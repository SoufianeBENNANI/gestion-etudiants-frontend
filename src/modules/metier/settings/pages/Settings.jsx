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

import GeneralSettings from "../components/GeneralSettings";
import AppearanceSettings from "../components/AppearanceSettings";
import NotificationSettings from "../components/NotificationSettings";
import MaintenanceSettings from "../components/MaintenanceSettings";

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const data = await getSettings();
      setSettings(data);
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
      label: "General",
      description: "School profile",
      icon: School,
    },
    {
      id: "appearance",
      label: "Appearance",
      description: "Theme & language",
      icon: Palette,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "System alerts",
      icon: Bell,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      description: "Access control",
      icon: ShieldAlert,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-black text-slate-700">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            Loading settings...
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              No settings found
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Please check your backend settings endpoint.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-40 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
          
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <SettingsIcon size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-100 ring-1 ring-white/10">
                <CheckCircle2 size={14} />
                System Configuration
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight">
                Settings
              </h1>

              <p className="mt-2 text-xs font-semibold text-slate-300">
                Manage school information, appearance and system preferences.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-300/30 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[310px_1fr]">
        {/* SETTINGS NAVIGATION */}
        <div className="h-fit rounded-[1.7rem] border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 px-2 py-2">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              Settings Menu
            </p>
            <h2 className="mt-1 text-lg font-black text-slate-950">
              Preferences
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
                  className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-black">{tab.label}</p>
                      <p
                        className={`mt-0.5 text-xs font-semibold ${
                          isActive ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {tab.description}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FORM CARD */}
        <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-3">
              {activeTabData && (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <activeTabData.icon size={21} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  {activeTabData?.label}
                </h2>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {activeTabData?.description}
                </p>
              </div>
            </div>

            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600 sm:inline-flex">
              Active
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