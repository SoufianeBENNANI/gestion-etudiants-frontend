import { useEffect, useState } from "react";
import { Loader2, Plus, Save, X } from "lucide-react";

const translations = {
  EN: {
    management: "Students Management",
    title: "Add Student",
    subtitle: "Add a new student record.",
    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    save: "Save",
    close: "Close",
    lastNamePlaceholder: "Ex: BENNANI",
    firstNamePlaceholder: "Ex: Soufiane",
    emailPlaceholder: "Ex: soufiane@gmail.com",
    phonePlaceholder: "Ex: 0674870006",
    addressPlaceholder: "Ex: Meknes",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Ajouter un étudiant",
    subtitle: "Ajouter un nouveau dossier étudiant.",
    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",
    selectGender: "Sélectionner le genre",
    male: "Homme",
    female: "Femme",
    save: "Enregistrer",
    close: "Fermer",
    lastNamePlaceholder: "Ex : BENNANI",
    firstNamePlaceholder: "Ex : Soufiane",
    emailPlaceholder: "Ex : soufiane@gmail.com",
    phonePlaceholder: "Ex : 0674870006",
    addressPlaceholder: "Ex : Meknès",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "إضافة طالب",
    subtitle: "إضافة سجل طالب جديد.",
    lastName: "الاسم العائلي",
    firstName: "الاسم الشخصي",
    email: "البريد الإلكتروني",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
    selectGender: "اختر الجنس",
    male: "ذكر",
    female: "أنثى",
    save: "حفظ",
    close: "إغلاق",
    lastNamePlaceholder: "مثال: BENNANI",
    firstNamePlaceholder: "مثال: Soufiane",
    emailPlaceholder: "مثال: soufiane@gmail.com",
    phonePlaceholder: "مثال: 0674870006",
    addressPlaceholder: "مثال: Meknes",
  },
};

export default function AddStudent({
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

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-7 py-7 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <div
            className="absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl"
            style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
          />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Plus size={28} />
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
              title={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <InputField
              label={t.lastName}
              name="nom"
              value={formData.nom}
              onChange={onChange}
              placeholder={t.lastNamePlaceholder}
            />

            <InputField
              label={t.firstName}
              name="prenom"
              value={formData.prenom}
              onChange={onChange}
              placeholder={t.firstNamePlaceholder}
            />

            <InputField
              label={t.email}
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder={t.emailPlaceholder}
            />

            <div>
              <label
                className="mb-2 block text-xs font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {t.gender}
              </label>

              <select
                name="genre"
                value={formData.genre}
                onChange={onChange}
                className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
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
              onChange={onChange}
              placeholder={t.phonePlaceholder}
            />

            <InputField
              label={t.address}
              name="adresse"
              value={formData.adresse}
              onChange={onChange}
              placeholder={t.addressPlaceholder}
            />
          </div>

          <div
            className={`flex pt-5 ${
              isArabic ? "justify-start" : "justify-end"
            }`}
            style={{ borderColor: "var(--border-color)" }}
          >
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--secondary-color)" }}
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
      <label
        className="mb-2 block text-xs font-black"
        style={{ color: "var(--muted-text)" }}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
        required
      />
    </div>
  );
}