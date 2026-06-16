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

  const statsCards = [
    {
      title: t.totalPredictions,
      value: totalPredictions,
      icon: Users,
      badge: t.records,
      iconBg: "bg-orange-500",
      badgeClass: "bg-orange-50 text-orange-600",
    },
    {
      title: t.highRisk,
      value: highRisk,
      icon: AlertTriangle,
      badge: t.risk,
      iconBg: "bg-red-500",
      badgeClass: "bg-red-50 text-red-600",
      valueClass: "text-red-600",
    },
    {
      title: t.mediumRisk,
      value: mediumRisk,
      icon: ShieldAlert,
      badge: t.moderate,
      iconBg: "bg-amber-500",
      badgeClass: "bg-amber-50 text-amber-600",
      valueClass: "text-amber-600",
    },
    {
      title: t.lowRisk,
      value: lowRisk,
      icon: CheckCircle,
      badge: t.safe,
      iconBg: "bg-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-600",
      valueClass: "text-emerald-600",
    },
  ];

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <div
        className="flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div>
          <p className="text-xs font-semibold text-blue-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-64"
            />

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={loadPredictions}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <RefreshCcw size={17} />
            )}
            {t.refresh}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconBg} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`truncate text-2xl font-black ${
                        card.valueClass || ""
                      }`}
                      style={card.valueClass ? undefined : textStyle}
                    >
                      {loading ? "..." : card.value}
                    </h3>

                    <p
                      className="truncate text-xs font-semibold"
                      style={mutedTextStyle}
                    >
                      {card.title}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${card.badgeClass}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.tableTitle}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startPrediction} {t.to} {endPrediction} {t.of}{" "}
                {filteredPredictions.length} {t.predictions}
              </p>
            </div>
          </div>

          <span className="rounded-xl border px-4 py-2 text-xs font-black" style={inputStyle}>
            {filteredPredictions.length} {t.results}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[22%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[28%] px-5 py-4 font-black">{t.prediction}</th>
                <th className="w-[14%] px-5 py-4 font-black">
                  {t.riskColumn}
                </th>
                <th className="w-[10%] px-5 py-4 font-black">{t.score}</th>
                <th className="w-[9%] px-5 py-4 font-black">{t.avg}</th>
                <th className="w-[9%] px-5 py-4 font-black">{t.abs}</th>
                <th className="w-[8%] px-5 py-4 font-black">{t.status}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 className="animate-spin" size={18} />
                      {t.loadingPredictions}
                    </div>
                  </td>
                </tr>
              ) : paginatedPredictions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noPredictions}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedPredictions.map((item) => {
                  const risk = getRiskStyle(item.status);
                  const Icon = risk.icon;
                  const fullName = `${item.prenom || ""} ${
                    item.nom || ""
                  }`.trim();

                  return (
                    <tr
                      key={item.predictionId || item.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${risk.iconBox}`}
                          >
                            <Icon size={17} />
                          </div>

                          <div className="min-w-0 text-center">
                            <p
                              className="mx-auto max-w-[150px] truncate font-black sm:max-w-[190px]"
                              style={textStyle}
                              title={fullName || "-"}
                            >
                              {fullName || "-"}
                            </p>

                            <p
                              className="mx-auto mt-0.5 max-w-[150px] truncate text-xs font-semibold sm:max-w-[190px]"
                              style={mutedTextStyle}
                              title={item.email || "-"}
                            >
                              {item.email || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p
                          className="mx-auto max-w-[260px] truncate text-sm font-bold"
                          style={textStyle}
                          title={item.prediction || "-"}
                        >
                          {item.prediction || "-"}
                        </p>

                        <p
                          className="mx-auto mt-0.5 max-w-[260px] truncate text-xs font-semibold"
                          style={mutedTextStyle}
                          title={item.recommandation || "-"}
                        >
                          {item.recommandation || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${risk.badge}`}
                        >
                          {risk.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                          {item.scoreRisque ?? 0}%
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-black" style={textStyle}>
                          {item.moyenne ?? 0}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-black" style={textStyle}>
                          {item.absences ?? 0}
                        </span>
                      </td>

                      <td className="px-5 py-4">
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
        </div>

        {/* PAGINATION */}
        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing}{" "}
            <span className="font-black" style={textStyle}>
              {startPrediction}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endPrediction}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredPredictions.length}
            </span>{" "}
            {t.predictions}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
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
                  color: currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span
              className="rounded-xl px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              {t.page} {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* AI SUMMARY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div
          className="overflow-hidden rounded-[1.4rem] border shadow-sm xl:col-span-2"
          style={cardStyle}
        >
          <div
            className="flex items-center gap-3 border-b px-5 py-4"
            style={sectionStyle}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.aiSummary}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.aiSummaryDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
            <div className="rounded-2xl border p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.totalPredictionsSummary}
              </p>

              <h3 className="mt-2 text-2xl font-black" style={textStyle}>
                {totalPredictions}
              </h3>
            </div>

            <div className="rounded-2xl border p-4" style={sectionStyle}>
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
          className="rounded-[1.4rem] border p-5 text-white shadow-sm"
          style={{
            borderColor: "var(--border-color)",
            background:
              "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <h3 className="text-lg font-black">{t.recommendation}</h3>

          <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
            {t.recommendationText}
          </p>
        </div>
      </div>
    </div>
  );
}