import { useEffect, useState } from "react";
import { X, BookOpen } from "lucide-react";

const translations = {
  EN: {
    management: "Academics Management",
    title: "Course Details",
    subtitle: "View course information.",
    courseName: "Course Name",
    description: "Description",
    credits: "Credits",
    noName: "No name",
    noDescription: "No description",
    notDefined: "Not defined",
  },

  FR: {
    management: "Gestion académique",
    title: "Détails du cours",
    subtitle: "Voir les informations du cours.",
    courseName: "Nom du cours",
    description: "Description",
    credits: "Crédits",
    noName: "Sans nom",
    noDescription: "Sans description",
    notDefined: "Non défini",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "تفاصيل الدورة",
    subtitle: "عرض معلومات الدورة.",
    courseName: "اسم الدورة",
    description: "الوصف",
    credits: "الأرصدة",
    noName: "بدون اسم",
    noDescription: "بدون وصف",
    notDefined: "غير محدد",
  },
};

export default function CourseDetails({ course, onClose }) {
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

  if (!course) return null;

  const courseName = course.nom || course.name || t.noName;
  const description = course.description || t.noDescription;
  const credits =
    course.credits ??
    course.credit ??
    course.courseCredits ??
    course.creditNumber ??
    t.notDefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] border shadow-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
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
                <BookOpen size={28} />
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

        <div className="grid gap-5 p-6">
          <div
            className="rounded-2xl border p-5 transition-colors duration-300"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <p
              className="text-xs font-black uppercase"
              style={{ color: "var(--muted-text)" }}
            >
              {t.courseName}
            </p>

            <h3
              className="mt-2 text-lg font-black"
              style={{ color: "var(--text-color)" }}
            >
              {courseName}
            </h3>
          </div>

          <div
            className="rounded-2xl border p-5 transition-colors duration-300"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <p
              className="text-xs font-black uppercase"
              style={{ color: "var(--muted-text)" }}
            >
              {t.description}
            </p>

            <p
              className="mt-2 text-sm font-semibold leading-6"
              style={{ color: "var(--muted-text)" }}
            >
              {description}
            </p>
          </div>

          <div
            className="rounded-2xl border p-5 transition-colors duration-300"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <p
              className="text-xs font-black uppercase"
              style={{ color: "var(--muted-text)" }}
            >
              {t.credits}
            </p>

            <h3
              className="mt-2 text-lg font-black"
              style={{ color: "var(--text-color)" }}
            >
              {credits}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}