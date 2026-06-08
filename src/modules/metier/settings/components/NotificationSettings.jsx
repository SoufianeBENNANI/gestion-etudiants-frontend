import { Bell } from "lucide-react";

export default function NotificationSettings({ settings, onChange }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Bell size={20} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            Notification Settings
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Enable or disable system notifications.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-black text-slate-900">
            Notifications Enabled
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Allow the system to send notifications.
          </p>
        </div>

        <input
          type="checkbox"
          name="notificationsEnabled"
          checked={Boolean(settings.notificationsEnabled)}
          onChange={onChange}
          className="h-5 w-5 accent-blue-600"
        />
      </label>
    </div>
  );
}