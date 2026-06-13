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

const translations = {
  EN: {
    management: "Students Management",
    title: "Students Overview",
    subtitle:
      "Manage students, attendance, performance and AI predictions from one place.",

    allStudents: "All Students",
    allStudentsDescription: "View all registered students",

    addStudent: "Add Student",
    addStudentDescription: "Create a new student profile",

    archivedStudents: "Archived Students",
    archivedStudentsDescription: "View deleted or archived students",

    performance: "Performance",
    performanceDescription: "Student academic performance",

    attendance: "Attendance",
    attendanceDescription: "Total student attendance records",

    aiPredictions: "AI Predictions",
    aiPredictionsDescription: "Students analyzed by AI",

    records: "Records",
    new: "New",
    archive: "Archive",
    analytics: "Analytics",
    presence: "Presence",
    ai: "AI",

    summaryTitle: "Students Summary",
    summaryDescription: "Quick overview of student records and academic tracking.",

    activeStudents: "Active Students",
    totalAttendance: "Total Attendance",
    totalPredictions: "AI Predictions",

    addError: "Error while adding student",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Vue d’ensemble des étudiants",
    subtitle:
      "Gérer les étudiants, les présences, les performances et les prédictions IA depuis un seul endroit.",

    allStudents: "Tous les étudiants",
    allStudentsDescription: "Voir tous les étudiants enregistrés",

    addStudent: "Ajouter étudiant",
    addStudentDescription: "Créer un nouveau profil étudiant",

    archivedStudents: "Étudiants archivés",
    archivedStudentsDescription: "Voir les étudiants supprimés ou archivés",

    performance: "Performance",
    performanceDescription: "Performance académique des étudiants",

    attendance: "Présence",
    attendanceDescription: "Total des enregistrements de présence",

    aiPredictions: "Prédictions IA",
    aiPredictionsDescription: "Étudiants analysés par l’IA",

    records: "Dossiers",
    new: "Nouveau",
    archive: "Archive",
    analytics: "Analytique",
    presence: "Présence",
    ai: "IA",

    summaryTitle: "Résumé des étudiants",
    summaryDescription: "Aperçu rapide des dossiers étudiants et du suivi académique.",

    activeStudents: "Étudiants actifs",
    totalAttendance: "Total présence",
    totalPredictions: "Prédictions IA",

    addError: "Erreur lors de l’ajout de l’étudiant",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "نظرة عامة على الطلاب",
    subtitle:
      "إدارة الطلاب والحضور والأداء والتوقعات بالذكاء الاصطناعي من مكان واحد.",

    allStudents: "كل الطلاب",
    allStudentsDescription: "عرض جميع الطلاب المسجلين",

    addStudent: "إضافة طالب",
    addStudentDescription: "إنشاء ملف طالب جديد",

    archivedStudents: "الطلاب المؤرشفون",
    archivedStudentsDescription: "عرض الطلاب المحذوفين أو المؤرشفين",

    performance: "الأداء",
    performanceDescription: "الأداء الأكاديمي للطلاب",

    attendance: "الحضور",
    attendanceDescription: "إجمالي سجلات حضور الطلاب",

    aiPredictions: "توقعات الذكاء الاصطناعي",
    aiPredictionsDescription: "الطلاب الذين تم تحليلهم بالذكاء الاصطناعي",

    records: "السجلات",
    new: "جديد",
    archive: "الأرشيف",
    analytics: "تحليلات",
    presence: "الحضور",
    ai: "ذكاء اصطناعي",

    summaryTitle: "ملخص الطلاب",
    summaryDescription: "نظرة سريعة على سجلات الطلاب والمتابعة الأكاديمية.",

    activeStudents: "الطلاب النشطون",
    totalAttendance: "إجمالي الحضور",
    totalPredictions: "توقعات الذكاء الاصطناعي",

    addError: "حدث خطأ أثناء إضافة الطالب",
  },
};

export default function StudentOverview() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

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

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  const textStyle = {
    color: "var(--text-color)",
  };

  const mutedTextStyle = {
    color: "var(--muted-text)",
  };

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail || localStorage.getItem("app-language") || "EN";

      setLanguage(nextLanguage);
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

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
    } catch (error) {
      console.error("Add student error:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const overviewCards = [
    {
      title: t.allStudents,
      value: stats.totalStudents,
      description: t.allStudentsDescription,
      icon: Users,
      path: "/admin/students/all",
      badge: t.records,
      color: "blue",
      type: "link",
    },
    {
      title: t.addStudent,
      value: "+",
      description: t.addStudentDescription,
      icon: UserPlus,
      badge: t.new,
      color: "emerald",
      type: "addDialog",
    },
    {
      title: t.archivedStudents,
      value: stats.totalArchivedStudents,
      description: t.archivedStudentsDescription,
      icon: Archive,
      badge: t.archive,
      color: "amber",
      type: "archiveDialog",
    },
    {
      title: t.performance,
      value: `${stats.averagePerformance}%`,
      description: t.performanceDescription,
      icon: BarChart3,
      path: "/admin/students/performance",
      badge: t.analytics,
      color: "violet",
      type: "link",
    },
    {
      title: t.attendance,
      value: stats.totalAttendance,
      description: t.attendanceDescription,
      icon: Bell,
      path: "/admin/students/attendance",
      badge: t.presence,
      color: "cyan",
      type: "link",
    },
    {
      title: t.aiPredictions,
      value: stats.totalPredictions,
      description: t.aiPredictionsDescription,
      icon: Brain,
      path: "/admin/students/predictions",
      badge: t.ai,
      color: "rose",
      type: "link",
    },
  ];

  const colorStyles = {
    blue: {
      icon: "bg-blue-600 text-white",
      badge: "bg-blue-50 text-blue-600",
    },
    emerald: {
      icon: "bg-emerald-600 text-white",
      badge: "bg-emerald-50 text-emerald-600",
    },
    amber: {
      icon: "bg-amber-500 text-white",
      badge: "bg-amber-50 text-amber-600",
    },
    violet: {
      icon: "bg-violet-600 text-white",
      badge: "bg-violet-50 text-violet-600",
    },
    cyan: {
      icon: "bg-cyan-600 text-white",
      badge: "bg-cyan-50 text-cyan-600",
    },
    rose: {
      icon: "bg-rose-600 text-white",
      badge: "bg-rose-50 text-rose-600",
    },
  };

  const renderCardContent = (card) => {
    const Icon = card.icon;
    const style = colorStyles[card.color];

    return (
      <>
        <div
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full transition group-hover:scale-125"
          style={{ backgroundColor: "var(--section-bg)" }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${style.icon}`}
          >
            <Icon size={22} />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-black ${style.badge}`}
            >
              {card.badge}
            </span>

            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl transition group-hover:text-white"
              style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--muted-text)",
              }}
            >
              <ArrowUpRight size={17} />
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <h2 className="text-sm font-black" style={textStyle}>
            {card.title}
          </h2>

          <p
            className="mt-3 truncate text-2xl font-black tracking-tight"
            style={textStyle}
            title={String(card.value)}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              card.value
            )}
          </p>

          <p
            className="mt-2 text-xs font-semibold leading-5"
            style={mutedTextStyle}
          >
            {card.description}
          </p>
        </div>
      </>
    );
  };

  const renderCard = (card, index) => {
    const cardClass =
      "group relative overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md";

    if (card.type === "addDialog") {
      return (
        <button
          key={index}
          type="button"
          onClick={handleOpenAddDialog}
          className={cardClass}
          style={cardStyle}
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
          style={cardStyle}
        >
          {renderCardContent(card)}
        </button>
      );
    }

    return (
      <Link key={index} to={card.path} className={cardClass} style={cardStyle}>
        {renderCardContent(card)}
      </Link>
    );
  };

  return (
    <div
      className="min-h-screen space-y-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <div
        className="relative overflow-hidden rounded-[1.7rem] border px-6 py-6 text-white shadow-sm"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div
          className="absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
        />

        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <GraduationCap size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                {t.management}
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                {t.title}
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card, index) => renderCard(card, index))}
      </div>

      {/* SUMMARY */}
      <div
        className="rounded-2xl border p-5 shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <Activity size={22} />
          </div>

          <div>
            <h2 className="text-lg font-black" style={textStyle}>
              {t.summaryTitle}
            </h2>

            <p className="text-xs font-semibold" style={mutedTextStyle}>
              {t.summaryDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl p-4" style={sectionStyle}>
            <p className="text-xs font-bold" style={mutedTextStyle}>
              {t.activeStudents}
            </p>

            <p className="mt-2 text-2xl font-black" style={textStyle}>
              {loading
                ? "..."
                : stats.totalStudents - stats.totalArchivedStudents}
            </p>
          </div>

          <div className="rounded-2xl p-4" style={sectionStyle}>
            <p className="text-xs font-bold" style={mutedTextStyle}>
              {t.totalAttendance}
            </p>

            <p className="mt-2 text-2xl font-black" style={textStyle}>
              {loading ? "..." : stats.totalAttendance}
            </p>
          </div>

          <div className="rounded-2xl p-4" style={sectionStyle}>
            <p className="text-xs font-bold" style={mutedTextStyle}>
              {t.totalPredictions}
            </p>

            <p className="mt-2 text-2xl font-black" style={textStyle}>
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