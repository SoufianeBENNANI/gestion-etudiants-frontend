import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCcw,
  Eye,
  Archive,
  CreditCard,
  DollarSign,
  Users,
  FileDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import {
  getAllPayementsAdmin,
  downloadPayementsPdfAdmin,
  getArchivedPayementsAdmin,
} from "../services/payementService";

import PayementDetails from "../components/PayementDetails";
import ArchivedPayements from "../components/ArchivedPayements";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Payments Management",
    subtitle: "View student payments, status, and payment history.",

    searchPlaceholder: "Search payment...",
    refresh: "Refresh",
    archive: "Archive",
    pdf: "PDF",

    records: "Records",
    results: "Results",
    amountLabel: "Amount",

    totalPayments: "Total Payments",
    displayedPayments: "Displayed Payments",
    totalAmount: "Total Amount",

    paymentsList: "Payments List",
    showing: "Showing",
    to: "to",
    of: "of",
    payments: "payments",
    rows: "Rows:",

    student: "Student",
    amount: "Amount",
    mode: "Mode",
    date: "Date",
    status: "Status",
    action: "Action",

    loadingPayments: "Loading payments...",
    noPayments: "No payments found.",

    view: "View",

    page: "Page",
    previous: "Previous",
    next: "Next",

    loadError: "Error while loading payments",
    downloadError: "Error while downloading payments PDF",
  },

  FR: {
    management: "Gestion des paiements",
    title: "Gestion des paiements",
    subtitle: "Voir les paiements des étudiants, les statuts et l’historique.",

    searchPlaceholder: "Rechercher un paiement...",
    refresh: "Actualiser",
    archive: "Archive",
    pdf: "PDF",

    records: "Dossiers",
    results: "Résultats",
    amountLabel: "Montant",

    totalPayments: "Total paiements",
    displayedPayments: "Paiements affichés",
    totalAmount: "Montant total",

    paymentsList: "Liste des paiements",
    showing: "Affichage",
    to: "à",
    of: "sur",
    payments: "paiements",
    rows: "Lignes :",

    student: "Étudiant",
    amount: "Montant",
    mode: "Mode",
    date: "Date",
    status: "Statut",
    action: "Action",

    loadingPayments: "Chargement des paiements...",
    noPayments: "Aucun paiement trouvé.",

    view: "Voir",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    loadError: "Erreur lors du chargement des paiements",
    downloadError: "Erreur lors du téléchargement du PDF des paiements",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "إدارة المدفوعات",
    subtitle: "عرض مدفوعات الطلاب والحالة وسجل الدفع.",

    searchPlaceholder: "البحث عن دفعة...",
    refresh: "تحديث",
    archive: "الأرشيف",
    pdf: "PDF",

    records: "السجلات",
    results: "النتائج",
    amountLabel: "المبلغ",

    totalPayments: "إجمالي المدفوعات",
    displayedPayments: "المدفوعات المعروضة",
    totalAmount: "المبلغ الإجمالي",

    paymentsList: "قائمة المدفوعات",
    showing: "عرض",
    to: "إلى",
    of: "من",
    payments: "مدفوعات",
    rows: "الأسطر:",

    student: "الطالب",
    amount: "المبلغ",
    mode: "الطريقة",
    date: "التاريخ",
    status: "الحالة",
    action: "الإجراء",

    loadingPayments: "جاري تحميل المدفوعات...",
    noPayments: "لا توجد مدفوعات.",

    view: "عرض",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    loadError: "حدث خطأ أثناء تحميل المدفوعات",
    downloadError: "حدث خطأ أثناء تحميل ملف PDF للمدفوعات",
  },
};

export default function AllPayements() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [payements, setPayements] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayement, setSelectedPayement] = useState(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

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

  const getAmount = (payement) => {
    return payement.amount ?? payement.montant ?? 0;
  };

  const getDate = (payement) => {
    return payement.date ?? payement.datePayement ?? "N/A";
  };

  const getStatus = (payement) => {
    return payement.status ?? payement.statut ?? "PAID";
  };

  const getMode = (payement) => {
    return payement.modePayement ?? payement.mode ?? "N/A";
  };

  const getStudentName = (payement) => {
    const student =
      payement.student ||
      payement.etudiant ||
      payement.studentDto ||
      payement.etudiantDto ||
      {};

    const nom =
      student.nom ||
      payement.studentNom ||
      payement.nomStudent ||
      payement.nomEtudiant ||
      payement.etudiantNom ||
      "";

    const prenom =
      student.prenom ||
      payement.studentPrenom ||
      payement.prenomStudent ||
      payement.prenomEtudiant ||
      payement.etudiantPrenom ||
      "";

    const fullName = `${nom} ${prenom}`.trim();

    return fullName || payement.studentName || payement.etudiantName || "N/A";
  };

  const loadArchivedCount = async () => {
    try {
      const data = await getArchivedPayementsAdmin();
      setArchivedCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Load archived payments count error:", error);
      setArchivedCount(0);
    }
  };

  const fetchPayements = async () => {
    try {
      setLoading(true);

      const data = await getAllPayementsAdmin();
      const list = Array.isArray(data) ? data : [];

      setPayements(list);
      setCurrentPage(1);

      await loadArchivedCount();
    } catch (error) {
      console.error("Error loading payments:", error);
      alert(t.loadError);
      setPayements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayements();
  }, []);

  const filteredPayements = useMemo(() => {
    const value = searchTerm.toLowerCase();

    return payements.filter((payement) => {
      const studentName = getStudentName(payement);

      return (
        String(getAmount(payement)).toLowerCase().includes(value) ||
        String(getMode(payement)).toLowerCase().includes(value) ||
        String(getStatus(payement)).toLowerCase().includes(value) ||
        String(getDate(payement)).toLowerCase().includes(value) ||
        String(studentName).toLowerCase().includes(value)
      );
    });
  }, [payements, searchTerm]);

  const totalAmount = payements.reduce(
    (sum, item) => sum + Number(getAmount(item) || 0),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayements.length / itemsPerPage)
  );

  const paginatedPayements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayements, currentPage, itemsPerPage]);

  const startPayement =
    filteredPayements.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endPayement = Math.min(
    currentPage * itemsPerPage,
    filteredPayements.length
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

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

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadPayementsPdfAdmin();
    } catch (error) {
      console.error("Error downloading payments PDF:", error);
      alert(t.downloadError);
    } finally {
      setDownloading(false);
    }
  };

  const stats = [
    {
      title: t.totalPayments,
      value: payements.length,
      icon: CreditCard,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedPayments,
      value: filteredPayements.length,
      icon: Users,
      iconBg: "bg-blue-500",
      percentBg: "bg-blue-50",
      percentText: "text-blue-600",
      percent: "73%",
      trend: "22%",
    },
    {
      title: t.totalAmount,
      value: `${totalAmount} DH`,
      icon: DollarSign,
      iconBg: "bg-amber-500",
      percentBg: "bg-amber-50",
      percentText: "text-amber-600",
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
            onClick={fetchPayements}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
          >
            <RefreshCcw size={17} />
            {t.refresh}
          </button>

          <button
            type="button"
            onClick={() => setShowArchiveDialog(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
          >
            <Archive size={17} />
            {t.archive}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <FileDown size={17} />
            )}
            {t.pdf}
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
              <CreditCard size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.paymentsList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startPayement} {t.to} {endPayement} {t.of}{" "}
                {filteredPayements.length} {t.payments}
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
                <th className="w-[25%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[15%] px-5 py-4 font-black">{t.amount}</th>
                <th className="w-[17%] px-5 py-4 font-black">{t.mode}</th>
                <th className="w-[17%] px-5 py-4 font-black">{t.date}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.status}</th>
                <th className="w-[12%] px-5 py-4 font-black">{t.action}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingPayments}
                    </div>
                  </td>
                </tr>
              ) : filteredPayements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noPayments}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedPayements.map((payement) => {
                  const studentName = getStudentName(payement);
                  const amount = getAmount(payement);
                  const mode = getMode(payement);
                  const date = getDate(payement);
                  const status = getStatus(payement);

                  return (
                    <tr
                      key={payement.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Users size={17} />
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {studentName}
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
                        <span
                          className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-600"
                        >
                          {amount ?? "N/A"} DH
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {mode}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {date}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedPayement(payement)}
                          title={t.view}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                        >
                          <Eye size={15} />
                        </button>
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
              {startPayement}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endPayement}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredPayements.length}
            </span>{" "}
            {t.payments}
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

      <PayementDetails
        payement={selectedPayement}
        onClose={() => setSelectedPayement(null)}
      />

      <ArchivedPayements
        open={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onRestored={() => {
          fetchPayements();
          loadArchivedCount();
        }}
      />
    </div>
  );
}