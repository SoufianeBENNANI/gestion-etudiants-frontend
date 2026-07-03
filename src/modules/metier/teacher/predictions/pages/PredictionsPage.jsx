import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Loader2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

import {
  getAllPredictions,
  getPerformancePredictions,
} from "../services/predictionService";

import PredictionDetails from "../components/PredictionDetails";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "AI Predictions",
    title: "Student Performance Predictions",
    subtitle: "View AI-based student risk, level and recommendations.",
    search: "Search prediction...",
    total: "Total Predictions",
    highRisk: "High Risk",
    average: "Average Score",
    list: "Predictions List",
    showing: "Showing",
    to: "to",
    of: "of",
    predictions: "predictions",
    rows: "Rows:",
    student: "Student",
    averageLabel: "Average",
    absences: "Absences",
    prediction: "Prediction",
    risk: "Risk Score",
    level: "Level",
    status: "Status",
    actions: "Actions",
    loading: "Loading predictions...",
    empty: "No predictions found.",
    page: "Page",
  },
  FR: {
    management: "Prédictions IA",
    title: "Prédictions de performance des étudiants",
    subtitle:
      "Consulter le risque, le niveau et les recommandations générés par l’IA.",
    search: "Rechercher une prédiction...",
    total: "Total des prédictions",
    highRisk: "Risque élevé",
    average: "Score moyen",
    list: "Liste des prédictions",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    predictions: "prédictions",
    rows: "Lignes :",
    student: "Étudiant",
    averageLabel: "Moyenne",
    absences: "Absences",
    prediction: "Prédiction",
    risk: "Score risque",
    level: "Niveau",
    status: "Statut",
    actions: "Actions",
    loading: "Chargement des prédictions...",
    empty: "Aucune prédiction trouvée.",
    page: "Page",
  },
  AR: {
    management: "توقعات الذكاء الاصطناعي",
    title: "توقعات أداء الطلاب",
    subtitle: "عرض مستوى الخطر والتوصيات الناتجة عن الذكاء الاصطناعي.",
    search: "البحث عن توقع...",
    total: "مجموع التوقعات",
    highRisk: "خطر مرتفع",
    average: "المعدل العام",
    list: "قائمة التوقعات",
    showing: "عرض",
    to: "إلى",
    of: "من",
    predictions: "توقعات",
    rows: "الأسطر:",
    student: "الطالب",
    averageLabel: "المعدل",
    absences: "الغيابات",
    prediction: "التوقع",
    risk: "نسبة الخطر",
    level: "المستوى",
    status: "الحالة",
    actions: "الإجراءات",
    loading: "جاري تحميل التوقعات...",
    empty: "لا توجد توقعات.",
    page: "صفحة",
  },
};

export default function PredictionsPage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const mutedTextStyle = { color: "var(--muted-text)" };
  const textStyle = { color: "var(--text-color)" };

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  const getStudentName = (item) =>
    `${item.nom || ""} ${item.prenom || ""}`.trim() ||
    item.studentName ||
    `ID ${item.studentId || "-"}`;

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await getPerformancePredictions();
      setPredictions(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Load predictions error:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const filteredPredictions = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();
    if (!value) return predictions;

    return predictions.filter((item) => {
      return (
        String(item.id || "").includes(value) ||
        getStudentName(item).toLowerCase().includes(value) ||
        String(item.email || "").toLowerCase().includes(value) ||
        String(item.prediction || "").toLowerCase().includes(value) ||
        String(item.niveau || "").toLowerCase().includes(value) ||
        String(item.status || "").toLowerCase().includes(value)
      );
    });
  }, [predictions, searchTerm]);

  const highRiskCount = filteredPredictions.filter((item) => {
    const risk = Number(item.scoreRisque ?? item.riskScore ?? 0);
    return risk >= 0.7 || String(item.niveau || "").toLowerCase().includes("high");
  }).length;

  const averageScore =
    filteredPredictions.length === 0
      ? 0
      : (
          filteredPredictions.reduce(
            (sum, item) => sum + Number(item.moyenne || 0),
            0
          ) / filteredPredictions.length
        ).toFixed(2);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPredictions.length / itemsPerPage)
  );

  const paginatedPredictions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPredictions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPredictions, currentPage, itemsPerPage]);

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

  const stats = [
    {
      title: t.total,
      value: predictions.length,
      icon: Brain,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "AI",
      trend: "Live",
    },
    {
      title: t.highRisk,
      value: highRiskCount,
      icon: AlertTriangle,
      iconBg: "bg-red-500",
      percentBg: "bg-red-50",
      percentText: "text-red-600",
      percent: "Risk",
      trend: "Alert",
    },
    {
      title: t.average,
      value: averageScore,
      icon: GraduationCap,
      iconBg: "bg-blue-500",
      percentBg: "bg-blue-50",
      percentText: "text-blue-600",
      percent: "AVG",
      trend: "Score",
    },
  ];

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      <div
        className={`flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between ${
          isArabic ? "lg:flex-row-reverse text-right" : "text-left"
        }`}
        style={{
          borderColor: "var(--border-color)",
          background: headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-semibold text-purple-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>

          <p className="mt-1 text-sm font-semibold text-purple-100">
            {t.subtitle}
          </p>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t.search}
            className={`w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-purple-200 sm:w-64 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <Search size={17} className="text-purple-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div
                className={`flex items-start justify-between ${
                  isArabic ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-4 ${
                    isArabic ? "flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black" style={textStyle}>
                      {item.value}
                    </h3>

                    <p className="text-xs font-semibold" style={mutedTextStyle}>
                      {item.title}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${item.percentBg}`}
                >
                  <span className={`text-[11px] font-black ${item.percentText}`}>
                    {item.percent}
                  </span>
                </div>
              </div>

              <div
                className={`mt-5 flex items-center gap-3 text-xs font-semibold ${
                  isArabic ? "flex-row-reverse" : ""
                }`}
              >
                <span style={mutedTextStyle}>{item.trend}</span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className={`flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between ${
            isArabic ? "lg:flex-row-reverse" : ""
          }`}
          style={sectionStyle}
        >
          <div
            className={`flex items-center gap-3 ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: headerGradient }}
            >
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.list}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startPrediction} {t.to} {endPrediction} {t.of}{" "}
                {filteredPredictions.length} {t.predictions}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-bold outline-none transition"
              style={inputStyle}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[22%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[13%] px-5 py-4 font-black">
                  {t.averageLabel}
                </th>
                <th className="w-[13%] px-5 py-4 font-black">{t.absences}</th>
                <th className="w-[18%] px-5 py-4 font-black">
                  {t.prediction}
                </th>
                <th className="w-[13%] px-5 py-4 font-black">{t.risk}</th>
                <th className="w-[13%] px-5 py-4 font-black">{t.level}</th>
                <th className="w-[10%] px-5 py-4 font-black">{t.actions}</th>
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
                      <Loader2 size={18} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedPredictions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedPredictions.map((item) => (
                  <tr
                    key={item.id || `${item.studentId}-${item.email}`}
                    className="border-b text-center text-sm transition last:border-none"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                          {String(getStudentName(item) || "-")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 text-center">
                          <p className="truncate font-black" style={textStyle}>
                            {getStudentName(item)}
                          </p>

                          <p
                            className="mt-0.5 truncate text-xs font-semibold"
                            style={mutedTextStyle}
                          >
                            {item.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-black">{item.moyenne ?? "-"}</td>
                    <td className="px-5 py-4">{item.absences ?? "-"}</td>

                    <td className="px-5 py-4">
                      <span
                        className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                        style={{
                          backgroundColor: "var(--section-bg)",
                          color: "var(--primary-color)",
                        }}
                      >
                        {item.prediction || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">{item.scoreRisque ?? "-"}</td>
                    <td className="px-5 py-4">{item.niveau || "-"}</td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPrediction(item)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className={`flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between ${
            isArabic ? "lg:flex-row-reverse" : ""
          }`}
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                  background:
                    currentPage === page ? headerGradient : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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

      <PredictionDetails
        open={!!selectedPrediction}
        prediction={selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
      />
    </div>
  );
}