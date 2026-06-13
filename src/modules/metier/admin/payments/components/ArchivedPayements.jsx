import { useEffect, useMemo, useState } from "react";
import {
  X,
  Archive,
  RotateCcw,
  Loader2,
  Search,
  RefreshCcw,
  CreditCard,
  User,
  DollarSign,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import {
  getArchivedPayementsAdmin,
  restorePayementAdmin,
} from "../services/payementService";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Archived Payments",
    subtitle: "View and restore archived payment records.",

    listTitle: "Archived Payments List",
    showing: "Showing",
    archivedPayments: "archived payments",

    searchPlaceholder: "Search archive...",
    refresh: "Refresh",

    student: "Student",
    amount: "Amount",
    mode: "Mode",
    date: "Date",
    status: "Status",
    action: "Action",

    loadingPayments: "Loading archived payments...",
    noPayments: "No archived payments found.",

    restore: "Restore",
    restoreConfirm: "Restore this payment?",
    restoreError: "Error while restoring the payment",
  },

  FR: {
    management: "Gestion des paiements",
    title: "Paiements archivés",
    subtitle: "Voir et restaurer les paiements archivés.",

    listTitle: "Liste des paiements archivés",
    showing: "Affichage de",
    archivedPayments: "paiements archivés",

    searchPlaceholder: "Rechercher dans l’archive...",
    refresh: "Actualiser",

    student: "Étudiant",
    amount: "Montant",
    mode: "Mode",
    date: "Date",
    status: "Statut",
    action: "Action",

    loadingPayments: "Chargement des paiements archivés...",
    noPayments: "Aucun paiement archivé trouvé.",

    restore: "Restaurer",
    restoreConfirm: "Restaurer ce paiement ?",
    restoreError: "Erreur lors de la restauration du paiement",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "المدفوعات المؤرشفة",
    subtitle: "عرض واستعادة سجلات المدفوعات المؤرشفة.",

    listTitle: "قائمة المدفوعات المؤرشفة",
    showing: "عرض",
    archivedPayments: "مدفوعات مؤرشفة",

    searchPlaceholder: "البحث في الأرشيف...",
    refresh: "تحديث",

    student: "الطالب",
    amount: "المبلغ",
    mode: "الطريقة",
    date: "التاريخ",
    status: "الحالة",
    action: "الإجراء",

    loadingPayments: "جاري تحميل المدفوعات المؤرشفة...",
    noPayments: "لا توجد مدفوعات مؤرشفة.",

    restore: "استعادة",
    restoreConfirm: "هل تريد استعادة هذا الدفع؟",
    restoreError: "حدث خطأ أثناء استعادة الدفع",
  },
};

export default function ArchivedPayements({ open, onClose, onRestored }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [payements, setPayements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    return payement.amount ?? payement.montant ?? "N/A";
  };

  const getDate = (payement) => {
    return payement.datePayement ?? payement.date ?? "N/A";
  };

  const getStatus = (payement) => {
    return payement.statut ?? payement.status ?? "N/A";
  };

  const getMode = (payement) => {
    return payement.modePayement ?? payement.mode ?? "N/A";
  };

  const getStudentName = (payement) => {
    return (
      payement.studentName ||
      `${payement.student?.prenom || ""} ${payement.student?.nom || ""}`.trim() ||
      "N/A"
    );
  };

  const loadArchivedPayements = async () => {
    try {
      setLoading(true);

      const data = await getArchivedPayementsAdmin();
      setPayements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived payments:", error);
      setPayements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      loadArchivedPayements();
    }
  }, [open]);

  const filteredPayements = useMemo(() => {
    return payements.filter((payement) => {
      const studentName = getStudentName(payement);
      const amount = getAmount(payement);
      const mode = getMode(payement);
      const date = getDate(payement);
      const status = getStatus(payement);

      return `${studentName} ${amount} ${mode} ${date} ${status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [payements, searchTerm]);

  const handleRestore = async (payement) => {
    if (!window.confirm(t.restoreConfirm)) return;

    try {
      setRestoringId(payement.id);

      const restoredPayement = await restorePayementAdmin(payement.id);

      setPayements((prev) => prev.filter((item) => item.id !== payement.id));

      if (onRestored) {
        onRestored(restoredPayement || payement);
      }
    } catch (error) {
      console.error("Error restoring payment:", error);
      alert(t.restoreError);
    } finally {
      setRestoringId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-6xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* LIST HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CreditCard size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t.listTitle}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {t.showing} {filteredPayements.length} {t.archivedPayments}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedPayements}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* TABLE */}
        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-[25%] px-4 py-4 font-black">{t.student}</th>
                <th className="w-[15%] px-4 py-4 font-black">{t.amount}</th>
                <th className="w-[17%] px-4 py-4 font-black">{t.mode}</th>
                <th className="w-[17%] px-4 py-4 font-black">{t.date}</th>
                <th className="w-[13%] px-4 py-4 font-black">{t.status}</th>
                <th className="w-[13%] px-4 py-4 font-black">{t.action}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingPayments}
                    </div>
                  </td>
                </tr>
              ) : filteredPayements.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-sm font-bold text-slate-600"
                  >
                    {t.noPayments}
                  </td>
                </tr>
              ) : (
                filteredPayements.map((payement) => {
                  const studentName = getStudentName(payement);
                  const amount = getAmount(payement);
                  const mode = getMode(payement);
                  const date = getDate(payement);
                  const status = getStatus(payement);

                  return (
                    <tr
                      key={payement.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                            <User size={17} />
                          </div>

                          <span className="truncate font-black text-slate-900">
                            {studentName}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1 font-bold text-slate-700">
                          <DollarSign size={15} />
                          <span>
                            {amount !== "N/A" ? `${amount} DH` : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="block truncate font-semibold text-slate-600">
                          {mode}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1 font-semibold text-slate-600">
                          <CalendarDays size={15} />
                          <span className="truncate">{date}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                          <BadgeCheck size={13} />
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleRestore(payement)}
                          disabled={restoringId === payement.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === payement.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <RotateCcw size={16} />
                          )}

                          {t.restore}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}