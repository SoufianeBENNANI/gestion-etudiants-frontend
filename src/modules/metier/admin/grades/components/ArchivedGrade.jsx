import { useEffect, useState } from "react";
import {
  Archive,
  GraduationCap,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { getArchivedGrades, restoreGrade } from "../services/gradeService";

export default function ArchivedGrades({ open, onClose, onRestored }) {
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const loadArchivedGrades = async () => {
    try {
      setLoading(true);

      const data = await getArchivedGrades();
      setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived grades:", error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedGrades();
    }
  }, [open]);

  const getStudentName = (grade) => {
    return (
      grade.studentName ||
      `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
      "N/A"
    );
  };

  const getCourseName = (grade) => {
    return (
      grade.courseName ||
      grade.courses?.nom ||
      grade.course?.nom ||
      grade.courses?.name ||
      grade.course?.name ||
      "N/A"
    );
  };

  const filteredGrades = grades.filter((grade) => {
    const note = String(grade.note ?? "");
    const semestre = String(grade.semestre || "");
    const studentName = getStudentName(grade);
    const courseName = getCourseName(grade);

    return `${note} ${semestre} ${studentName} ${courseName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleRestore = async (grade) => {
    
    try {
      setRestoringId(grade.id);

      const restoredGrade = await restoreGrade(grade.id);

      setGrades((prev) => prev.filter((item) => item.id !== grade.id));

      if (onRestored) {
        onRestored(restoredGrade || grade);
      }

    } catch (error) {
      console.error("Error restoring grade:", error);
      alert("Error while restoring the grade");
    } finally {
      setRestoringId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-cyan-200">
                  Academics Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Archived Grades
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  View and restore archived grade records.
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

        {/* TOOLBAR */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <GraduationCap size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Archived Grades List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredGrades.length} archived grades
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search archive..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedGrades}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RefreshCcw size={17} />
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full min-w-[950px] table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/5 px-5 py-3 font-black">Student</th>
                <th className="w-1/5 px-5 py-3 font-black">Course</th>
                <th className="w-1/5 px-5 py-3 font-black">Semester</th>
                <th className="w-1/5 px-5 py-3 font-black">Note</th>
                <th className="w-1/5 px-5 py-3 font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      Loading archived grades...
                    </div>
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                  >
                    No archived grades found.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade) => {
                  const note = grade.note ?? "N/A";
                  const semestre = grade.semestre || "N/A";
                  const studentName = getStudentName(grade);
                  const courseName = getCourseName(grade);

                  return (
                    <tr
                      key={grade.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-900">
                          {studentName}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="font-bold text-slate-700">
                          {courseName}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-600">
                          {semestre}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                          {note}/20
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => handleRestore(grade)}
                          disabled={restoringId === grade.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === grade.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RotateCcw size={14} />
                          )}
                          Restore
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}