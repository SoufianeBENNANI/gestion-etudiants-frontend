import { useEffect, useState } from "react";
import {
  X,
  Brain,
  UserRound,
  Mail,
  GraduationCap,
  AlertTriangle,
  CalendarDays,
  Activity,
  BadgeCheck,
  FileText,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "AI Predictions",
    title: "Prediction Details",
    subtitle: "View selected AI prediction information.",
    student: "Student",
    email: "Email",
    average: "Average",
    absences: "Absences",
    prediction: "Prediction",
    risk: "Risk Score",
    level: "Level",
    date: "Date",
    status: "Status",
    model: "Model Version",
    recommendation: "Recommendation",
    unavailable: "Unavailable",
    close: "Close",
  },
  FR: {
    management: "Prédictions IA",
    title: "Détails de la prédiction",
    subtitle: "Afficher les informations de la prédiction sélectionnée.",
    student: "Étudiant",
    email: "Email",
    average: "Moyenne",
    absences: "Absences",
    prediction: "Prédiction",
    risk: "Score risque",
    level: "Niveau",
    date: "Date",
    status: "Statut",
    model: "Version du modèle",
    recommendation: "Recommandation",
    unavailable: "Non disponible",
    close: "Fermer",
  },
  AR: {
    management: "توقعات الذكاء الاصطناعي",
    title: "تفاصيل التوقع",
    subtitle: "عرض معلومات التوقع المحدد.",
    student: "الطالب",
    email: "البريد الإلكتروني",
    average: "المعدل",
    absences: "الغيابات",
    prediction: "التوقع",
    risk: "نسبة الخطر",
    level: "المستوى",
    date: "التاريخ",
    status: "الحالة",
    model: "نسخة النموذج",
    recommendation: "التوصية",
    unavailable: "غير متوفر",
    close: "إغلاق",
  },
};

export default function PredictionDetails({ open, prediction, onClose }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  if (!open || !prediction) return null;

  const studentName =
    `${prediction.nom || ""} ${prediction.prenom || ""}`.trim() ||
    prediction.studentName ||
    `ID ${prediction.studentId || "-"}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-3 py-4 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative px-5 py-5 text-white"
          style={{ background: headerGradient }}
        >
          <button
            type="button"
            onClick={onClose}
            title={t.close}
            className={`absolute top-4 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 ${
              isArabic ? "left-4" : "right-4"
            }`}
          >
            <X size={16} />
          </button>

          <div
            className={`flex items-center gap-4 ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <Brain size={28} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-purple-200">
                {t.management}
              </p>

              <h2 className="mt-1 truncate text-xl font-black tracking-tight">
                {studentName || t.unavailable}
              </h2>

              <p className="mt-1 text-xs font-semibold text-purple-100">
                {t.title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p
            className={`mb-4 text-xs font-semibold ${
              isArabic ? "text-right" : "text-left"
            }`}
            style={{ color: "var(--muted-text)" }}
          >
            {t.subtitle}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBox icon={Mail} label={t.email} value={prediction.email || t.unavailable} />
            <InfoBox icon={GraduationCap} label={t.average} value={prediction.moyenne ?? t.unavailable} />
            <InfoBox icon={Activity} label={t.absences} value={prediction.absences ?? t.unavailable} />
            <InfoBox icon={Brain} label={t.prediction} value={prediction.prediction || t.unavailable} />
            <InfoBox icon={AlertTriangle} label={t.risk} value={prediction.scoreRisque ?? t.unavailable} />
            <InfoBox icon={BadgeCheck} label={t.level} value={prediction.niveau || t.unavailable} />
            <InfoBox icon={CalendarDays} label={t.date} value={prediction.date || t.unavailable} />
            <InfoBox icon={Activity} label={t.status} value={prediction.status || t.unavailable} />
            <InfoBox icon={FileText} label={t.model} value={prediction.modelVersion || t.unavailable} />
          </div>

          <div
            className="mt-4 rounded-2xl border p-4"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                style={{ background: headerGradient }}
              >
                <FileText size={16} />
              </div>

              <p
                className="text-[11px] font-black uppercase tracking-wide"
                style={{ color: "var(--muted-text)" }}
              >
                {t.recommendation}
              </p>
            </div>

            <p
              className="text-xs font-semibold leading-5"
              style={{ color: "var(--text-color)" }}
            >
              {prediction.recommandation || t.unavailable}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div
      className="rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{
        backgroundColor: "var(--section-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
          style={{ background: headerGradient }}
        >
          <Icon size={16} />
        </div>

        <p
          className="truncate text-[11px] font-black uppercase tracking-wide"
          style={{ color: "var(--muted-text)" }}
        >
          {label}
        </p>
      </div>

      <p
        className="truncate text-xs font-bold"
        style={{ color: "var(--text-color)" }}
      >
        {value}
      </p>
    </div>
  );
}