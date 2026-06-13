import { useEffect, useState } from "react";
import { X, GraduationCap, Loader2, Save } from "lucide-react";

const translations = {
  EN: {
    management: "Teachers Management",
    title: "Edit Teacher",
    subtitle: "Update teacher information",

    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    speciality: "Speciality",
    departmentId: "Department ID",

    update: "Update",
  },

  FR: {
    management: "Gestion des enseignants",
    title: "Modifier l’enseignant",
    subtitle: "Modifier les informations de l’enseignant",

    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    speciality: "Spécialité",
    departmentId: "ID du département",

    update: "Modifier",
  },

  AR: {
    management: "إدارة الأساتذة",
    title: "تعديل الأستاذ",
    subtitle: "تعديل معلومات الأستاذ",

    lastName: "الاسم العائلي",
    firstName: "الاسم الشخصي",
    email: "البريد الإلكتروني",
    speciality: "التخصص",
    departmentId: "معرف القسم",

    update: "تحديث",
  },
};

export default function EditTeacher({ teacher, saving, onClose, onSubmit }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
    departementId: "",
  });

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail || localStorage.getItem("app-language") || "EN";

      setLanguage(nextLanguage);
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (teacher) {
      setFormData({
        nom: teacher.nom || "",
        prenom: teacher.prenom || "",
        email: teacher.email || "",
        specialite: teacher.specialite || "",
        departementId: teacher.departement?.id || teacher.departementId || "",
      });
    }
  }, [teacher]);

  if (!teacher) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(teacher.id, formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER LIKE EDIT DEPARTMENT */}
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

                <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.lastName}
              </label>

              <input
                type="text"
                name="nom"
                value={formData.nom || ""}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.firstName}
              </label>

              <input
                type="text"
                name="prenom"
                value={formData.prenom || ""}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
              value={formData.email || ""}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.speciality}
            </label>

            <input
              type="text"
              name="specialite"
              value={formData.specialite || ""}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              {t.departmentId}
            </label>

            <input
              type="number"
              name="departementId"
              value={formData.departementId || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-[#081633] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0d1f47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {t.update}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}