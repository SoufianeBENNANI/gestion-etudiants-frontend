export const applySettingsTheme = (settings) => {
  if (!settings) return;

  const primaryColor = settings.primaryColor || "#2563eb";
  const secondaryColor = settings.secondaryColor || "#0f172a";
  const themeMode = settings.themeMode || "LIGHT";

  const root = document.documentElement;

  root.style.setProperty("--primary-color", primaryColor);
  root.style.setProperty("--secondary-color", secondaryColor);

  if (themeMode === "DARK") {
    root.classList.add("dark");

    root.style.setProperty("--app-bg", secondaryColor);
    root.style.setProperty("--card-bg", "#020617");
    root.style.setProperty("--section-bg", "#0f172a");
    root.style.setProperty("--input-bg", "#020617");
    root.style.setProperty("--border-color", "#334155");
    root.style.setProperty("--text-color", "#ffffff");
    root.style.setProperty("--muted-text", "#94a3b8");
    root.style.setProperty("--hover-bg", "#0f172a");

    document.body.style.backgroundColor = secondaryColor;
  } else {
    root.classList.remove("dark");

    root.style.setProperty("--app-bg", "#f1f5f9");
    root.style.setProperty("--card-bg", "#ffffff");
    root.style.setProperty("--section-bg", "#f8fafc");
    root.style.setProperty("--input-bg", "#ffffff");
    root.style.setProperty("--border-color", "#e2e8f0");
    root.style.setProperty("--text-color", "#0f172a");
    root.style.setProperty("--muted-text", "#64748b");
    root.style.setProperty("--hover-bg", "#f8fafc");

    document.body.style.backgroundColor = "#f1f5f9";
  }
};