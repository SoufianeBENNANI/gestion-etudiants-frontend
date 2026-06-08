import { School } from "lucide-react";

export default function GeneralSettings({ settings, onChange }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <School size={20} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            General Settings
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Basic school information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            School Name
          </label>
          <input
            type="text"
            name="schoolName"
            value={settings.schoolName || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            School Email
          </label>
          <input
            type="email"
            name="schoolEmail"
            value={settings.schoolEmail || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Phone
          </label>
          <input
            type="text"
            name="schoolPhone"
            value={settings.schoolPhone || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Logo URL
          </label>
          <input
            type="text"
            name="logoUrl"
            value={settings.logoUrl || ""}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Address
          </label>
          <textarea
            name="schoolAddress"
            value={settings.schoolAddress || ""}
            onChange={onChange}
            rows="4"
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
        </div>
      </div>
    </div>
  );
}