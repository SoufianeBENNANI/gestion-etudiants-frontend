import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  Building2,
  FileText,
  Activity,
  X,
} from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #134e4a 100%)";

const translations = {
  EN: {
    management: "Student / Departments",
    title: "Department Details",
    subtitle:
      "View selected department information.",

    name: "Department",
    description: "Description",
    status: "Status",

    active: "Active",
    archived: "Archived",

    close: "Close",
    unavailable: "Unavailable",
  },

  FR: {
    management: "Étudiant / Départements",
    title: "Détails du département",
    subtitle:
      "Afficher les informations du département sélectionné.",

    name: "Département",
    description: "Description",
    status: "Statut",

    active: "Actif",
    archived: "Archivé",

    close: "Fermer",
    unavailable: "Non disponible",
  },

  AR: {
    management: "الطالب / الأقسام",
    title: "تفاصيل القسم",
    subtitle:
      "عرض معلومات القسم المحدد.",

    name: "القسم",
    description: "الوصف",
    status: "الحالة",

    active: "نشط",
    archived: "مؤرشف",

    close: "إغلاق",
    unavailable: "غير متوفر",
  },
};

const getDepartmentName = (department) => {
  return (
    department?.nom ||
    department?.name ||
    department?.departmentName ||
    department?.departementNom ||
    "-"
  );
};

const getDepartmentDescription = (department) => {
  return (
    department?.description ||
    department?.details ||
    department?.descriptionDepartement ||
    "-"
  );
};

export default function DepartmentDetails({
  open,
  department,
  onClose,
}) {
  const [
    language,
    setLanguage,
  ] = useState(
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
    if (!open) {
      return;
    }

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, [open]);

  if (
    !open ||
    !department
  ) {
    return null;
  }

  const departmentName =
    getDepartmentName(
      department
    );

  const description =
    getDepartmentDescription(
      department
    );

  const status =
    department.archived
      ? t.archived
      : t.active;

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
          <div
            className="
              absolute
              -right-16
              -top-16
              h-44
              w-44
              rounded-full
              bg-white/10
            "
          />

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
                <Building2
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

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <DetailItem
            icon={Building2}
            label={t.name}
            value={
              departmentName ||
              t.unavailable
            }
          />

          <DetailItem
            icon={Activity}
            label={t.status}
            value={status}
            status
            archived={
              department.archived
            }
          />

          <div className="md:col-span-2">
            <DetailItem
              icon={FileText}
              label={t.description}
              value={
                description ||
                t.unavailable
              }
            />
          </div>
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
  status = false,
  archived = false,
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

      {status ? (
        <span
          className="
            mt-2
            inline-flex
            rounded-full
            px-3
            py-1.5
            text-xs
            font-black
          "
          style={{
            backgroundColor:
              "var(--section-bg)",

            color:
              archived
                ? "#dc2626"
                : "var(--primary-color)",
          }}
        >
          {value}
        </span>
      ) : (
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
      )}
    </div>
  );
}