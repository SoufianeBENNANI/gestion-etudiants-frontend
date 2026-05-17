import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCcw,
  Search,
  Users,
  XCircle,
  Activity,
  Archive,
} from "lucide-react";

import { getAllStudents } from "../services/studentService";
import { getAllAttendances } from "../services/attendanceService";

export default function StudentAttendance() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [autoRefreshing, setAutoRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = async (silent = false) => {
    try {
      if (silent) {
        setAutoRefreshing(true);
      } else {
        setLoading(true);
      }

      const [studentsData, attendancesData] = await Promise.all([
        getAllStudents(),
        getAllAttendances(),
      ]);

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setAttendances(Array.isArray(attendancesData) ? attendancesData : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Load attendance error:", error);

      if (!silent) {
        alert("Error while loading attendance data");
      }
    } finally {
      setLoading(false);
      setAutoRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    const intervalId = setInterval(() => {
      loadData(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDateOnly = (value) => {
    if (!value) return "-";
    return String(value).substring(0, 10);
  };

  const normalizeStatus = (status) => {
    return String(status || "").trim().toUpperCase();
  };

  const getStudentName = (item) => {
    return (
      `${item.studentNom || ""} ${item.studentPrenom || ""}`.trim() || "-"
    );
  };

  const getStudentEmail = (item) => {
    return item.studentEmail || "-";
  };

  const getStudentId = (item) => {
    return item.studentId || item.student?.id || item.idStudent || null;
  };

  const countAttendanceRecordsByStatus = (status) => {
    return attendances.filter(
      (item) => normalizeStatus(item.status) === status
    ).length;
  };

  const filteredAttendances = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return attendances;

    return attendances.filter((item) => {
      const studentName = getStudentName(item).toLowerCase();
      const email = String(getStudentEmail(item)).toLowerCase();
      const status = String(item.status || "").toLowerCase();
      const date = String(item.date || "").toLowerCase();

      return (
        studentName.includes(value) ||
        email.includes(value) ||
        status.includes(value) ||
        date.includes(value)
      );
    });
  }, [attendances, searchTerm]);

  const totalStudents = students.length;
  const totalRecords = attendances.length;

  const absentStudents = countAttendanceRecordsByStatus("ABSENT");
  const lateStudents = countAttendanceRecordsByStatus("LATE");

  const presentStudents = Math.max(
    totalStudents - absentStudents - lateStudents,
    0
  );

  const attendanceRate =
    totalStudents === 0
      ? 0
      : Math.round((presentStudents / totalStudents) * 100);

  const getStatusBadge = (status) => {
    const value = normalizeStatus(status);

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

  const statCards = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      iconClass: "bg-slate-100 text-slate-700",
    },
    {
      title: "Present Students",
      value: presentStudents,
      icon: CheckCircle,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Absent Students",
      value: absentStudents,
      icon: XCircle,
      iconClass: "bg-red-50 text-red-700",
    },
    {
      title: "Late Students",
      value: lateStudents,
      icon: Clock,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Bell size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Student Attendance
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                View attendance records directly from the database.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => loadData()}
                disabled={loading || autoRefreshing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading || autoRefreshing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RefreshCcw size={18} />
                )}
                Refresh
              </button>

              <button
                type="button"
                onClick={() => navigate("/students/attendance/archive")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <Archive size={18} />
                Archive
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                : "Waiting for data..."}
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <Icon size={21} />
              </div>

              <h2 className="mt-5 text-base font-bold text-slate-900">
                {card.title}
              </h2>

              <p className="mt-2 text-3xl font-black text-slate-950">
                {loading ? "..." : card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Calendar size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Attendance Summary
              </h2>
              <p className="text-sm text-slate-500">
                Dynamic overview calculated from students and attendance records.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">
                Total Records
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {loading ? "..." : totalRecords}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">
                Attendance Rate
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {loading ? "..." : `${attendanceRate}%`}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Last Sync</p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <Activity size={22} className="text-blue-300" />
            <h2 className="text-xl font-bold">Live Sync</h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            This page refreshes automatically every 10 seconds. When a teacher
            adds attendance, the admin dashboard updates without reloading the
            page.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Calendar size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Attendance Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAttendances.length} attendance record
                {filteredAttendances.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, email, date or status..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-96"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 font-bold text-slate-600">
            <Loader2 size={20} className="animate-spin" />
            Loading attendance...
          </div>
        ) : filteredAttendances.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-600">
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-white text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-black">Student</th>
                  <th className="px-6 py-4 font-black">Email</th>
                  <th className="px-6 py-4 font-black">Date</th>
                  <th className="px-6 py-4 font-black">Status</th>
                  <th className="px-6 py-4 font-black">Student ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendances.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-black text-slate-900">
                      {getStudentName(item)}
                    </td>

                    <td className="px-6 py-4">{getStudentEmail(item)}</td>

                    <td className="px-6 py-4">{formatDateOnly(item.date)}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {normalizeStatus(item.status) || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">{getStudentId(item) || "-"}</td>
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