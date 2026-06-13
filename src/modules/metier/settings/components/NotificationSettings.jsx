import { Bell } from "lucide-react";

const translations = {
  EN: {
    title: "Notification Settings",
    description: "Enable or disable system notifications.",
    enabled: "Notifications Enabled",
    enabledDesc: "Allow the system to send notifications.",
  },
  FR: {
    title: "Paramètres des notifications",
    description: "Activer ou désactiver les notifications système.",
    enabled: "Notifications activées",
    enabledDesc: "Autoriser le système à envoyer des notifications.",
  },
  AR: {
    title: "إعدادات الإشعارات",
    description: "تفعيل أو تعطيل إشعارات النظام.",
    enabled: "الإشعارات مفعلة",
    enabledDesc: "السماح للنظام بإرسال الإشعارات.",
  },
};

export default function NotificationSettings({ settings, onChange }) {
  const currentLanguage = settings?.language || "EN";
  const t = translations[currentLanguage] || translations.EN;

  const textStyle = {
    color: "var(--text-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  return (
    <div dir={currentLanguage === "AR" ? "rtl" : "ltr"}>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          <Bell size={20} />
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

      <label
        className="flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition"
        style={sectionStyle}
      >
        <div>
          <p className="text-sm font-black" style={textStyle}>
            {t.enabled}
          </p>

          <p className="mt-1 text-xs font-semibold" style={mutedTextStyle}>
            {t.enabledDesc}
          </p>
        </div>

        <input
          type="checkbox"
          name="notificationsEnabled"
          checked={Boolean(settings?.notificationsEnabled)}
          onChange={onChange}
          className="h-5 w-5 accent-blue-600"
        />
      </label>
    </div>
  );
}