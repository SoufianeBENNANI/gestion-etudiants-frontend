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
    title: "Edit Teacher",
    subtitle: "Update teacher information",
    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    speciality: "Speciality",
    department: "Department",
    selectDepartment: "Select a department",
    loadingDepartments: "Loading departments...",
    departmentsError: "Unable to load departments",
    cancel: "Cancel",
    update: "Update",
    updating: "Updating...",
  },

  FR: {
    management: "Gestion des enseignants",
    title: "Modifier l’enseignant",
    subtitle: "Modifier les informations de l’enseignant",
    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    speciality: "Spécialité",
    department: "Département",
    selectDepartment: "Sélectionner un département",
    loadingDepartments: "Chargement des départements...",
    departmentsError: "Impossible de charger les départements",
    cancel: "Annuler",
    update: "Modifier",
    updating: "Modification...",
  },

  AR: {
    management: "إدارة الأساتذة",
    title: "تعديل الأستاذ",
    subtitle: "تعديل معلومات الأستاذ",
    lastName: "الاسم العائلي",
    firstName: "الاسم الشخصي",
    email: "البريد الإلكتروني",
    speciality: "التخصص",
    department: "القسم",
    selectDepartment: "اختر القسم",
    loadingDepartments: "جاري تحميل الأقسام...",
    departmentsError: "تعذر تحميل الأقسام",
    cancel: "إلغاء",
    update: "تحديث",
    updating: "جاري التحديث...",
  },
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 " +
  "px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none " +
  "transition focus:border-blue-400 focus:bg-white " +
  "focus:ring-4 focus:ring-blue-100 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export default function EditTeacher({
  teacher,
  saving,
  onClose,
  onSubmit,
}) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
    departementNom: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] =
    useState(false);
  const [departmentsError, setDepartmentsError] =
    useState("");

  const t = translations[language] || translations.EN;

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

  // Remplir le formulaire avec l’enseignant sélectionné
  useEffect(() => {
    if (!teacher) return;

    setFormData({
      nom: teacher.nom || "",
      prenom: teacher.prenom || "",
      email: teacher.email || "",
      specialite: teacher.specialite || "",
      departementNom:
        teacher.departementNom ||
        teacher.departement?.nom ||
        "",
    });
  }, [teacher]);

  // Charger la liste des départements
  useEffect(() => {
    if (!teacher) return;

    let active = true;

    const loadDepartments = async () => {
      setLoadingDepartments(true);
      setDepartmentsError("");

      try {
        const data = await getAllDepartements();

        if (!active) return;

        const activeDepartments = Array.isArray(data)
          ? data.filter(
              (department) =>
                department.archived !== true
            )
          : [];

        setDepartments(activeDepartments);
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
  }, [teacher, language]);

  if (!teacher) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      email: formData.email.trim().toLowerCase(),
      specialite: formData.specialite.trim(),
      departementNom:
        formData.departementNom.trim(),
    };

    onSubmit(teacher.id, payload);
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={handleClose}
      dir={language === "AR" ? "rtl" : "ltr"}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <GraduationCap size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              aria-label={t.cancel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.lastName}
              </label>

              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                disabled={saving}
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.firstName}
              </label>

              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                disabled={saving}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.email}
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={saving}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.speciality}
            </label>

            <input
              type="text"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              required
              disabled={saving}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.department}
            </label>

            <select
              name="departementNom"
              value={formData.departementNom}
              onChange={handleChange}
              required
              disabled={
                saving || loadingDepartments
              }
              className={`${inputClassName} ${
                departmentsError
                  ? "border-red-400"
                  : ""
              }`}
            >
              <option value="">
                {loadingDepartments
                  ? t.loadingDepartments
                  : t.selectDepartment}
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
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingDepartments ||
                Boolean(departmentsError) ||
                !formData.departementNom
              }
              className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-[#081633] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0d1f47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {saving ? t.updating : t.update}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}