import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Layers3,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import {
  getArchivedStudents,
  restoreStudent,
} from "../services/studentService";

export default function ArchivedStudents({ open, onClose, onRestored }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const loadArchivedStudents = async () => {
    try {
      setLoading(true);

      const data = await getArchivedStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedStudents();
    }
  }, [open]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const lastName = String(student.nom || "");
      const firstName = String(student.prenom || "");
      const email = String(student.email || "");

      return `${lastName} ${firstName} ${email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [students, searchTerm]);

  const handleRestore = async (student) => {
    if (!student?.id) return;

    try {
      setRestoringId(student.id);

      const restoredStudent = await restoreStudent(student.id);

      setStudents((prev) => prev.filter((item) => item.id !== student.id));

      if (onRestored) {
        onRestored(restoredStudent || student);
      }
    } catch (error) {
      console.error("Error restoring student:", error);
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
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  Students Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Archived Students
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  View and restore archived student records.
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

        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Layers3 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Archived Students List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredStudents.length} archived students
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
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedStudents}
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

        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-white text-left text-sm text-slate-600">
                <th className="px-6 py-4 font-black">Last Name</th>
                <th className="px-6 py-4 font-black">First Name</th>
                <th className="px-6 py-4 font-black">Email</th>
                <th className="px-6 py-4 font-black">Gender</th>
                <th className="px-6 py-4 font-black">Phone</th>
                <th className="px-6 py-4 font-black">Address</th>
                <th className="px-6 py-4 text-right font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold text-slate-600">
                      <Loader2 size={20} className="animate-spin" />
                      Loading archived students...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center font-bold text-slate-600"
                  >
                    No archived students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-900">
                        {student.nom || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">{student.prenom || "-"}</td>
                    <td className="px-6 py-4">{student.email || "-"}</td>
                    <td className="px-6 py-4">{student.genre || "-"}</td>
                    <td className="px-6 py-4">{student.telephone || "-"}</td>
                    <td className="px-6 py-4">{student.adresse || "-"}</td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRestore(student)}
                        disabled={restoringId === student.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {restoringId === student.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RotateCcw size={16} />
                        )}
                        {restoringId === student.id ? "Restoring..." : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}