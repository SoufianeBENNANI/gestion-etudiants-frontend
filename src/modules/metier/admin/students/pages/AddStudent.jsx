import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

const headerGradient =
  "linear-gradient(180deg, #3b2c8f 0%, #4c1d95 45%, #581c87 100%)";

const calendarText = {
  days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  today: "Aujourd’hui",
  clear: "Vider",
};

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
    if (!saving) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-5xl overflow-visible rounded-[1.7rem] shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between rounded-t-[1.7rem] px-7 py-6 text-white"
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

            <BirthDatePicker
              value={formData.dateNaissance}
              onChange={onChange}
            />

            <div>
              <label className="mb-2 block text-xs font-black">Genre</label>
              <select
                name="genre"
                value={formData.genre ?? ""}
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

function BirthDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseLocalDate(value);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const monthName = useMemo(
    () =>
      viewDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    [viewDate]
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1
    );
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date;
    });
  }, [viewDate]);

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("fr-FR")
    : "";

  const changeMonth = (step) => {
    setViewDate(
      (previousDate) =>
        new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() + step,
          1
        )
    );
  };

  const selectDate = (date) => {
    if (isFutureDate(date)) return;

    onChange({
      target: {
        name: "dateNaissance",
        value: formatLocalDateTime(date),
      },
    });
    setOpen(false);
  };

  const clearDate = () => {
    onChange({
      target: {
        name: "dateNaissance",
        value: "",
      },
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-xs font-black">
        Date de naissance
      </label>

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
      >
        <span>{displayValue || "Sélectionner une date"}</span>
        <CalendarDays size={18} style={{ color: "var(--muted-text)" }} />
      </button>

      {open && (
        <div
          className="absolute top-[76px] z-[80] w-full min-w-[330px] rounded-[1.4rem] border p-4 shadow-2xl"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--text-color)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded-xl border p-2"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <h3 className="text-sm font-black capitalize">{monthName}</h3>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded-xl border p-2"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarText.days.map((day) => (
              <div
                key={day}
                className="py-2 text-[11px] font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((date) => {
              const inCurrentMonth =
                date.getMonth() === viewDate.getMonth();
              const selected = isSameDate(date, selectedDate);
              const today = isSameDate(date, new Date());
              const future = isFutureDate(date);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => selectDate(date)}
                  disabled={future}
                  className="flex h-10 items-center justify-center rounded-xl text-xs font-black transition hover:opacity-80 disabled:cursor-not-allowed"
                  style={{
                    background: selected
                      ? headerGradient
                      : today
                        ? "var(--section-bg)"
                        : "transparent",
                    color: selected
                      ? "#fff"
                      : inCurrentMonth
                        ? "var(--text-color)"
                        : "var(--muted-text)",
                    opacity: future ? 0.25 : inCurrentMonth ? 1 : 0.45,
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between gap-2">
            <button
              type="button"
              onClick={() => selectDate(new Date())}
              className="rounded-xl px-4 py-2 text-xs font-black text-white"
              style={{ background: headerGradient }}
            >
              {calendarText.today}
            </button>

            <button
              type="button"
              onClick={clearDate}
              className="rounded-xl border px-4 py-2 text-xs font-black"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              {calendarText.clear}
            </button>
          </div>
        </div>
      )}
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

function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00`;
}

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function isSameDate(firstDate, secondDate) {
  return (
    firstDate &&
    secondDate &&
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function isFutureDate(date) {
  const candidate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return candidate > today;
}