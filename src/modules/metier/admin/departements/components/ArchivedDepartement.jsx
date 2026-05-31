import { useEffect, useState } from "react";
import { X, Archive, RotateCcw, Loader2 } from "lucide-react";

import {
  getArchivedDepartements,
  restoreDepartement,
} from "../service/departementService";

export default function ArchivedDepartement({ open, onClose, onRestored }) {
  const [archivedDepartements, setArchivedDepartements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const loadArchivedDepartements = async () => {
    try {
      setLoading(true);

      const data = await getArchivedDepartements();
      setArchivedDepartements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived departments:", error);
      setArchivedDepartements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedDepartements();
    }
  }, [open]);

  const handleRestore = async (id) => {
    try {
      setRestoringId(id);

      const restoredDepartement = await restoreDepartement(id);

      setArchivedDepartements((prev) =>
        prev.filter((departement) => departement.id !== id)
      );

      if (onRestored) {
        onRestored(restoredDepartement);
      }

      alert("Department restored successfully");
    } catch (error) {
      console.error("Error restoring department:", error);
      alert("Error while restoring the department");
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
        {/* HEADER LIKE ARCHIVED COURSES */}
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
                  Optional Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Archived Departments
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  Restore archived departments.
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

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm font-bold text-slate-600">
              <Loader2 size={18} className="animate-spin" />
              Loading archived departments...
            </div>
          ) : archivedDepartements.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 py-10 text-center text-sm font-bold text-slate-600">
              No archived departments found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-center text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3 font-black">
                        Department Name
                      </th>
                      <th className="px-5 py-3 font-black">Description</th>
                      <th className="px-5 py-3 font-black">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {archivedDepartements.map((departement) => (
                      <tr
                        key={departement.id}
                        className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-3 font-black text-slate-900">
                          {departement.nom || "No name"}
                        </td>

                        <td className="px-5 py-3">
                          {departement.description || "No description"}
                        </td>

                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => handleRestore(departement.id)}
                            disabled={restoringId === departement.id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {restoringId === departement.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <RotateCcw size={14} />
                            )}
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}