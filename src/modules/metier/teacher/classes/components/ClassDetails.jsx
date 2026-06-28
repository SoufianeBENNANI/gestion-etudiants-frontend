import { useEffect, useState } from "react";
import { X, GraduationCap } from "lucide-react";

const translations = {
  EN: {
    management: "Classes Management",
    title: "Class Details",
    subtitle: "View selected class information.",
    className: "Class Name",
    level: "Level",
    academicYear: "Academic Year",
    notDefined: "Not defined",
  },

  FR: {
    management: "Gestion des classes",
    title: "Détails de la classe",
    subtitle: "Voir les informations de la classe sélectionnée.",
    className: "Nom de la classe",
    level: "Niveau",
    academicYear: "Année scolaire",
    notDefined: "Non défini",
  },

  AR: {
    management: "إدارة الأقسام",
    title: "تفاصيل القسم",
    subtitle: "عرض معلومات القسم المحدد.",
    className: "اسم القسم",
    level: "المستوى",
    academicYear: "السنة الدراسية",
    notDefined: "غير محدد",
  },
};

export default function ClassDetails({ classe, onClose }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  if (!classe) return null;

  const className =
    classe.nom ||
    classe.name ||
    classe.nomClasse ||
    classe.className ||
    t.notDefined;

  const level = classe.niveau || classe.level || classe.filiere || t.notDefined;

  const academicYear =
    classe.annee ||
    classe.academicYear ||
    classe.year ||
    classe.anneeScolaire ||
    t.notDefined;

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
        <div
          className="relative overflow-hidden px-7 py-7 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary-color), #312e81, #020617)",
          }}
        >
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-32 h-28 w-28 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
                <GraduationCap size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-violet-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                  {t.title}
                </h2>

                <p className="mt-2 text-xs font-semibold text-slate-300">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-6 bg-white p-7 md:grid-cols-3">
          <InfoCard label={t.className} value={className} />
          <InfoCard label={t.level} value={level} />
          <InfoCard label={t.academicYear} value={academicYear} />
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