import { useEffect, useState } from "react";
import {
    Settings as SettingsIcon,
    Loader2,
    Save,
    Palette,
    Bell,
    CheckCircle2,
} from "lucide-react";

import {
    getSettings,
    updateAppearanceSettings,
} from "../services/teacherSettingsService";

import { applySettingsTheme } from "../../../settings/utils/applySettingsTheme";
import AppearanceSettings from "../../../settings/components/AppearanceSettings";
import NotificationSettings from "../../../settings/components/NotificationSettings";

const translations = {
    EN: {
        title: "Settings",
        badge: "TEACHER / SETTINGS",
        subtitle: "Manage your preferences for appearance and notifications.",
        save: "Save Changes",
        saving: "Saving...",
        loading: "Loading settings...",
        menu: "Settings Menu",
        preferences: "Preferences",
        active: "Active",
        appearance: "Appearance",
        appearanceDesc: "Theme & language",
        appearanceTitle: "Appearance Settings",
        appearanceSub: "Customize the theme, colors and language.",
        notifications: "Notifications",
        notificationsDesc: "System alerts",
        notificationsTitle: "Notification Settings",
        notificationsSub: "Manage how you receive system notifications.",
    },
    FR: {
        title: "Paramètres",
        badge: "TEACHER / PARAMÈTRES",
        subtitle: "Gérer vos préférences d’apparence et de notifications.",
        save: "Enregistrer",
        saving: "Enregistrement...",
        loading: "Chargement...",
        menu: "Menu des paramètres",
        preferences: "Préférences",
        active: "Actif",
        appearance: "Apparence",
        appearanceDesc: "Thème et langue",
        appearanceTitle: "Paramètres d’apparence",
        appearanceSub: "Personnaliser le thème, les couleurs et la langue.",
        notifications: "Notifications",
        notificationsDesc: "Alertes système",
        notificationsTitle: "Paramètres des notifications",
        notificationsSub: "Gérer la réception des notifications système.",
    },
    AR: {
        title: "الإعدادات",
        badge: "الأستاذ / الإعدادات",
        subtitle: "إدارة تفضيلات المظهر والإشعارات.",
        save: "حفظ التغييرات",
        saving: "جاري الحفظ...",
        loading: "جاري التحميل...",
        menu: "قائمة الإعدادات",
        preferences: "التفضيلات",
        active: "نشط",
        appearance: "المظهر",
        appearanceDesc: "الثيم واللغة",
        appearanceTitle: "إعدادات المظهر",
        appearanceSub: "تخصيص الثيم والألوان واللغة.",
        notifications: "الإشعارات",
        notificationsDesc: "تنبيهات النظام",
        notificationsTitle: "إعدادات الإشعارات",
        notificationsSub: "إدارة طريقة استقبال الإشعارات.",
    },
};

export default function TeacherSettings() {
    const [settings, setSettings] = useState(null);
    const [appliedSettings, setAppliedSettings] = useState(null);
    const [activeTab, setActiveTab] = useState("appearance");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const currentLanguage = appliedSettings?.language || "EN";
    const t = translations[currentLanguage] || translations.EN;

    const tabs = [
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
    ];

    const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];
    const ActiveIcon = activeTabData.icon;

    const loadSettings = async () => {
        try {
            setLoading(true);

            const data = await getSettings();

            setSettings(data);
            setAppliedSettings(data);

            applySettingsTheme(data);
            localStorage.setItem("app-language", data?.language || "EN");
        } catch (error) {
            console.error("Error loading teacher settings:", error);
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

            const updatedSettings = await updateAppearanceSettings(settings.id, {
                themeMode: settings.themeMode,
                language: settings.language,
                primaryColor: settings.primaryColor,
                secondaryColor: settings.secondaryColor,
                emailNotifications: settings.emailNotifications,
                smsNotifications: settings.smsNotifications,
                systemNotifications: settings.systemNotifications,
            });

            setSettings(updatedSettings);
            setAppliedSettings(updatedSettings);

            applySettingsTheme(updatedSettings);
            localStorage.setItem("app-language", updatedSettings?.language || "EN");

            window.dispatchEvent(
                new CustomEvent("app-language-change", {
                    detail: updatedSettings?.language || "EN",
                })
            );
        } catch (error) {
            console.error("Error updating teacher settings:", error);
            alert("Error while saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
                <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-5 text-[var(--text-color)] shadow-sm">
                    <div className="flex items-center gap-3 text-sm font-black">
                        <Loader2 size={20} className="animate-spin text-violet-600" />
                        {t.loading}
                    </div>
                </div>
            </div>
        );
    }

    if (!settings) return null;

    return (
        <div
            className="min-h-screen w-full space-y-6 px-2 py-1 transition-colors duration-300"
            style={{
                backgroundColor: "var(--app-bg)",
                color: "var(--text-color)",
            }}
            dir="ltr"
        >
            {/* HEADER - même taille que StudentsList */}
            <div className="flex flex-col gap-4 rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-[#6d28d9] to-[#020617] px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div
                    className="flex items-center gap-4"
                    dir={currentLanguage === "AR" ? "rtl" : "ltr"}
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
                        <SettingsIcon size={24} />
                    </div>

                    <div>
                        <p className="inline-flex items-center gap-2 text-xs font-semibold text-violet-200">
                            <CheckCircle2 size={14} />
                            {t.badge}
                        </p>

                        <h1 className="mt-1 text-2xl font-black text-white">
                            {t.title}
                        </h1>

                        <p className="mt-1 text-sm font-semibold text-slate-300">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-60"
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

            <div
                className="grid grid-cols-1 gap-5 xl:grid-cols-[330px_1fr]"
                dir={currentLanguage === "AR" ? "rtl" : "ltr"}
            >
                <div className="h-fit rounded-[1.7rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-sm">
                    <div className="mb-6 px-3 py-2">
                        <p className="text-xs font-black uppercase tracking-wide text-violet-500">
                            {t.menu}
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-[var(--text-color)]">
                            {t.preferences}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 transition ${isActive
                                            ? "bg-gradient-to-r from-violet-700 to-purple-800 text-white"
                                            : "text-[var(--text-color)] hover:bg-white/5"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? "bg-white/10" : "bg-[var(--section-bg)]"
                                                }`}
                                        >
                                            <Icon size={22} />
                                        </div>

                                        <div className="text-left">
                                            <p className="text-sm font-black">{tab.label}</p>
                                            <p className="mt-1 text-xs font-semibold text-[var(--muted-text)]">
                                                {tab.description}
                                            </p>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <span className="h-3 w-3 rounded-full bg-violet-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.7rem] border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-900/40">
                                <ActiveIcon size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-[var(--text-color)]">
                                    {activeTab === "appearance"
                                        ? t.appearanceTitle
                                        : t.notificationsTitle}
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-[var(--muted-text)]">
                                    {activeTab === "appearance"
                                        ? t.appearanceSub
                                        : t.notificationsSub}
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-500">
                            {t.active}
                        </span>
                    </div>

                    <div className="p-6">
                        {activeTab === "appearance" && (
                            <AppearanceSettings settings={settings} onChange={handleChange} />
                        )}

                        {activeTab === "notifications" && (
                            <NotificationSettings
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