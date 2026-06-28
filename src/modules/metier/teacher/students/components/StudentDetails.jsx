import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";

const translations = {
  EN: {
    management: "Students Management",
    title: "Student Details",
    subtitle: "View selected student information.",

    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Détails de l’étudiant",
    subtitle: "Voir les informations de l’étudiant sélectionné.",

    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "تفاصيل الطالب",
    subtitle: "عرض معلومات الطالب المحدد.",

    lastName: "الاسم العائلي",
    firstName: "الاسم الشخصي",
    email: "البريد الإلكتروني",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
  },
};

export default function StudentDetails({ student, onClose }) {
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
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-7 py-7 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary-color), #312e81, #020617)",
          }}
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                <Eye size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-violet-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
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

        <div className="grid gap-6 bg-white p-7 md:grid-cols-3">
          <InfoCard label={t.lastName} value={student.nom} />
          <InfoCard label={t.firstName} value={student.prenom} />
          <InfoCard label={t.email} value={student.email} />
          <InfoCard label={t.gender} value={student.genre} />
          <InfoCard label={t.phone} value={student.telephone} />
          <InfoCard label={t.address} value={student.adresse} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-6">
      <p className="text-xs font-black text-slate-500">{label}</p>

      <h3 className="mt-4 truncate text-xl font-black text-slate-900">
        {value || "-"}
      </h3>
    </div>
  );
}