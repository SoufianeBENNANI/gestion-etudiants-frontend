import { Brain } from "lucide-react";

export default function StudentPredictions() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Brain size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI Predictions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View AI predictions and student risk analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}