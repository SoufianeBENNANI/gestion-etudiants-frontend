import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
} from "lucide-react";

import { createPortal } from "react-dom";

const headerGradient =
  "linear-gradient(135deg, #c2410c 0%, #9a3412 45%, #431407 100%)";

const translations = {
  EN: {
    management:
      "Student Management",

    title:
      "Student Details",

    subtitle:
      "View selected student information.",

    student:
      "Student",

    email:
      "Email",

    gender:
      "Gender",

    phone:
      "Phone",

    address:
      "Address",

    close:
      "Close",
  },

  FR: {
    management:
      "Gestion des étudiants",

    title:
      "Détails de l'étudiant",

    subtitle:
      "Afficher les informations de l'étudiant sélectionné.",

    student:
      "Étudiant",

    email:
      "Email",

    gender:
      "Genre",

    phone:
      "Téléphone",

    address:
      "Adresse",

    close:
      "Fermer",
  },

  AR: {
    management:
      "إدارة الطلاب",

    title:
      "تفاصيل الطالب",

    subtitle:
      "عرض معلومات الطالب المحدد.",

    student:
      "الطالب",

    email:
      "البريد الإلكتروني",

    gender:
      "الجنس",

    phone:
      "الهاتف",

    address:
      "العنوان",

    close:
      "إغلاق",
  },
};

export default function StudentDetails({
  student,
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

  /* LANGUAGE */

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

  /* BLOCK SCROLL */

  useEffect(() => {
    if (!student) return;

    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        oldOverflow;
    };
  }, [student]);

  if (!student) {
    return null;
  }

  const fullName =
    `${student.nom || ""} ${
      student.prenom || ""
    }`.trim() || "-";

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
      onClick={
        onClose
      }
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <div
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
        className="
          my-auto
          w-full
          max-w-3xl
          overflow-hidden
          rounded-[2rem]
          shadow-2xl
        "
        style={{
          backgroundColor:
            "var(--card-bg)",

          color:
            "var(--text-color)",
        }}
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
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/5" />

          <div className="absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-white/5" />

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
                  text-orange-200
                  ring-1
                  ring-white/15
                "
              >
                <Eye
                  size={28}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-orange-200">
                  {
                    t.management
                  }
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {
                    t.title
                  }
                </h2>

                <p className="mt-2 text-xs text-orange-100/80">
                  {
                    t.subtitle
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              title={
                t.close
              }
              className="
                inline-flex
                h-11
                w-11
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
              <X
                size={18}
              />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            p-6

            md:grid-cols-2
          "
        >
          <DetailItem
            icon={User}
            label={
              t.student
            }
            value={
              fullName
            }
          />

          <DetailItem
            icon={Mail}
            label={
              t.email
            }
            value={
              student.email ||
              "-"
            }
          />

          <DetailItem
            icon={Users}
            label={
              t.gender
            }
            value={
              student.genre ||
              "-"
            }
          />

          <DetailItem
            icon={Phone}
            label={
              t.phone
            }
            value={
              student.telephone ||
              "-"
            }
          />

          <div className="md:col-span-2">
            <DetailItem
              icon={
                MapPin
              }
              label={
                t.address
              }
              value={
                student.adresse ||
                "-"
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
        flex
        items-center
        gap-4
        rounded-2xl
        border
        p-5
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
          flex
          h-11
          w-11
          shrink-0
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
        <Icon
          size={19}
        />
      </div>

      <div className="min-w-0">
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
            mt-1
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
    </div>
  );
}