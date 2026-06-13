import { useEffect, useState } from "react";
import { X, Brain, Cpu, Percent, CalendarDays } from "lucide-react";

const translations = {
  EN: {
    management: "Artificial Intelligence",
    title: "Model Details",
    subtitle: "View AI model information",

    modelName: "Model Name",
    version: "Version",
    accuracy: "Accuracy",
    createdAt: "Created At",

    noName: "No name",
    notAvailable: "N/A",
  },

  FR: {
    management: "Intelligence artificielle",
    title: "Détails du modèle",
    subtitle: "Voir les informations du modèle d’IA",

    modelName: "Nom du modèle",
    version: "Version",
    accuracy: "Précision",
    createdAt: "Créé le",

    noName: "Sans nom",
    notAvailable: "N/A",
  },

  AR: {
    management: "الذكاء الاصطناعي",
    title: "تفاصيل النموذج",
    subtitle: "عرض معلومات نموذج الذكاء الاصطناعي",

    modelName: "اسم النموذج",
    version: "الإصدار",
    accuracy: "الدقة",
    createdAt: "تاريخ الإنشاء",

    noName: "بدون اسم",
    notAvailable: "N/A",
  },
};

export default function ModelDetails({ model, onClose }) {
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

  const modelName = model.name || t.noName;
  const version = model.version || t.notAvailable;
  const accuracy =
    model.accuracy !== null && model.accuracy !== undefined
      ? `${model.accuracy}%`
      : t.notAvailable;

  const createdAt = model.createdAt
    ? new Date(model.createdAt).toLocaleString()
    : t.notAvailable;

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

        <div className="grid gap-5 p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <Brain size={16} />
              {t.modelName}
            </div>

            <p className="text-sm font-black text-slate-900">{modelName}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <Cpu size={16} />
              {t.version}
            </div>

            <p className="text-sm font-semibold text-slate-700">{version}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <Percent size={16} />
              {t.accuracy}
            </div>

            <p className="text-sm font-semibold text-slate-700">{accuracy}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <CalendarDays size={16} />
              {t.createdAt}
            </div>

            <p className="text-sm font-semibold text-slate-700">{createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}