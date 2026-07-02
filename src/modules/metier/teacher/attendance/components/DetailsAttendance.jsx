import { useEffect, useState } from "react";
import { X, Eye, CalendarDays, User, FileText, CheckCircle } from "lucide-react";

const headerGradient =
  "linear-gradient(180deg, #3b2c8f 0%, #4c1d95 45%, #581c87 100%)";

const translations = {
  EN: {
    management: "Attendance Management",
    title: "Attendance Details",
    subtitle: "View selected attendance information.",
    student: "Student",
    date: "Date",
    status: "Status",
    remark: "Remark",
    noRemark: "No remark",
    close: "Close",
    unavailableStudent: "Student name unavailable",
  },
  FR: {
    management: "Gestion des présences",
    title: "Détails de la présence",
    subtitle: "Afficher les informations de présence sélectionnées.",
    student: "Étudiant",
    date: "Date",
    status: "Statut",
    remark: "Remarque",
    noRemark: "Aucune remarque",
    close: "Fermer",
    unavailableStudent: "Nom étudiant non disponible",
  },
  AR: {
    management: "إدارة الحضور",
    title: "تفاصيل الحضور",
    subtitle: "عرض معلومات الحضور المحددة.",
    student: "الطالب",
    date: "التاريخ",
    status: "الحالة",
    remark: "ملاحظة",
    noRemark: "لا توجد ملاحظة",
    close: "إغلاق",
    unavailableStudent: "اسم الطالب غير متوفر",
  },
};

export default function DetailsAttendance({ open, attendance, onClose }) {
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

  const studentName =
    `${attendance.studentPrenom || ""} ${attendance.studentNom || ""}`.trim() ||
    attendance.studentName ||
    attendance.studentFullName ||
    `${attendance.student?.prenom || ""} ${attendance.student?.nom || ""}`.trim() ||
    t.unavailableStudent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[2rem] border shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-7 py-7 text-white"
          style={{ background: headerGradient }}
        >
          <div
            className={`relative flex items-center justify-between gap-5 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Eye size={28} />
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
              title={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <DetailCard icon={User} label={t.student} value={studentName} />
            <DetailCard icon={CalendarDays} label={t.date} value={attendance.date || "-"} />
            <DetailCard icon={CheckCircle} label={t.status} value={attendance.status || "-"} />

            <div
              className="md:col-span-3 rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <FileText size={18} style={{ color: "var(--primary-color)" }} />
                <span
                  className="text-xs font-black"
                  style={{ color: "var(--muted-text)" }}
                >
                  {t.remark}
                </span>
              </div>

              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {attendance.remarque || t.noRemark}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--section-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white"
        style={{ background: headerGradient }}
      >
        <Icon size={20} />
      </div>

      <p className="text-xs font-black" style={{ color: "var(--muted-text)" }}>
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-black" style={{ color: "var(--text-color)" }}>
        {value}
      </p>
    </div>
  );
}