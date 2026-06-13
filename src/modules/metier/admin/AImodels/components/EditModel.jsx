import { useEffect, useState } from "react";
import { X, Brain, Loader2, Save } from "lucide-react";

const translations = {
  EN: {
    management: "Artificial Intelligence",
    title: "Edit AI Model",
    subtitle: "Update AI model information",

    modelName: "Model Name",
    modelNamePlaceholder: "Model name",

    version: "Version",
    versionPlaceholder: "Model version",

    accuracy: "Accuracy",
    accuracyPlaceholder: "Accuracy",

    update: "Update",
  },

  FR: {
    management: "Intelligence artificielle",
    title: "Modifier le modèle IA",
    subtitle: "Modifier les informations du modèle d’IA",

    modelName: "Nom du modèle",
    modelNamePlaceholder: "Nom du modèle",

    version: "Version",
    versionPlaceholder: "Version du modèle",

    accuracy: "Précision",
    accuracyPlaceholder: "Précision",

    update: "Modifier",
  },

  AR: {
    management: "الذكاء الاصطناعي",
    title: "تعديل نموذج الذكاء الاصطناعي",
    subtitle: "تعديل معلومات نموذج الذكاء الاصطناعي",

    modelName: "اسم النموذج",
    modelNamePlaceholder: "اسم النموذج",

    version: "الإصدار",
    versionPlaceholder: "إصدار النموذج",

    accuracy: "الدقة",
    accuracyPlaceholder: "الدقة",

    update: "تحديث",
  },
};

export default function EditModel({
  model,
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

  if (!model) return null;

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
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Brain size={28} />
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

        <form onSubmit={onSubmit} className="grid gap-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.modelName}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={onChange}
              placeholder={t.modelNamePlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.version}
            </label>

            <input
              type="text"
              name="version"
              value={formData.version || ""}
              onChange={onChange}
              placeholder={t.versionPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.accuracy}
            </label>

            <input
              type="number"
              name="accuracy"
              value={formData.accuracy || ""}
              onChange={onChange}
              placeholder={t.accuracyPlaceholder}
              min="0"
              max="100"
              step="0.01"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              required
            />
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
              {t.update}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}