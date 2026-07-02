import { useEffect, useState } from "react";
import { X, Eye, Building2, FileText, CheckCircle } from "lucide-react";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "Departments Management",
    title: "Department Details",
    subtitle: "View selected department information.",
    department: "Department",
    description: "Description",
    status: "Status",
    active: "Active",
    archived: "Archived",
    noDescription: "No description",
    close: "Close",
  },
  FR: {
    management: "Gestion des départements",
    title: "Détails du département",
    subtitle: "Afficher les informations du département sélectionné.",
    department: "Département",
    description: "Description",
    status: "Statut",
    active: "Actif",
    archived: "Archivé",
    noDescription: "Aucune description",
    close: "Fermer",
  },
  AR: {
    management: "إدارة الأقسام",
    title: "تفاصيل القسم",
    subtitle: "عرض معلومات القسم المحدد.",
    department: "القسم",
    description: "الوصف",
    status: "الحالة",
    active: "نشط",
    archived: "مؤرشف",
    noDescription: "لا يوجد وصف",
    close: "إغلاق",
  },
};

export default function DepartmentDetails({ department, onClose }) {
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

  if (!department) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[2rem] border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-7 py-7 text-white"
          style={{ background: headerGradient }}
        >
          <div
            className={`relative flex items-center justify-between gap-5 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                <Eye size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-purple-200">
                  {t.management}
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>
                <p className="mt-2 text-xs text-purple-100">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <DetailCard
              icon={Building2}
              label={t.department}
              value={department.nom || "-"}
            />

            <DetailCard
              icon={CheckCircle}
              label={t.status}
              value={department.archived ? t.archived : t.active}
            />

            <div
              className="md:col-span-2 rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <FileText size={18} style={{ color: "var(--primary-color)" }} />
                <span
                  className="text-xs font-black"
                  style={{ color: "var(--muted-text)" }}
                >
                  {t.description}
                </span>
              </div>

              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {department.description || t.noDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--section-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white"
        style={{ background: headerGradient }}
      >
        <Icon size={20} />
      </div>

      <p className="text-xs font-black" style={{ color: "var(--muted-text)" }}>
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-black" style={{ color: "var(--text-color)" }}>
        {value}
      </p>
    </div>
  );
}