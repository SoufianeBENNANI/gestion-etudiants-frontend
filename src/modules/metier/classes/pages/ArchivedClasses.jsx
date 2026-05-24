import { useEffect, useState } from "react";
import {
  Archive,
  Layers3,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { getArchivedClasses, restoreClasse } from "../services/classeService";

export default function ArchivedClasses({ open, onClose, onRestored }) {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const loadArchivedClasses = async () => {
    try {
      setLoading(true);

      const data = await getArchivedClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedClasses();
    }
  }, [open]);

  const filteredClasses = classes.filter((classe) => {
    const className = String(classe.nom || classe.name || "");
    const level = String(classe.niveau || classe.level || "");
    const year = String(classe.annee || "");

    return `${className} ${level} ${year}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleRestore = async (classe) => {
    if (!window.confirm("Restore this class?")) return;

    try {
      setRestoringId(classe.id);

      const restoredClasse = await restoreClasse(classe.id);

      setClasses((prev) => prev.filter((item) => item.id !== classe.id));

      if (onRestored) {
        onRestored(restoredClasse || classe);
      }

      alert("Class restored successfully");
    } catch (error) {
      console.error("Error restoring class:", error);
      alert("Error while restoring the class");
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
                  Academics Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Archived Classes
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  View and restore archived class records.
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Layers3 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Archived Classes List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredClasses.length} archived classes
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
              onClick={loadArchivedClasses}
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
          <table className="w-full min-w-[850px] table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/4 px-5 py-3 font-black">Class Name</th>
                <th className="w-1/4 px-5 py-3 font-black">Level</th>
                <th className="w-1/4 px-5 py-3 font-black">Academic Year</th>
                <th className="w-1/4 px-5 py-3 font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      Loading archived classes...
                    </div>
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                  >
                    No archived classes found.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((classe) => {
                  const className = classe.nom || classe.name || "No name";
                  const level = classe.niveau || classe.level || "Not defined";
                  const year = classe.annee || "Not defined";

                  return (
                    <tr
                      key={classe.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-900">
                          {className}
                        </span>
                      </td>

                      <td className="px-5 py-3">{level}</td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                          {year}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => handleRestore(classe)}
                          disabled={restoringId === classe.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === classe.id ? (
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