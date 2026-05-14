import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Loader2,
  GraduationCap,
} from "lucide-react";

export default function EditStudentModal({
  student,
  saving,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    date_Naissance: "",
    genre: "",
    telephone: "",
    adresse: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        nom: student.nom || "",
        prenom: student.prenom || "",
        email: student.email || "",
        date_Naissance: student.date_Naissance
          ? student.date_Naissance.substring(0, 10)
          : "",
        genre: student.genre || "",
        telephone: student.telephone || "",
        adresse: student.adresse || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const studentData = {
      ...formData,
      date_Naissance: formData.date_Naissance
        ? `${formData.date_Naissance}T12:00:26`
        : null,
    };

    onUpdate(student.id, studentData);
  };

  if (!student) return null;

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-800 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  const labelClass = "mb-2 block text-sm font-bold text-slate-700";

  const iconClass =
    "absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400";

  return (
  <div className="space-y-8">
    {/* HEADER SAME SIZE AS ALL STUDENTS */}
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-8 text-white shadow-2xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center text-white/90 transition duration-200 hover:-translate-x-1 hover:text-white"
            title="Back to all students"
          >
            <ArrowLeft size={30} strokeWidth={2.5} />
          </button>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
            <GraduationCap size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-black">Update Student</h1>
            <p className="mt-1 text-sm text-white/80">
              Edit the student&apos;s personal information and save changes.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* FORM CARD */}
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <form onSubmit={handleSubmit} className="bg-white px-8 py-8 md:px-10 md:py-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 md:p-7">
            <h2 className="mb-6 text-lg font-black text-slate-900">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <label className={labelClass}>Last Name</label>
                <div className="relative">
                  <User size={19} className={iconClass} />
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
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
                    value={formData.prenom}
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
                    value={formData.email}
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
                  <input
                    type="date"
                    name="date_Naissance"
                    value={formData.date_Naissance}
                    onChange={handleChange}
                    className={inputClass}
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
                    value={formData.genre}
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
                    value={formData.telephone}
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
                    value={formData.adresse}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-7 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}