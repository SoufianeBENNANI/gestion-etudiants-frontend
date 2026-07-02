import { useEffect, useState } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

const headerGradient =
  "linear-gradient(180deg, #3b2c8f 0%, #4c1d95 45%, #581c87 100%)";

const translations = {
  EN: {
    title: "Delete Attendance",
    subtitle: "Confirm attendance deletion.",
    question: "Are you sure you want to delete this attendance?",
    description: "This attendance record will be removed from the list.",
    delete: "Delete",
    deleting: "Deleting...",
    close: "Close",
  },
  FR: {
    title: "Supprimer la présence",
    subtitle: "Confirmer la suppression de la présence.",
    question: "Êtes-vous sûr de vouloir supprimer cette présence ?",
    description: "Cette présence sera retirée de la liste.",
    delete: "Supprimer",
    deleting: "Suppression...",
    close: "Fermer",
  },
  AR: {
    title: "حذف الحضور",
    subtitle: "تأكيد حذف الحضور.",
    question: "هل أنت متأكد أنك تريد حذف هذا الحضور؟",
    description: "سيتم حذف سجل الحضور من القائمة.",
    delete: "حذف",
    deleting: "جاري الحذف...",
    close: "إغلاق",
  },
};

export default function DeleteAttendance({
  open,
  attendance,
  onClose,
  onConfirm,
}) {
  const [deleting, setDeleting] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  if (!open || !attendance) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onConfirm(attendance.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[1.7rem] border shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-6 py-5 text-white"
          style={{ background: headerGradient }}
        >
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

          <div
            className={`relative flex items-center justify-between gap-4 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <AlertTriangle size={25} />
              </div>

              <div>
                <h2 className="text-lg font-black">{t.title}</h2>

                <p className="mt-1 text-xs font-semibold text-purple-100">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              title={t.close}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div
            className="rounded-2xl border p-4"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className={`flex items-start gap-3 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ background: headerGradient }}
              >
                <Trash2 size={20} />
              </div>

              <div>
                <p
                  className="text-sm font-black"
                  style={{ color: "var(--text-color)" }}
                >
                  {t.question}
                </p>

                <p
                  className="mt-2 text-sm font-semibold"
                  style={{ color: "var(--muted-text)" }}
                >
                  {t.description}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 flex gap-3 ${
              isArabic ? "flex-row-reverse" : "justify-end"
            }`}
          >
           

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: headerGradient }}
            >
              {deleting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  {t.deleting}
                </>
              ) : (
                <>
                  <Trash2 size={17} />
                  {t.delete}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}