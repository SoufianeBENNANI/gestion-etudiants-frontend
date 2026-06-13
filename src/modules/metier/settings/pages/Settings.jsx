import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Loader2,
  Save,
  School,
  Palette,
  Bell,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { getSettings, updateSettings } from "../service/serviceSetting";
import { applySettingsTheme } from "../utils/applySettingsTheme";

import GeneralSettings from "../components/GeneralSettings";
import AppearanceSettings from "../components/AppearanceSettings";
import NotificationSettings from "../components/NotificationSettings";
import MaintenanceSettings from "../components/MaintenanceSettings";

const translations = {
  EN: {
    systemConfiguration: "System Configuration",
    settings: "Settings",
    subtitle: "Manage school information, appearance and system preferences.",
    save: "Save Changes",
    saving: "Saving...",
    loading: "Loading settings...",
    noSettings: "No settings found",
    backendMessage: "Please check your backend settings endpoint.",
    back: "Back",
    settingsMenu: "Settings Menu",
    preferences: "Preferences",
    active: "Active",

    general: "General",
    generalDesc: "School profile",
    appearance: "Appearance",
    appearanceDesc: "Theme & language",
    notifications: "Notifications",
    notificationsDesc: "System alerts",
    maintenance: "Maintenance",
    maintenanceDesc: "Access control",
  },

  FR: {
    systemConfiguration: "Configuration du système",
    settings: "Paramètres",
    subtitle:
      "Gérer les informations de l’école, l’apparence et les préférences système.",
    save: "Enregistrer",
    saving: "Enregistrement...",
    loading: "Chargement des paramètres...",
    noSettings: "Aucun paramètre trouvé",
    backendMessage: "Veuillez vérifier l’endpoint des paramètres.",
    back: "Retour",
    settingsMenu: "Menu des paramètres",
    preferences: "Préférences",
    active: "Actif",

    general: "Général",
    generalDesc: "Profil de l’école",
    appearance: "Apparence",
    appearanceDesc: "Thème et langue",
    notifications: "Notifications",
    notificationsDesc: "Alertes système",
    maintenance: "Maintenance",
    maintenanceDesc: "Contrôle d’accès",
  },

  AR: {
    systemConfiguration: "إعدادات النظام",
    settings: "الإعدادات",
    subtitle: "إدارة معلومات المدرسة والمظهر وتفضيلات النظام.",
    save: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    loading: "جاري تحميل الإعدادات...",
    noSettings: "لا توجد إعدادات",
    backendMessage: "يرجى التحقق من رابط الإعدادات في الخادم.",
    back: "رجوع",
    settingsMenu: "قائمة الإعدادات",
    preferences: "التفضيلات",
    active: "نشط",

    general: "عام",
    generalDesc: "ملف المدرسة",
    appearance: "المظهر",
    appearanceDesc: "الثيم واللغة",
    notifications: "الإشعارات",
    notificationsDesc: "تنبيهات النظام",
    maintenance: "الصيانة",
    maintenanceDesc: "التحكم في الوصول",
  },
};

export default function Settings() {
  const navigate = useNavigate();

  // Form values
  const [settings, setSettings] = useState(null);

  // Applied values: UI does not change before Save
  const [appliedSettings, setAppliedSettings] = useState(null);

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentLanguage = appliedSettings?.language || "EN";
  const t = translations[currentLanguage] || translations.EN;

  const applyLanguage = (language) => {
    document.documentElement.lang = String(language || "EN").toLowerCase();
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
  };

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

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

  const loadSettings = async () => {
    try {
      setLoading(true);

      const data = await getSettings();

      setSettings(data);
      setAppliedSettings(data);

      // Apply only saved settings from backend
      applySettingsTheme(data);
      applyLanguage(data?.language);

      localStorage.setItem("app-language", data?.language || "EN");
    } catch (error) {
      console.error("Error loading settings:", error);
      alert("Error while loading settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Important:
    // Do not apply theme, language, localStorage or events here.
    // Only update form values.
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!settings?.id) {
      alert("Settings ID not found");
      return;
    }

    try {
      setSaving(true);

      const updatedSettings = await updateSettings(settings.id, settings);

      setSettings(updatedSettings);
      setAppliedSettings(updatedSettings);

      // Apply changes only after Save
      applySettingsTheme(updatedSettings);
      applyLanguage(updatedSettings?.language);

      localStorage.setItem("app-language", updatedSettings?.language || "EN");

      window.dispatchEvent(
        new CustomEvent("app-language-change", {
          detail: updatedSettings?.language || "EN",
        })
      );

      
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Error while updating settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      id: "general",
      label: t.general,
      description: t.generalDesc,
      icon: School,
    },
    {
      id: "appearance",
      label: t.appearance,
      description: t.appearanceDesc,
      icon: Palette,
    },
    {
      id: "notifications",
      label: t.notifications,
      description: t.notificationsDesc,
      icon: Bell,
    },
    {
      id: "maintenance",
      label: t.maintenance,
      description: t.maintenanceDesc,
      icon: ShieldAlert,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const ActiveIcon = activeTabData?.icon;

  if (loading) {
    return (
      <div
        className="flex min-h-[70vh] items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: "var(--app-bg)" }}
      >
        <div className="rounded-3xl border px-6 py-5 shadow-sm" style={cardStyle}>
          <div
            className="flex items-center gap-3 text-sm font-black"
            style={textStyle}
          >
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: "var(--primary-color)" }}
            />
            {t.loading}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div
        className="min-h-screen w-full space-y-6 p-6 transition-colors duration-300"
        style={{
          backgroundColor: "var(--app-bg)",
          color: "var(--text-color)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black" style={textStyle}>
              {t.noSettings}
            </h2>

            <p className="mt-1 text-sm font-semibold" style={mutedTextStyle}>
              {t.backendMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold shadow-sm transition"
            style={inputStyle}
          >
            <ArrowLeft size={17} />
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen space-y-6 p-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      {/* HEADER */}
      <div
        className="relative overflow-hidden rounded-[2rem] border px-6 py-6 text-white shadow-sm"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div
          className="absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
        />

        <div className="absolute bottom-0 right-40 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <SettingsIcon size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-100 ring-1 ring-white/10">
                <CheckCircle2 size={14} />
                {t.systemConfiguration}
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight">
                {t.settings}
              </h1>

              <p className="mt-2 text-xs font-semibold text-slate-300">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "var(--primary-color)",
              boxShadow: "0 18px 35px rgba(37, 99, 235, 0.25)",
            }}
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <Save size={17} />
                {t.save}
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[310px_1fr]">
        {/* SETTINGS NAVIGATION */}
        <div
          className="h-fit rounded-[1.7rem] border p-3 shadow-sm transition-colors duration-300"
          style={cardStyle}
        >
          <div className="mb-3 px-2 py-2">
            <p
              className="text-xs font-black uppercase tracking-wide"
              style={mutedTextStyle}
            >
              {t.settingsMenu}
            </p>

            <h2 className="mt-1 text-lg font-black" style={textStyle}>
              {t.preferences}
            </h2>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition"
                  style={{
                    backgroundColor: isActive
                      ? "var(--secondary-color)"
                      : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-color)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl transition"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.12)"
                          : "var(--section-bg)",
                        color: isActive ? "#ffffff" : "var(--muted-text)",
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-black">{tab.label}</p>

                      <p
                        className="mt-0.5 text-xs font-semibold"
                        style={{
                          color: isActive ? "#cbd5e1" : "var(--muted-text)",
                        }}
                      >
                        {tab.description}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FORM CARD */}
        <div
          className="overflow-hidden rounded-[1.7rem] border shadow-sm transition-colors duration-300"
          style={cardStyle}
        >
          <div
            className="flex items-center justify-between border-b px-5 py-4 transition-colors duration-300"
            style={sectionStyle}
          >
            <div className="flex items-center gap-3">
              {ActiveIcon && (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  <ActiveIcon size={21} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-black" style={textStyle}>
                  {activeTabData?.label}
                </h2>

                <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                  {activeTabData?.description}
                </p>
              </div>
            </div>

            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600 sm:inline-flex">
              {t.active}
            </span>
          </div>

          <div className="p-5">
            {activeTab === "general" && (
              <GeneralSettings settings={settings} onChange={handleChange} />
            )}

            {activeTab === "appearance" && (
              <AppearanceSettings settings={settings} onChange={handleChange} />
            )}

            {activeTab === "notifications" && (
              <NotificationSettings
                settings={settings}
                onChange={handleChange}
              />
            )}

            {activeTab === "maintenance" && (
              <MaintenanceSettings
                settings={settings}
                onChange={handleChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}