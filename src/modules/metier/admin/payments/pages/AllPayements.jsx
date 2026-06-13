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
              <CreditCard size={28} />
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
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={fetchPayements}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <RefreshCcw size={17} />
              {t.refresh}
            </button>

            <button
              type="button"
              onClick={() => setShowArchiveDialog(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Archive size={17} />
              {t.archive}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-red-300/30 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={cardStyle}
        >
          <div className="mb-5 flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <CreditCard size={22} />
            </div>

            <span
              className="rounded-full px-3 py-1.5 text-xs font-black"
              style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--primary-color)",
              }}
            >
              {t.records}
            </span>
          </div>

          <p className="text-sm font-black" style={textStyle}>
            {t.totalPayments}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {payements.length}
          </h2>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={cardStyle}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <Users size={22} />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
              {t.results}
            </span>
          </div>

          <p className="text-sm font-black" style={textStyle}>
            {t.displayedPayments}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {filteredPayements.length}
          </h2>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={cardStyle}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white">
              <DollarSign size={22} />
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-600">
              {t.amountLabel}
            </span>
          </div>

          <p className="text-sm font-black" style={textStyle}>
            {t.totalAmount}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {totalAmount} DH
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
              <CreditCard size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.paymentsList}
              </h2>

              <p className="mt-0.5 text-xs" style={mutedTextStyle}>
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

        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr
              className="text-center text-[11px] uppercase tracking-wide"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--muted-text)",
              }}
            >
              <th className="w-[25%] px-3 py-3 font-black">{t.student}</th>
              <th className="w-[15%] px-3 py-3 font-black">{t.amount}</th>
              <th className="w-[17%] px-3 py-3 font-black">{t.mode}</th>
              <th className="w-[17%] px-3 py-3 font-black">{t.date}</th>
              <th className="w-[14%] px-3 py-3 font-black">{t.status}</th>
              <th className="w-[12%] px-3 py-3 font-black">{t.action}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center">
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
                <td colSpan="6" className="px-5 py-8 text-center">
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
                    className="border-t text-center text-sm transition"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div
                          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white sm:flex"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Users size={17} />
                        </div>

                        <span className="truncate font-black" style={textStyle}>
                          {studentName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="font-bold" style={mutedTextStyle}>
                        {amount ?? "N/A"} DH
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {mode}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {date}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                        {status}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPayement(payement)}
                        title={t.view}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white transition hover:opacity-80"
                        style={{ backgroundColor: "var(--primary-color)" }}
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