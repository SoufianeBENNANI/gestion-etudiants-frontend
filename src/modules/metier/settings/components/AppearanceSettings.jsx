import { Palette } from "lucide-react";

const translations = {
  EN: {
    title: "Appearance Settings",
    description: "Theme and color configuration.",
    primaryColor: "Primary Color",
    secondaryColor: "Secondary Color",
    themeMode: "Theme Mode",
    language: "Language",
    light: "Light",
    dark: "Dark",
    english: "English",
    french: "French",
    arabic: "Arabic",
  },
  FR: {
    title: "Paramètres d’apparence",
    description: "Configuration du thème et des couleurs.",
    primaryColor: "Couleur principale",
    secondaryColor: "Couleur secondaire",
    themeMode: "Mode du thème",
    language: "Langue",
    light: "Clair",
    dark: "Sombre",
    english: "Anglais",
    french: "Français",
    arabic: "Arabe",
  },
  AR: {
    title: "إعدادات المظهر",
    description: "إعداد الثيم والألوان.",
    primaryColor: "اللون الرئيسي",
    secondaryColor: "اللون الثانوي",
    themeMode: "وضع الثيم",
    language: "اللغة",
    light: "فاتح",
    dark: "داكن",
    english: "الإنجليزية",
    french: "الفرنسية",
    arabic: "العربية",
  },
};

export default function AppearanceSettings({ settings, onChange }) {
  const currentLanguage = settings?.language || "EN";
  const t = translations[currentLanguage] || translations.EN;

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
  };

  const textStyle = {
    color: "var(--text-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Palette size={20} />
        </div>

        <div>
          <h2 className="text-lg font-black" style={textStyle}>
            {t.title}
          </h2>

          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.primaryColor}
          </label>

          <input
            type="color"
            name="primaryColor"
            value={settings?.primaryColor || "#2563eb"}
            onChange={onChange}
            className="h-12 w-full cursor-pointer rounded-2xl border p-2 outline-none transition"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.secondaryColor}
          </label>

          <input
            type="color"
            name="secondaryColor"
            value={settings?.secondaryColor || "#0f172a"}
            onChange={onChange}
            className="h-12 w-full cursor-pointer rounded-2xl border p-2 outline-none transition"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.themeMode}
          </label>

          <select
            name="themeMode"
            value={settings?.themeMode || "LIGHT"}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-bold outline-none transition"
            style={inputStyle}
          >
            <option value="LIGHT">{t.light}</option>
            <option value="DARK">{t.dark}</option>
          </select>
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.language}
          </label>

          <select
            name="language"
            value={settings?.language || "EN"}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-bold outline-none transition"
            style={inputStyle}
          >
            <option value="EN">{t.english}</option>
            <option value="FR">{t.french}</option>
            <option value="AR">{t.arabic}</option>
          </select>
        </div>
      </div>
    </div>
  );
}