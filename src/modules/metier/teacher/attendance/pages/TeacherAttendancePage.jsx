import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  Pencil,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Archive,
  Loader2,
  Plus,
  AlertTriangle,
  TrendingUp,
  Search,
  Eye,
} from "lucide-react";

import {
  getAllAttendances,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getArchivedAttendances,
} from "../services/attendanceService";

import AddAttendance from "../components/AddAttendance";
import EditAttendance from "../components/EditAttendance";
import DeleteAttendance from "../components/DeleteAttendance";
import ArchiveAttendance from "../components/ArchiveAttendance";
import DetailsAttendance from "../components/DetailsAttendance";

const headerGradient =
  "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)";

const translations = {
  EN: {
    management: "Attendance Management",
    title: "Teacher Attendances",
    subtitle:
      "Manage, create, update, archive and restore student attendance records.",
    search: "Search attendance...",
    add: "Add",
    archive: "Archive",
    total: "Total Attendances",
    active: "Active Records",
    archived: "Archived Records",
    lastDays: "Last 30 days",
    list: "Attendance List",
    showing: "Showing",
    to: "to",
    of: "of",
    attendances: "attendances",
    rows: "Rows:",
    student: "Student",
    date: "Date",
    status: "Status",
    remark: "Remark",
    actions: "Actions",
    loading: "Loading attendances...",
    empty: "No attendances found.",
    page: "Page",
  },
  FR: {
    management: "Gestion des présences",
    title: "Présences des enseignants",
    subtitle:
      "Gérer, créer, modifier, archiver et restaurer les présences des étudiants.",
    search: "Rechercher une présence...",
    add: "Ajouter",
    archive: "Archive",
    total: "Total des présences",
    active: "Enregistrements actifs",
    archived: "Enregistrements archivés",
    lastDays: "Derniers 30 jours",
    list: "Liste des présences",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    attendances: "présences",
    rows: "Lignes :",
    student: "Étudiant",
    date: "Date",
    status: "Statut",
    remark: "Remarque",
    actions: "Actions",
    loading: "Chargement des présences...",
    empty: "Aucune présence trouvée.",
    page: "Page",
  },
  AR: {
    management: "إدارة الحضور",
    title: "حضور الأستاذ",
    subtitle: "إدارة وإنشاء وتعديل وأرشفة واسترجاع حضور الطلاب.",
    search: "البحث عن حضور...",
    add: "إضافة",
    archive: "الأرشيف",
    total: "مجموع الحضور",
    active: "السجلات النشطة",
    archived: "السجلات المؤرشفة",
    lastDays: "آخر 30 يومًا",
    list: "قائمة الحضور",
    showing: "عرض",
    to: "إلى",
    of: "من",
    attendances: "حضور",
    rows: "الأسطر:",
    student: "الطالب",
    date: "التاريخ",
    status: "الحالة",
    remark: "ملاحظة",
    actions: "الإجراءات",
    loading: "جاري تحميل الحضور...",
    empty: "لا توجد سجلات حضور.",
    page: "صفحة",
  },
};

export default function TeacherAttendancePage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  const [attendances, setAttendances] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [detailsItem, setDetailsItem] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    date: "",
    status: "",
    remarque: "",
  });

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () =>
      window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
  };

  const mutedTextStyle = { color: "var(--muted-text)" };
  const textStyle = { color: "var(--text-color)" };

  const getStudentName = (attendance) =>
    `${attendance.studentPrenom || ""} ${attendance.studentNom || ""}`.trim() ||
    attendance.studentName ||
    attendance.studentFullName ||
    `${attendance.student?.prenom || ""} ${attendance.student?.nom || ""}`.trim() ||
    `ID ${attendance.studentId || "-"}`;

  const resetForm = () => {
    setFormData({
      studentId: "",
      studentName: "",
      date: "",
      status: "",
      remarque: "",
    });
    setEditingId(null);
  };

  const loadArchivedCount = async () => {
    try {
      const data = await getArchivedAttendances();
      setArchivedCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setArchivedCount(0);
    }
  };

  const loadAttendances = async () => {
    try {
      setLoading(true);
      const data = await getAllAttendances();
      setAttendances(Array.isArray(data) ? data : []);
      setCurrentPage(1);
      await loadArchivedCount();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();
  }, []);

  const filteredAttendances = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();
    if (!value) return attendances;

    return attendances.filter((attendance) => {
      const studentName = getStudentName(attendance).toLowerCase();

      return (
        String(attendance.id || "").includes(value) ||
        studentName.includes(value) ||
        String(attendance.date || "").toLowerCase().includes(value) ||
        String(attendance.status || "").toLowerCase().includes(value) ||
        String(attendance.remarque || "").toLowerCase().includes(value)
      );
    });
  }, [attendances, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await addAttendance({
        studentId: Number(formData.studentId),
        date: formData.date,
        status: formData.status,
        remarque: formData.remarque,
      });

      resetForm();
      setOpenAdd(false);
      await loadAttendances();
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateAttendance(editingId, {
        studentId: Number(formData.studentId),
        date: formData.date,
        status: formData.status,
        remarque: formData.remarque,
      });

      resetForm();
      setOpenEdit(false);
      await loadAttendances();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (attendance) => {
    setEditingId(attendance.id);

    setFormData({
      studentId: attendance.studentId || attendance.student?.id || "",
      studentName: getStudentName(attendance),
      date: attendance.date || "",
      status: attendance.status || "",
      remarque: attendance.remarque || "",
    });

    setOpenEdit(true);
  };

  const confirmDelete = async (id) => {
    await deleteAttendance(id);
    setDeleteItem(null);
    await loadAttendances();
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAttendances.length / itemsPerPage)
  );

  const paginatedAttendances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendances.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttendances, currentPage, itemsPerPage]);

  const startAttendance =
    filteredAttendances.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endAttendance = Math.min(
    currentPage * itemsPerPage,
    filteredAttendances.length
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const stats = [
    {
      title: t.total,
      value: attendances.length,
      icon: CalendarCheck,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.active,
      value: filteredAttendances.length,
      icon: Search,
      iconBg: "bg-blue-500",
      percentBg: "bg-blue-50",
      percentText: "text-blue-600",
      percent: "73%",
      trend: "22%",
    },
    {
      title: t.archived,
      value: archivedCount,
      icon: AlertTriangle,
      iconBg: "bg-red-500",
      percentBg: "bg-red-50",
      percentText: "text-red-600",
      percent: "12%",
      trend: "0.9%",
    },
  ];

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1 transition-colors duration-300"
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      <div
        className={`flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between ${isArabic ? "lg:flex-row-reverse text-right" : "text-left"
          }`}
        style={{
          borderColor: "var(--border-color)",
          background: headerGradient,
        }}
      >
        <div>
          <p className="text-xs font-semibold text-purple-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>

          <p className="mt-1 text-sm font-semibold text-purple-100">
            {t.subtitle}
          </p>
        </div>

        <div
          className={`flex flex-col gap-3 sm:flex-row sm:items-center ${isArabic ? "sm:flex-row-reverse" : ""
            }`}
        >
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.search}
              className={`w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-purple-200 sm:w-64 ${isArabic ? "text-right" : "text-left"
                }`}
            />

            <Search size={17} className="text-purple-100" />
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setOpenAdd(true);
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
          >
            <Plus size={17} />
            {t.add}
          </button>

          <button
            type="button"
            onClick={() => setOpenArchiveDialog(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/15 shadow-sm transition hover:bg-white/15"
          >
            <Archive size={17} />
            {t.archive}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div
                className={`flex items-start justify-between ${isArabic ? "flex-row-reverse" : ""
                  }`}
              >
                <div
                  className={`flex items-center gap-4 ${isArabic ? "flex-row-reverse text-right" : "text-left"
                    }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black" style={textStyle}>
                      {item.value}
                    </h3>

                    <p className="text-xs font-semibold" style={mutedTextStyle}>
                      {item.title}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${item.percentBg}`}
                >
                  <span className={`text-[11px] font-black ${item.percentText}`}>
                    {item.percent}
                  </span>
                </div>
              </div>

              <div
                className={`mt-5 flex items-center gap-3 text-xs font-semibold ${isArabic ? "flex-row-reverse" : ""
                  }`}
              >
                <span style={mutedTextStyle}>{t.lastDays}</span>
                <span className="font-black text-emerald-500">
                  {item.trend}
                </span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className={`flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between ${isArabic ? "lg:flex-row-reverse" : ""
            }`}
          style={sectionStyle}
        >
          <div
            className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: headerGradient }}
            >
              <CalendarCheck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.list}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startAttendance} {t.to} {endAttendance} {t.of}{" "}
                {filteredAttendances.length} {t.attendances}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-xs font-bold outline-none transition"
              style={inputStyle}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[24%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[18%] px-5 py-4 font-black">{t.date}</th>
                <th className="w-[18%] px-5 py-4 font-black">{t.status}</th>
                <th className="w-[18%] px-5 py-4 font-black">{t.remark}</th>
                <th className="w-[12%] px-5 py-4 font-black">{t.actions}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : paginatedAttendances.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedAttendances.map((attendance) => {
                  const studentName = getStudentName(attendance);

                  return (
                    <tr
                      key={attendance.id}
                      className="border-b text-center text-sm transition last:border-none"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(studentName || "-")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {studentName}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.student}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {attendance.date || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                          style={{
                            backgroundColor: "var(--section-bg)",
                            color: "var(--primary-color)",
                          }}
                        >
                          {attendance.status || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {attendance.remarque || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailsItem(attendance)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(attendance)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteItem(attendance)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div
          className={`flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between ${isArabic ? "lg:flex-row-reverse" : ""
            }`}
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing}{" "}
            <span className="font-black" style={textStyle}>
              {startAttendance}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endAttendance}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredAttendances.length}
            </span>{" "}
            {t.attendances}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black transition"
                style={{
                  background:
                    currentPage === page ? headerGradient : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>


            <span className="rounded-xl px-4 py-2 text-xs font-black" style={inputStyle}>
              {t.page} {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      <AddAttendance
        open={openAdd}
        formData={formData}
        saving={saving}
        onClose={() => {
          resetForm();
          setOpenAdd(false);
        }}
        onChange={handleChange}
        onSubmit={handleAddSubmit}
      />

      <EditAttendance
        open={openEdit}
        formData={formData}
        saving={saving}
        onClose={() => {
          resetForm();
          setOpenEdit(false);
        }}
        onChange={handleChange}
        onSubmit={handleEditSubmit}
      />

      <DeleteAttendance
        open={!!deleteItem}
        attendance={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />

      <ArchiveAttendance
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={async () => {
          await loadArchivedCount();
          await loadAttendances();
        }}
      />

      <DetailsAttendance
        open={!!detailsItem}
        attendance={detailsItem}
        onClose={() => setDetailsItem(null)}
      />
    </div>
  );
}