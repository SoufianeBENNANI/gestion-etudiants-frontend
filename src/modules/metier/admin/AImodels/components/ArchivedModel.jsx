import { useEffect, useMemo, useState } from "react";
import {
  X,
  Archive,
  RotateCcw,
  Loader2,
  Search,
  Brain,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

import { getArchivedModels, restoreModel } from "../service/serviceModels";

export default function ArchivedModel({ open, onClose, onRestored }) {
  const [archivedModels, setArchivedModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadArchivedModels = async () => {
    try {
      setLoading(true);

      const data = await getArchivedModels();
      setArchivedModels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived models:", error);
      setArchivedModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      loadArchivedModels();
    }
  }, [open]);

  const filteredArchivedModels = useMemo(() => {
    return archivedModels.filter((model) => {
      const name = String(model.name || "");
      const version = String(model.version || "");
      const accuracy = String(model.accuracy || "");

      return `${name} ${version} ${accuracy}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [archivedModels, searchTerm]);

  const handleRestore = async (model) => {
    if (!window.confirm("Restore this model?")) return;

    try {
      setRestoringId(model.id);

      const restoredModel = await restoreModel(model.id);

      setArchivedModels((prev) => prev.filter((item) => item.id !== model.id));

      if (onRestored) {
        onRestored(restoredModel || model);
      }

      alert("Model restored successfully");
    } catch (error) {
      console.error("Error restoring model:", error);
      alert("Error while restoring the model");
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
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-cyan-200">
                  Artificial Intelligence
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Archived Models
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  View and restore archived AI model records.
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Brain size={22} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Archived Models List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredArchivedModels.length} archived models
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
              onClick={loadArchivedModels}
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
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-[30%] px-5 py-4 font-black">Model Name</th>
                <th className="w-[20%] px-5 py-4 font-black">Version</th>
                <th className="w-[20%] px-5 py-4 font-black">Accuracy</th>
                <th className="w-[30%] px-5 py-4 font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      Loading archived models...
                    </div>
                  </td>
                </tr>
              ) : filteredArchivedModels.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-sm font-bold text-slate-600"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle size={18} />
                      No archived models found.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArchivedModels.map((model) => {
                  const modelName = model.name || "No name";
                  const version = model.version || "N/A";
                  const accuracy =
                    model.accuracy !== null && model.accuracy !== undefined
                      ? `${model.accuracy}%`
                      : "N/A";

                  return (
                    <tr
                      key={model.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Brain size={16} className="text-cyan-600" />

                          <span className="truncate font-black text-slate-900">
                            {modelName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-700">
                          {version}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-600">
                          {accuracy}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleRestore(model)}
                          disabled={restoringId === model.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringId === model.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <RotateCcw size={16} />
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