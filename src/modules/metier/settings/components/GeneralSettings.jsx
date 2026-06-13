import { School, Image } from "lucide-react";
import defaultLogo from "/images/LogoSchool.png";

const translations = {
  EN: {
    title: "General Settings",
    description: "Basic school information.",
    schoolName: "School Name",
    schoolEmail: "School Email",
    phone: "Phone",
    logoUrl: "Logo URL",
    logoPreview: "Logo Preview",
    logoPlaceholder:
      "Example: /images/LogoSchool.png or https://site.com/logo.png",
    address: "Address",
    defaultLogoText: "Default logo from src/assets",
    customLogoText: "Logo loaded from logoUrl",
    logoName: "LogoSchool.png",
  },

  FR: {
    title: "Paramètres généraux",
    description: "Informations principales de l’école.",
    schoolName: "Nom de l’école",
    schoolEmail: "Email de l’école",
    phone: "Téléphone",
    logoUrl: "URL du logo",
    logoPreview: "Aperçu du logo",
    logoPlaceholder:
      "Exemple : /images/LogoSchool.png ou https://site.com/logo.png",
    address: "Adresse",
    defaultLogoText: "Logo par défaut depuis src/assets",
    customLogoText: "Logo chargé depuis logoUrl",
    logoName: "LogoSchool.png",
  },

  AR: {
    title: "الإعدادات العامة",
    description: "المعلومات الأساسية للمدرسة.",
    schoolName: "اسم المدرسة",
    schoolEmail: "بريد المدرسة",
    phone: "الهاتف",
    logoUrl: "رابط الشعار",
    logoPreview: "معاينة الشعار",
    logoPlaceholder: "مثال: /images/LogoSchool.png أو https://site.com/logo.png",
    address: "العنوان",
    defaultLogoText: "الشعار الافتراضي من src/assets",
    customLogoText: "تم تحميل الشعار من logoUrl",
    logoName: "LogoSchool.png",
  },
};

export default function GeneralSettings({ settings, onChange }) {
  const currentLanguage = settings?.language || "EN";
  const t = translations[currentLanguage] || translations.EN;

  const logoSrc = settings?.logoUrl?.trim() || defaultLogo;

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
    <div dir={currentLanguage === "AR" ? "rtl" : "ltr"}>
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <School size={20} />
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
            {t.schoolName}
          </label>

          <input
            type="text"
            name="schoolName"
            value={settings?.schoolName || ""}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.schoolEmail}
          </label>

          <input
            type="email"
            name="schoolEmail"
            value={settings?.schoolEmail || ""}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.phone}
          </label>

          <input
            type="text"
            name="schoolPhone"
            value={settings?.schoolPhone || ""}
            onChange={onChange}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.logoUrl}
          </label>

          <input
            type="text"
            name="logoUrl"
            value={settings?.logoUrl || ""}
            onChange={onChange}
            placeholder={t.logoPlaceholder}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
            style={inputStyle}
          />
        </div>

        <div className="md:col-span-2">
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.logoPreview}
          </label>

          <div
            className="flex items-center gap-4 rounded-2xl border px-4 py-4"
            style={inputStyle}
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-[#081028] p-2">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="School Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultLogo;
                  }}
                />
              ) : (
                <Image size={24} className="text-white/70" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black" style={textStyle}>
                {settings?.logoUrl || t.logoName}
              </p>

              <p className="mt-1 text-xs font-semibold" style={mutedTextStyle}>
                {settings?.logoUrl ? t.customLogoText : t.defaultLogoText}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            className="mb-1.5 block text-xs font-black"
            style={mutedTextStyle}
          >
            {t.address}
          </label>

          <textarea
            name="schoolAddress"
            value={settings?.schoolAddress || ""}
            onChange={onChange}
            rows={4}
            className="w-full resize-none rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}