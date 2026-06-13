import { useEffect, useState } from "react";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";

import { deleteModel } from "../service/serviceModels";

const translations = {
  EN: {
    title: "Delete Model",
    subtitle: "Confirm model deletion.",

    confirmQuestion: "Are you sure you want to delete this model?",
    removedText: "will be removed from the list.",
    version: "Version:",

    deleting: "Deleting...",
    deleteModel: "Delete Model",

    selectedModel: "Selected model",
    archiveError: "Error while archiving the model",
  },

  FR: {
    title: "Supprimer le modèle",
    subtitle: "Confirmer la suppression du modèle.",

    confirmQuestion: "Êtes-vous sûr de vouloir supprimer ce modèle ?",
    removedText: "sera supprimé de la liste.",
    version: "Version :",

    deleting: "Suppression...",
    deleteModel: "Supprimer le modèle",

    selectedModel: "Modèle sélectionné",
    archiveError: "Erreur lors de l’archivage du modèle",
  },

  AR: {
    title: "حذف النموذج",
    subtitle: "تأكيد حذف النموذج.",

    confirmQuestion: "هل أنت متأكد أنك تريد حذف هذا النموذج؟",
    removedText: "سيتم حذفه من القائمة.",
    version: "الإصدار:",

    deleting: "جاري الحذف...",
    deleteModel: "حذف النموذج",

    selectedModel: "النموذج المحدد",
    archiveError: "حدث خطأ أثناء أرشفة النموذج",
  },
};

export default function DeleteModel({ open, model, onClose, onDeleted }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!model?.id || deleting) return;

    try {
      setDeleting(true);

      await deleteModel(model.id);

      if (onDeleted) {
        onDeleted(model.id);
      }
    } catch (error) {
      console.error("Delete model error:", error);
      alert(t.archiveError);
    } finally {
      setDeleting(false);
    }
  };

  if (!open || !model) return null;

  const modelName = model.name || model.modelName || t.selectedModel;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-6 py-5 text-white">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <AlertTriangle size={25} />
              </div>

              <div>
                <h2 className="text-lg font-black">{t.title}</h2>
                <p className="mt-1 text-xs font-semibold text-red-100">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  {t.confirmQuestion}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {modelName} {t.removedText}
                </p>

                {model.version && (
                  <p className="mt-2 line-clamp-2 text-xs font-semibold text-slate-500">
                    {t.version} {model.version}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {t.deleting}
              </>
            ) : (
              <>
                <Trash2 size={17} />
                {t.deleteModel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}