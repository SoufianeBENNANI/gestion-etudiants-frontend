import { Loader2, Plus, Save, X } from "lucide-react";

export default function AddStudent({
  open,
  formData,
  saving,
  error,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!open) return null;

  const handleBackdropClick = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-7 py-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Plus size={27} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Gestion des étudiants
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Ajouter un étudiant
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Un compte Keycloak sera automatiquement créé.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            title="Fermer"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <InputField
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={onChange}
              placeholder="Ex : BENNANI"
            />

            <InputField
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={onChange}
              placeholder="Ex : Soufiane"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Ex : soufiane@gmail.com"
            />

            <InputField
              label="Date de naissance"
              name="dateNaissance"
              type="datetime-local"
              value={formData.dateNaissance}
              onChange={onChange}
            />

            <div>
              <label className="mb-2 block text-xs font-black">
                Genre
              </label>

              <select
                name="genre"
                value={formData.genre}
                onChange={onChange}
                required
                className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <option value="">Sélectionner</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>

            <InputField
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={onChange}
              placeholder="Ex : 0674870006"
              required={false}
            />

            <InputField
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={onChange}
              placeholder="Ex : Meknès"
              required={false}
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--secondary-color)" }}
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Création..." : "Enregistrer"}
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
  required = true,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black">{label}</label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
      />
    </div>
  );
}