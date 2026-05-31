import { useEffect, useMemo, useState } from "react";
import {
  X,
  Archive,
  RotateCcw,
  Loader2,
  GraduationCap,
  Search,
  RefreshCcw,
  Layers3,
} from "lucide-react";

import {
  getArchivedTeachers,
  restoreTeacher,
} from "../service/teacherService";

export default function ArchivedTeachers({ open, onClose, onRestored }) {
  const [archivedTeachers, setArchivedTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const normalizeTeachers = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadArchivedTeachers = async () => {
    try {
      setLoading(true);

      const data = await getArchivedTeachers();
      setArchivedTeachers(normalizeTeachers(data));
    } catch (error) {
      console.error("Load archived teachers error:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      alert("Error while loading archived teachers");
      setArchivedTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      loadArchivedTeachers();
    }
  }, [open]);

  const filteredTeachers = useMemo(() => {
    return archivedTeachers.filter((teacher) => {
      const lastName = String(teacher.nom || "");
      const firstName = String(teacher.prenom || "");
      const email = String(teacher.email || "");
      const speciality = String(teacher.specialite || "");

      const departmentName = String(
        teacher.departement?.nom ||
          teacher.departementNom ||
          teacher.nomDepartement ||
          ""
      );

      return `${lastName} ${firstName} ${email} ${speciality} ${departmentName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [archivedTeachers, searchTerm]);

  const handleRestore = async (teacher) => {
    if (!window.confirm("Restore this teacher?")) return;

    try {
      setRestoringId(teacher.id);

      const restoredTeacher = await restoreTeacher(teacher.id);

      setArchivedTeachers((prev) =>
        prev.filter((item) => item.id !== teacher.id)
      );

      if (onRestored) {
        onRestored(restoredTeacher || teacher);
      }

      alert("Teacher restored successfully");
    } catch (error) {
      console.error("Restore teacher error:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      alert("Error while restoring teacher");
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
        className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
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
                  Teachers Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Archived Teachers
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  View and restore archived teacher records.
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

        {/* LIST HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Layers3 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Archived Teachers List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredTeachers.length} archived teachers
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
              onClick={loadArchivedTeachers}
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-[15%] px-4 py-4 font-black">Last Name</th>
                <th className="w-[15%] px-4 py-4 font-black">First Name</th>
                <th className="w-[24%] px-4 py-4 font-black">Email</th>
                <th className="w-[16%] px-4 py-4 font-black">Speciality</th>
                <th className="w-[15%] px-4 py-4 font-black">Department</th>
                <th className="w-[15%] px-4 py-4 font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      Loading archived teachers...
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-sm font-bold text-slate-600"
                  >
                    No archived teachers found.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <GraduationCap size={16} className="text-blue-600" />

                        <span className="font-black text-slate-900">
                          {teacher.nom || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">{teacher.prenom || "-"}</td>

                    <td className="px-4 py-4">
                      <span className="block truncate">
                        {teacher.email || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="block truncate">
                        {teacher.specialite || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="block truncate">
                        {teacher.departement?.nom ||
                          teacher.departementNom ||
                          teacher.nomDepartement ||
                          "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleRestore(teacher)}
                        disabled={restoringId === teacher.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {restoringId === teacher.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RotateCcw size={16} />
                        )}
                        Restore
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