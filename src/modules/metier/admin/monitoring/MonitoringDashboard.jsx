import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Database,
  Gauge,
  RefreshCcw,
} from "lucide-react";

const GRAFANA_BASE_URL = "http://localhost:3000";
const DASHBOARD_PATH = "/d/adjfkfb/gestion-etudiants";

const translations = {
  EN: {
    section: "System monitoring",
    title: "Application monitoring",
    subtitle: "Track your student management application's performance.",
    open: "Open in Grafana",
    performance: "Performance",
    performanceDetail: "CPU, memory and HTTP requests",
    database: "Database",
    databaseDetail: "PostgreSQL connections",
    collection: "Data collection",
    collectionDetail: "Spring Boot · Prometheus · Grafana",
    dashboard: "Application metrics",
    period: "Last 15 minutes",
    refresh: "Refreshes every 15 seconds",
    note:
      "Charts display real Prometheus data. A stable value can be normal when activity does not change.",
    iframe: "Grafana monitoring dashboard",
  },
  FR: {
    section: "Supervision du système",
    title: "Monitoring de l’application",
    subtitle: "Suivez les performances de votre application de gestion des étudiants.",
    open: "Ouvrir dans Grafana",
    performance: "Performances",
    performanceDetail: "CPU, mémoire et requêtes HTTP",
    database: "Base de données",
    databaseDetail: "Connexions PostgreSQL",
    collection: "Collecte des données",
    collectionDetail: "Spring Boot · Prometheus · Grafana",
    dashboard: "Métriques de l’application",
    period: "Les 15 dernières minutes",
    refresh: "Actualisation toutes les 15 secondes",
    note:
      "Les courbes affichent les données réelles de Prometheus. Une valeur stable peut être normale lorsque l’activité ne change pas.",
    iframe: "Dashboard de monitoring Grafana",
  },
  AR: {
    section: "مراقبة النظام",
    title: "مراقبة التطبيق",
    subtitle: "تابع أداء تطبيق إدارة الطلاب.",
    open: "فتح في Grafana",
    performance: "الأداء",
    performanceDetail: "المعالج والذاكرة وطلبات HTTP",
    database: "قاعدة البيانات",
    databaseDetail: "اتصالات PostgreSQL",
    collection: "جمع البيانات",
    collectionDetail: "Spring Boot · Prometheus · Grafana",
    dashboard: "مقاييس التطبيق",
    period: "آخر 15 دقيقة",
    refresh: "تحديث كل 15 ثانية",
    note:
      "تعرض الرسوم بيانات حقيقية من Prometheus. قد تبقى القيمة ثابتة عندما لا يتغير نشاط التطبيق.",
    iframe: "لوحة مراقبة Grafana",
  },
};

function getAppLanguage() {
  try {
    const value = localStorage.getItem("app-language");
    return translations[value] ? value : "EN";
  } catch {
    return "EN";
  }
}

/*
 * Lit la couleur de fond réellement utilisée par l'application.
 * Cela permet de donner à l'iframe Grafana le même thème,
 * sans créer un second bouton clair/sombre sur cette page.
 */
function getAppTheme() {
  if (typeof document === "undefined") return "light";

  const rawColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--app-bg")
    .trim();

  if (!rawColor) return "light";

  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.backgroundColor = rawColor;
  document.body.appendChild(probe);

  const computedColor = getComputedStyle(probe).backgroundColor;
  probe.remove();

  const channels = computedColor.match(/\d+(\.\d+)?/g)?.map(Number);

  if (!channels || channels.length < 3) return "light";

  const [red, green, blue] = channels;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness < 128 ? "dark" : "light";
}

export default function MonitoringDashboard() {
  const [language, setLanguage] = useState(getAppLanguage);
  const [grafanaTheme, setGrafanaTheme] = useState(getAppTheme);

  const t = translations[language] || translations.EN;

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage = event.detail || getAppLanguage();
      setLanguage(translations[nextLanguage] ? nextLanguage : "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener(
        "app-language-change",
        handleLanguageChange
      );
    };
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      setGrafanaTheme(getAppTheme());
    };

    syncTheme();

    /*
     * La page Paramètres peut modifier les classes ou styles globaux.
     * L'observateur synchronise alors le thème de Grafana.
     */
    const observer = new MutationObserver(syncTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    window.addEventListener("focus", syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("focus", syncTheme);
    };
  }, []);

  const { dashboardUrl, embeddedUrl } = useMemo(() => {
    const dashboard = new URL(DASHBOARD_PATH, GRAFANA_BASE_URL);

    dashboard.searchParams.set("orgId", "1");
    dashboard.searchParams.set("from", "now-15m");
    dashboard.searchParams.set("to", "now");
    dashboard.searchParams.set("refresh", "15s");

    const embedded = new URL(dashboard);
    embedded.searchParams.set("kiosk", "1");
    embedded.searchParams.set("theme", grafanaTheme);

    return {
      dashboardUrl: dashboard.toString(),
      embeddedUrl: embedded.toString(),
    };
  }, [grafanaTheme]);

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  const cards = [
    {
      title: t.performance,
      description: t.performanceDetail,
      icon: Gauge,
      iconColor: "bg-blue-500",
    },
    {
      title: t.database,
      description: t.databaseDetail,
      icon: Database,
      iconColor: "bg-violet-500",
    },
    {
      title: t.collection,
      description: t.collectionDetail,
      icon: Activity,
      iconColor: "bg-emerald-500",
    },
  ];

  return (
    <main
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language.toLowerCase()}
    >
      {/* En-tête : même structure que la page Paiement */}
      <header
        className="flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold text-blue-200">
            <Activity size={15} aria-hidden="true" />
            {t.section}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {t.subtitle}
          </p>
        </div>

        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
        >
          {t.open}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </header>

      {/* Cartes descriptives, sans chiffres fictifs */}
      <section
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
        aria-label={t.section}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="flex min-w-0 items-center gap-4 rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${card.iconColor}`}
              >
                <Icon size={21} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-black">{card.title}</h2>
                <p
                  className="mt-1 text-xs font-semibold leading-5"
                  style={mutedTextStyle}
                >
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Dashboard complet Grafana */}
      <section
        className="min-w-0 overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <Gauge size={20} aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-lg font-black">{t.dashboard}</h2>
              <p
                className="mt-0.5 text-xs font-semibold"
                style={mutedTextStyle}
              >
                {t.period}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 text-xs font-black text-emerald-500">
            <RefreshCcw size={15} aria-hidden="true" />
            {t.refresh}
          </span>
        </div>

        <iframe
          src={embeddedUrl}
          title={t.iframe}
          loading="lazy"
          className="block h-[900px] w-full min-w-0 border-0 max-md:h-[1100px]"
          style={{ backgroundColor: "var(--card-bg)" }}
        />
      </section>

      <p className="px-1 text-xs font-semibold" style={mutedTextStyle}>
        {t.note}
      </p>
    </main>
  );
}