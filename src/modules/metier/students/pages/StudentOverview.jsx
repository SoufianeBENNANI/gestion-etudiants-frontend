import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Archive,
  BarChart3,
  Bell,
  Brain,
  GraduationCap,
  ArrowUpRight,
  Activity,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getStudentOverviewStats,
  addStudent,
} from "../services/studentService";

import AddStudent from "./AddStudent";
import ArchivedStudents from "./ArchivedStudents";

export default function StudentOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalArchivedStudents: 0,
    totalPredictions: 0,
    averagePerformance: 0,
    totalAttendance: 0,
  });

  const [loading, setLoading] = useState(true);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);

  const [savingAdd, setSavingAdd] = useState(false);

  const [addFormData, setAddFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    genre: "",
    telephone: "",
    adresse: "",
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const data = await getStudentOverviewStats();

      setStats({
        totalStudents: Number(data.totalStudents) || 0,
        totalArchivedStudents: Number(data.totalArchivedStudents) || 0,
        totalPredictions: Number(data.totalPredictions) || 0,
        averagePerformance: Number(data.averagePerformance) || 0,
        totalAttendance: Number(data.totalAttendance) || 0,
      });
    } catch (error) {
      console.error("Error loading overview stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setAddFormData({
      nom: "",
      prenom: "",
      email: "",
      genre: "",
      telephone: "",
      adresse: "",
    });

    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);

    setAddFormData({
      nom: "",
      prenom: "",
      email: "",
      genre: "",
      telephone: "",
      adresse: "",
    });
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      setSavingAdd(true);

      await addStudent(addFormData);

      handleCloseAddDialog();
      await loadStats();

      alert("Student added successfully");
    } catch (error) {
      console.error("Add student error:", error);
      alert("Error while adding student");
    } finally {
      setSavingAdd(false);
    }
  };

  const overviewCards = [
    {
      title: "All Students",
      value: stats.totalStudents,
      description: "View all registered students",
      icon: Users,
      path: "/students/all",
      badge: "Records",
      color: "blue",
      type: "link",
    },
    {
      title: "Add Student",
      value: "+",
      description: "Create a new student profile",
      icon: UserPlus,
      badge: "New",
      color: "emerald",
      type: "addDialog",
    },
    {
      title: "Archived Students",
      value: stats.totalArchivedStudents,
      description: "View deleted or archived students",
      icon: Archive,
      badge: "Archive",
      color: "amber",
      type: "archiveDialog",
    },
    {
      title: "Performance",
      value: `${stats.averagePerformance}%`,
      description: "Student academic performance",
      icon: BarChart3,
      path: "/students/performance",
      badge: "Analytics",
      color: "violet",
      type: "link",
    },
    {
      title: "Attendance",
      value: stats.totalAttendance,
      description: "Total student attendance records",
      icon: Bell,
      path: "/students/attendance",
      badge: "Presence",
      color: "cyan",
      type: "link",
    },
    {
      title: "AI Predictions",
      value: stats.totalPredictions,
      description: "Students analyzed by AI",
      icon: Brain,
      path: "/students/predictions",
      badge: "AI",
      color: "rose",
      type: "link",
    },
  ];

  const colorStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      hover: "group-hover:bg-blue-600 group-hover:text-white",
      badge: "bg-blue-50 text-blue-600",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      hover: "group-hover:bg-emerald-600 group-hover:text-white",
      badge: "bg-emerald-50 text-emerald-600",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      hover: "group-hover:bg-amber-500 group-hover:text-white",
      badge: "bg-amber-50 text-amber-600",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      hover: "group-hover:bg-violet-600 group-hover:text-white",
      badge: "bg-violet-50 text-violet-600",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-600",
      hover: "group-hover:bg-cyan-600 group-hover:text-white",
      badge: "bg-cyan-50 text-cyan-600",
    },
    rose: {
      icon: "bg-rose-50 text-rose-600",
      hover: "group-hover:bg-rose-600 group-hover:text-white",
      badge: "bg-rose-50 text-rose-600",
    },
  };

  const renderCardContent = (card) => {
    const Icon = card.icon;
    const style = colorStyles[card.color];

    return (
      <>
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100 transition group-hover:scale-125" />

        <div className="relative flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${style.icon} ${style.hover}`}
          >
            <Icon size={25} />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
            >
              {card.badge}
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-slate-900 group-hover:text-white">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>

          <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {loading ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              card.value
            )}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {card.description}
          </p>
        </div>
      </>
    );
  };

  const renderCard = (card, index) => {
    const cardClass =
      "group relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl";

    if (card.type === "addDialog") {
      return (
        <button
          key={index}
          type="button"
          onClick={handleOpenAddDialog}
          className={cardClass}
        >
          {renderCardContent(card)}
        </button>
      );
    }

    if (card.type === "archiveDialog") {
      return (
        <button
          key={index}
          type="button"
          onClick={() => setOpenArchiveDialog(true)}
          className={cardClass}
        >
          {renderCardContent(card)}
        </button>
      );
    }

    return (
      <Link key={index} to={card.path} className={cardClass}>
        {renderCardContent(card)}
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <GraduationCap size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Students Overview
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Manage students, attendance, performance and AI predictions from
                one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card, index) => renderCard(card, index))}
      </div>

      {/* SUMMARY */}
      <div className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Activity size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Students Summary
            </h2>
            <p className="text-sm text-slate-500">
              Quick overview of student records and academic tracking.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Active Students</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading
                ? "..."
                : stats.totalStudents - stats.totalArchivedStudents}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Total Attendance</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.totalAttendance}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">AI Predictions</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.totalPredictions}
            </p>
          </div>
        </div>
      </div>

      {/* ADD STUDENT DIALOG */}
      <AddStudent
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddStudent}
      />

      {/* ARCHIVED STUDENTS DIALOG */}
      <ArchivedStudents
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={() => {
          loadStats();
        }}
      />
    </div>
  );
}