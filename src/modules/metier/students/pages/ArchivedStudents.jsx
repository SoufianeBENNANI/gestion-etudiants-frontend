import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  RefreshCcw,
  RotateCcw,
  Trash2,
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
      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-8 text-white shadow-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => navigate("/students/all")}
              className="inline-flex items-center justify-center text-white/90 transition duration-200 hover:-translate-x-1 hover:text-white"
            >
              <ArrowLeft size={30} strokeWidth={2.5} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <Archive size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-black">Archived Students</h1>
              <p className="mt-1 text-sm text-white/80">
                View, restore or permanently delete archived students.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadArchivedStudents}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        {loading ? (
          <div className="p-10 text-center font-bold text-slate-600">
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
                <tr className="bg-slate-50 text-left text-sm text-slate-600">
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
                    <td className="px-6 py-4 font-bold">{student.nom}</td>
                    <td className="px-6 py-4">{student.prenom}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.genre}</td>
                    <td className="px-6 py-4">{student.telephone}</td>
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
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <RotateCcw size={16} />
                          {restoringId === student.id
                            ? "Restoring..."
                            : "Restore"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(student.id)}
                          disabled={deletingId === student.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={16} />
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