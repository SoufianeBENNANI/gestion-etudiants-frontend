import { useEffect, useState } from "react";
import {
  X,
  GraduationCap,
  Mail,
  BookOpen,
  Building2,
  User,
} from "lucide-react";

const translations = {
  EN: {
    management: "Teachers Management",
    title: "Teacher Details",
    subtitle: "View teacher information",

    fullName: "Full Name",
    email: "Email",
    speciality: "Speciality",
    department: "Department",
  },

  FR: {
    management: "Gestion des enseignants",
    title: "Détails de l’enseignant",
    subtitle: "Voir les informations de l’enseignant",

    fullName: "Nom complet",
    email: "Email",
    speciality: "Spécialité",
    department: "Département",
  },

  AR: {
    management: "إدارة الأساتذة",
    title: "تفاصيل الأستاذ",
    subtitle: "عرض معلومات الأستاذ",

    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    speciality: "التخصص",
    department: "القسم",
  },
};

export default function TeacherDetails({ teacher, onClose }) {
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

  if (!teacher) return null;

  const fullName = `${teacher.nom || "-"} ${teacher.prenom || "-"}`;
  const email = teacher.email || "-";
  const speciality = teacher.specialite || "-";

  const departmentName =
    teacher.departement?.nom ||
    teacher.departementNom ||
    teacher.nomDepartement ||
    "-";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER LIKE DEPARTMENT DETAILS */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <GraduationCap size={28} />
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

        <div className="grid gap-5 p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {t.fullName}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <User size={18} className="text-blue-600" />

              <p className="text-sm font-black text-slate-900">{fullName}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {t.email}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <Mail size={18} className="text-blue-600" />

              <p className="text-sm font-semibold leading-6 text-slate-700">
                {email}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {t.speciality}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <BookOpen size={18} className="text-blue-600" />

              <p className="text-sm font-semibold leading-6 text-slate-700">
                {speciality}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              {t.department}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <Building2 size={18} className="text-blue-600" />

              <p className="text-sm font-semibold leading-6 text-slate-700">
                {departmentName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}