import { X, Brain, Loader2 } from "lucide-react";

export default function AddModel({
  open,
  formData,
  saving,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
                <Brain size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-cyan-200">
                  Artificial Intelligence
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Add AI Model
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  Create a new AI model record
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

        <form onSubmit={onSubmit} className="grid gap-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Model Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={onChange}
              placeholder="Example: Prediction Model"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Version
            </label>

            <input
              type="text"
              name="version"
              value={formData.version || ""}
              onChange={onChange}
              placeholder="Example: v1.0"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Accuracy
            </label>

            <input
              type="number"
              name="accuracy"
              value={formData.accuracy || ""}
              onChange={onChange}
              placeholder="Example: 95"
              min="0"
              max="100"
              step="0.01"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}