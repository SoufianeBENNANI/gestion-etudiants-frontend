import { useEffect, useState } from "react";
import { Loader2, Plus, Save, X } from "lucide-react";

const semestreOptions = ["S1", "S2", "S3", "S4", "S5", "S6"];

const translations = {
  EN: {
    management: "Evaluation Management",
    title: "Add Grade",
    subtitle: "Add the note, semester, student and course.",

    note: "Note",
    notePlaceholder: "Ex: 15.5",

    semester: "Semester",
    selectSemester: "Select semester",

    student: "Student",
    selectStudent: "Select student",
    studentFallback: "Student",

    course: "Course",
    selectCourse: "Select course",
    courseFallback: "Course",

    save: "Save",
  },

  FR: {
    management: "Gestion des évaluations",
    title: "Ajouter une note",
    subtitle: "Ajouter la note, le semestre, l’étudiant et le cours.",

    note: "Note",
    notePlaceholder: "Ex : 15.5",

    semester: "Semestre",
    selectSemester: "Sélectionner le semestre",

    student: "Étudiant",
    selectStudent: "Sélectionner l’étudiant",
    studentFallback: "Étudiant",

    course: "Cours",
    selectCourse: "Sélectionner le cours",
    courseFallback: "Cours",

    save: "Enregistrer",
  },

  AR: {
    management: "إدارة التقييمات",
    title: "إضافة نقطة",
    subtitle: "إضافة النقطة والفصل والطالب والمادة.",

    note: "النقطة",
    notePlaceholder: "مثال: 15.5",

    semester: "الفصل",
    selectSemester: "اختر الفصل",

    student: "الطالب",
    selectStudent: "اختر الطالب",
    studentFallback: "طالب",

    course: "المادة",
    selectCourse: "اختر المادة",
    courseFallback: "مادة",

    save: "حفظ",
  },
};

export default function AddGrade({
  open,
  formData,
  saving,
  students = [],
  courses = [],
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.note}
              </label>
              <input
                type="number"
                name="note"
                value={formData.note || ""}
                onChange={onChange}
                placeholder={t.notePlaceholder}
                min="0"
                max="20"
                step="0.01"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.semester}
              </label>
              <select
                name="semestre"
                value={formData.semestre || ""}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              >
                <option value="">{t.selectSemester}</option>
                {semestreOptions.map((semestre) => (
                  <option key={semestre} value={semestre}>
                    {semestre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.student}
              </label>
              <select
                name="studentId"
                value={formData.studentId || ""}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              >
                <option value="">{t.selectStudent}</option>
                {students.map((student) => {
                  const fullName =
                    `${student.prenom || ""} ${student.nom || ""}`.trim() ||
                    student.name ||
                    `${t.studentFallback} #${student.id}`;

                  return (
                    <option key={student.id} value={student.id}>
                      {fullName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.course}
              </label>
              <select
                name="courseId"
                value={formData.courseId || ""}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              >
                <option value="">{t.selectCourse}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.nom || course.name || `${t.courseFallback} #${course.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
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