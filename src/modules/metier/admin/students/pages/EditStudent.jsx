import { useEffect, useState } from "react";
import { Loader2, Pencil, Save, X } from "lucide-react";

const translations = {
  EN: {
    management: "Students Management",
    title: "Edit Student",
    subtitle: "Update selected student information.",

    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    gender: "Gender",
    phone: "Phone",
    address: "Address",

    lastNamePlaceholder: "Ex: BENNANI",
    firstNamePlaceholder: "Ex: Soufiane",
    emailPlaceholder: "Ex: soufiane@gmail.com",
    phonePlaceholder: "Ex: 0674870006",
    addressPlaceholder: "Ex: Meknes",

    selectGender: "Select gender",
    male: "Homme",
    female: "Femme",

    save: "Save",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Modifier l’étudiant",
    subtitle: "Mettre à jour les informations de l’étudiant sélectionné.",

    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",

    lastNamePlaceholder: "Ex: BENNANI",
    firstNamePlaceholder: "Ex: Soufiane",
    emailPlaceholder: "Ex: soufiane@gmail.com",
    phonePlaceholder: "Ex: 0674870006",
    addressPlaceholder: "Ex: Meknes",

    selectGender: "Sélectionner le genre",
    male: "Homme",
    female: "Femme",

    save: "Enregistrer",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "تعديل الطالب",
    subtitle: "تحديث معلومات الطالب المحدد.",

    lastName: "الاسم العائلي",
    firstName: "الاسم الشخصي",
    email: "البريد الإلكتروني",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",

    lastNamePlaceholder: "مثال: BENNANI",
    firstNamePlaceholder: "مثال: Soufiane",
    emailPlaceholder: "مثال: soufiane@gmail.com",
    phonePlaceholder: "مثال: 0674870006",
    addressPlaceholder: "مثال: Meknes",

    selectGender: "اختر الجنس",
    male: "ذكر",
    female: "أنثى",

    save: "حفظ",
  },
};

export default function EditStudent({ student, saving, onClose, onSubmit }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    genre: "",
    telephone: "",
    adresse: "",
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
    if (student) {
      setFormData({
        nom: student.nom || "",
        prenom: student.prenom || "",
        email: student.email || "",
        genre: student.genre || "",
        telephone: student.telephone || "",
        adresse: student.adresse || "",
      });
    }
  }, [student]);

  if (!student) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(student.id, formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Pencil size={28} />
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
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid gap-5 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <InputField
              label={t.lastName}
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder={t.lastNamePlaceholder}
            />

            <InputField
              label={t.firstName}
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder={t.firstNamePlaceholder}
            />

            <InputField
              label={t.email}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.emailPlaceholder}
            />

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                {t.gender}
              </label>

              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              >
                <option value="">{t.selectGender}</option>
                <option value="Homme">{t.male}</option>
                <option value="Femme">{t.female}</option>
              </select>
            </div>

            <InputField
              label={t.phone}
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder={t.phonePlaceholder}
            />

            <InputField
              label={t.address}
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder={t.addressPlaceholder}
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        required
      />
    </div>
  );
}