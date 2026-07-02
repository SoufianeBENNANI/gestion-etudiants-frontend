import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { getAllStudents } from "../../students/services/studentService";

const headerGradient =
  "linear-gradient(180deg, #3b2c8f 0%, #4c1d95 45%, #581c87 100%)";

const translations = {
  EN: {
    management: "Attendance Management",
    title: "Add",
    subtitle: "Add a new attendance record.",
    student: "Student",
    selectStudent: "Select student",
    date: "Date",
    status: "Status",
    selectStatus: "Select status",
    present: "PRESENT",
    absent: "ABSENT",
    late: "LATE",
    remark: "Remark",
    remarkPlaceholder: "Ex: Student was absent...",
    save: "Save",
    close: "Close",
    today: "Today",
    clear: "Clear",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  FR: {
    management: "Gestion des présences",
    title: "Ajouter",
    subtitle: "Ajouter un nouveau dossier de présence.",
    student: "Étudiant",
    selectStudent: "Sélectionner un étudiant",
    date: "Date",
    status: "Statut",
    selectStatus: "Sélectionner le statut",
    present: "PRÉSENT",
    absent: "ABSENT",
    late: "RETARD",
    remark: "Remarque",
    remarkPlaceholder: "Ex : Étudiant absent...",
    save: "Enregistrer",
    close: "Fermer",
    today: "Aujourd’hui",
    clear: "Vider",
    days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  },
  AR: {
    management: "إدارة الحضور",
    title: "إضافة",
    subtitle: "إضافة سجل حضور جديد.",
    student: "الطالب",
    selectStudent: "اختر الطالب",
    date: "التاريخ",
    status: "الحالة",
    selectStatus: "اختر الحالة",
    present: "حاضر",
    absent: "غائب",
    late: "متأخر",
    remark: "ملاحظة",
    remarkPlaceholder: "مثال: الطالب غائب...",
    save: "حفظ",
    close: "إغلاق",
    today: "اليوم",
    clear: "مسح",
    days: ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
  },
};

export default function AddAttendance({
  open,
  formData,
  saving,
  onClose,
  onChange,
  onSubmit,
}) {
  const [students, setStudents] = useState([]);
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

  useEffect(() => {
    if (open) loadStudents();
  }, [open]);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setStudents([]);
    }
  };

  const handleDateChange = (dateValue) => {
    onChange({
      target: {
        name: "date",
        value: dateValue,
      },
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-5xl overflow-visible rounded-[2rem] shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-t-[2rem] px-7 py-7 text-white"
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

        <form onSubmit={onSubmit} className="grid gap-5 rounded-b-[2rem] p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <SelectStudent
              label={t.student}
              value={formData.studentId}
              onChange={onChange}
              students={students}
              placeholder={t.selectStudent}
            />

            <ModernDatePicker
              label={t.date}
              value={formData.date}
              onChange={handleDateChange}
              t={t}
              isArabic={isArabic}
            />

            <StatusSelect t={t} value={formData.status} onChange={onChange} />

            <div className="md:col-span-3">
              <label
                className="mb-2 block text-xs font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {t.remark}
              </label>

              <textarea
                name="remarque"
                value={formData.remarque}
                onChange={onChange}
                placeholder={t.remarkPlaceholder}
                className="min-h-[110px] w-full resize-none rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
          </div>

          <div className={`flex pt-5 ${isArabic ? "justify-start" : "justify-end"}`}>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: headerGradient }}
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

function ModernDatePicker({ label, value, onChange, t, isArabic }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

  const selectedDate = value ? new Date(value) : null;

  const monthName = useMemo(() => {
    const locale = isArabic ? "ar-MA" : "fr-FR";
    return viewDate.toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  }, [viewDate, isArabic]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date;
    });
  }, [viewDate]);

  const formatDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(isArabic ? "ar-MA" : "fr-FR")
    : "";

  const changeMonth = (step) => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + step, 1)
    );
  };

  const selectDate = (date) => {
    onChange(formatDateValue(date));
    setOpen(false);
  };

  const isSameDate = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="relative">
      <label
        className="mb-2 block text-xs font-black"
        style={{ color: "var(--muted-text)" }}
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
      >
        <span>{displayValue || label}</span>
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
              onClick={() => changeMonth(isArabic ? 1 : -1)}
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
              onClick={() => changeMonth(isArabic ? -1 : 1)}
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
            {t.days.map((day) => (
              <div
                key={day}
                className="py-2 text-[11px] font-black"
                style={{ color: "var(--muted-text)" }}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((date) => {
              const inCurrentMonth = date.getMonth() === viewDate.getMonth();
              const isSelected = isSameDate(date, selectedDate);
              const isToday = isSameDate(date, new Date());

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => selectDate(date)}
                  className="flex h-10 items-center justify-center rounded-xl text-xs font-black transition hover:opacity-80"
                  style={{
                    background: isSelected
                      ? headerGradient
                      : isToday
                      ? "var(--section-bg)"
                      : "transparent",
                    color: isSelected
                      ? "#fff"
                      : inCurrentMonth
                      ? "var(--text-color)"
                      : "var(--muted-text)",
                    opacity: inCurrentMonth ? 1 : 0.45,
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
              {t.today}
            </button>

            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="rounded-xl border px-4 py-2 text-xs font-black"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              {t.clear}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectStudent({ label, value, onChange, students, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black" style={{ color: "var(--muted-text)" }}>
        {label}
      </label>

      <select
        name="studentId"
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
        required
      >
        <option value="">{placeholder}</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.nom} {student.prenom}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusSelect({ t, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black" style={{ color: "var(--muted-text)" }}>
        {t.status}
      </label>

      <select
        name="status"
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold outline-none transition"
        style={{
          backgroundColor: "var(--input-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
        required
      >
        <option value="">{t.selectStatus}</option>
        <option value="PRESENT">{t.present}</option>
        <option value="ABSENT">{t.absent}</option>
        <option value="LATE">{t.late}</option>
      </select>
    </div>
  );
}