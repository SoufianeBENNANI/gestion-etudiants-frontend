import { useEffect, useState } from "react";
import {
  GraduationCap,
  Loader2,
  Save,
  X,
} from "lucide-react";

import {
  getAllDepartements,
} from "../../departements/service/departementService";

const translations = {
  EN: {
    management: "Teachers Management",
    title: "Add Teacher",
    subtitle:
      "Create the teacher and generate a Keycloak account",
    lastName: "Last Name",
    lastNamePlaceholder: "Enter last name",
    firstName: "First Name",
    firstNamePlaceholder: "Enter first name",
    email: "Email",
    emailPlaceholder: "teacher@gmail.com",
    speciality: "Speciality",
    specialityPlaceholder: "Example: Mathematics",
    department: "Department",
    departmentPlaceholder: "Select a department",
    loadingDepartments: "Loading departments...",
    departmentsError: "Unable to load departments",
    cancel: "Cancel",
    save: "Create teacher",
    saving: "Creating...",
  },

  FR: {
    management: "Gestion des enseignants",
    title: "Ajouter un enseignant",
    subtitle:
      "Créer l’enseignant et générer son compte Keycloak",
    lastName: "Nom",
    lastNamePlaceholder: "Entrer le nom",
    firstName: "Prénom",
    firstNamePlaceholder: "Entrer le prénom",
    email: "Email",
    emailPlaceholder: "teacher@gmail.com",
    speciality: "Spécialité",
    specialityPlaceholder: "Exemple : Mathématiques",
    department: "Département",
    departmentPlaceholder: "Sélectionner un département",
    loadingDepartments: "Chargement des départements...",
    departmentsError: "Impossible de charger les départements",
    cancel: "Annuler",
    save: "Créer l’enseignant",
    saving: "Création...",
  },

  AR: {
    management: "إدارة الأساتذة",
    title: "إضافة أستاذ",
    subtitle: "إنشاء الأستاذ وحسابه في Keycloak",
    lastName: "الاسم العائلي",
    lastNamePlaceholder: "أدخل الاسم العائلي",
    firstName: "الاسم الشخصي",
    firstNamePlaceholder: "أدخل الاسم الشخصي",
    email: "البريد الإلكتروني",
    emailPlaceholder: "teacher@gmail.com",
    speciality: "التخصص",
    specialityPlaceholder: "مثال: الرياضيات",
    department: "القسم",
    departmentPlaceholder: "اختر القسم",
    loadingDepartments: "جاري تحميل الأقسام...",
    departmentsError: "تعذر تحميل الأقسام",
    cancel: "إلغاء",
    save: "إنشاء الأستاذ",
    saving: "جاري الإنشاء...",
  },
};

export default function AddTeacher({
  open,
  formData,
  saving,
  onClose,
  onChange,
  onSubmit,
}) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departmentsError, setDepartmentsError] = useState("");

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail ||
        localStorage.getItem("app-language") ||
        "EN";

      setLanguage(nextLanguage);
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

    let active = true;

    const loadDepartments = async () => {
      setLoadingDepartments(true);
      setDepartmentsError("");

      try {
        const data = await getAllDepartements();

        if (active) {
          const activeDepartments = Array.isArray(data)
            ? data.filter(
              (department) => department.archived !== true
            )
            : [];

          setDepartments(activeDepartments);
        }
      } catch (error) {
        console.error(
          "Erreur chargement des départements :",
          error.response?.data || error.message
        );

        if (active) {
          setDepartments([]);
          setDepartmentsError(
            translations[language]?.departmentsError ||
            translations.EN.departmentsError
          );
        }
      } finally {
        if (active) {
          setLoadingDepartments(false);
        }
      }
    };

    loadDepartments();

    return () => {
      active = false;
    };
  }, [open, language]);

  if (!open) return null;

  const inputClassName =
    "w-full rounded-2xl border px-4 py-2.5 text-sm " +
    "font-semibold outline-none transition " +
    "focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={() => {
        if (!saving) onClose();
      }}
      dir={isArabic ? "rtl" : "ltr"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-teacher-title"
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <GraduationCap size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  {t.management}
                </p>

                <h2
                  id="add-teacher-title"
                  className="mt-1 text-2xl font-black tracking-tight"
                >
                  {t.title}
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label={t.cancel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label={t.lastName}>
              <input
                type="text"
                name="nom"
                value={formData.nom || ""}
                onChange={onChange}
                required
                disabled={saving}
                autoComplete="family-name"
                placeholder={t.lastNamePlaceholder}
                className={inputClassName}
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </FormField>

            <FormField label={t.firstName}>
              <input
                type="text"
                name="prenom"
                value={formData.prenom || ""}
                onChange={onChange}
                required
                disabled={saving}
                autoComplete="given-name"
                placeholder={t.firstNamePlaceholder}
                className={inputClassName}
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </FormField>
          </div>

          <FormField label={t.email}>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={onChange}
              required
              disabled={saving}
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              className={inputClassName}
              dir="ltr"
              style={{
                backgroundColor: "var(--input-bg)",
                color: "var(--text-color)",
                borderColor: "var(--border-color)",
              }}
            />
          </FormField>

          <FormField label={t.speciality}>
            <input
              type="text"
              name="specialite"
              value={formData.specialite || ""}
              onChange={onChange}
              required
              disabled={saving}
              placeholder={t.specialityPlaceholder}
              className={inputClassName}
              style={{
                backgroundColor: "var(--input-bg)",
                color: "var(--text-color)",
                borderColor: "var(--border-color)",
              }}
            />
          </FormField>

          <FormField label={t.department}>
            <select
              name="departementNom"
              value={formData.departementNom || ""}
              onChange={onChange}
              required
              disabled={saving || loadingDepartments}
              className={inputClassName}
              style={{
                backgroundColor: "var(--input-bg)",
                color: "var(--text-color)",
                borderColor: departmentsError
                  ? "#ef4444"
                  : "var(--border-color)",
              }}
            >
              <option value="">
                {loadingDepartments
                  ? t.loadingDepartments
                  : t.departmentPlaceholder}
              </option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.nom}
                >
                  {department.nom}
                </option>
              ))}
            </select>

            {departmentsError && (
              <p className="mt-2 text-xs font-semibold text-red-500">
                {departmentsError}
              </p>
            )}
          </FormField>

          <div
            className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end"
            style={{ borderColor: "var(--border-color)" }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-black transition hover:opacity-75 disabled:opacity-50"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#081633] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0d1f47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-black"
        style={{ color: "var(--text-color)" }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}