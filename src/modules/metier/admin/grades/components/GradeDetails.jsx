import { useEffect, useState } from "react";
import {
  Eye,
  X,
  GraduationCap,
  User,
  BookOpen,
  CalendarDays,
} from "lucide-react";

const translations = {
  EN: {
    management: "Evaluation Management",
    title: "Grade Details",
    subtitle: "View selected grade information.",

    note: "Note",
    semester: "Semester",
    student: "Student",
    course: "Course",
    createdAt: "Created At",

    notAvailable: "N/A",
  },

  FR: {
    management: "Gestion des évaluations",
    title: "Détails de la note",
    subtitle: "Voir les informations de la note sélectionnée.",

    note: "Note",
    semester: "Semestre",
    student: "Étudiant",
    course: "Cours",
    createdAt: "Créé le",

    notAvailable: "N/A",
  },

  AR: {
    management: "إدارة التقييمات",
    title: "تفاصيل النقطة",
    subtitle: "عرض معلومات النقطة المحددة.",

    note: "النقطة",
    semester: "الفصل",
    student: "الطالب",
    course: "المادة",
    createdAt: "تاريخ الإنشاء",

    notAvailable: "N/A",
  },
};

export default function GradeDetails({ grade, onClose }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

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

  if (!grade) return null;

  const note = grade.note ?? t.notAvailable;
  const semestre = grade.semestre || t.notAvailable;

  const studentName =
    grade.studentName ||
    `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
    grade.student?.name ||
    t.notAvailable;

  const courseName =
    grade.courseName ||
    grade.courses?.nom ||
    grade.course?.nom ||
    grade.courses?.name ||
    grade.course?.name ||
    t.notAvailable;

  const createdAt = grade.createdAt
    ? new Date(grade.createdAt).toLocaleDateString("en-GB")
    : t.notAvailable;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Eye size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-cyan-200">
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

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
            <div className="flex items-center gap-2 text-slate-500">
              <GraduationCap size={17} />
              <p className="text-xs font-black uppercase">{t.note}</p>
            </div>

            <h3 className="mt-2 text-3xl font-black text-emerald-600">
              {note}/20
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays size={17} />
              <p className="text-xs font-black uppercase">{t.semester}</p>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {semestre}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <User size={17} />
              <p className="text-xs font-black uppercase">{t.student}</p>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {studentName}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <BookOpen size={17} />
              <p className="text-xs font-black uppercase">{t.course}</p>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {courseName}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              {t.createdAt}
            </p>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {createdAt}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}