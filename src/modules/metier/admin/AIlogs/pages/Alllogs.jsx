import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Search,
  RefreshCw,
  CalendarDays,
  User,
  FileInput,
  FileOutput,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Database,
  Activity,
  TrendingUp,
} from "lucide-react";
import api from "../../../../../api/axios";

const translations = {
  EN: {
    management: "Artificial Intelligence",
    title: "AI Logs",
    subtitle: "Monitor, view and track AI prediction history.",

    searchPlaceholder: "Search log...",
    refresh: "Refresh",

    records: "Records",
    results: "Results",
    today: "Today",

    totalLogs: "Total Logs",
    displayedLogs: "Displayed Logs",
    todayLogs: "Today Logs",

    logsList: "Logs List",
    showing: "Showing",
    to: "to",
    of: "of",
    logs: "logs",
    rows: "Rows:",

    log: "Log",
    student: "Student",
    input: "Input",
    output: "Output",
    created: "Created",

    saved: "Saved",
    id: "ID:",
    noStudent: "No student",
    noInputData: "No input data",
    noOutputData: "No output data",

    loadingLogs: "Loading AI logs...",
    noLogs: "No AI logs found.",
    loadError: "Failed to load AI logs. Please try again.",

    page: "Page",
    previous: "Previous",
    next: "Next",

    notAvailable: "N/A",
  },

  FR: {
    management: "Intelligence artificielle",
    title: "Logs IA",
    subtitle: "Surveiller, consulter et suivre l’historique des prédictions IA.",

    searchPlaceholder: "Rechercher un log...",
    refresh: "Actualiser",

    records: "Dossiers",
    results: "Résultats",
    today: "Aujourd’hui",

    totalLogs: "Total logs",
    displayedLogs: "Logs affichés",
    todayLogs: "Logs du jour",

    logsList: "Liste des logs",
    showing: "Affichage",
    to: "à",
    of: "sur",
    logs: "logs",
    rows: "Lignes :",

    log: "Log",
    student: "Étudiant",
    input: "Entrée",
    output: "Sortie",
    created: "Créé le",

    saved: "Enregistré",
    id: "ID :",
    noStudent: "Aucun étudiant",
    noInputData: "Aucune donnée d’entrée",
    noOutputData: "Aucune donnée de sortie",

    loadingLogs: "Chargement des logs IA...",
    noLogs: "Aucun log IA trouvé.",
    loadError: "Échec du chargement des logs IA. Veuillez réessayer.",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    notAvailable: "N/A",
  },

  AR: {
    management: "الذكاء الاصطناعي",
    title: "سجلات الذكاء الاصطناعي",
    subtitle: "مراقبة وعرض وتتبع تاريخ توقعات الذكاء الاصطناعي.",

    searchPlaceholder: "البحث عن سجل...",
    refresh: "تحديث",

    records: "السجلات",
    results: "النتائج",
    today: "اليوم",

    totalLogs: "إجمالي السجلات",
    displayedLogs: "السجلات المعروضة",
    todayLogs: "سجلات اليوم",

    logsList: "قائمة السجلات",
    showing: "عرض",
    to: "إلى",
    of: "من",
    logs: "سجلات",
    rows: "الأسطر:",

    log: "السجل",
    student: "الطالب",
    input: "المدخلات",
    output: "المخرجات",
    created: "تاريخ الإنشاء",

    saved: "محفوظ",
    id: "المعرف:",
    noStudent: "لا يوجد طالب",
    noInputData: "لا توجد بيانات إدخال",
    noOutputData: "لا توجد بيانات إخراج",

    loadingLogs: "جاري تحميل سجلات الذكاء الاصطناعي...",
    noLogs: "لا توجد سجلات ذكاء اصطناعي.",
    loadError: "فشل تحميل سجلات الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    notAvailable: "N/A",
  },
};

export default function Alllogs() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
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

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/logs");
      setLogs(Array.isArray(response.data) ? response.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error loading AI logs:", err);
      setLogs([]);
      setError(t.loadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (error) {
      setError(t.loadError);
    }
  }, [language]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
  };

  const filteredLogs = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    if (!value) return logs;

    return logs.filter((log) => {
      const studentName = `${log.student?.prenom || ""} ${
        log.student?.nom || ""
      }`.toLowerCase();

      return (
        String(log.id || "").includes(value) ||
        String(log.inputData || "").toLowerCase().includes(value) ||
        String(log.outputData || "").toLowerCase().includes(value) ||
        studentName.includes(value)
      );
    });
  }, [logs, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / itemsPerPage)
  );

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const startLog =
    filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endLog = Math.min(currentPage * itemsPerPage, filteredLogs.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const todayLogs = logs.filter((log) => {
    if (!log.createdAt) return false;
    return new Date(log.createdAt).toDateString() === new Date().toDateString();
  }).length;

  const formatDate = (date) => {
    if (!date) return t.notAvailable;

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (student) => {
    if (!student) return t.noStudent;
    return `${student.prenom || ""} ${student.nom || ""}`.trim() || t.noStudent;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const stats = [
    {
      title: t.totalLogs,
      value: logs.length,
      icon: Database,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedLogs,
      value: filteredLogs.length,
      icon: Search,
      iconBg: "bg-blue-500",
      percentBg: "bg-blue-50",
      percentText: "text-blue-600",
      percent: "73%",
      trend: "22%",
    },
    {
      title: t.todayLogs,
      value: todayLogs,
      icon: Activity,
      iconBg: "bg-emerald-500",
      percentBg: "bg-emerald-50",
      percentText: "text-emerald-600",
      percent: "100%",
      trend: "0.9%",
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
          background: "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div>
          <p className="text-xs font-semibold text-blue-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
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
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            {t.refresh}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
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

              <div className="mt-5 flex items-center gap-3 text-xs font-semibold">
                <span style={mutedTextStyle}>Last 30 days</span>

                <span className="font-black text-emerald-500">
                  {item.trend}
                </span>

                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

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
                {t.logsList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startLog} {t.to} {endLog} {t.of}{" "}
                {filteredLogs.length} {t.logs}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>

            <select
              value={itemsPerPage}
              onChange={handleChangeItemsPerPage}
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
          <table className="w-full min-w-[980px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[17%] px-5 py-4 font-black">{t.log}</th>
                <th className="w-[19%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.input}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.output}</th>
                <th className="w-[16%] px-5 py-4 font-black">{t.created}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingLogs}
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noLogs}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                          <Brain size={17} />
                        </div>

                        <div className="min-w-0 text-center">
                          <p className="truncate font-black" style={textStyle}>
                            {t.log} #{log.id}
                          </p>

                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                            <ShieldCheck size={11} />
                            {t.saved}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <User size={16} />
                        </div>

                        <div className="min-w-0 text-center">
                          <p className="truncate font-black" style={textStyle}>
                            {getStudentName(log.student)}
                          </p>

                          <p
                            className="truncate text-xs font-bold"
                            style={mutedTextStyle}
                          >
                            {t.id} {log.student?.id || t.notAvailable}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-start justify-center gap-2">
                        <FileInput
                          size={16}
                          className="mt-0.5 shrink-0 text-cyan-600"
                        />

                        <p
                          className="line-clamp-2 text-center text-xs font-semibold"
                          style={mutedTextStyle}
                        >
                          {log.inputData || t.noInputData}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="mx-auto flex max-w-full items-start justify-center gap-2">
                        <FileOutput
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <p
                          className="line-clamp-2 text-center text-xs font-semibold"
                          style={mutedTextStyle}
                        >
                          {log.outputData || t.noOutputData}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <CalendarDays size={15} style={mutedTextStyle} />

                        <span
                          className="text-xs font-bold"
                          style={mutedTextStyle}
                        >
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
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
              {startLog}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endLog}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredLogs.length}
            </span>{" "}
            {t.logs}
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
    </div>
  );
}