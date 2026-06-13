import { useEffect, useState } from "react";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";

import { deleteGrade } from "../services/gradeService";

const translations = {
  EN: {
    title: "Delete Grade",
    subtitle: "Confirm grade deletion.",

    confirmQuestion: "Are you sure you want to delete this grade?",
    gradeText: "Grade",
    removedText: "will be removed from the list.",

    deleting: "Deleting...",
    deleteGrade: "Delete Grade",

    selectedStudent: "Selected student",
    selectedCourse: "Selected course",
    notAvailable: "N/A",

    archiveError: "Error while archiving grade",
  },

  FR: {
    title: "Supprimer la note",
    subtitle: "Confirmer la suppression de la note.",

    confirmQuestion: "Êtes-vous sûr de vouloir supprimer cette note ?",
    gradeText: "La note",
    removedText: "sera supprimée de la liste.",

    deleting: "Suppression...",
    deleteGrade: "Supprimer la note",

    selectedStudent: "Étudiant sélectionné",
    selectedCourse: "Cours sélectionné",
    notAvailable: "N/A",

    archiveError: "Erreur lors de l’archivage de la note",
  },

  AR: {
    title: "حذف النقطة",
    subtitle: "تأكيد حذف النقطة.",

    confirmQuestion: "هل أنت متأكد أنك تريد حذف هذه النقطة؟",
    gradeText: "النقطة",
    removedText: "سيتم حذفها من القائمة.",

    deleting: "جاري الحذف...",
    deleteGrade: "حذف النقطة",

    selectedStudent: "الطالب المحدد",
    selectedCourse: "المادة المحددة",
    notAvailable: "N/A",

    archiveError: "حدث خطأ أثناء أرشفة النقطة",
  },
};

export default function DeleteGrade({ open, grade, onClose, onDeleted }) {
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
    if (!grade?.id || deleting) return;

    try {
      setDeleting(true);

      await deleteGrade(grade.id);

      if (onDeleted) {
        onDeleted(grade.id);
      }
    } catch (error) {
      console.error("Delete grade error:", error);
      alert(t.archiveError);
    } finally {
      setDeleting(false);
    }
  };

  if (!open || !grade) return null;

  const studentName =
    grade.studentName ||
    `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
    grade.student?.name ||
    t.selectedStudent;

  const courseName =
    grade.courseName ||
    grade.courses?.nom ||
    grade.courses?.name ||
    grade.course?.nom ||
    grade.course?.name ||
    t.selectedCourse;

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
                  {t.gradeText} {grade.note ?? t.notAvailable}/20{" "}
                  {t.removedText}
                </p>

                <p className="mt-2 line-clamp-2 text-xs font-semibold text-slate-500">
                  {studentName} - {courseName}
                </p>
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
                {t.deleteGrade}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}