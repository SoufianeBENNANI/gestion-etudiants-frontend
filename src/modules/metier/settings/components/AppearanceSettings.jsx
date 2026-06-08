import { Palette } from "lucide-react";

export default function AppearanceSettings({ settings, onChange }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <Palette size={20} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            Appearance Settings
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Theme and color configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Primary Color
          </label>

          <input
            type="color"
            name="primaryColor"
            value={settings.primaryColor || "#2563eb"}
            onChange={onChange}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Secondary Color
          </label>

          <input
            type="color"
            name="secondaryColor"
            value={settings.secondaryColor || "#0f172a"}
            onChange={onChange}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Theme Mode
          </label>

          <select
            name="themeMode"
            value={settings.themeMode || "LIGHT"}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          >
            <option value="LIGHT">Light</option>
            <option value="DARK">Dark</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black text-slate-600">
            Language
          </label>

          <select
            name="language"
            value={settings.language || "EN"}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          >
            <option value="EN">English</option>
            <option value="FR">French</option>
            <option value="AR">Arabic</option>
          </select>
        </div>
      </div>
    </div>
  );
}