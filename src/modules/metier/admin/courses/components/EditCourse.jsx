import { X, Loader2, Pencil, Save } from "lucide-react";

export default function EditCourse({
  course,
  formData,
  saving,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER LIKE ADD CLASSE */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Pencil size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  Academics Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Edit Course
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  Update course information.
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
              Course Name
            </label>

            <input
              type="text"
              name="nom"
              value={formData.nom || ""}
              onChange={onChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              rows="4"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Credits
            </label>

            <input
              type="number"
              name="credits"
              value={formData.credits || ""}
              onChange={onChange}
              min="1"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              required
            />

            <p className="mt-1 text-xs font-semibold text-slate-400">
              Credits must be greater than 0.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-[#081633] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0d1f47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}