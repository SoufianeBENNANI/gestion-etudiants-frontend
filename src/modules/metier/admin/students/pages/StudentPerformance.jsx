import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CalendarDays,
  GraduationCap,
  Mail,
  RefreshCcw,
  Search,
  Sparkles,
  Trophy,
  Users,
  Activity,
  Wand2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getStudentPerformance,
  generateStudentPrediction,
} from "../services/studentService";

export default function StudentPerformance() {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [predictingId, setPredictingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadPerformance = async () => {
    try {
      setLoading(true);

      const data = await getStudentPerformance();
      setPerformances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load student performance error:", error);
      alert("Error while loading student performance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformance();
  }, []);

  const handleGeneratePrediction = async (id) => {
    try {
      setPredictingId(id);

      await generateStudentPrediction(id);
      await loadPerformance();

      alert("Prediction generated successfully");
    } catch (error) {
      console.error("Generate prediction error:", error);
      alert("Error while generating prediction");
    } finally {
      setPredictingId(null);
    }
  };

  const filteredPerformances = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return performances;

    return performances.filter((item) => {
      const fullName = `${item.nom || ""} ${item.prenom || ""}`.toLowerCase();
      const reverseName = `${item.prenom || ""} ${item.nom || ""}`.toLowerCase();
      const email = String(item.email || "").toLowerCase();
      const prediction = String(item.prediction || "").toLowerCase();
      const status = String(item.status || "").toLowerCase();
      const niveau = String(item.niveau || "").toLowerCase();

      return (
        fullName.includes(value) ||
        reverseName.includes(value) ||
        email.includes(value) ||
        prediction.includes(value) ||
        status.includes(value) ||
        niveau.includes(value)
      );
    });
  }, [performances, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPerformances.length / rowsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedPerformances = filteredPerformances.slice(
    startIndex,
    endIndex
  );

  const showingFrom = filteredPerformances.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, filteredPerformances.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(
    Math.max(safeCurrentPage - 3, 0),
    Math.min(safeCurrentPage + 2, totalPages)
  );

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  const predictedStudents = useMemo(() => {
    return performances.filter((item) => item.hasPrediction);
  }, [performances]);

  const totalStudents = performances.length;

  const averageGrade = useMemo(() => {
    if (predictedStudents.length === 0) return "0.00";

    const sum = predictedStudents.reduce(
      (total, item) => total + Number(item.moyenne || 0),
      0
    );

    return (sum / predictedStudents.length).toFixed(2);
  }, [predictedStudents]);

  const bestStudent = useMemo(() => {
    if (predictedStudents.length === 0) return "-";

    const best = [...predictedStudents].sort(
      (a, b) => Number(b.moyenne || 0) - Number(a.moyenne || 0)
    )[0];

    return `${best.nom || ""} ${best.prenom || ""}`.trim() || "-";
  }, [predictedStudents]);

  const atRiskStudents = useMemo(() => {
    return predictedStudents.filter((item) => {
      const score = Number(item.scoreRisque || 0);
      const status = String(item.status || "").toUpperCase();
      const niveau = String(item.niveau || "").toLowerCase();
      const prediction = String(item.prediction || "").toLowerCase();

      return (
        status === "AT_RISK" ||
        score >= 50 ||
        niveau.includes("faible") ||
        prediction.includes("risque")
      );
    }).length;
  }, [predictedStudents]);

  const riskDistribution = useMemo(() => {
    const low = predictedStudents.filter(
      (item) => Number(item.scoreRisque || 0) < 40
    ).length;

    const moderate = predictedStudents.filter((item) => {
      const score = Number(item.scoreRisque || 0);
      return score >= 40 && score < 70;
    }).length;

    const high = predictedStudents.filter(
      (item) => Number(item.scoreRisque || 0) >= 70
    ).length;

    return { low, moderate, high };
  }, [predictedStudents]);

  const getStatusBadge = (status, scoreRisque, hasPrediction) => {
    if (!hasPrediction) {
      return {
        text: "No Prediction",
        className: "bg-slate-100 text-slate-600 ring-slate-200",
      };
    }

    const normalizedStatus = String(status || "").toUpperCase();
    const score = Number(scoreRisque || 0);

    if (normalizedStatus === "AT_RISK" || score >= 70) {
      return {
        text: "At Risk",
        className: "bg-rose-50 text-rose-700 ring-rose-200",
      };
    }

    if (normalizedStatus === "MODERATE" || score >= 40) {
      return {
        text: "Moderate",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
      };
    }

    return {
      text: "Good",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRiskBarClass = (risk, hasPrediction) => {
    if (!hasPrediction) return "bg-slate-300";
    if (risk >= 70) return "bg-rose-500";
    if (risk >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const statsCards = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      badge: "Records",
      color: "blue",
    },
    {
      title: "Average Grade",
      value: averageGrade,
      icon: GraduationCap,
      badge: "Average",
      color: "emerald",
    },
    {
      title: "Best Student",
      value: bestStudent,
      icon: Trophy,
      badge: "Top",
      color: "amber",
      mediumText: true,
    },
    {
      title: "At Risk Students",
      value: atRiskStudents,
      icon: AlertTriangle,
      badge: "Risk",
      color: "rose",
    },
  ];

  const colorStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      badge: "bg-blue-50 text-blue-600",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-600",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-600",
    },
    rose: {
      icon: "bg-rose-50 text-rose-600",
      badge: "bg-rose-50 text-rose-600",
    },
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <BarChart3 size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                Performance Students
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Analyse AI des moyennes, absences, risques et recommandations.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadPerformance}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RefreshCcw size={17} />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const style = colorStyles[card.color];

          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${style.icon}`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${style.badge}`}
                >
                  {card.badge}
                </span>
              </div>

              <p className="text-sm font-black text-slate-950">
                {card.title}
              </p>

              <h2
                className={`mt-3 truncate font-black text-slate-950 ${
                  card.mediumText ? "text-xl" : "text-2xl"
                }`}
                title={String(card.value)}
              >
                {loading ? "..." : card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* GRAPH + SUMMARY */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Activity size={22} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Risk Score Overview
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Vue globale du risque IA pour tous les étudiants.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200">
              {predictedStudents.length} predicted / {performances.length} students
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase text-emerald-600">
                Low Risk
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-700">
                {riskDistribution.low}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs font-black uppercase text-amber-600">
                Moderate
              </p>
              <p className="mt-2 text-2xl font-black text-amber-700">
                {riskDistribution.moderate}
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-xs font-black uppercase text-rose-600">
                High Risk
              </p>
              <p className="mt-2 text-2xl font-black text-rose-700">
                {riskDistribution.high}
              </p>
            </div>
          </div>

          <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex h-60 items-center justify-center gap-2 text-sm font-bold text-slate-500">
                <Loader2 className="animate-spin" size={18} />
                Loading graph...
              </div>
            ) : filteredPerformances.length === 0 ? (
              <div className="flex h-60 items-center justify-center text-sm font-bold text-slate-500">
                No performance data found.
              </div>
            ) : (
              filteredPerformances.map((item) => {
                const risk = Number(item.scoreRisque || 0);
                const hasPrediction = Boolean(item.hasPrediction);

                return (
                  <div
                    key={item.studentId}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-900">
                          {item.nom} {item.prenom}
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-500">
                          {item.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                          hasPrediction
                            ? "bg-blue-50 text-blue-600"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {hasPrediction ? `${risk}% Risk` : "No prediction"}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                      <div
                        className={`h-full rounded-full ${getRiskBarClass(
                          risk,
                          hasPrediction
                        )}`}
                        style={{
                          width: `${hasPrediction ? Math.min(100, risk) : 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">AI Summary</h2>
              <p className="text-xs font-semibold text-slate-500">
                Résumé automatique des performances.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                Nombre total d’étudiants
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {totalStudents}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                Étudiants avec prédiction
              </p>
              <p className="mt-2 text-2xl font-black text-blue-600">
                {predictedStudents.length}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                Moyenne générale
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {averageGrade}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                Étudiants à risque
              </p>
              <p className="mt-2 text-2xl font-black text-rose-600">
                {atRiskStudents}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Students Performance Table
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Showing {showingFrom} to {showingTo} of{" "}
                {filteredPerformances.length} results
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600">Rows:</span>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm font-bold text-slate-600">
            <Loader2 className="animate-spin" size={18} />
            Loading performance...
          </div>
        ) : filteredPerformances.length === 0 ? (
          <div className="p-10 text-center text-sm font-bold text-slate-600">
            No performance data found.
          </div>
        ) : (
          <>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-white text-center text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="w-[19%] px-2 py-3 font-black">Student</th>
                  <th className="w-[20%] px-2 py-3 font-black">Email</th>
                  <th className="w-[8%] px-2 py-3 font-black">Avg</th>
                  <th className="w-[8%] px-2 py-3 font-black">Abs.</th>
                  <th className="w-[17%] px-2 py-3 font-black">Prediction</th>
                  <th className="w-[12%] px-2 py-3 font-black">Risk</th>
                  <th className="w-[8%] px-2 py-3 font-black">Status</th>
                  <th className="w-[8%] px-2 py-3 font-black">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedPerformances.map((item) => {
                  const fullName =
                    `${item.nom || ""} ${item.prenom || ""}`.trim() ||
                    "Unknown Student";

                  const badge = getStatusBadge(
                    item.status,
                    item.scoreRisque,
                    item.hasPrediction
                  );

                  const risk = Number(item.scoreRisque || 0);

                  return (
                    <tr
                      key={item.studentId}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-2 py-3">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                            <Users size={17} />
                          </div>

                          <span className="truncate font-black text-slate-900">
                            {fullName}
                          </span>
                        </div>
                      </td>

                      <td className="px-2 py-3">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-1">
                          <Mail size={14} className="shrink-0 text-slate-400" />
                          <span className="truncate">{item.email || "-"}</span>
                        </div>
                      </td>

                      <td className="px-2 py-3 font-black text-slate-900">
                        {item.hasPrediction ? item.moyenne ?? 0 : "-"}
                      </td>

                      <td className="px-2 py-3">
                        {item.hasPrediction ? item.absences ?? 0 : "-"}
                      </td>

                      <td className="px-2 py-3">
                        <span className="block truncate font-bold text-slate-700">
                          {item.prediction || "-"}
                        </span>
                      </td>

                      <td className="px-2 py-3">
                        <div className="mx-auto flex max-w-[100px] items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${getRiskBarClass(
                                risk,
                                item.hasPrediction
                              )}`}
                              style={{
                                width: `${
                                  item.hasPrediction
                                    ? Math.min(100, risk)
                                    : 100
                                }%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-black text-slate-600">
                            {item.hasPrediction ? `${risk}%` : "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${badge.className}`}
                        >
                          {badge.text}
                        </span>
                      </td>

                      <td className="px-2 py-3">
                        {!item.hasPrediction ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleGeneratePrediction(item.studentId)
                            }
                            disabled={predictingId === item.studentId}
                            title="Generate Prediction"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {predictingId === item.studentId ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Wand2 size={15} />
                            )}
                          </button>
                        ) : (
                          <span
                            title="Generated"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                          >
                            <Brain size={15} />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs font-semibold text-slate-500">
                Page{" "}
                <span className="font-black text-slate-800">
                  {safeCurrentPage}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-800">{totalPages}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={safeCurrentPage === 1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                      safeCurrentPage === page
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={safeCurrentPage === totalPages}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}