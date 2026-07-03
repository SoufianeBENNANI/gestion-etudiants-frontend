import { useEffect, useState } from "react";
import {
  X,
  UserRound,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Archive,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "Grades Management",
    title: "Grade Details",
    subtitle: "View selected grade information.",
    student: "Student",
    course: "Course",
    note: "Note",
    semestre: "Semester",
    archived: "Archived",
    archivedAt: "Archived At",
    yes: "Yes",
    no: "No",
    unavailable: "Unavailable",
    close: "Close",
  },
  FR: {
    management: "Gestion des notes",
    title: "Détails de la note",
    subtitle: "Afficher les informations de la note sélectionnée.",
    student: "Étudiant",
    course: "Cours",
    note: "Note",
    semestre: "Semestre",
    archived: "Archivée",
    archivedAt: "Archivée le",
    yes: "Oui",
    no: "Non",
    unavailable: "Non disponible",
    close: "Fermer",
  },
  AR: {
    management: "إدارة النقط",
    title: "تفاصيل النقطة",
    subtitle: "عرض معلومات النقطة المحددة.",
    student: "الطالب",
    course: "المادة",
    note: "النقطة",
    semestre: "السداسي",
    archived: "مؤرشفة",
    archivedAt: "تاريخ الأرشفة",
    yes: "نعم",
    no: "لا",
    unavailable: "غير متوفر",
    close: "إغلاق",
  },
};

export default function DetailsGrade({ open, grade, onClose }) {
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

  if (!open || !grade) return null;

  const studentName = grade.studentName || `ID ${grade.studentId || "-"}`;
  const courseName = grade.courseName || `ID ${grade.courseId || "-"}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[2rem] border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative px-7 py-7 text-white"
          style={{ background: headerGradient }}
        >
          <button
            type="button"
            onClick={onClose}
            title={t.close}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
          >
            <X size={18} />
          </button>

          <div
            className={`flex items-center gap-5 ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/15 text-white ring-1 ring-white/20">
              <GraduationCap size={38} />
            </div>

            <div>
              <p className="text-xs font-bold text-purple-200">
                {t.management}
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight">
                {studentName || t.unavailable}
              </h2>

              <p className="mt-2 text-sm font-semibold text-purple-100">
                {t.title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p
            className={`mb-5 text-sm font-semibold ${
              isArabic ? "text-right" : "text-left"
            }`}
            style={{ color: "var(--muted-text)" }}
          >
            {t.subtitle}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoBox icon={BookOpen} label={t.course} value={courseName} />
            <InfoBox icon={GraduationCap} label={t.note} value={grade.note ?? "-"} />
            <InfoBox icon={CalendarDays} label={t.semestre} value={grade.semestre || "-"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div
      className="rounded-[1.4rem] border p-5 transition hover:-translate-y-1 hover:shadow-md"
      style={{
        backgroundColor: "var(--section-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
          style={{ background: headerGradient }}
        >
          <Icon size={20} />
        </div>

        <p className="text-xs font-black" style={{ color: "var(--muted-text)" }}>
          {label}
        </p>
      </div>

      <p
        className="truncate text-sm font-black"
        style={{ color: "var(--text-color)" }}
      >
        {value}
      </p>
    </div>
  );
}