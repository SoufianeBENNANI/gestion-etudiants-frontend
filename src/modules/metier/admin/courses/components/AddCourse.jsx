import { useEffect, useState } from "react";
import { X, Loader2, Plus, Save } from "lucide-react";

const translations = {
  EN: {
    management: "Academics Management",
    title: "Add Course",
    subtitle: "Create a new course.",

    courseName: "Course Name",
    courseNamePlaceholder: "Example: Algebra",

    description: "Description",
    descriptionPlaceholder: "Example: Algebra and analysis",

    credits: "Credits",
    creditsPlaceholder: "Example: 3",
    creditsHelp: "Credits must be greater than 0.",

    save: "Save",
  },

  FR: {
    management: "Gestion académique",
    title: "Ajouter un cours",
    subtitle: "Créer un nouveau cours.",

    courseName: "Nom du cours",
    courseNamePlaceholder: "Exemple : Algèbre",

    description: "Description",
    descriptionPlaceholder: "Exemple : Algèbre et analyse",

    credits: "Crédits",
    creditsPlaceholder: "Exemple : 3",
    creditsHelp: "Les crédits doivent être supérieurs à 0.",

    save: "Enregistrer",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "إضافة دورة",
    subtitle: "إنشاء دورة جديدة.",

    courseName: "اسم الدورة",
    courseNamePlaceholder: "مثال: الجبر",

    description: "الوصف",
    descriptionPlaceholder: "مثال: الجبر والتحليل",

    credits: "الأرصدة",
    creditsPlaceholder: "مثال: 3",
    creditsHelp: "يجب أن تكون الأرصدة أكبر من 0.",

    save: "حفظ",
  },
};

export default function AddCourse({
  open,
  formData,
  saving,
  onClose,
  onChange,
  onSubmit,
}) {
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

  if (!open) return null;

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
        {/* HEADER LIKE ADD CLASSE */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Plus size={28} />
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

        <form onSubmit={onSubmit} className="grid gap-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.courseName}
            </label>

            <input
              type="text"
              name="nom"
              value={formData.nom || ""}
              onChange={onChange}
              placeholder={t.courseNamePlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.description}
            </label>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              placeholder={t.descriptionPlaceholder}
              rows="4"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.credits}
            </label>

            <input
              type="number"
              name="credits"
              value={formData.credits || ""}
              onChange={onChange}
              min="1"
              placeholder={t.creditsPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />

            <p className="mt-1 text-xs font-semibold text-slate-400">
              {t.creditsHelp}
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-[#081633] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0d1f47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}