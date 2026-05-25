// src/modules/metier/students/pages/StudentPredictions.jsx

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

function StudentPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await getAllPredictions();
      setPredictions(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des prédictions :", error);
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

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);

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
    <div className="min-h-screen bg-slate-100 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/10">
                <Brain size={40} className="text-blue-300" />
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-blue-300">
                  Students Management
                </p>
                <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
                  AI Predictions
                </h1>
                <p className="mt-2 text-sm text-slate-300 lg:text-base">
                  Analyse IA des risques, absences, moyennes et recommandations.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student..."
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm font-semibold text-white outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 sm:w-80"
                />
              </div>

              <button
                type="button"
                onClick={loadPredictions}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15"
              >
                <RefreshCcw size={18} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-[2rem] bg-white p-12 shadow-sm ring-1 ring-slate-200">
            <Loader2 className="animate-spin text-blue-600" size={34} />
            <span className="ml-3 font-bold text-slate-600">
              Loading predictions...
            </span>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Users size={24} />
                  </div>
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600">
                    Records
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500">
                  Total Predictions
                </p>
                <h2 className="mt-3 text-4xl font-black text-slate-950">
                  {totalPredictions}
                </h2>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                  <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600">
                    Risk
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500">High Risk</p>
                <h2 className="mt-3 text-4xl font-black text-red-600">
                  {highRisk}
                </h2>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <ShieldAlert size={24} />
                  </div>
                  <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-orange-600">
                    Moderate
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500">Medium Risk</p>
                <h2 className="mt-3 text-4xl font-black text-orange-600">
                  {mediumRisk}
                </h2>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle size={24} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600">
                    Safe
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500">Low Risk</p>
                <h2 className="mt-3 text-4xl font-black text-emerald-600">
                  {lowRisk}
                </h2>
              </div>
            </div>

            {/* TABLE */}
            <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Students Risk Predictions
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Tableau complet des prédictions IA.
                  </p>
                </div>

                <span className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700">
                  {filteredPredictions.length} results
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl ring-1 ring-slate-100">
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                      <th className="w-[22%] px-4 py-4 text-left">Student</th>
                      <th className="w-[28%] px-4 py-4 text-left">
                        Prediction
                      </th>
                      <th className="w-[14%] px-4 py-4 text-center">
                        Risk Level
                      </th>
                      <th className="w-[9%] px-4 py-4 text-center">Score</th>
                      <th className="w-[9%] px-4 py-4 text-center">
                        Moyenne
                      </th>
                      <th className="w-[9%] px-4 py-4 text-center">
                        Absences
                      </th>
                      <th className="w-[9%] px-4 py-4 text-center">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedPredictions.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-5 py-10 text-center font-bold text-slate-500"
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
                            className="border-t border-slate-100 align-middle transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-6 align-middle">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${risk.iconBox}`}
                                >
                                  <Icon size={18} />
                                </div>

                                <div className="min-w-0">
                                  <p className="break-words text-sm font-black leading-5 text-slate-950">
                                    {item.prenom} {item.nom}
                                  </p>
                                  <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-500">
                                    {item.email || "-"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-6 align-middle">
                              <p className="break-words text-sm font-bold leading-5 text-slate-800">
                                {item.prediction || "-"}
                              </p>
                              <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-500">
                                {item.recommandation || "-"}
                              </p>
                            </td>

                            <td className="px-4 py-6 text-center align-middle">
                              <span
                                className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-black leading-4 ${risk.badge}`}
                              >
                                {risk.label}
                              </span>
                            </td>

                            <td className="px-4 py-6 text-center align-middle">
                              <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-600">
                                {item.scoreRisque ?? 0}%
                              </span>
                            </td>

                            <td className="px-4 py-6 text-center align-middle text-sm font-black text-slate-700">
                              {item.moyenne ?? 0}
                            </td>

                            <td className="px-4 py-6 text-center align-middle text-sm font-black text-slate-700">
                              {item.absences ?? 0}
                            </td>

                            <td className="px-4 py-6 text-center align-middle">
                              <div
                                className={`mx-auto flex max-w-[100px] items-center justify-center gap-2 text-sm font-black leading-5 ${risk.statusColor}`}
                              >
                                <Icon size={16} className="shrink-0" />
                                <span className="break-words text-center">
                                  {risk.statusText}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Showing{" "}
                  <span className="text-slate-900">
                    {filteredPredictions.length === 0
                      ? 0
                      : (currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-slate-900">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredPredictions.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="text-slate-900">
                    {filteredPredictions.length}
                  </span>{" "}
                  predictions
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages || 1 }).map((_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 w-10 rounded-xl text-sm font-black transition ${
                          currentPage === page
                            ? "bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* AI SUMMARY + RECOMMENDATION */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 xl:col-span-2">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <Sparkles size={26} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      AI Summary
                    </h2>
                    <p className="text-sm font-semibold text-slate-500">
                      Résumé automatique des prédictions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-500">
                      Nombre total des prédictions
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-slate-950">
                      {totalPredictions}
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-500">
                      Score risque moyen
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-slate-950">
                      {averageRisk}%
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-orange-50 p-5">
                    <p className="text-sm font-bold text-orange-700">
                      Étudiants à surveiller
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-orange-700">
                      {highRisk + mediumRisk}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
                <h3 className="text-xl font-black">Recommendation</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Students with a moderate or high risk should be monitored more
                  closely: attendance, grades, and regular work.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentPredictions;