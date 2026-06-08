import { ShieldAlert } from "lucide-react";

export default function MaintenanceSettings({ settings, onChange }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert size={20} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            Maintenance Settings
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Control maintenance mode.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-red-100 bg-red-50 p-4">
        <div>
          <p className="text-sm font-black text-slate-900">
            Maintenance Mode
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Disable user access temporarily.
          </p>
        </div>

        <input
          type="checkbox"
          name="maintenanceMode"
          checked={Boolean(settings.maintenanceMode)}
          onChange={onChange}
          className="h-5 w-5 accent-red-600"
        />
      </label>
    </div>
  );
}