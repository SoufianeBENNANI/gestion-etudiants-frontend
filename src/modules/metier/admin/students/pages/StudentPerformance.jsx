import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
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

const translations = {
  EN: {
    management: "Students Management",
    title: "Performance Students",
    subtitle: "Analyse AI des moyennes, absences, risques et recommandations.",

    searchPlaceholder: "Search student...",
    refresh: "Refresh",

    totalStudents: "Total Students",
    averageGrade: "Average Grade",
    bestStudent: "Best Student",
    atRiskStudents: "At Risk Students",

    records: "Records",
    average: "Average",
    top: "Top",
    risk: "Risk",

    riskScoreOverview: "Risk Score Overview",
    riskScoreDescription: "Vue globale du risque IA pour tous les étudiants.",
    predicted: "predicted",
    students: "students",

    lowRisk: "Low Risk",
    moderate: "Moderate",
    highRisk: "High Risk",

    loadingGraph: "Loading graph...",
    noPerformanceData: "No performance data found.",

    noPrediction: "No prediction",
    riskText: "Risk",

    aiSummary: "AI Summary",
    aiSummaryDescription: "Résumé automatique des performances.",
    totalStudentsSummary: "Nombre total d’étudiants",
    predictedStudents: "Étudiants avec prédiction",
    generalAverage: "Moyenne générale",
    riskStudents: "Étudiants à risque",

    tableTitle: "Students Performance Table",
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    rows: "Rows:",

    student: "Student",
    email: "Email",
    avg: "Avg",
    abs: "Abs.",
    prediction: "Prediction",
    status: "Status",
    action: "Action",

    loadingPerformance: "Loading performance...",
    loadError: "Error while loading student performance",
    generateError: "Error while generating prediction",

    page: "Page",
    previous: "Previous",
    next: "Next",

    statusNoPrediction: "No Prediction",
    statusAtRisk: "At Risk",
    statusModerate: "Moderate",
    statusGood: "Good",

    generatePrediction: "Generate Prediction",
    generated: "Generated",
    unknownStudent: "Unknown Student",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Performance des étudiants",
    subtitle: "Analyse IA des moyennes, absences, risques et recommandations.",

    searchPlaceholder: "Rechercher un étudiant...",
    refresh: "Actualiser",

    totalStudents: "Total étudiants",
    averageGrade: "Moyenne générale",
    bestStudent: "Meilleur étudiant",
    atRiskStudents: "Étudiants à risque",

    records: "Dossiers",
    average: "Moyenne",
    top: "Top",
    risk: "Risque",

    riskScoreOverview: "Vue d’ensemble du score de risque",
    riskScoreDescription: "Vue globale du risque IA pour tous les étudiants.",
    predicted: "prédits",
    students: "étudiants",

    lowRisk: "Risque faible",
    moderate: "Modéré",
    highRisk: "Risque élevé",

    loadingGraph: "Chargement du graphique...",
    noPerformanceData: "Aucune donnée de performance trouvée.",

    noPrediction: "Aucune prédiction",
    riskText: "Risque",

    aiSummary: "Résumé IA",
    aiSummaryDescription: "Résumé automatique des performances.",
    totalStudentsSummary: "Nombre total d’étudiants",
    predictedStudents: "Étudiants avec prédiction",
    generalAverage: "Moyenne générale",
    riskStudents: "Étudiants à risque",

    tableTitle: "Tableau des performances étudiants",
    showing: "Affichage",
    to: "à",
    of: "sur",
    results: "résultats",
    rows: "Lignes :",

    student: "Étudiant",
    email: "Email",
    avg: "Moy.",
    abs: "Abs.",
    prediction: "Prédiction",
    status: "Statut",
    action: "Action",

    loadingPerformance: "Chargement des performances...",
    loadError: "Erreur lors du chargement des performances",
    generateError: "Erreur lors de la génération de la prédiction",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    statusNoPrediction: "Aucune prédiction",
    statusAtRisk: "À risque",
    statusModerate: "Modéré",
    statusGood: "Bon",

    generatePrediction: "Générer la prédiction",
    generated: "Généré",
    unknownStudent: "Étudiant inconnu",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "أداء الطلاب",
    subtitle: "تحليل الذكاء الاصطناعي للمعدلات والغيابات والمخاطر والتوصيات.",

    searchPlaceholder: "البحث عن طالب...",
    refresh: "تحديث",

    totalStudents: "إجمالي الطلاب",
    averageGrade: "المعدل العام",
    bestStudent: "أفضل طالب",
    atRiskStudents: "الطلاب المعرضون للخطر",

    records: "السجلات",
    average: "المعدل",
    top: "الأفضل",
    risk: "الخطر",

    riskScoreOverview: "نظرة عامة على درجة الخطر",
    riskScoreDescription: "نظرة عامة على خطر الذكاء الاصطناعي لجميع الطلاب.",
    predicted: "تم توقعهم",
    students: "طلاب",

    lowRisk: "خطر منخفض",
    moderate: "متوسط",
    highRisk: "خطر مرتفع",

    loadingGraph: "جاري تحميل الرسم البياني...",
    noPerformanceData: "لا توجد بيانات أداء.",

    noPrediction: "لا توجد توقعات",
    riskText: "خطر",

    aiSummary: "ملخص الذكاء الاصطناعي",
    aiSummaryDescription: "ملخص تلقائي للأداء.",
    totalStudentsSummary: "إجمالي عدد الطلاب",
    predictedStudents: "طلاب لديهم توقعات",
    generalAverage: "المعدل العام",
    riskStudents: "طلاب معرضون للخطر",

    tableTitle: "جدول أداء الطلاب",
    showing: "عرض",
    to: "إلى",
    of: "من",
    results: "نتائج",
    rows: "الأسطر:",

    student: "الطالب",
    email: "البريد الإلكتروني",
    avg: "المعدل",
    abs: "الغياب",
    prediction: "التوقع",
    status: "الحالة",
    action: "الإجراء",

    loadingPerformance: "جاري تحميل الأداء...",
    loadError: "حدث خطأ أثناء تحميل أداء الطلاب",
    generateError: "حدث خطأ أثناء إنشاء التوقع",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    statusNoPrediction: "لا توجد توقعات",
    statusAtRisk: "معرض للخطر",
    statusModerate: "متوسط",
    statusGood: "جيد",

    generatePrediction: "إنشاء التوقع",
    generated: "تم الإنشاء",
    unknownStudent: "طالب غير معروف",
  },
};

export default function StudentPerformance() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [predictingId, setPredictingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const loadPerformance = async () => {
    try {
      setLoading(true);

      const data = await getStudentPerformance();
      setPerformances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load student performance error:", error);
      alert(t.loadError);
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
    } catch (error) {
      console.error("Generate prediction error:", error);
      alert(t.generateError);
    } finally {
      setPredictingId(null);
    }
  };

  const filteredPerformances = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return performances;

    return performances.filter((item) => {
      const fullName = `${item.nom || ""} ${item.prenom || ""}`.toLowerCase();
      const reverseName = `${item.prenom || ""} ${
        item.nom || ""
      }`.toLowerCase();
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
        text: t.statusNoPrediction,
        className: "bg-slate-100 text-slate-600 ring-slate-200",
      };
    }

    const normalizedStatus = String(status || "").toUpperCase();
    const score = Number(scoreRisque || 0);

    if (normalizedStatus === "AT_RISK" || score >= 70) {
      return {
        text: t.statusAtRisk,
        className: "bg-rose-50 text-rose-700 ring-rose-200",
      };
    }

    if (normalizedStatus === "MODERATE" || score >= 40) {
      return {
        text: t.statusModerate,
        className: "bg-amber-50 text-amber-700 ring-amber-200",
      };
    }

    return {
      text: t.statusGood,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  };

  const getRiskBarClass = (risk, hasPrediction) => {
    if (!hasPrediction) return "bg-slate-300";
    if (risk >= 70) return "bg-rose-500";
    if (risk >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const statsCards = [
    {
      title: t.totalStudents,
      value: totalStudents,
      icon: Users,
      badge: t.records,
      iconBg: "bg-orange-500",
      badgeClass: "bg-orange-50 text-orange-600",
    },
    {
      title: t.averageGrade,
      value: averageGrade,
      icon: GraduationCap,
      badge: t.average,
      iconBg: "bg-blue-500",
      badgeClass: "bg-blue-50 text-blue-600",
    },
    {
      title: t.bestStudent,
      value: bestStudent,
      icon: Trophy,
      badge: t.top,
      iconBg: "bg-amber-500",
      badgeClass: "bg-amber-50 text-amber-600",
      mediumText: true,
    },
    {
      title: t.atRiskStudents,
      value: atRiskStudents,
      icon: AlertTriangle,
      badge: t.risk,
      iconBg: "bg-red-500",
      badgeClass: "bg-red-50 text-red-600",
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={loadPerformance}
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
                className={`truncate font-black ${
                  card.mediumText
                    ? "max-w-[130px] text-sm sm:max-w-[160px] sm:text-base xl:max-w-[180px] xl:text-lg"
                    : "text-2xl"
                }`}
                style={textStyle}
                title={String(card.value)}
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

      {/* GRAPH + SUMMARY */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div
          className="overflow-hidden rounded-[1.4rem] border shadow-sm"
          style={cardStyle}
        >
          <div
            className="flex flex-col gap-4 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
            style={sectionStyle}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                <Activity size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black" style={textStyle}>
                  {t.riskScoreOverview}
                </h2>

                <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                  {t.riskScoreDescription}
                </p>
              </div>
            </div>

            <div
              className="rounded-xl border px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              {predictedStudents.length} {t.predicted} / {performances.length}{" "}
              {t.students}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase text-emerald-600">
                  {t.lowRisk}
                </p>

                <p className="mt-2 text-2xl font-black text-emerald-700">
                  {riskDistribution.low}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-black uppercase text-amber-600">
                  {t.moderate}
                </p>

                <p className="mt-2 text-2xl font-black text-amber-700">
                  {riskDistribution.moderate}
                </p>
              </div>

              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-xs font-black uppercase text-rose-600">
                  {t.highRisk}
                </p>

                <p className="mt-2 text-2xl font-black text-rose-700">
                  {riskDistribution.high}
                </p>
              </div>
            </div>

            <div className="max-h-[360px] space-y-4 overflow-y-auto pr-2">
              {loading ? (
                <div
                  className="flex h-60 items-center justify-center gap-2 text-sm font-bold"
                  style={mutedTextStyle}
                >
                  <Loader2 className="animate-spin" size={18} />
                  {t.loadingGraph}
                </div>
              ) : filteredPerformances.length === 0 ? (
                <div
                  className="flex h-60 items-center justify-center text-sm font-bold"
                  style={mutedTextStyle}
                >
                  {t.noPerformanceData}
                </div>
              ) : (
                filteredPerformances.map((item) => {
                  const risk = Number(item.scoreRisque || 0);
                  const hasPrediction = Boolean(item.hasPrediction);

                  return (
                    <div
                      key={item.studentId}
                      className="rounded-2xl border p-4"
                      style={sectionStyle}
                    >
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-black" style={textStyle}>
                            {item.nom} {item.prenom}
                          </p>

                          <p
                            className="truncate text-xs font-semibold"
                            style={mutedTextStyle}
                          >
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
                          {hasPrediction
                            ? `${risk}% ${t.riskText}`
                            : t.noPrediction}
                        </span>
                      </div>

                      <div
                        className="h-3 overflow-hidden rounded-full ring-1"
                        style={{
                          backgroundColor: "var(--input-bg)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <div
                          className={`h-full rounded-full ${getRiskBarClass(
                            risk,
                            hasPrediction
                          )}`}
                          style={{
                            width: `${
                              hasPrediction ? Math.min(100, risk) : 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-[1.4rem] border shadow-sm"
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

          <div className="space-y-4 p-5">
            <div className="rounded-2xl border p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.totalStudentsSummary}
              </p>

              <p className="mt-2 text-2xl font-black" style={textStyle}>
                {totalStudents}
              </p>
            </div>

            <div className="rounded-2xl border p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.predictedStudents}
              </p>

              <p
                className="mt-2 text-2xl font-black"
                style={{ color: "var(--primary-color)" }}
              >
                {predictedStudents.length}
              </p>
            </div>

            <div className="rounded-2xl border p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.generalAverage}
              </p>

              <p className="mt-2 text-2xl font-black" style={textStyle}>
                {averageGrade}
              </p>
            </div>

            <div className="rounded-2xl border p-4" style={sectionStyle}>
              <p className="text-xs font-bold" style={mutedTextStyle}>
                {t.riskStudents}
              </p>

              <p className="mt-2 text-2xl font-black text-rose-600">
                {atRiskStudents}
              </p>
            </div>
          </div>
        </div>
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
                {t.showing} {showingFrom} {t.to} {showingTo} {t.of}{" "}
                {filteredPerformances.length} {t.results}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-bold outline-none transition"
              style={inputStyle}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[19%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[20%] px-5 py-4 font-black">{t.email}</th>
                <th className="w-[8%] px-5 py-4 font-black">{t.avg}</th>
                <th className="w-[8%] px-5 py-4 font-black">{t.abs}</th>
                <th className="w-[17%] px-5 py-4 font-black">{t.prediction}</th>
                <th className="w-[12%] px-5 py-4 font-black">{t.risk}</th>
                <th className="w-[8%] px-5 py-4 font-black">{t.status}</th>
                <th className="w-[8%] px-5 py-4 font-black">{t.action}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 className="animate-spin" size={18} />
                      {t.loadingPerformance}
                    </div>
                  </td>
                </tr>
              ) : filteredPerformances.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noPerformanceData}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedPerformances.map((item) => {
                  const fullName =
                    `${item.nom || ""} ${item.prenom || ""}`.trim() ||
                    t.unknownStudent;

                  const badge = getStatusBadge(
                    item.status,
                    item.scoreRisque,
                    item.hasPrediction
                  );

                  const risk = Number(item.scoreRisque || 0);

                  return (
                    <tr
                      key={item.studentId}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(fullName).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {fullName}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.student}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-1">
                          <Mail
                            size={14}
                            className="shrink-0"
                            style={mutedTextStyle}
                          />

                          <span
                            className="truncate text-sm font-semibold"
                            style={mutedTextStyle}
                          >
                            {item.email || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-black" style={textStyle}>
                          {item.hasPrediction ? item.moyenne ?? 0 : "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold" style={mutedTextStyle}>
                          {item.hasPrediction ? item.absences ?? 0 : "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-bold"
                          style={mutedTextStyle}
                        >
                          {item.prediction || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-[120px] items-center gap-2">
                          <div
                            className="h-2 flex-1 overflow-hidden rounded-full"
                            style={{ backgroundColor: "var(--section-bg)" }}
                          >
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

                          <span
                            className="text-xs font-black"
                            style={mutedTextStyle}
                          >
                            {item.hasPrediction ? `${risk}%` : "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${badge.className}`}
                        >
                          {badge.text}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {!item.hasPrediction ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleGeneratePrediction(item.studentId)
                            }
                            disabled={predictingId === item.studentId}
                            title={t.generatePrediction}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                            style={inputStyle}
                          >
                            {predictingId === item.studentId ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Wand2 size={15} />
                            )}
                          </button>
                        ) : (
                          <span
                            title={t.generated}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                          >
                            <Brain size={15} />
                          </span>
                        )}
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
              {showingFrom}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {showingTo}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredPerformances.length}
            </span>{" "}
            {t.results}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={safeCurrentPage === 1}
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
                    safeCurrentPage === page
                      ? "var(--secondary-color)"
                      : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color:
                    safeCurrentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span
              className="rounded-xl px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              {t.page} {safeCurrentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}