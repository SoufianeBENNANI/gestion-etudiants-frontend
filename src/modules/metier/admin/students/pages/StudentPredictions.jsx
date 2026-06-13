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

const translations = {
  EN: {
    management: "Students Management",
    title: "AI Predictions",
    subtitle: "Analyse IA des risques, absences, moyennes et recommandations.",

    searchPlaceholder: "Search student...",
    refresh: "Refresh",

    loadingPredictions: "Loading predictions...",

    records: "Records",
    risk: "Risk",
    moderate: "Moderate",
    safe: "Safe",

    totalPredictions: "Total Predictions",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    lowRisk: "Low Risk",

    tableTitle: "Students Risk Predictions",
    showing: "Showing",
    to: "to",
    of: "of",
    predictions: "predictions",
    results: "results",

    student: "Student",
    prediction: "Prediction",
    riskColumn: "Risk",
    score: "Score",
    avg: "Avg",
    abs: "Abs.",
    status: "Status",

    noPredictions: "No predictions found.",

    page: "Page",
    previous: "Previous",
    next: "Next",

    highRiskLabel: "High Risk",
    moderateRiskLabel: "Moderate Risk",
    lowRiskLabel: "Low Risk",
    noPredictionLabel: "No Prediction",

    needAttention: "Need attention",
    moderateRiskText: "Moderate risk",
    normal: "Normal",
    noPredictionText: "No prediction",

    aiSummary: "AI Summary",
    aiSummaryDescription: "Résumé automatique des prédictions.",
    totalPredictionsSummary: "Nombre total des prédictions",
    averageRiskScore: "Score risque moyen",
    studentsToMonitor: "Étudiants à surveiller",

    recommendation: "Recommendation",
    recommendationText:
      "Students with a moderate or high risk should be monitored more closely: attendance, grades, and regular work.",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Prédictions IA",
    subtitle: "Analyse IA des risques, absences, moyennes et recommandations.",

    searchPlaceholder: "Rechercher un étudiant...",
    refresh: "Actualiser",

    loadingPredictions: "Chargement des prédictions...",

    records: "Dossiers",
    risk: "Risque",
    moderate: "Modéré",
    safe: "Sécurisé",

    totalPredictions: "Total prédictions",
    highRisk: "Risque élevé",
    mediumRisk: "Risque moyen",
    lowRisk: "Risque faible",

    tableTitle: "Prédictions des risques étudiants",
    showing: "Affichage",
    to: "à",
    of: "sur",
    predictions: "prédictions",
    results: "résultats",

    student: "Étudiant",
    prediction: "Prédiction",
    riskColumn: "Risque",
    score: "Score",
    avg: "Moy.",
    abs: "Abs.",
    status: "Statut",

    noPredictions: "Aucune prédiction trouvée.",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    highRiskLabel: "Risque élevé",
    moderateRiskLabel: "Risque modéré",
    lowRiskLabel: "Risque faible",
    noPredictionLabel: "Aucune prédiction",

    needAttention: "Besoin d’attention",
    moderateRiskText: "Risque modéré",
    normal: "Normal",
    noPredictionText: "Aucune prédiction",

    aiSummary: "Résumé IA",
    aiSummaryDescription: "Résumé automatique des prédictions.",
    totalPredictionsSummary: "Nombre total des prédictions",
    averageRiskScore: "Score risque moyen",
    studentsToMonitor: "Étudiants à surveiller",

    recommendation: "Recommandation",
    recommendationText:
      "Les étudiants avec un risque modéré ou élevé doivent être suivis de plus près : présence, notes et travail régulier.",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "توقعات الذكاء الاصطناعي",
    subtitle: "تحليل الذكاء الاصطناعي للمخاطر والغيابات والمعدلات والتوصيات.",

    searchPlaceholder: "البحث عن طالب...",
    refresh: "تحديث",

    loadingPredictions: "جاري تحميل التوقعات...",

    records: "السجلات",
    risk: "الخطر",
    moderate: "متوسط",
    safe: "آمن",

    totalPredictions: "إجمالي التوقعات",
    highRisk: "خطر مرتفع",
    mediumRisk: "خطر متوسط",
    lowRisk: "خطر منخفض",

    tableTitle: "توقعات مخاطر الطلاب",
    showing: "عرض",
    to: "إلى",
    of: "من",
    predictions: "توقعات",
    results: "نتائج",

    student: "الطالب",
    prediction: "التوقع",
    riskColumn: "الخطر",
    score: "النسبة",
    avg: "المعدل",
    abs: "الغياب",
    status: "الحالة",

    noPredictions: "لا توجد توقعات.",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    highRiskLabel: "خطر مرتفع",
    moderateRiskLabel: "خطر متوسط",
    lowRiskLabel: "خطر منخفض",
    noPredictionLabel: "لا توجد توقعات",

    needAttention: "يحتاج إلى متابعة",
    moderateRiskText: "خطر متوسط",
    normal: "عادي",
    noPredictionText: "لا توجد توقعات",

    aiSummary: "ملخص الذكاء الاصطناعي",
    aiSummaryDescription: "ملخص تلقائي للتوقعات.",
    totalPredictionsSummary: "إجمالي عدد التوقعات",
    averageRiskScore: "متوسط درجة الخطر",
    studentsToMonitor: "طلاب يجب مراقبتهم",

    recommendation: "توصية",
    recommendationText:
      "يجب متابعة الطلاب ذوي الخطر المتوسط أو المرتفع بشكل أكبر: الحضور، النقاط، والعمل المنتظم.",
  },
};

export default function StudentPredictions() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
  };

  const textStyle = {
    color: "var(--text-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail || localStorage.getItem("app-language") || "EN";

      setLanguage(nextLanguage);
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

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
        iconBox: "bg-red-600 text-white",
        label: t.highRiskLabel,
        statusText: t.needAttention,
        statusColor: "text-red-600",
      };
    }

    if (status === "MODERATE") {
      return {
        badge: "bg-orange-100 text-orange-700",
        icon: ShieldAlert,
        iconBox: "bg-orange-500 text-white",
        label: t.moderateRiskLabel,
        statusText: t.moderateRiskText,
        statusColor: "text-orange-600",
      };
    }

    if (status === "LOW") {
      return {
        badge: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle,
        iconBox: "bg-emerald-600 text-white",
        label: t.lowRiskLabel,
        statusText: t.normal,
        statusColor: "text-emerald-600",
      };
    }

    return {
      badge: "bg-slate-100 text-slate-600",
      icon: Brain,
      iconBox: "bg-slate-600 text-white",
      label: t.noPredictionLabel,
      statusText: t.noPredictionText,
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
    <div
      className="min-h-screen space-y-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <div
        className="relative overflow-hidden rounded-[1.7rem] border px-6 py-6 text-white shadow-sm"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div
          className="absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
        />

        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Brain size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                {t.management}
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                {t.title}
              </h1>

              <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
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
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadPredictions}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <RefreshCcw size={17} />
              {t.refresh}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center rounded-2xl border p-10 shadow-sm"
          style={cardStyle}
        >
          <Loader2
            className="animate-spin"
            size={28}
            style={{ color: "var(--primary-color)" }}
          />

          <span className="ml-3 text-sm font-bold" style={mutedTextStyle}>
            {t.loadingPredictions}
          </span>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div
              className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={cardStyle}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Users size={22} />
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                  {t.records}
                </span>
              </div>

              <p className="text-sm font-black" style={textStyle}>
                {t.totalPredictions}
              </p>

              <h2 className="mt-3 text-2xl font-black" style={textStyle}>
                {totalPredictions}
              </h2>
            </div>

            <div
              className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={cardStyle}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
                  <AlertTriangle size={22} />
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
                  {t.risk}
                </span>
              </div>

              <p className="text-sm font-black" style={textStyle}>
                {t.highRisk}
              </p>

              <h2 className="mt-3 text-2xl font-black text-red-600">
                {highRisk}
              </h2>
            </div>

            <div
              className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={cardStyle}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <ShieldAlert size={22} />
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                  {t.moderate}
                </span>
              </div>

              <p className="text-sm font-black" style={textStyle}>
                {t.mediumRisk}
              </p>

              <h2 className="mt-3 text-2xl font-black text-orange-600">
                {mediumRisk}
              </h2>
            </div>

            <div
              className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={cardStyle}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <CheckCircle size={22} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                  {t.safe}
                </span>
              </div>

              <p className="text-sm font-black" style={textStyle}>
                {t.lowRisk}
              </p>

              <h2 className="mt-3 text-2xl font-black text-emerald-600">
                {lowRisk}
              </h2>
            </div>
          </div>

          {/* TABLE */}
          <div
            className="overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300"
            style={cardStyle}
          >
            <div
              className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              style={sectionStyle}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  <Brain size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black" style={textStyle}>
                    {t.tableTitle}
                  </h2>

                  <p className="mt-0.5 text-xs" style={mutedTextStyle}>
                    {t.showing} {startPrediction} {t.to} {endPrediction}{" "}
                    {t.of} {filteredPredictions.length} {t.predictions}
                  </p>
                </div>
              </div>

              <span
                className="rounded-xl px-4 py-2 text-xs font-black"
                style={inputStyle}
              >
                {filteredPredictions.length} {t.results}
              </span>
            </div>

            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr
                  className="text-center text-[11px] uppercase tracking-wide"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--muted-text)",
                  }}
                >
                  <th className="w-[22%] px-3 py-3 font-black">
                    {t.student}
                  </th>
                  <th className="w-[28%] px-3 py-3 font-black">
                    {t.prediction}
                  </th>
                  <th className="w-[14%] px-3 py-3 font-black">
                    {t.riskColumn}
                  </th>
                  <th className="w-[10%] px-3 py-3 font-black">{t.score}</th>
                  <th className="w-[9%] px-3 py-3 font-black">{t.avg}</th>
                  <th className="w-[9%] px-3 py-3 font-black">{t.abs}</th>
                  <th className="w-[8%] px-3 py-3 font-black">{t.status}</th>
                </tr>
              </thead>

              <tbody>
                {paginatedPredictions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center">
                      <span
                        className="text-sm font-bold"
                        style={mutedTextStyle}
                      >
                        {t.noPredictions}
                      </span>
                    </td>
                  </tr>
                ) : (
                  paginatedPredictions.map((item) => {
                    const risk = getRiskStyle(item.status);
                    const Icon = risk.icon;

                    return (
                      <tr
                        key={item.predictionId || item.id}
                        className="border-t text-center text-sm transition"
                        style={{
                          borderColor: "var(--border-color)",
                          color: "var(--text-color)",
                        }}
                      >
                        <td className="px-3 py-3">
                          <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                            <div
                              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:flex ${risk.iconBox}`}
                            >
                              <Icon size={17} />
                            </div>

                            <div className="min-w-0 text-left">
                              <p
                                className="truncate font-black"
                                style={textStyle}
                              >
                                {item.prenom || "-"} {item.nom || ""}
                              </p>

                              <p
                                className="truncate text-xs font-semibold"
                                style={mutedTextStyle}
                              >
                                {item.email || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <p
                            className="truncate text-sm font-bold"
                            style={textStyle}
                          >
                            {item.prediction || "-"}
                          </p>

                          <p
                            className="truncate text-xs font-semibold"
                            style={mutedTextStyle}
                          >
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

                        <td className="px-3 py-3 font-black" style={textStyle}>
                          {item.moyenne ?? 0}
                        </td>

                        <td className="px-3 py-3 font-black" style={textStyle}>
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
            <div
              className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              style={sectionStyle}
            >
              <p className="text-xs font-semibold" style={mutedTextStyle}>
                {t.page}{" "}
                <span className="font-black" style={textStyle}>
                  {currentPage}
                </span>{" "}
                {t.of}{" "}
                <span className="font-black" style={textStyle}>
                  {totalPages}
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={inputStyle}
                >
                  <ChevronLeft size={16} />
                  {t.previous}
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black transition"
                    style={{
                      backgroundColor:
                        currentPage === page
                          ? "var(--secondary-color)"
                          : "var(--input-bg)",
                      borderColor: "var(--border-color)",
                      color:
                        currentPage === page ? "#ffffff" : "var(--text-color)",
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={inputStyle}
                >
                  {t.next}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* AI SUMMARY */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div
              className="rounded-2xl border p-5 shadow-sm xl:col-span-2"
              style={cardStyle}
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black" style={textStyle}>
                    {t.aiSummary}
                  </h2>

                  <p className="text-xs font-semibold" style={mutedTextStyle}>
                    {t.aiSummaryDescription}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl p-4" style={sectionStyle}>
                  <p className="text-xs font-bold" style={mutedTextStyle}>
                    {t.totalPredictionsSummary}
                  </p>

                  <h3 className="mt-2 text-2xl font-black" style={textStyle}>
                    {totalPredictions}
                  </h3>
                </div>

                <div className="rounded-2xl p-4" style={sectionStyle}>
                  <p className="text-xs font-bold" style={mutedTextStyle}>
                    {t.averageRiskScore}
                  </p>

                  <h3 className="mt-2 text-2xl font-black" style={textStyle}>
                    {averageRisk}%
                  </h3>
                </div>

                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs font-bold text-orange-700">
                    {t.studentsToMonitor}
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-orange-700">
                    {highRisk + mediumRisk}
                  </h3>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border p-5 text-white shadow-sm"
              style={{
                borderColor: "var(--border-color)",
                background:
                  "linear-gradient(135deg, var(--secondary-color), #020617)",
              }}
            >
              <h3 className="text-lg font-black">{t.recommendation}</h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {t.recommendationText}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}