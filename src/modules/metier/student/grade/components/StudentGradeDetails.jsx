import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  Award,
  BookOpen,
  CalendarRange,
  GraduationCap,
  User,
  X,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Grades",
    title: "Grade Details",
    subtitle: "View selected grade information.",

    student: "Student",
    subject: "Course",
    grade: "Note",
    semester: "Semester",
    close: "Close",

    unavailable: "Unavailable",
  },

  FR: {
    management: "Étudiant / Notes",
    title: "Détails de la note",
    subtitle: "Afficher les informations de la note sélectionnée.",

    student: "Étudiant",
    subject: "Cours",
    grade: "Note",
    semester: "Semestre",
    close: "Fermer",

    unavailable: "Non disponible",
  },

  AR: {
    management: "الطالب / النقاط",
    title: "تفاصيل النقطة",
    subtitle: "عرض معلومات النقطة المحددة.",

    student: "الطالب",
    subject: "المادة",
    grade: "النقطة",
    semester: "الفصل",
    close: "إغلاق",

    unavailable: "غير متوفر",
  },
};

const getStudentName = (grade) => {
  return (
    `${grade?.studentPrenom || ""} ${
      grade?.studentNom || ""
    }`.trim() ||
    grade?.studentName ||
    grade?.studentFullName ||
    `${grade?.student?.prenom || ""} ${
      grade?.student?.nom || ""
    }`.trim()
  );
};

const getSubjectName = (grade) => {
  return (
    grade?.subjectName ||
    grade?.matiereNom ||
    grade?.matiere ||
    grade?.subject?.name ||
    grade?.subject?.nom ||
    grade?.courseName ||
    grade?.course?.name ||
    "-"
  );
};

const getGradeValue = (grade) => {
  return (
    grade?.grade ??
    grade?.note ??
    grade?.value ??
    "-"
  );
};

const getSemester = (grade) => {
  return (
    grade?.semester ||
    grade?.semestre ||
    grade?.semesterName ||
    grade?.semestreNom ||
    "-"
  );
};

export default function StudentGradeDetails({
  open,
  grade,
  onClose,
}) {
  const [language, setLanguage] =
    useState(
      localStorage.getItem(
        "app-language"
      ) || "EN"
    );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  useEffect(() => {
    const handleLanguageChange = (
      event
    ) => {
      setLanguage(
        event.detail ||
          localStorage.getItem(
            "app-language"
          ) ||
          "EN"
      );
    };

    window.addEventListener(
      "app-language-change",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "app-language-change",
        handleLanguageChange
      );
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [open]);

  if (!open || !grade) {
    return null;
  }

  const studentName =
    getStudentName(grade) ||
    t.unavailable;

  const subjectName =
    getSubjectName(grade);

  const gradeValue =
    getGradeValue(grade);

  const semester =
    getSemester(grade);

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
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                  ring-1
                  ring-white/20
                "
              >
                <GraduationCap
                  size={28}
                />
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
                items-center
                justify-center
                rounded-2xl
                bg-white/10
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

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <DetailItem
            icon={User}
            label={t.student}
            value={studentName}
          />

          <DetailItem
            icon={BookOpen}
            label={t.subject}
            value={subjectName}
          />

          <DetailItem
            icon={Award}
            label={t.grade}
            value={gradeValue}
          />

          <DetailItem
            icon={CalendarRange}
            label={t.semester}
            value={semester}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

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
        className="mt-2 break-words text-sm font-black"
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