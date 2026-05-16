import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  RefreshCcw,
  RotateCcw,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getArchivedStudents,
  restoreStudent,
  deleteStudent,
} from "../services/studentService";

export default function ArchivedStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadArchivedStudents = async () => {
    try {
      setLoading(true);

      const data = await getArchivedStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load archived students error:", error);
      alert("Error while loading archived students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedStudents();
  }, []);

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to restore this student?"
    );

    if (!confirmed) return;

    try {
      setRestoringId(id);

      await restoreStudent(id);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );

      alert("Student restored successfully");
    } catch (error) {
      console.error("Restore student error:", error);
      alert("Error while restoring the student");
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "This student will be permanently deleted. Continue?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteStudent(id);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );

      alert("Student deleted permanently");
    } catch (error) {
      console.error("Delete archived student error:", error);
      alert("Error while deleting the student");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Archive size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Archived Students
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                View, restore or permanently delete archived students.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate("/students/all")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              onClick={loadArchivedStudents}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCcw size={18} />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Archive size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Archive List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {students.length} archived student
                {students.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 font-bold text-slate-600">
            <Loader2 size={20} className="animate-spin" />
            Loading archived students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-600">
            No archived students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-white text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-black">Last Name</th>
                  <th className="px-6 py-4 font-black">First Name</th>
                  <th className="px-6 py-4 font-black">Email</th>
                  <th className="px-6 py-4 font-black">Gender</th>
                  <th className="px-6 py-4 font-black">Phone</th>
                  <th className="px-6 py-4 font-black">Archived At</th>
                  <th className="px-6 py-4 text-right font-black">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
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

                    <td className="px-6 py-4">
                      {student.archivedAt
                        ? new Date(student.archivedAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleRestore(student.id)}
                          disabled={restoringId === student.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === student.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <RotateCcw size={16} />
                          )}

                          {restoringId === student.id
                            ? "Restoring..."
                            : "Restore"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(student.id)}
                          disabled={deletingId === student.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === student.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          {deletingId === student.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}