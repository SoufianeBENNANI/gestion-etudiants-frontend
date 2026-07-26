import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  UserRound,
  Mail,
  Building2,
  BookOpen,
  BadgeCheck,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    management: "Teachers Management",
    title: "Teacher Details",
    subtitle: "View selected teacher information.",

    teacher: "Teacher",
    email: "Email",
    department: "Department",
    speciality: "Speciality",

    unavailable: "Unavailable",
    close: "Close",
  },

  FR: {
    management: "Gestion des enseignants",
    title: "Détails de l’enseignant",
    subtitle:
      "Afficher les informations de l’enseignant sélectionné.",

    teacher: "Enseignant",
    email: "Email",
    department: "Département",
    speciality: "Spécialité",

    unavailable: "Non disponible",
    close: "Fermer",
  },

  AR: {
    management: "إدارة الأساتذة",
    title: "تفاصيل الأستاذ",
    subtitle: "عرض معلومات الأستاذ المحدد.",

    teacher: "الأستاذ",
    email: "البريد الإلكتروني",
    department: "القسم",
    speciality: "التخصص",

    unavailable: "غير متوفر",
    close: "إغلاق",
  },
};

export default function TeacherDetails({
  teacher,
  onClose,
}) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t =
    translations[language] ||
    translations.EN;

  const isArabic =
    language === "AR";

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(
        event.detail ||
          localStorage.getItem("app-language") ||
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
    if (!teacher) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [teacher]);

  if (!teacher) {
    return null;
  }

  const fullName =
    `${teacher.nom || ""} ${
      teacher.prenom || ""
    }`.trim() ||
    t.unavailable;

  const department =
    teacher.departementNom ||
    teacher.departmentName ||
    teacher.department?.nom ||
    t.unavailable;

  const speciality =
    teacher.specialite ||
    teacher.speciality ||
    t.unavailable;

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
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="
          my-auto
          w-full
          max-w-4xl
          overflow-hidden
          rounded-[2rem]
          border
          shadow-2xl
          transition-colors
          duration-300
        "
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
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
            background: headerGradient,
          }}
        >
          <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10 blur-sm" />

          <div className="absolute -bottom-24 left-[28%] h-44 w-44 rounded-full bg-white/5" />

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
                gap-5

                ${
                  isArabic
                    ? "flex-row-reverse text-right"
                    : "text-left"
                }
              `}
            >
              <div
                className="
                  relative
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-[1.6rem]
                  bg-white/15
                  text-white
                  ring-1
                  ring-white/20
                  shadow-lg
                "
              >
                <UserRound size={38} />

                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-orange-700 shadow-md">
                  <BadgeCheck size={15} />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-orange-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  {fullName}
                </h2>

                <p className="mt-2 text-sm font-semibold text-orange-100/85">
                  {t.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="
                inline-flex
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
                hover:scale-105
                hover:bg-white/20
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-6">
          <p
            className={`
              mb-5
              text-sm
              font-semibold

              ${
                isArabic
                  ? "text-right"
                  : "text-left"
              }
            `}
            style={{
              color: "var(--muted-text)",
            }}
          >
            {t.subtitle}
          </p>

          {/* MAIN TEACHER CARD */}

          <div
            className="
              mb-5
              flex
              flex-col
              gap-4
              rounded-[1.5rem]
              border
              p-5

              md:flex-row
              md:items-center
              md:justify-between
            "
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
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
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  text-white
                "
                style={{
                  background: headerGradient,
                }}
              >
                <UserRound size={21} />
              </div>

              <div>
                <p
                  className="text-xs font-black"
                  style={{
                    color: "var(--muted-text)",
                  }}
                >
                  {t.teacher}
                </p>

                <p
                  className="mt-1 text-base font-black"
                  style={{
                    color: "var(--text-color)",
                  }}
                >
                  {fullName}
                </p>
              </div>
            </div>

            <div
              className={`
                ${
                  isArabic
                    ? "text-left"
                    : "text-right"
                }
              `}
            >
              <p
                className="text-xs font-black"
                style={{
                  color: "var(--muted-text)",
                }}
              >
                {t.department}
              </p>

              <p
                className="mt-1 text-base font-black"
                style={{
                  color: "#c2410c",
                }}
              >
                {department}
              </p>
            </div>
          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoBox
              icon={Mail}
              label={t.email}
              value={
                teacher.email ||
                t.unavailable
              }
            />

            <InfoBox
              icon={Building2}
              label={t.department}
              value={department}
            />

            <InfoBox
              icon={BookOpen}
              label={t.speciality}
              value={speciality}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        group
        rounded-[1.4rem]
        border
        p-5
        transition
        duration-200

        hover:-translate-y-1
        hover:shadow-lg
      "
      style={{
        backgroundColor: "var(--section-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            text-white
            shadow-sm
            transition
            group-hover:scale-105
          "
          style={{
            background: headerGradient,
          }}
        >
          <Icon size={20} />
        </div>

        <p
          className="text-xs font-black"
          style={{
            color: "var(--muted-text)",
          }}
        >
          {label}
        </p>
      </div>

      <p
        className="
          break-words
          text-sm
          font-black
        "
        style={{
          color: "var(--text-color)",
        }}
      >
        {value}
      </p>
    </div>
  );
}