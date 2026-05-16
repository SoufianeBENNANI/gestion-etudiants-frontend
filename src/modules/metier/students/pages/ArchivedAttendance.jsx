import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  Calendar,
  Loader2,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";

import {
  getArchivedAttendances,
  restoreAttendance,
} from "../services/attendanceService";

export default function ArchivedAttendance() {
  const navigate = useNavigate();

  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  const loadArchivedAttendances = async () => {
    try {
      setLoading(true);

      const data = await getArchivedAttendances();

      setAttendances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load archived attendances error:", error);
      alert("Error while loading archived attendances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedAttendances();
  }, []);

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to restore this attendance?"
    );

    if (!confirmed) return;

    try {
      setRestoringId(id);

      await restoreAttendance(id);

      setAttendances((prevAttendances) =>
        prevAttendances.filter((attendance) => attendance.id !== id)
      );

      alert("Attendance restored successfully");
    } catch (error) {
      console.error("Restore attendance error:", error);
      alert("Error while restoring attendance");
    } finally {
      setRestoringId(null);
    }
  };

  const getStudentName = (attendance) => {
    return (
      `${attendance.studentNom || ""} ${attendance.studentPrenom || ""}`.trim() ||
      "-"
    );
  };

  const getStudentEmail = (attendance) => {
    return attendance.studentEmail || "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return String(date).substring(0, 10);
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "PRESENT") {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (value === "ABSENT") {
      return "bg-red-50 text-red-700 ring-red-200";
    }

    if (value === "LATE") {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-slate-100 text-slate-600 ring-slate-200";
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Archive size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Archived Attendance
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                View and restore archived attendance records.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate("/students/attendance")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              onClick={loadArchivedAttendances}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCcw size={18} />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Calendar size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Archived Attendance List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {attendances.length} archived record
              {attendances.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 font-bold text-slate-600">
            <Loader2 size={20} className="animate-spin" />
            Loading archived attendance...
          </div>
        ) : attendances.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-600">
            No archived attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr className="bg-white text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-black">Student</th>
                  <th className="px-6 py-4 font-black">Email</th>
                  <th className="px-6 py-4 font-black">Date</th>
                  <th className="px-6 py-4 font-black">Status</th>
                  <th className="px-6 py-4 font-black">Archived At</th>
                  <th className="px-6 py-4 text-right font-black">Action</th>
                </tr>
              </thead>

              <tbody>
                {attendances.map((attendance) => (
                  <tr
                    key={attendance.id}
                    className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-black text-slate-900">
                      {getStudentName(attendance)}
                    </td>

                    <td className="px-6 py-4">
                      {getStudentEmail(attendance)}
                    </td>

                    <td className="px-6 py-4">
                      {formatDate(attendance.date)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getStatusBadge(
                          attendance.status
                        )}`}
                      >
                        {attendance.status || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {formatDateTime(attendance.archivedAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRestore(attendance.id)}
                        disabled={restoringId === attendance.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {restoringId === attendance.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RotateCcw size={16} />
                        )}

                        {restoringId === attendance.id
                          ? "Restoring..."
                          : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}