import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./StudentForm.css";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  RotateCcw,
  Save,
} from "lucide-react";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex w-full items-center rounded-2xl border border-slate-200 bg-slate-50/80 py-4 pl-12 pr-4 text-left text-slate-800 shadow-sm outline-none transition duration-200 hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
  >
    {value || <span className="text-slate-400">Select a date</span>}
  </button>
));

CustomDateInput.displayName = "CustomDateInput";

export default function StudentForm({ onSubmit }) {
  const initialStudent = {
    nom: "",
    prenom: "",
    email: "",
    date_Naissance: null,
    genre: "",
    adresse: "",
    telephone: "",
  };

  const [student, setStudent] = useState(initialStudent);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setStudent(initialStudent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      ...student,
      date_Naissance: student.date_Naissance
        ? `${format(student.date_Naissance, "yyyy-MM-dd")}T12:00:26`
        : "",
    };

    const success = await onSubmit(studentData);

    if (success) {
      setStudent(initialStudent);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-4 pl-12 pr-4 text-slate-800 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  const labelClass = "mb-2 block text-sm font-bold text-slate-700";

  const iconClass =
    "absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-black text-slate-900">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label className={labelClass}>Last Name</label>
            <div className="relative">
              <User size={19} className={iconClass} />
              <input
                type="text"
                name="nom"
                placeholder="Ex: BENNANI"
                value={student.nom}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>First Name</label>
            <div className="relative">
              <User size={19} className={iconClass} />
              <input
                type="text"
                name="prenom"
                placeholder="Ex: Soufiane"
                value={student.prenom}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail size={19} className={iconClass} />
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={student.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Date of Birth</label>
            <div className="relative">
              <Calendar size={19} className={iconClass} />
              <DatePicker
                selected={student.date_Naissance}
                onChange={(date) =>
                  setStudent({
                    ...student,
                    date_Naissance: date,
                  })
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                customInput={<CustomDateInput />}
                calendarClassName="modern-datepicker"
                wrapperClassName="w-full"
                popperClassName="modern-datepicker-popper"
                popperPlacement="bottom-start"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <div className="relative">
              <Users size={19} className={iconClass} />
              <select
                name="genre"
                value={student.genre}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
                required
              >
                <option value="">Select gender</option>
                <option value="Femme">Female</option>
                <option value="Homme">Male</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <div className="relative">
              <Phone size={19} className={iconClass} />
              <input
                type="text"
                name="telephone"
                placeholder="Ex: 0674870006"
                value={student.telephone}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className={labelClass}>Address</label>
            <div className="relative">
              <MapPin size={19} className={iconClass} />
              <input
                type="text"
                name="adresse"
                placeholder="Ex: Oujda"
                value={student.adresse}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        {/* ACTIONS */}
<div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-end">
  <button
    type="button"
    onClick={handleReset}
    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
  >
    <RotateCcw size={18} />
    Reset
  </button>

  <button
    type="submit"
    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
  >
    <Save size={18} />
    Add Student
  </button>
</div>
      </div>
    </form>
  );
}