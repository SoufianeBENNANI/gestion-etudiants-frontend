import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Loader2,
  TrendingUp,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import { getMyGrades } from "../../grade/services/studentgradeService";
import { getMyAttendances } from "../../attendance/services/attendanceService";
import { getMyPayements } from "../../Payment/services/paymentService";
import { getMyPrediction } from "../../prediction/services/predictionService";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    dashboard: "Student Dashboard",
    title: "My Student Space",
    subtitle:
      "Overview of your academic performance and student activities.",

    grades: "My Grades",
    gradesDescription:
      "View your academic results and grades.",
    totalGrades: "Total grades",
    average: "Average",

    attendance: "My Attendance",
    attendanceDescription:
      "View your attendance and absences.",
    present: "Present",
    absent: "Absent",
    totalAttendance: "Total attendance",

    payments: "My Payments",
    paymentsDescription:
      "View your payment history.",
    totalPayments: "Total payments",

    prediction: "My Prediction",
    predictionDescription:
      "AI analysis of your academic performance.",
    riskScore: "Risk score",
    riskLevel: "Risk level",
    lowRisk: "Low risk",
    moderateRisk: "Moderate risk",
    highRisk: "High risk",

    academicSummary: "Academic Summary",
    academicSummaryDescription:
      "A quick overview of your current academic situation.",

    recommendation: "AI Recommendation",
    noRecommendation:
      "No recommendation available.",

    goodPerformance: "Good performance",
    attentionRequired: "Attention recommended",
    urgentFollowUp:
      "Urgent follow-up recommended",

    loading: "Loading dashboard...",
    error: "Unable to load dashboard data.",
    noData: "No data",

    student: "Student",
    currentStatus: "Current status",
    excellent: "Excellent",
    good: "Good",
    needsAttention: "Needs attention",
  },

  FR: {
    dashboard: "Tableau de bord étudiant",
    title: "Mon espace étudiant",
    subtitle:
      "Vue d'ensemble de vos performances académiques et de vos activités.",

    grades: "Mes notes",
    gradesDescription:
      "Consulter vos résultats et vos notes académiques.",
    totalGrades: "Total des notes",
    average: "Moyenne",

    attendance: "Mes présences",
    attendanceDescription:
      "Consulter vos présences et vos absences.",
    present: "Présences",
    absent: "Absences",
    totalAttendance: "Total présences",

    payments: "Mes paiements",
    paymentsDescription:
      "Consulter votre historique de paiements.",
    totalPayments: "Total paiements",

    prediction: "Ma prédiction",
    predictionDescription:
      "Analyse IA de votre performance académique.",
    riskScore: "Score de risque",
    riskLevel: "Niveau de risque",
    lowRisk: "Risque faible",
    moderateRisk: "Risque modéré",
    highRisk: "Risque élevé",

    academicSummary: "Résumé académique",
    academicSummaryDescription:
      "Vue rapide de votre situation académique actuelle.",

    recommendation: "Recommandation IA",
    noRecommendation:
      "Aucune recommandation disponible.",

    goodPerformance: "Bonne performance",
    attentionRequired:
      "Attention recommandée",
    urgentFollowUp:
      "Suivi urgent recommandé",

    loading: "Chargement du tableau de bord...",
    error:
      "Impossible de charger les données du tableau de bord.",
    noData: "Aucune donnée",

    student: "Étudiant",
    currentStatus: "Statut actuel",
    excellent: "Excellent",
    good: "Bon",
    needsAttention: "Attention requise",
  },

  AR: {
    dashboard: "لوحة تحكم الطالب",
    title: "مساحتي الطلابية",
    subtitle:
      "نظرة عامة على أدائك الأكاديمي وأنشطتك الطلابية.",

    grades: "نقاطي",
    gradesDescription:
      "عرض نتائجك ونقاطك الدراسية.",
    totalGrades: "إجمالي النقاط",
    average: "المعدل",

    attendance: "حضوري",
    attendanceDescription:
      "عرض الحضور والغيابات.",
    present: "الحضور",
    absent: "الغيابات",
    totalAttendance: "إجمالي الحضور",

    payments: "مدفوعاتي",
    paymentsDescription:
      "عرض سجل المدفوعات.",
    totalPayments: "إجمالي المدفوعات",

    prediction: "توقعي",
    predictionDescription:
      "تحليل الذكاء الاصطناعي لأدائك الأكاديمي.",
    riskScore: "درجة المخاطر",
    riskLevel: "مستوى المخاطر",
    lowRisk: "مخاطر منخفضة",
    moderateRisk: "مخاطر متوسطة",
    highRisk: "مخاطر مرتفعة",

    academicSummary: "الملخص الأكاديمي",
    academicSummaryDescription:
      "نظرة سريعة على وضعك الأكاديمي الحالي.",

    recommendation: "توصية الذكاء الاصطناعي",
    noRecommendation:
      "لا توجد توصية متاحة.",

    goodPerformance: "أداء جيد",
    attentionRequired:
      "يوصى بالانتباه",
    urgentFollowUp:
      "يوصى بمتابعة عاجلة",

    loading: "جاري تحميل لوحة التحكم...",
    error: "تعذر تحميل بيانات لوحة التحكم.",
    noData: "لا توجد بيانات",

    student: "الطالب",
    currentStatus: "الحالة الحالية",
    excellent: "ممتاز",
    good: "جيد",
    needsAttention: "يحتاج إلى الانتباه",
  },
};

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data?.content)) {
    return data.data.content;
  }

  return [];
};

const getGradeValue = (grade) =>
  Number(
    grade?.note ??
      grade?.grade ??
      grade?.value ??
      0,
  );

const getAttendanceStatus = (attendance) => {
  const value = String(
    attendance?.status ??
      attendance?.etat ??
      attendance?.presence ??
      "",
  ).toLowerCase();

  if (
    value.includes("abs") ||
    value.includes("absent")
  ) {
    return "absent";
  }

  if (
    value.includes("present") ||
    value.includes("présent") ||
    value === "p"
  ) {
    return "present";
  }

  if (
    attendance?.present === true ||
    attendance?.isPresent === true
  ) {
    return "present";
  }

  if (
    attendance?.present === false ||
    attendance?.isPresent === false
  ) {
    return "absent";
  }

  return null;
};

const getPaymentAmount = (payment) =>
  Number(
    payment?.amount ??
      payment?.montant ??
      payment?.amountPaid ??
      payment?.montantPaye ??
      0,
  );

export default function StudentDashboard() {
  const [grades, setGrades] = useState([]);
  const [attendances, setAttendances] =
    useState([]);
  const [payments, setPayments] = useState([]);
  const [prediction, setPrediction] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language",
      ) || "FR",
    );

  const t =
    translations[language] ||
    translations.FR;

  const isArabic =
    language === "AR";

  const cardStyle = {
    backgroundColor:
      "var(--card-bg)",
    borderColor:
      "var(--border-color)",
    color:
      "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor:
      "var(--section-bg)",
    borderColor:
      "var(--border-color)",
  };

  const mutedTextStyle = {
    color:
      "var(--muted-text)",
  };

  useEffect(() => {
    const handleLanguageChange = (
      event,
    ) => {
      setLanguage(
        event.detail ||
          localStorage.getItem(
            "app-language",
          ) ||
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
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const results =
            await Promise.allSettled([
              getMyGrades(),
              getMyAttendances(),
              getMyPayements(),
              getMyPrediction(),
            ]);

          const [
            gradesResult,
            attendanceResult,
            paymentsResult,
            predictionResult,
          ] = results;

          if (
            gradesResult.status ===
            "fulfilled"
          ) {
            setGrades(
              normalizeArray(
                gradesResult.value,
              ),
            );
          }

          if (
            attendanceResult.status ===
            "fulfilled"
          ) {
            setAttendances(
              normalizeArray(
                attendanceResult.value,
              ),
            );
          }

          if (
            paymentsResult.status ===
            "fulfilled"
          ) {
            setPayments(
              normalizeArray(
                paymentsResult.value,
              ),
            );
          }

          if (
            predictionResult.status ===
            "fulfilled"
          ) {
            const data =
              predictionResult.value;

            if (
              data &&
              data.hasPrediction !==
                false &&
              data.id !== null
            ) {
              setPrediction(data);
            } else {
              setPrediction(null);
            }
          }

          const allFailed =
            results.every(
              (result) =>
                result.status ===
                "rejected",
            );

          if (allFailed) {
            setError(t.error);
          }
        } catch (requestError) {
          console.error(
            "Erreur dashboard :",
            requestError,
          );

          setError(t.error);
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  const validGrades =
    grades.filter(
      (grade) =>
        !Number.isNaN(
          getGradeValue(grade),
        ),
    );

  const average =
    validGrades.length > 0
      ? validGrades.reduce(
          (sum, grade) =>
            sum +
            getGradeValue(grade),
          0,
        ) / validGrades.length
      : 0;

  const roundedAverage =
    Math.round(average * 100) / 100;

  const presentCount =
    attendances.filter(
      (attendance) =>
        getAttendanceStatus(
          attendance,
        ) === "present",
    ).length;

  const absentCount =
    attendances.filter(
      (attendance) =>
        getAttendanceStatus(
          attendance,
        ) === "absent",
    ).length;

  const totalPaymentAmount =
    payments.reduce(
      (sum, payment) =>
        sum +
        getPaymentAmount(payment),
      0,
    );

  const riskScore = Number(
    prediction?.scoreRisque ?? 0,
  );

  const getRiskLabel = () => {
    if (
      prediction?.status ===
      "HIGH"
    ) {
      return t.highRisk;
    }

    if (
      prediction?.status ===
      "MODERATE"
    ) {
      return t.moderateRisk;
    }

    return t.lowRisk;
  };

  const getRiskBadge = () => {
    if (
      prediction?.status ===
      "HIGH"
    ) {
      return "border-red-200 bg-red-50 text-red-600";
    }

    if (
      prediction?.status ===
      "MODERATE"
    ) {
      return "border-amber-200 bg-amber-50 text-amber-600";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  };

  const getAcademicStatus =
    () => {
      if (roundedAverage >= 14) {
        return t.excellent;
      }

      if (roundedAverage >= 10) {
        return t.good;
      }

      return t.needsAttention;
    };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        dir={
          isArabic
            ? "rtl"
            : "ltr"
        }
        style={{
          color:
            "var(--text-color)",
        }}
      >
        <div className="flex items-center gap-2 font-bold">
          <Loader2
            size={21}
            className="animate-spin"
          />

          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1"
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      style={{
        color:
          "var(--text-color)",
      }}
    >
      
       

      {/* ERROR */}

      {error && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            font-bold
            text-red-600
          "
        >
          <AlertTriangle
            size={18}
          />

          {error}
        </div>
      )}

      {/* MAIN STATISTICS */}

      <section
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <DashboardCard
          icon={
            <BookOpen size={21} />
          }
          title={t.grades}
          description={
            t.gradesDescription
          }
          value={
            grades.length
          }
          label={
            t.totalGrades
          }
          cardStyle={
            cardStyle
          }
          mutedTextStyle={
            mutedTextStyle
          }
          iconBackground="bg-blue-100 text-blue-600"
        />

        <DashboardCard
          icon={
            <CalendarCheck
              size={21}
            />
          }
          title={t.attendance}
          description={
            t.attendanceDescription
          }
          value={
            presentCount
          }
          label={
            t.present
          }
          cardStyle={
            cardStyle
          }
          mutedTextStyle={
            mutedTextStyle
          }
          iconBackground="bg-emerald-100 text-emerald-600"
          extra={
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-500">
              <XCircle
                size={14}
              />
              {absentCount}{" "}
              {t.absent}
            </div>
          }
        />

        <DashboardCard
          icon={
            <WalletCards
              size={21}
            />
          }
          title={t.payments}
          description={
            t.paymentsDescription
          }
          value={
            payments.length
          }
          label={
            t.totalPayments
          }
          cardStyle={
            cardStyle
          }
          mutedTextStyle={
            mutedTextStyle
          }
          iconBackground="bg-orange-100 text-orange-600"
          extra={
            totalPaymentAmount >
            0 ? (
              <div
                className="mt-3 text-xs font-bold"
                style={
                  mutedTextStyle
                }
              >
                {totalPaymentAmount.toFixed(
                  2,
                )}
              </div>
            ) : null
          }
        />

        <DashboardCard
          icon={
            <BrainCircuit
              size={21}
            />
          }
          title={t.prediction}
          description={
            t.predictionDescription
          }
          value={
            prediction
              ? Math.round(
                  riskScore,
                )
              : "-"
          }
          label={
            prediction
              ? t.riskScore
              : t.noData
          }
          suffix={
            prediction
              ? "/100"
              : ""
          }
          cardStyle={
            cardStyle
          }
          mutedTextStyle={
            mutedTextStyle
          }
          iconBackground="bg-violet-100 text-violet-600"
        />
      </section>

      {/* ACADEMIC SUMMARY */}

      <section
        className="
          rounded-[1.7rem]
          border
          p-6
          shadow-sm
        "
        style={cardStyle}
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              text-white
            "
            style={{
              background:
                headerGradient,
            }}
          >
            <TrendingUp
              size={20}
            />
          </div>

          <div>
            <h2 className="text-lg font-black">
              {t.academicSummary}
            </h2>

            <p
              className="text-xs font-semibold"
              style={
                mutedTextStyle
              }
            >
              {
                t.academicSummaryDescription
              }
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryItem
            icon={
              <GraduationCap
                size={19}
              />
            }
            label={t.average}
            value={
              roundedAverage > 0
                ? `${roundedAverage}/20`
                : "-"
            }
            cardStyle={
              sectionStyle
            }
            mutedTextStyle={
              mutedTextStyle
            }
          />

          <SummaryItem
            icon={
              <CheckCircle2
                size={19}
              />
            }
            label={t.present}
            value={
              presentCount
            }
            cardStyle={
              sectionStyle
            }
            mutedTextStyle={
              mutedTextStyle
            }
          />

          <SummaryItem
            icon={
              <Activity
                size={19}
              />
            }
            label={t.riskLevel}
            value={
              prediction
                ? getRiskLabel()
                : "-"
            }
            cardStyle={
              sectionStyle
            }
            mutedTextStyle={
              mutedTextStyle
            }
          />
        </div>
      </section>

      {/* PREDICTION */}

      {prediction && (
        <section
          className="
            rounded-[1.7rem]
            border
            p-6
            shadow-sm
          "
          style={cardStyle}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-100
                  text-violet-600
                "
              >
                <BrainCircuit
                  size={23}
                />
              </div>

              <div>
                <h2 className="text-lg font-black">
                  {t.prediction}
                </h2>

                <p
                  className="mt-1 text-xs font-semibold"
                  style={
                    mutedTextStyle
                  }
                >
                  {
                    t.predictionDescription
                  }
                </p>

                <span
                  className={`
                    mt-4
                    inline-flex
                    rounded-full
                    border
                    px-4
                    py-2
                    text-xs
                    font-black
                    ${getRiskBadge()}
                  `}
                >
                  {getRiskLabel()}
                </span>
              </div>
            </div>

            <div
              className="
                flex
                h-28
                w-28
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-full
                border-8
                border-violet-100
                bg-violet-50
                text-violet-700
              "
            >
              <span className="text-3xl font-black">
                {Math.round(
                  riskScore,
                )}
              </span>

              <span className="text-xs font-bold">
                /100
              </span>
            </div>
          </div>

          <div
            className="
              mt-5
              rounded-2xl
              border
              p-5
            "
            style={
              sectionStyle
            }
          >
            <p
              className="text-xs font-black"
              style={
                mutedTextStyle
              }
            >
              {t.recommendation}
            </p>

            <p
              className="mt-2 text-sm font-semibold leading-7"
              style={
                mutedTextStyle
              }
            >
              {prediction.recommandation ||
                t.noRecommendation}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  value,
  label,
  suffix,
  extra,
  cardStyle,
  mutedTextStyle,
  iconBackground,
}) {
  return (
    <section
      className="
        rounded-[1.5rem]
        border
        p-5
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-md
      "
      style={cardStyle}
    >
      <div
        className={`
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          ${iconBackground}
        `}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black">
        {title}
      </h3>

      <p
        className="mt-1 min-h-[40px] text-xs font-semibold leading-5"
        style={
          mutedTextStyle
        }
      >
        {description}
      </p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-2xl font-black">
          {value}
        </span>

        {suffix && (
          <span
            className="text-xs font-bold"
            style={
              mutedTextStyle
            }
          >
            {suffix}
          </span>
        )}
      </div>

      <p
        className="mt-1 text-xs font-bold"
        style={
          mutedTextStyle
        }
      >
        {label}
      </p>

      {extra}
    </section>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  cardStyle,
  mutedTextStyle,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        p-4
      "
      style={cardStyle}
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-teal-100
            text-teal-700
          "
        >
          {icon}
        </div>

        <div>
          <p
            className="text-xs font-semibold"
            style={
              mutedTextStyle
            }
          >
            {label}
          </p>

          <p className="mt-1 text-lg font-black">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}