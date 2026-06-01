import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

import { getAllPredictions } from "../services/predictionService";

export default function StudentPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await getAllPredictions();
      setPredictions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des prédictions :", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((item) => {
      const keyword = search.toLowerCase();

      const fullName = `${item.prenom || ""} ${item.nom || ""}`.toLowerCase();
      const email = `${item.email || ""}`.toLowerCase();
      const prediction = `${item.prediction || ""}`.toLowerCase();
      const status = `${item.status || ""}`.toLowerCase();

      return (
        fullName.includes(keyword) ||
        email.includes(keyword) ||
        prediction.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }, [predictions, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPredictions.length / itemsPerPage)
  );

  const paginatedPredictions = filteredPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPredictions = predictions.length;

  const highRisk = predictions.filter((item) => item.status === "HIGH").length;

  const mediumRisk = predictions.filter(
    (item) => item.status === "MODERATE"
  ).length;

  const lowRisk = predictions.filter((item) => item.status === "LOW").length;

  const averageRisk =
    predictions.length > 0
      ? (
          predictions.reduce(
            (sum, item) => sum + Number(item.scoreRisque || 0),
            0
          ) / predictions.length
        ).toFixed(1)
      : "0.0";

  const startPrediction =
    filteredPredictions.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endPrediction = Math.min(
    currentPage * itemsPerPage,
    filteredPredictions.length
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const getRiskStyle = (status) => {
    if (status === "HIGH") {
      return {
        badge: "bg-red-100 text-red-700",
        icon: AlertTriangle,
        iconBox: "bg-red-50 text-red-600",
        label: "High Risk",
        statusText: "Need attention",
        statusColor: "text-red-600",
      };
    }

    if (status === "MODERATE") {
      return {
        badge: "bg-orange-100 text-orange-700",
        icon: ShieldAlert,
        iconBox: "bg-orange-50 text-orange-600",
        label: "Moderate Risk",
        statusText: "Moderate risk",
        statusColor: "text-orange-600",
      };
    }

    if (status === "LOW") {
      return {
        badge: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle,
        iconBox: "bg-emerald-50 text-emerald-600",
        label: "Low Risk",
        statusText: "Normal",
        statusColor: "text-emerald-600",
      };
    }

    return {
      badge: "bg-slate-100 text-slate-600",
      icon: Brain,
      iconBox: "bg-slate-100 text-slate-600",
      label: "No Prediction",
      statusText: "No prediction",
      statusColor: "text-slate-500",
    };
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
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
              <Brain size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                AI Predictions
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Analyse IA des risques, absences, moyennes et recommandations.
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadPredictions}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <RefreshCcw size={17} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <Loader2 className="animate-spin text-blue-600" size={28} />
          <span className="ml-3 text-sm font-bold text-slate-600">
            Loading predictions...
          </span>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Users size={22} />
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                  Records
                </span>
              </div>

              <p className="text-sm font-black text-slate-950">
                Total Predictions
              </p>

              <h2 className="mt-3 text-2xl font-black text-slate-950">
                {totalPredictions}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={22} />
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
                  Risk
                </span>
              </div>

              <p className="text-sm font-black text-slate-950">High Risk</p>

              <h2 className="mt-3 text-2xl font-black text-red-600">
                {highRisk}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <ShieldAlert size={22} />
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                  Moderate
                </span>
              </div>

              <p className="text-sm font-black text-slate-950">Medium Risk</p>

              <h2 className="mt-3 text-2xl font-black text-orange-600">
                {mediumRisk}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle size={22} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                  Safe
                </span>
              </div>

              <p className="text-sm font-black text-slate-950">Low Risk</p>

              <h2 className="mt-3 text-2xl font-black text-emerald-600">
                {lowRisk}
              </h2>
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
                    Students Risk Predictions
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Showing {startPrediction} to {endPrediction} of{" "}
                    {filteredPredictions.length} predictions
                  </p>
                </div>
              </div>

              <span className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-700">
                {filteredPredictions.length} results
              </span>
            </div>

            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-white text-center text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="w-[22%] px-3 py-3 font-black">Student</th>
                  <th className="w-[28%] px-3 py-3 font-black">Prediction</th>
                  <th className="w-[14%] px-3 py-3 font-black">Risk</th>
                  <th className="w-[10%] px-3 py-3 font-black">Score</th>
                  <th className="w-[9%] px-3 py-3 font-black">Avg</th>
                  <th className="w-[9%] px-3 py-3 font-black">Abs.</th>
                  <th className="w-[8%] px-3 py-3 font-black">Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedPredictions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                    >
                      No predictions found.
                    </td>
                  </tr>
                ) : (
                  paginatedPredictions.map((item) => {
                    const risk = getRiskStyle(item.status);
                    const Icon = risk.icon;

                    return (
                      <tr
                        key={item.predictionId || item.id}
                        className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <td className="px-3 py-3">
                          <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                            <div
                              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:flex ${risk.iconBox}`}
                            >
                              <Icon size={17} />
                            </div>

                            <div className="min-w-0 text-left">
                              <p className="truncate font-black text-slate-900">
                                {item.prenom || "-"} {item.nom || ""}
                              </p>
                              <p className="truncate text-xs font-semibold text-slate-500">
                                {item.email || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {item.prediction || "-"}
                          </p>
                          <p className="truncate text-xs font-semibold text-slate-500">
                            {item.recommandation || "-"}
                          </p>
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${risk.badge}`}
                          >
                            {risk.label}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-600">
                            {item.scoreRisque ?? 0}%
                          </span>
                        </td>

                        <td className="px-3 py-3 font-black text-slate-700">
                          {item.moyenne ?? 0}
                        </td>

                        <td className="px-3 py-3 font-black text-slate-700">
                          {item.absences ?? 0}
                        </td>

                        <td className="px-3 py-3">
                          <div
                            className={`mx-auto flex items-center justify-center gap-1 text-xs font-black ${risk.statusColor}`}
                            title={risk.statusText}
                          >
                            <Icon size={15} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs font-semibold text-slate-500">
                Page{" "}
                <span className="font-black text-slate-800">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-800">{totalPages}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
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
                      currentPage === page
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
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* AI SUMMARY */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    AI Summary
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Résumé automatique des prédictions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">
                    Nombre total des prédictions
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">
                    {totalPredictions}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">
                    Score risque moyen
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">
                    {averageRisk}%
                  </h3>
                </div>

                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs font-bold text-orange-700">
                    Étudiants à surveiller
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-orange-700">
                    {highRisk + mediumRisk}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
              <h3 className="text-lg font-black">Recommendation</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Students with a moderate or high risk should be monitored more
                closely: attendance, grades, and regular work.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}