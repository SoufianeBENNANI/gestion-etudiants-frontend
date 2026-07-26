import {
  useEffect,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  User,
  X,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Attendance",
    title: "Attendance Details",
    subtitle:
      "View selected attendance information.",

    student: "Student",
    date: "Date",
    status: "Status",
    remark: "Remark",

    noRemark: "No remark",
    unavailableStudent:
      "Student unavailable",

    close: "Close",
  },

  FR: {
    management: "Étudiant / Présences",
    title: "Détails de la présence",
    subtitle:
      "Afficher les informations de la présence sélectionnée.",

    student: "Étudiant",
    date: "Date",
    status: "Statut",
    remark: "Remarque",

    noRemark: "Aucune remarque",
    unavailableStudent:
      "Étudiant non disponible",

    close: "Fermer",
  },

  AR: {
    management: "الطالب / الحضور",
    title: "تفاصيل الحضور",
    subtitle:
      "عرض معلومات الحضور المحددة.",

    student: "الطالب",
    date: "التاريخ",
    status: "الحالة",
    remark: "ملاحظة",

    noRemark: "لا توجد ملاحظة",
    unavailableStudent:
      "الطالب غير متوفر",

    close: "إغلاق",
  },
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const cleanDate =
    String(date).split("T")[0];

  const [year, month, day] =
    cleanDate.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${String(
    year
  ).slice(-2)}`;
};

const getStudentName = (
  attendance
) => {
  return (
    `${
      attendance?.studentPrenom ||
      ""
    } ${
      attendance?.studentNom ||
      ""
    }`.trim() ||
    attendance?.studentName ||
    attendance?.studentFullName ||
    `${
      attendance?.student?.prenom ||
      ""
    } ${
      attendance?.student?.nom ||
      ""
    }`.trim()
  );
};

export default function DetailsAttendance({
  open,
  attendance,
  onClose,
}) {
  const language =
    localStorage.getItem(
      "app-language"
    ) || "EN";

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  if (!open || !attendance) {
    return null;
  }

  const studentName =
    getStudentName(attendance) ||
    t.unavailableStudent;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        h-[100dvh]
        w-screen
        items-center
        justify-center
        overflow-y-auto
        bg-slate-950/60
        p-4
        backdrop-blur-sm
      "
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      onClick={onClose}
    >
      <div
        className="
          my-auto
          w-full
          max-w-3xl
          overflow-hidden
          rounded-[2rem]
          border
          shadow-2xl
        "
        style={{
          backgroundColor:
            "var(--card-bg)",

          borderColor:
            "var(--border-color)",

          color:
            "var(--text-color)",
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}

        <div
          className="
            relative
            overflow-hidden
            px-7
            py-7
            text-white
          "
          style={{
            background:
              headerGradient,
          }}
        >
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10" />

          <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-white/5" />

          <div
            className={`
              relative
              flex
              items-center
              justify-between
              gap-5

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
                  bg-white/10
                  text-teal-100
                  ring-1
                  ring-white/20
                "
              >
                <Eye size={27} />
              </div>

              <div>
                <p className="text-xs font-bold text-teal-100">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {t.title}
                </h2>

                <p className="mt-1 text-xs font-semibold text-teal-100/80">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-white/10
                text-white
                ring-1
                ring-white/15
                transition

                hover:bg-white/20
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="grid gap-4 p-6 md:grid-cols-3">
          <DetailItem
            icon={User}
            label={t.student}
            value={studentName}
          />

          <DetailItem
            icon={CalendarDays}
            label={t.date}
            value={formatDate(
              attendance.date
            )}
          />

          <DetailItem
            icon={CheckCircle2}
            label={t.status}
            value={
              attendance.status ||
              "-"
            }
          />

          <div className="md:col-span-3">
            <DetailItem
              icon={FileText}
              label={t.remark}
              value={
                attendance.remarque ||
                attendance.remark ||
                t.noRemark
              }
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        p-5
        transition
        duration-200

        hover:-translate-y-0.5
        hover:shadow-md
      "
      style={{
        backgroundColor:
          "var(--section-bg)",

        borderColor:
          "var(--border-color)",
      }}
    >
      <div
        className="
          mb-4
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
        <Icon size={19} />
      </div>

      <p
        className="text-xs font-black"
        style={{
          color:
            "var(--muted-text)",
        }}
      >
        {label}
      </p>

      <p
        className="
          mt-2
          break-words
          text-sm
          font-black
        "
        style={{
          color:
            "var(--text-color)",
        }}
      >
        {value}
      </p>
    </div>
  );
}