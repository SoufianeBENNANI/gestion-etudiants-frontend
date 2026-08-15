import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  GraduationCap,
  Lightbulb,
  Loader2,
  ShieldCheck,
  Target,
} from "lucide-react";

import { getMyPrediction } from "../services/predictionService";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Prediction",
    title: "My Prediction",
    subtitle: "View your academic performance prediction.",
    prediction: "Prediction",
    riskScore: "Risk Score",
    riskLevel: "Risk Level",
    average: "Average",
    absences: "Absences",
    recommendation: "Recommendation",
    status: "Status",
    date: "Date",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    lowRisk: "Low Risk",
    moderateRisk: "Moderate Risk",
    highRisk: "High Risk",
    loading: "Loading prediction...",
    noData: "No prediction found.",
    noDataDescription: "No prediction data is currently available.",
    error: "Unable to load prediction.",
    noRecommendation: "No recommendation available.",
    noDate: "No date available",
    points: "/100",
    outOf20: "/20",
  },

  FR: {
    management: "Étudiant / Prédiction",
    title: "Ma prédiction",
    subtitle: "Consulter votre prédiction de performance académique.",
    prediction: "Prédiction",
    riskScore: "Score de risque",
    riskLevel: "Niveau de risque",
    average: "Moyenne",
    absences: "Absences",
    recommendation: "Recommandation",
    status: "Statut",
    date: "Date",
    low: "Faible",
    moderate: "Modéré",
    high: "Élevé",
    lowRisk: "Risque faible",
    moderateRisk: "Risque modéré",
    highRisk: "Risque élevé",
    loading: "Chargement de la prédiction...",
    noData: "Aucune prédiction trouvée.",
    noDataDescription:
      "Aucune donnée de prédiction n'est actuellement disponible.",
    error: "Impossible de charger la prédiction.",
    noRecommendation: "Aucune recommandation disponible.",
    noDate: "Aucune date disponible",
    points: "/100",
    outOf20: "/20",
  },

  AR: {
    management: "الطالب / التوقع",
    title: "توقعي",
    subtitle: "عرض توقع الأداء الأكاديمي الخاص بك.",
    prediction: "التوقع",
    riskScore: "درجة المخاطر",
    riskLevel: "مستوى المخاطر",
    average: "المعدل",
    absences: "الغيابات",
    recommendation: "التوصية",
    status: "الحالة",
    date: "التاريخ",
    low: "منخفض",
    moderate: "متوسط",
    high: "مرتفع",
    lowRisk: "مخاطر منخفضة",
    moderateRisk: "مخاطر متوسطة",
    highRisk: "مخاطر مرتفعة",
    loading: "جاري تحميل التوقع...",
    noData: "لم يتم العثور على أي توقع.",
    noDataDescription: "لا توجد بيانات توقع متاحة حاليا.",
    error: "تعذر تحميل التوقع.",
    noRecommendation: "لا توجد توصية متاحة.",
    noDate: "لا يوجد تاريخ متاح",
    points: "/100",
    outOf20: "/20",
  },
};

export default function StudentPredictionPage() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "FR",
  );

  const t = translations[language] || translations.FR;
  const isArabic = language === "AR";

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

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(
        event.detail ||
          localStorage.getItem("app-language") ||
          "FR",
      );
    };

    window.addEventListener(
      "app-language-change",
      handleLanguageChange,
    );

    return () =>
      window.removeEventListener(
        "app-language-change",
        handleLanguageChange,
      );
  }, []);

  useEffect(() => {
    const loadPrediction = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyPrediction();

        if (
          data &&
          data.hasPrediction !== false &&
          data.id !== null
        ) {
          setPrediction(data);
        } else {
          setPrediction(null);
        }
      } catch (requestError) {
        console.error(
          "Erreur chargement prédiction :",
          requestError,
        );

        setPrediction(null);

        if (requestError?.response?.status !== 404) {
          setError(t.error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrediction();
  }, []);

  const getRiskType = (status) => {
    if (status === "HIGH") return "high";
    if (status === "MODERATE") return "moderate";
    return "low";
  };

  const getRiskLabel = (status) => {
    if (status === "HIGH") return t.highRisk;
    if (status === "MODERATE") return t.moderateRisk;
    return t.lowRisk;
  };

  const getRiskBadgeClass = (status) => {
    if (status === "HIGH") {
      return "border-red-200 bg-red-50 text-red-600";
    }

    if (status === "MODERATE") {
      return "border-amber-200 bg-amber-50 text-amber-600";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  };

  const getRiskIconClass = (status) => {
    if (status === "HIGH") {
      return "bg-red-100 text-red-600";
    }

    if (status === "MODERATE") {
      return "bg-amber-100 text-amber-600";
    }

    return "bg-emerald-100 text-emerald-600";
  };

  const formatDate = (date) => {
    if (!date) return t.noDate;

    try {
      return new Date(date).toLocaleString(
        language === "AR"
          ? "ar-MA"
          : language === "FR"
            ? "fr-FR"
            : "en-US",
      );
    } catch {
      return t.noDate;
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        dir={isArabic ? "rtl" : "ltr"}
        style={{ color: "var(--text-color)" }}
      >
        <div className="flex items-center gap-2 font-bold">
          <Loader2
            className="animate-spin"
            size={22}
          />
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1"
      dir={isArabic ? "rtl" : "ltr"}
      style={{ color: "var(--text-color)" }}
    >
      <section
        className="flex flex-col gap-4 rounded-[1.7rem] border border-white/15 px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{ background: headerGradient }}
      >
        <div>
          <p className="text-xs font-bold text-teal-100">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-semibold text-teal-100/80">
            {t.subtitle}
          </p>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4">
          <Activity
            size={18}
            className="text-teal-100"
          />

          <span className="text-sm font-bold text-white">
            {t.prediction}
          </span>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {!prediction && !error && (
        <section
          className="rounded-[1.7rem] border p-10 text-center shadow-sm"
          style={cardStyle}
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white"
            style={{ background: headerGradient }}
          >
            <Activity size={28} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            {t.noData}
          </h2>

          <p
            className="mt-2 text-sm font-semibold"
            style={mutedTextStyle}
          >
            {t.noDataDescription}
          </p>
        </section>
      )}

      {prediction && (
        <>
          <section
            className="rounded-[1.7rem] border p-6 shadow-sm"
            style={cardStyle}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{ background: headerGradient }}
                >
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <p
                    className="text-xs font-black uppercase"
                    style={mutedTextStyle}
                  >
                    {t.prediction}
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {getRiskLabel(
                      prediction.status,
                    )}
                  </h2>

                  <p
                    className="mt-2 max-w-2xl text-sm font-semibold leading-6"
                    style={mutedTextStyle}
                  >
                    {prediction.recommandation ||
                      t.noRecommendation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-8 ${getRiskBadgeClass(
                    prediction.status,
                  )}`}
                >
                  <span className="text-3xl font-black">
                    {Math.round(
                      Number(
                        prediction.scoreRisque || 0,
                      ),
                    )}
                  </span>

                  <span className="text-xs font-bold">
                    {t.points}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PredictionStat
              icon={<Activity size={21} />}
              label={t.riskScore}
              value={
                prediction.scoreRisque ??
                "-"
              }
              suffix={t.points}
              cardStyle={cardStyle}
              mutedTextStyle={mutedTextStyle}
            />

            <PredictionStat
              icon={<Target size={21} />}
              label={t.riskLevel}
              value={
                prediction.niveau ??
                getRiskLabel(
                  prediction.status,
                )
              }
              cardStyle={cardStyle}
              mutedTextStyle={mutedTextStyle}
            />

            <PredictionStat
              icon={<GraduationCap size={21} />}
              label={t.average}
              value={
                prediction.moyenne ?? "-"
              }
              suffix={t.outOf20}
              cardStyle={cardStyle}
              mutedTextStyle={mutedTextStyle}
            />

            <PredictionStat
              icon={<CalendarDays size={21} />}
              label={t.absences}
              value={
                prediction.absences ?? "-"
              }
              cardStyle={cardStyle}
              mutedTextStyle={mutedTextStyle}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div
              className="rounded-[1.7rem] border p-6 shadow-sm"
              style={cardStyle}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ background: headerGradient }}
                >
                  <Lightbulb size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    {t.recommendation}
                  </h2>

                  <p
                    className="text-xs font-semibold"
                    style={mutedTextStyle}
                  >
                    {t.prediction}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 rounded-2xl border p-5"
                style={sectionStyle}
              >
                <p
                  className="text-sm font-semibold leading-7"
                  style={mutedTextStyle}
                >
                  {prediction.recommandation ||
                    t.noRecommendation}
                </p>
              </div>
            </div>

            <div
              className="rounded-[1.7rem] border p-6 shadow-sm"
              style={cardStyle}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ background: headerGradient }}
                >
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    {t.status}
                  </h2>

                  <p
                    className="text-xs font-semibold"
                    style={mutedTextStyle}
                  >
                    {t.date}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <span
                  className={`w-fit rounded-full border px-4 py-2 text-xs font-black ${getRiskBadgeClass(
                    prediction.status,
                  )}`}
                >
                  {getRiskLabel(
                    prediction.status,
                  )}
                </span>

                <div
                  className="rounded-2xl border p-4"
                  style={sectionStyle}
                >
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      style={mutedTextStyle}
                    />

                    <span
                      className="text-sm font-semibold"
                      style={mutedTextStyle}
                    >
                      {formatDate(
                        prediction.date,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function PredictionStat({
  icon,
  label,
  value,
  suffix,
  cardStyle,
  mutedTextStyle,
}) {
  return (
    <section
      className="rounded-[1.5rem] border p-5 shadow-sm"
      style={cardStyle}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
          style={{ background: headerGradient }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <h2 className="truncate text-2xl font-black">
              {value}
            </h2>

            {suffix && (
              <span
                className="text-xs font-bold"
                style={mutedTextStyle}
              >
                {suffix}
              </span>
            )}
          </div>

          <p
            className="text-xs font-semibold"
            style={mutedTextStyle}
          >
            {label}
          </p>
        </div>
      </div>
    </section>
  );
}