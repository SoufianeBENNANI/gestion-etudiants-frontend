import {
  useEffect,
  useState,
} from "react";

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
} from "../services/studentSettingsService";

import {
  applySettingsTheme,
} from "../../../settings/utils/applySettingsTheme";

import AppearanceSettings from "../../../settings/components/AppearanceSettings";

import NotificationSettings from "../../../settings/components/NotificationSettings";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    title: "Settings",
    badge: "STUDENT / SETTINGS",

    subtitle:
      "Manage your appearance and notification preferences.",

    save: "Save Changes",
    saving: "Saving...",
    loading: "Loading settings...",

    menu: "Settings Menu",
    preferences: "Preferences",
    active: "Active",

    appearance: "Appearance",
    appearanceDesc: "Theme & language",

    appearanceTitle:
      "Appearance Settings",

    appearanceSub:
      "Customize the theme, colors and language.",

    notifications: "Notifications",
    notificationsDesc: "System alerts",

    notificationsTitle:
      "Notification Settings",

    notificationsSub:
      "Manage how you receive system notifications.",

    loadError:
      "Error while loading settings",

    saveError:
      "Error while saving settings",

    missingId:
      "Settings ID not found",
  },

  FR: {
    title: "Paramètres",
    badge: "ÉTUDIANT / PARAMÈTRES",

    subtitle:
      "Gérer vos préférences d’apparence et de notifications.",

    save: "Enregistrer",
    saving: "Enregistrement...",
    loading: "Chargement...",

    menu: "Menu des paramètres",
    preferences: "Préférences",
    active: "Actif",

    appearance: "Apparence",
    appearanceDesc: "Thème et langue",

    appearanceTitle:
      "Paramètres d’apparence",

    appearanceSub:
      "Personnaliser le thème, les couleurs et la langue.",

    notifications: "Notifications",
    notificationsDesc: "Alertes système",

    notificationsTitle:
      "Paramètres des notifications",

    notificationsSub:
      "Gérer la réception des notifications système.",

    loadError:
      "Erreur lors du chargement des paramètres",

    saveError:
      "Erreur lors de l'enregistrement des paramètres",

    missingId:
      "ID des paramètres introuvable",
  },

  AR: {
    title: "الإعدادات",
    badge: "الطالب / الإعدادات",

    subtitle:
      "إدارة تفضيلات المظهر والإشعارات.",

    save: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    loading: "جاري التحميل...",

    menu: "قائمة الإعدادات",
    preferences: "التفضيلات",
    active: "نشط",

    appearance: "المظهر",
    appearanceDesc:
      "المظهر واللغة",

    appearanceTitle:
      "إعدادات المظهر",

    appearanceSub:
      "تخصيص المظهر والألوان واللغة.",

    notifications: "الإشعارات",
    notificationsDesc:
      "تنبيهات النظام",

    notificationsTitle:
      "إعدادات الإشعارات",

    notificationsSub:
      "إدارة طريقة استقبال الإشعارات.",

    loadError:
      "حدث خطأ أثناء تحميل الإعدادات",

    saveError:
      "حدث خطأ أثناء حفظ الإعدادات",

    missingId:
      "معرف الإعدادات غير موجود",
  },
};

export default function StudentSettings() {
  const [
    settings,
    setSettings,
  ] = useState(null);

  const [
    appliedSettings,
    setAppliedSettings,
  ] = useState(null);

  const [
    activeTab,
    setActiveTab,
  ] = useState("appearance");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const currentLanguage =
    appliedSettings?.language ||
    localStorage.getItem(
      "app-language"
    ) ||
    "EN";

  const t =
    translations[currentLanguage] ||
    translations.EN;

  const isArabic =
    currentLanguage === "AR";

  /* =====================================================
     TABS
  ===================================================== */

  const tabs = [
    {
      id: "appearance",
      label: t.appearance,
      description:
        t.appearanceDesc,
      icon: Palette,
    },

    {
      id: "notifications",
      label:
        t.notifications,
      description:
        t.notificationsDesc,
      icon: Bell,
    },
  ];

  const activeTabData =
    tabs.find(
      (tab) =>
        tab.id ===
        activeTab
    ) || tabs[0];

  const ActiveIcon =
    activeTabData.icon;

  /* =====================================================
     LOAD SETTINGS
  ===================================================== */

  const loadSettings =
    async () => {
      try {
        setLoading(true);

        const data =
          await getSettings();

        setSettings(data);
        setAppliedSettings(data);

        applySettingsTheme(
          data
        );

        const language =
          data?.language ||
          "EN";

        localStorage.setItem(
          "app-language",
          language
        );
      } catch (error) {
        console.error(
          "Error loading student settings:",
          error
        );

        alert(
          t.loadError
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadSettings();
  }, []);

  /* =====================================================
     CHANGE
  ===================================================== */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings(
      (previous) => ({
        ...previous,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave =
    async () => {
      if (!settings?.id) {
        alert(
          t.missingId
        );

        return;
      }

      try {
        setSaving(true);

        const updatedSettings =
          await updateAppearanceSettings(
            settings.id,
            {
              themeMode:
                settings.themeMode,

              language:
                settings.language,

              primaryColor:
                settings.primaryColor,

              secondaryColor:
                settings.secondaryColor,

              emailNotifications:
                settings.emailNotifications,

              smsNotifications:
                settings.smsNotifications,

              systemNotifications:
                settings.systemNotifications,
            }
          );

        setSettings(
          updatedSettings
        );

        setAppliedSettings(
          updatedSettings
        );

        applySettingsTheme(
          updatedSettings
        );

        const language =
          updatedSettings?.language ||
          "EN";

        localStorage.setItem(
          "app-language",
          language
        );

        window.dispatchEvent(
          new CustomEvent(
            "app-language-change",
            {
              detail:
                language,
            }
          )
        );
      } catch (error) {
        console.error(
          "Error updating student settings:",
          error
        );

        alert(
          t.saveError
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
        "
        style={{
          backgroundColor:
            "var(--app-bg)",
        }}
      >
        <div
          className="
            rounded-3xl
            border
            px-6
            py-5
            shadow-sm
          "
          style={{
            backgroundColor:
              "var(--card-bg)",

            borderColor:
              "var(--border-color)",

            color:
              "var(--text-color)",
          }}
        >
          <div className="flex items-center gap-3 text-sm font-black">
            <Loader2
              size={20}
              className="animate-spin text-teal-600"
            />

            {t.loading}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        min-h-screen
        w-full
        space-y-6
        px-2
        py-1
        transition-colors
        duration-300
      "
      style={{
        backgroundColor:
          "var(--app-bg)",

        color:
          "var(--text-color)",
      }}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          flex
          flex-col
          gap-4
          overflow-hidden
          rounded-[1.7rem]
          border
          border-white/15
          px-6
          py-5
          text-white
          shadow-sm

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
        style={{
          background:
            headerGradient,
        }}
      >
        {/* DECORATION */}

        <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/5" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-white/5" />

        {/* TITLE */}

        <div
          className={`
            relative
            z-10
            flex
            items-center
            gap-4

            ${
              isArabic
                ? "flex-row-reverse text-right"
                : "text-left"
            }
          `}
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-white/10
              text-white
              ring-1
              ring-white/15
            "
          >
            <SettingsIcon
              size={24}
            />
          </div>

          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-teal-100">
              <CheckCircle2
                size={14}
              />

              {t.badge}
            </p>

            <h1 className="mt-1 text-2xl font-black text-white">
              {t.title}
            </h1>

            <p className="mt-1 text-sm font-semibold text-teal-100/80">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* SAVE */}

        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          className="
            relative
            z-10
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-full
            bg-white/10
            px-5
            text-sm
            font-black
            text-white
            ring-1
            ring-white/15
            transition

            hover:bg-white/15

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />

              {t.saving}
            </>
          ) : (
            <>
              <Save
                size={17}
              />

              {t.save}
            </>
          )}
        </button>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5

          xl:grid-cols-[330px_1fr]
        "
      >
        {/* ===============================================
            SETTINGS MENU
        =============================================== */}

        <div
          className="
            h-fit
            rounded-[1.7rem]
            border
            p-4
            shadow-sm
          "
          style={{
            backgroundColor:
              "var(--card-bg)",

            borderColor:
              "var(--border-color)",
          }}
        >
          <div className="mb-6 px-3 py-2">
            <p className="text-xs font-black uppercase tracking-wide text-teal-500">
              {t.menu}
            </p>

            <h2
              className="mt-2 text-2xl font-black"
              style={{
                color:
                  "var(--text-color)",
              }}
            >
              {t.preferences}
            </h2>
          </div>

          <div className="space-y-4">
            {tabs.map(
              (tab) => {
                const Icon =
                  tab.icon;

                const isActive =
                  activeTab ===
                  tab.id;

                return (
                  <button
                    key={
                      tab.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab.id
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-2xl
                      px-4
                      py-4
                      transition

                      ${
                        isActive
                          ? "text-white shadow-lg shadow-teal-900/20"
                          : "hover:bg-teal-500/5"
                      }
                    `}
                    style={
                      isActive
                        ? {
                            background:
                              headerGradient,
                          }
                        : {
                            color:
                              "var(--text-color)",
                          }
                    }
                  >
                    <div
                      className={`
                        flex
                        items-center
                        gap-4

                        ${
                          isArabic
                            ? "flex-row-reverse"
                            : ""
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl

                          ${
                            isActive
                              ? "bg-white/10"
                              : ""
                          }
                        `}
                        style={
                          !isActive
                            ? {
                                backgroundColor:
                                  "var(--section-bg)",
                              }
                            : undefined
                        }
                      >
                        <Icon
                          size={22}
                        />
                      </div>

                      <div
                        className={
                          isArabic
                            ? "text-right"
                            : "text-left"
                        }
                      >
                        <p className="text-sm font-black">
                          {
                            tab.label
                          }
                        </p>

                        <p
                          className={`
                            mt-1
                            text-xs
                            font-semibold

                            ${
                              isActive
                                ? "text-teal-100"
                                : ""
                            }
                          `}
                          style={
                            !isActive
                              ? {
                                  color:
                                    "var(--muted-text)",
                                }
                              : undefined
                          }
                        >
                          {
                            tab.description
                          }
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="h-3 w-3 rounded-full bg-teal-300" />
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* ===============================================
            ACTIVE SETTINGS
        =============================================== */}

        <div
          className="
            overflow-hidden
            rounded-[1.7rem]
            border
            shadow-sm
          "
          style={{
            backgroundColor:
              "var(--card-bg)",

            borderColor:
              "var(--border-color)",
          }}
        >
          {/* ACTIVE HEADER */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              px-6
              py-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
            style={{
              borderColor:
                "var(--border-color)",
            }}
          >
            <div
              className={`
                flex
                items-center
                gap-4

                ${
                  isArabic
                    ? "flex-row-reverse text-right"
                    : "text-left"
                }
              `}
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  text-white
                  shadow-lg
                  shadow-teal-900/20
                "
                style={{
                  background:
                    headerGradient,
                }}
              >
                <ActiveIcon
                  size={24}
                />
              </div>

              <div>
                <h2
                  className="text-2xl font-black"
                  style={{
                    color:
                      "var(--text-color)",
                  }}
                >
                  {activeTab ===
                  "appearance"
                    ? t.appearanceTitle
                    : t.notificationsTitle}
                </h2>

                <p
                  className="mt-1 text-sm font-semibold"
                  style={{
                    color:
                      "var(--muted-text)",
                  }}
                >
                  {activeTab ===
                  "appearance"
                    ? t.appearanceSub
                    : t.notificationsSub}
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-500">
              {t.active}
            </span>
          </div>

          {/* CONTENT */}

          <div className="p-6">
            {activeTab ===
              "appearance" && (
              <AppearanceSettings
                settings={
                  settings
                }
                onChange={
                  handleChange
                }
              />
            )}

            {activeTab ===
              "notifications" && (
              <NotificationSettings
                settings={
                  settings
                }
                onChange={
                  handleChange
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}