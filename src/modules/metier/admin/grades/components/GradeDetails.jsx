import { Eye, X, GraduationCap, User, BookOpen, CalendarDays } from "lucide-react";

export default function GradeDetails({ grade, onClose }) {
  if (!grade) return null;

  const note = grade.note ?? "N/A";
  const semestre = grade.semestre || "N/A";

  const studentName =
    grade.studentName ||
    `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
    grade.student?.name ||
    "N/A";

  const courseName =
    grade.courseName ||
    grade.courses?.nom ||
    grade.course?.nom ||
    grade.courses?.name ||
    grade.course?.name ||
    "N/A";

  const createdAt = grade.createdAt
    ? new Date(grade.createdAt).toLocaleDateString("en-GB")
    : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Eye size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-cyan-200">
                  Evaluation Management
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Grade Details
                </h2>
                <p className="mt-2 text-xs text-slate-300">
                  View selected grade information.
                </p>
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

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
            <div className="flex items-center gap-2 text-slate-500">
              <GraduationCap size={17} />
              <p className="text-xs font-black uppercase">Note</p>
            </div>

            <h3 className="mt-2 text-3xl font-black text-emerald-600">
              {note}/20
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays size={17} />
              <p className="text-xs font-black uppercase">Semester</p>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {semestre}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <User size={17} />
              <p className="text-xs font-black uppercase">Student</p>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {studentName}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <BookOpen size={17} />
              <p className="text-xs font-black uppercase">Course</p>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {courseName}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Created At
            </p>

            <h3 className="mt-2 text-lg font-black text-slate-900">
              {createdAt}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}