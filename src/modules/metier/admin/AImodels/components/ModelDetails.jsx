import { Brain, X } from "lucide-react";

export default function ModelDetails({ model, onClose }) {
  if (!model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Model Details
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                AI model information
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">Name</p>
            <p className="mt-1 font-bold text-slate-900">
              {model.name || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">
              Version
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {model.version || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">
              Accuracy
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {model.accuracy !== null && model.accuracy !== undefined
                ? `${model.accuracy}%`
                : "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">
              Created At
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {model.createdAt
                ? new Date(model.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">
              Status
            </p>
            <p className="mt-1 font-bold text-slate-900">
              {model.archived ? "Archived" : "Active"}
            </p>
          </div>

          {model.archivedAt && (
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Archived At
              </p>
              <p className="mt-1 font-bold text-slate-900">
                {new Date(model.archivedAt).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}