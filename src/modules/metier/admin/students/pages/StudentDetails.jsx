import { Eye, X } from "lucide-react";

export default function StudentDetails({ student, onClose }) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Eye size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  Students Management
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Student Details
                </h2>

                <p className="mt-2 text-xs text-slate-300">
                  View selected student information.
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

        <div className="grid gap-5 p-6 md:grid-cols-3">
          <InfoCard label="Last Name" value={student.nom} />
          <InfoCard label="First Name" value={student.prenom} />
          <InfoCard label="Email" value={student.email} />
          <InfoCard label="Gender" value={student.genre} />
          <InfoCard label="Phone" value={student.telephone} />
          <InfoCard label="Address" value={student.adresse} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <h3 className="mt-2 text-lg font-black text-slate-900">
        {value || "-"}
      </h3>
    </div>
  );
}