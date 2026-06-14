import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  BrainCircuit,
  CreditCard,
  GraduationCap,
  Loader2,
  LogOut,
  Mail,
  Search,
  School,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboardData } from "../services/dashboardService";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    students: [],
    archivedStudents: [],
    teachers: [],
    courses: [],
    classes: [],
    departements: [],
    grades: [],
    payements: [],
    attendances: [],
    predictions: [],
    models: [],
  });

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Impossible de charger les données du dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleKeycloakLogout = () => {
    const keycloakUrl = "http://localhost:8081";
    const realm = "gestion_etudiant";
    const clientId = "gestion-etudiant-frontend";
    const postLogoutRedirectUri = "http://localhost:5173";

    const idToken =
      localStorage.getItem("idToken") ||
      localStorage.getItem("id_token") ||
      sessionStorage.getItem("idToken") ||
      sessionStorage.getItem("id_token");

    if (!idToken) {
      console.error("idToken introuvable. Keycloak va afficher la page de confirmation.");
    }

    const logoutParams = new URLSearchParams();

    logoutParams.set("client_id", clientId);
    logoutParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

    if (idToken) {
      logoutParams.set("id_token_hint", idToken);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("id_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth");

    sessionStorage.clear();

    window.location.href = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?${logoutParams.toString()}`;
  };

  const {
    students,
    archivedStudents,
    teachers,
    courses,
    classes,
    payements,
    attendances,
    predictions,
    models,
  } = dashboardData;

  const stats = [
    {
      title: "Students",
      value: students.length,
      icon: GraduationCap,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      title: "Teachers",
      value: teachers.length,
      icon: Users,
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
    {
      title: "Courses",
      value: courses.length,
      icon: BookOpen,
      bg: "bg-sky-50",
      text: "text-sky-700",
    },
    {
      title: "Classes",
      value: classes.length,
      icon: School,
      bg: "bg-violet-50",
      text: "text-violet-700",
    },
    {
      title: "Payments",
      value: payements.length,
      icon: CreditCard,
      bg: "bg-rose-50",
      text: "text-rose-700",
    },
    {
      title: "AI Models",
      value: models.length,
      icon: BrainCircuit,
      bg: "bg-indigo-50",
      text: "text-indigo-700",
    },
  ];

  const overviewChartData = [
    { name: "Students", value: students.length },
    { name: "Teachers", value: teachers.length },
    { name: "Courses", value: courses.length },
    { name: "Classes", value: classes.length },
    { name: "Payments", value: payements.length },
    { name: "AI Models", value: models.length },
  ];

  const attendanceChartData = useMemo(() => {
    const present = attendances.filter((item) => {
      const status = String(item.status || item.statut || "")
        .trim()
        .toLowerCase();

      return status.includes("present") || status.includes("présent");
    }).length;

    const absent = attendances.filter((item) => {
      const status = String(item.status || item.statut || "")
        .trim()
        .toLowerCase();

      return status.includes("absent");
    }).length;

    const unknown = Math.max(attendances.length - present - absent, 0);

    return [
      { name: "Present", value: present },
      { name: "Absent", value: absent },
      { name: "Other", value: unknown },
    ];
  }, [attendances]);

  const filteredStudents = students.filter((student) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    const fullName = `${student.nom || ""} ${student.prenom || ""}`.toLowerCase();

    const email = String(student.email || "").toLowerCase();

    const classe = String(
      student.classe?.nom ||
      student.classeName ||
      student.className ||
      student.niveau ||
      ""
    ).toLowerCase();

    return (
      fullName.includes(keyword) ||
      email.includes(keyword) ||
      classe.includes(keyword)
    );
  });

  const recentStudents = filteredStudents.slice(0, 8);

  const notifications = [
    {
      title: "Gmail notification service",
      message: "Kafka/WebSocket prêt pour recevoir les emails.",
    },
    {
      title: "Students loaded",
      message: `${students.length} étudiants chargés depuis l'API.`,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
          <span className="font-semibold text-slate-700">
            Chargement du dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">
              Hey, Admin 👋
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Gestion globale des étudiants, enseignants, cours, paiements et IA.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 sm:w-56"
              />
            </div>

            <button
              type="button"
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <button
              type="button"
              onClick={handleKeycloakLogout}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                A
              </div>

              <div>
                <p className="text-sm font-black text-slate-800">Admin</p>
                <p className="text-xs font-semibold text-slate-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-2xl ${item.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${item.text}`} />
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  Total
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-black text-slate-900">
                {item.value}
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Global Overview
              </h2>

              <p className="text-sm font-semibold text-slate-400">
                Statistiques principales
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0284c7"
                  fill="#e0f2fe"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Attendance Overview
              </h2>

              <p className="text-sm font-semibold text-slate-400">
                Présence / absence
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE + NOTIFICATIONS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Students List
              </h2>

              <p className="text-sm font-semibold text-slate-400">
                Liste des étudiants récents
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500">
              {students.length} students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                  <th className="py-4">Student</th>
                  <th className="py-4">Email</th>
                  <th className="py-4">Class</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentStudents.length > 0 ? (
                  recentStudents.map((student, index) => {
                    const fullName =
                      `${student.nom || ""} ${student.prenom || ""}`.trim() ||
                      student.name ||
                      "Unknown Student";

                    const classe =
                      student.classe?.nom ||
                      student.classeName ||
                      student.className ||
                      student.niveau ||
                      "-";

                    return (
                      <tr
                        key={student.id || index}
                        className="border-b border-slate-100 text-sm last:border-none"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-600">
                              {fullName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="font-black text-slate-800">
                                {fullName}
                              </p>

                              <p className="text-xs font-semibold text-slate-400">
                                ID: {student.id || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 font-semibold text-slate-500">
                          {student.email || "-"}
                        </td>

                        <td className="py-4 font-semibold text-slate-500">
                          {classe}
                        </td>

                        <td className="py-4">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-sm font-semibold text-slate-400"
                    >
                      Aucun étudiant trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Gmail Kafka
              </h2>

              <p className="text-sm font-semibold text-slate-400">
                Notifications récentes
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-3">
              <Mail className="h-5 w-5 text-red-600" />
            </div>
          </div>

          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-black text-slate-800">
                  {notification.title}
                </p>

                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
            <p className="text-sm font-black">Kafka Status</p>

            <p className="mt-1 text-xs font-semibold text-slate-300">
              Connecter avec WebSocket après configuration backend.
            </p>
          </div>
        </div>
      </div>

      {/* MINI SUMMARY */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-400">
            Archived Students
          </p>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            {archivedStudents.length}
          </h3>
        </div>

        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-400">Predictions</p>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            {predictions.length}
          </h3>
        </div>

        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-400">Attendance</p>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            {attendances.length}
          </h3>
        </div>
      </div>
    </div>
  );
}