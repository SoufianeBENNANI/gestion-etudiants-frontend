import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Mail,
  RefreshCcw,
  Search,
  Sparkles,
  Trophy,
  Users,
  Activity,
  Wand2,
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadPerformance = async () => {
    try {
      setLoading(true);

      const data = await getStudentPerformance();

      console.log("Performance data:", data);

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

  const averageRisk = useMemo(() => {
    if (predictedStudents.length === 0) return "0.00";

    const sum = predictedStudents.reduce(
      (total, item) => total + Number(item.scoreRisque || 0),
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
        className: "bg-rose-100 text-rose-700 ring-rose-200",
      };
    }

    if (normalizedStatus === "MODERATE" || score >= 40) {
      return {
        text: "Moderate",
        className: "bg-amber-100 text-amber-700 ring-amber-200",
      };
    }

    return {
      text: "Good",
      className: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    };
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getRiskBarClass = (risk, hasPrediction) => {
    if (!hasPrediction) return "bg-slate-300";

    if (risk >= 70) return "bg-gradient-to-r from-rose-500 to-red-600";
    if (risk >= 40) return "bg-gradient-to-r from-amber-400 to-orange-500";

    return "bg-gradient-to-r from-emerald-400 to-green-600";
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <BarChart3 size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Performance Students
              </h1>
              <p className="mt-1 text-sm font-medium text-white/80">
                Analyse AI des moyennes, absences, risques et recommandations.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student..."
                className="w-full rounded-2xl border border-white/20 bg-white/15 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-white/60 focus:border-white/40 focus:bg-white/20 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadPerformance}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-xl shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/80">Total Students</p>
            <Users size={26} />
          </div>
          <p className="mt-4 text-4xl font-black">{totalStudents}</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/80">Average Grade</p>
            <GraduationCap size={26} />
          </div>
          <p className="mt-4 text-4xl font-black">{averageGrade}</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-xl shadow-amber-500/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/80">Best Student</p>
            <Trophy size={26} />
          </div>
          <p className="mt-4 truncate text-2xl font-black">{bestStudent}</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-xl shadow-rose-500/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/80">At Risk Students</p>
            <AlertTriangle size={26} />
          </div>
          <p className="mt-4 text-4xl font-black">{atRiskStudents}</p>
        </div>
      </div>

      {/* GRAPH + SUMMARY */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* RISK GRAPH */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <Activity size={24} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Risk Score Overview
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Vue globale du risque IA pour tous les étudiants.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
              {predictedStudents.length} predicted / {performances.length} students
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase text-emerald-600">
                Low Risk
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-700">
                {riskDistribution.low}
              </p>
            </div>

            <div className="rounded-3xl bg-amber-50 p-4">
              <p className="text-xs font-black uppercase text-amber-600">
                Moderate
              </p>
              <p className="mt-2 text-2xl font-black text-amber-700">
                {riskDistribution.moderate}
              </p>
            </div>

            <div className="rounded-3xl bg-rose-50 p-4">
              <p className="text-xs font-black uppercase text-rose-600">
                High Risk
              </p>
              <p className="mt-2 text-2xl font-black text-rose-700">
                {riskDistribution.high}
              </p>
            </div>
          </div>

          <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex h-72 items-center justify-center text-sm font-bold text-slate-500">
                Loading graph...
              </div>
            ) : filteredPerformances.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm font-bold text-slate-500">
                No performance data found.
              </div>
            ) : (
              filteredPerformances.map((item) => {
                const risk = Number(item.scoreRisque || 0);
                const hasPrediction = Boolean(item.hasPrediction);

                return (
                  <div
                    key={item.studentId}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-black text-slate-900">
                          {item.nom} {item.prenom}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {item.email}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          hasPrediction
                            ? "bg-indigo-100 text-indigo-700"
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

        {/* AI SUMMARY */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Sparkles size={24} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">AI Summary</h2>
              <p className="text-sm font-medium text-slate-500">
                Résumé automatique des performances.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Nombre total d’étudiants
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {totalStudents}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Étudiants avec prédiction
              </p>
              <p className="mt-2 text-2xl font-black text-indigo-600">
                {predictedStudents.length}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Moyenne générale
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {averageGrade}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
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
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Brain size={22} />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-800">
                Students Performance Table
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Tous les étudiants actifs avec leur état IA.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
              Showing {showingFrom} to {showingTo} of{" "}
              {filteredPerformances.length} results
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <span className="text-sm font-bold text-slate-600">Rows:</span>

              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm font-black text-slate-800 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center font-bold text-slate-600">
            Loading performance...
          </div>
        ) : filteredPerformances.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-600">
            No performance data found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse">
                <thead>
                  <tr className="bg-white text-left text-sm text-slate-600">
                    <th className="px-6 py-4 font-black">Student</th>
                    <th className="px-6 py-4 font-black">Email</th>
                    <th className="px-6 py-4 font-black">Average</th>
                    <th className="px-6 py-4 font-black">Absences</th>
                    <th className="px-6 py-4 font-black">Prediction</th>
                    <th className="px-6 py-4 font-black">Risk Score</th>
                    <th className="px-6 py-4 font-black">Level</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 text-right font-black">
                      Action
                    </th>
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
                        className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white">
                              {String(item.nom || "?").charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="font-black text-slate-900">
                                {fullName}
                              </p>
                              <p className="text-xs font-semibold text-slate-400">
                                ID: {item.studentId || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" />
                            {item.email || "-"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-black text-slate-900">
                            {item.hasPrediction ? item.moyenne ?? 0 : "-"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {item.hasPrediction ? item.absences ?? 0 : "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-700">
                            {item.prediction || "-"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
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

                        <td className="px-6 py-4">
                          {item.hasPrediction ? item.niveau || "-" : "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${badge.className}`}
                          >
                            {badge.text}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={16}
                              className="text-slate-400"
                            />
                            <span className="whitespace-nowrap">
                              {formatDate(item.date)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {!item.hasPrediction ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleGeneratePrediction(item.studentId)
                              }
                              disabled={predictingId === item.studentId}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Wand2 size={16} />
                              {predictingId === item.studentId
                                ? "Generating..."
                                : "Generate"}
                            </button>
                          ) : (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                              Generated
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-slate-600">
                Page {safeCurrentPage} of {totalPages}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={safeCurrentPage === 1}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-indigo-500/20">
                  {safeCurrentPage}
                </div>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={safeCurrentPage === totalPages}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}