import { useEffect, useState } from "react";
import { X, Loader2, Pencil } from "lucide-react";
import { updateGrade } from "../services/gradeService";
import { getAllStudents } from "../../students/services/studentService";
import { getAllCourses } from "../../courses/services/courseService";

const headerGradient =
  "linear-gradient(180deg, #3b2c8f 0%, #4c1d95 45%, #581c87 100%)";

const translations = {
  EN: {
    management: "Grades Management",
    title: "Update",
    subtitle: "Update selected student grade.",
    student: "Student",
    selectStudent: "Select student",
    course: "Course",
    selectCourse: "Select course",
    note: "Note",
    semestre: "Semester",
    update: "Update",
    close: "Close",
  },
  FR: {
    management: "Gestion des notes",
    title: "Modifier",
    subtitle: "Modifier la note sélectionnée.",
    student: "Étudiant",
    selectStudent: "Sélectionner un étudiant",
    course: "Cours",
    selectCourse: "Sélectionner un cours",
    note: "Note",
    semestre: "Semestre",
    update: "Modifier",
    close: "Fermer",
  },
  AR: {
    management: "إدارة النقط",
    title: "تعديل",
    subtitle: "تعديل النقطة المحددة.",
    student: "الطالب",
    selectStudent: "اختر الطالب",
    course: "المادة",
    selectCourse: "اختر المادة",
    note: "النقطة",
    semestre: "السداسي",
    update: "تحديث",
    close: "إغلاق",
  },
};

export default function EditGrade({ open, grade, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [formData, setFormData] = useState({
    note: "",
    semestre: "",
    studentId: "",
    courseId: "",
  });

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  useEffect(() => {
    if (open) {
      loadStudents();
      loadCourses();
    }
  }, [open]);

  useEffect(() => {
    if (grade) {
      setFormData({
        note: grade.note ?? "",
        semestre: grade.semestre || "",
        studentId: grade.studentId || "",
        courseId: grade.courseId || "",
      });
    }
  }, [grade]);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setStudents([]);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    }
  };

  if (!open || !grade) return null;

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
  };

  const getCourseName = (course) =>
    course.nom ||
    course.name ||
    course.courseName ||
    course.titre ||
    course.title ||
    `ID ${course.id}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateGrade(grade.id, {
        note: Number(formData.note),
        semestre: formData.semestre,
        studentId: Number(formData.studentId),
        courseId: Number(formData.courseId),
      });

      onUpdated?.();
      onClose();
    } catch (error) {
      console.error("Update grade error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-t-[2rem] px-7 py-7 text-white"
          style={{ background: headerGradient }}
        >
          <div
            className={`relative flex items-center justify-between gap-5 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Pencil size={28} />
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
              title={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 rounded-b-[2rem] p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <SelectStudent
              label={t.student}
              value={formData.studentId}
              onChange={handleChange}
              students={students}
              placeholder={t.selectStudent}
            />

            <div>
              <label
                className="mb-2 block text-xs font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {t.course}
              </label>

              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
                style={inputStyle}
              >
                <option value="">{t.selectCourse}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {getCourseName(course)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {t.note}
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                max="20"
                name="note"
                value={formData.note}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {t.semestre}
              </label>

              <input
                type="text"
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
                style={inputStyle}
              />
            </div>
          </div>

          <div className={`flex pt-5 ${isArabic ? "justify-start" : "justify-end"}`}>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: headerGradient }}
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Pencil size={17} />
              )}
              {t.update}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectStudent({ label, value, onChange, students, placeholder }) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-black"
        style={{ color: "var(--muted-text)" }}
      >
        {label}
      </label>

      <select
        name="studentId"
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
      >
        <option value="">{placeholder}</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.nom} {student.prenom}
          </option>
        ))}
      </select>
    </div>
  );
}