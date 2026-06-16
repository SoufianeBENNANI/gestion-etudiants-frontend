import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  GraduationCap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  AlertTriangle,
  Archive,
  BookOpen,
  User,
  TrendingUp,
} from "lucide-react";

import api from "../../../../../api/axios";

import {
  addGrade,
  getAllGrades,
  getArchivedGrades,
  updateGrade,
} from "../services/gradeService";

import AddGrade from "../components/AddGrade";
import EditGrade from "../components/EditGrade";
import GradeDetails from "../components/GradeDetails";
import ArchivedGrade from "../components/ArchivedGrade";
import DeleteGrade from "../components/DeleteGrade";

const translations = {
  EN: {
    management: "Evaluation",
    title: "All Grades",
    subtitle: "Manage, view and archive student grade records.",

    searchPlaceholder: "Search grade...",
    add: "Add",
    archive: "Archive",

    records: "Records",
    results: "Results",
    status: "Status",

    totalGrades: "Total Grades",
    displayedGrades: "Displayed Grades",
    archived: "Archived",

    gradesList: "Grades List",
    showing: "Showing",
    to: "to",
    of: "of",
    grades: "grades",
    rows: "Rows:",

    note: "Note",
    semester: "Semester",
    student: "Student",
    course: "Course",
    actions: "Actions",

    loadingGrades: "Loading grades...",
    noGrades: "No grades found.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    page: "Page",
    previous: "Previous",
    next: "Next",

    noteRequired: "Note is required",
    noteRange: "Note must be between 0 and 20",
    semesterRequired: "Semester is required",
    studentRequired: "Student is required",
    courseRequired: "Course is required",
    gradeIdNotFound: "Grade ID not found",
    addError: "Error while adding grade",
    updateError: "Error while updating grade",

    notAvailable: "N/A",
  },

  FR: {
    management: "Évaluation",
    title: "Toutes les notes",
    subtitle: "Gérer, consulter et archiver les notes des étudiants.",

    searchPlaceholder: "Rechercher une note...",
    add: "Ajouter",
    archive: "Archive",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",

    totalGrades: "Total notes",
    displayedGrades: "Notes affichées",
    archived: "Archivées",

    gradesList: "Liste des notes",
    showing: "Affichage",
    to: "à",
    of: "sur",
    grades: "notes",
    rows: "Lignes :",

    note: "Note",
    semester: "Semestre",
    student: "Étudiant",
    course: "Cours",
    actions: "Actions",

    loadingGrades: "Chargement des notes...",
    noGrades: "Aucune note trouvée.",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    noteRequired: "La note est obligatoire",
    noteRange: "La note doit être entre 0 et 20",
    semesterRequired: "Le semestre est obligatoire",
    studentRequired: "L’étudiant est obligatoire",
    courseRequired: "Le cours est obligatoire",
    gradeIdNotFound: "ID de la note introuvable",
    addError: "Erreur lors de l’ajout de la note",
    updateError: "Erreur lors de la modification de la note",

    notAvailable: "N/A",
  },

  AR: {
    management: "التقييم",
    title: "كل النقط",
    subtitle: "إدارة وعرض وأرشفة نقط الطلاب.",

    searchPlaceholder: "البحث عن نقطة...",
    add: "إضافة",
    archive: "الأرشيف",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",

    totalGrades: "إجمالي النقط",
    displayedGrades: "النقط المعروضة",
    archived: "المؤرشفة",

    gradesList: "قائمة النقط",
    showing: "عرض",
    to: "إلى",
    of: "من",
    grades: "نقط",
    rows: "الأسطر:",

    note: "النقطة",
    semester: "الفصل",
    student: "الطالب",
    course: "المادة",
    actions: "الإجراءات",

    loadingGrades: "جاري تحميل النقط...",
    noGrades: "لا توجد نقط.",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    noteRequired: "النقطة مطلوبة",
    noteRange: "يجب أن تكون النقطة بين 0 و 20",
    semesterRequired: "الفصل مطلوب",
    studentRequired: "الطالب مطلوب",
    courseRequired: "المادة مطلوبة",
    gradeIdNotFound: "معرف النقطة غير موجود",
    addError: "حدث خطأ أثناء إضافة النقطة",
    updateError: "حدث خطأ أثناء تعديل النقطة",

    notAvailable: "N/A",
  },
};

export default function AllGrades() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [viewGrade, setViewGrade] = useState(null);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const emptyGradeForm = {
    note: "",
    semestre: "",
    studentId: "",
    courseId: "",
  };

  const [addFormData, setAddFormData] = useState(emptyGradeForm);
  const [editFormData, setEditFormData] = useState(emptyGradeForm);

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

  const loadArchivedCount = async () => {
    try {
      const archivedData = await getArchivedGrades();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived grades:", error);
      setArchivedCount(0);
    }
  };

  const loadStudentsAndCourses = async () => {
    try {
      const [studentsResponse, coursesResponse] = await Promise.all([
        api.get("/Students/AllStudents"),
        api.get("/Courses/AllCourses"),
      ]);

      setStudents(
        Array.isArray(studentsResponse.data) ? studentsResponse.data : []
      );

      setCourses(Array.isArray(coursesResponse.data) ? coursesResponse.data : []);
    } catch (error) {
      console.error("Error loading students/courses:", error);
      setStudents([]);
      setCourses([]);
    }
  };

  const loadGrades = async () => {
    try {
      setLoading(true);

      const data = await getAllGrades();
      setGrades(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading grades:", error);
      setGrades([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
    loadStudentsAndCourses();
  }, []);

  const getStudentName = (grade) => {
    return (
      grade.studentName ||
      `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
      grade.student?.name ||
      t.notAvailable
    );
  };

  const getCourseName = (grade) => {
    return (
      grade.courseName ||
      grade.courses?.nom ||
      grade.courses?.name ||
      grade.course?.nom ||
      grade.course?.name ||
      t.notAvailable
    );
  };

  const getCourseId = (grade) => {
    return grade.courseId || grade.courses?.id || grade.course?.id || "";
  };

  const filteredGrades = useMemo(() => {
    return grades.filter((grade) => {
      const note = String(grade.note || "");
      const semestre = String(grade.semestre || "");
      const studentName = getStudentName(grade);
      const courseName = getCourseName(grade);

      return `${note} ${semestre} ${studentName} ${courseName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [grades, searchTerm, language]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGrades.length / itemsPerPage)
  );

  const paginatedGrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGrades.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGrades, currentPage, itemsPerPage]);

  const startGrade =
    filteredGrades.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endGrade = Math.min(currentPage * itemsPerPage, filteredGrades.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleOpenAddDialog = () => {
    setAddFormData(emptyGradeForm);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddFormData(emptyGradeForm);
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildGradePayload = (formData) => {
    return {
      note: formData.note === "" ? null : Number(formData.note),
      semestre: formData.semestre.trim(),
      studentId: formData.studentId === "" ? null : Number(formData.studentId),
      courseId: formData.courseId === "" ? null : Number(formData.courseId),
    };
  };

  const validateGradePayload = (payload) => {
    if (payload.note === null || Number.isNaN(payload.note)) {
      alert(t.noteRequired);
      return false;
    }

    if (payload.note < 0 || payload.note > 20) {
      alert(t.noteRange);
      return false;
    }

    if (!payload.semestre) {
      alert(t.semesterRequired);
      return false;
    }

    if (!payload.studentId) {
      alert(t.studentRequired);
      return false;
    }

    if (!payload.courseId) {
      alert(t.courseRequired);
      return false;
    }

    return true;
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();

    const payload = buildGradePayload(addFormData);

    if (!validateGradePayload(payload)) return;

    try {
      setSavingAdd(true);

      const newGrade = await addGrade(payload);

      setGrades((prev) => [newGrade, ...prev]);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding grade:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleEditClick = (grade) => {
    setSelectedGrade(grade);

    setEditFormData({
      note: grade.note ?? "",
      semestre: grade.semestre || "",
      studentId: grade.studentId || grade.student?.id || "",
      courseId: getCourseId(grade),
    });

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedGrade(null);
    setEditFormData(emptyGradeForm);
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();

    if (!selectedGrade?.id) {
      alert(t.gradeIdNotFound);
      return;
    }

    const payload = buildGradePayload(editFormData);

    if (!validateGradePayload(payload)) return;

    try {
      setSavingUpdate(true);

      const updatedGrade = await updateGrade(selectedGrade.id, payload);

      setGrades((prev) =>
        prev.map((grade) =>
          grade.id === selectedGrade.id ? updatedGrade : grade
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating grade:", error);
      alert(t.updateError);
    } finally {
      setSavingUpdate(false);
    }
  };

  const stats = [
    {
      title: t.totalGrades,
      value: grades.length,
      icon: GraduationCap,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedGrades,
      value: filteredGrades.length,
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
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <div
        className="flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
        style={{
          borderColor: "var(--border-color)",
          background:
            "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div>
          <p className="text-xs font-semibold text-blue-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">{t.title}</h1>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-64"
            />

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAddDialog}
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

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              style={cardStyle}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
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

              <div className="mt-5 flex items-center gap-3 text-xs font-semibold">
                <span style={mutedTextStyle}>Last 30 days</span>

                <span className="font-black text-emerald-500">
                  {item.trend}
                </span>

                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              <GraduationCap size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.gradesList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startGrade} {t.to} {endGrade} {t.of}{" "}
                {filteredGrades.length} {t.grades}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={mutedTextStyle}>
              {t.rows}
            </span>

            <select
              value={itemsPerPage}
              onChange={handleChangeItemsPerPage}
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
          <table className="w-full min-w-[920px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[16%] px-5 py-4 font-black">{t.note}</th>
                <th className="w-[16%] px-5 py-4 font-black">{t.semester}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.course}</th>
                <th className="w-[20%] px-5 py-4 font-black">{t.actions}</th>
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
                      {t.loadingGrades}
                    </div>
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noGrades}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedGrades.map((grade) => {
                  const note = grade.note ?? t.notAvailable;
                  const semestre = grade.semestre || t.notAvailable;
                  const studentName = getStudentName(grade);
                  const courseName = getCourseName(grade);

                  return (
                    <tr
                      key={grade.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                          {note}/20
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
                          {semestre}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <User size={17} />
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
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <BookOpen size={17} />
                          </div>

                          <div className="min-w-0 text-center">
                            <p
                              className="truncate font-bold"
                              style={mutedTextStyle}
                            >
                              {courseName}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.course}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewGrade(grade)}
                            title={t.view}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(grade)}
                            title={t.edit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setGradeToDelete(grade)}
                            disabled={!grade.id}
                            title={t.delete}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* PAGINATION */}
        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.showing}{" "}
            <span className="font-black" style={textStyle}>
              {startGrade}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endGrade}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredGrades.length}
            </span>{" "}
            {t.grades}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
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
                  backgroundColor:
                    currentPage === page
                      ? "var(--secondary-color)"
                      : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span
              className="rounded-xl px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              {t.page} {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* DIALOGS */}
      <AddGrade
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        students={students}
        courses={courses}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddGrade}
      />

      {openEditDialog && (
        <EditGrade
          grade={selectedGrade}
          formData={editFormData}
          saving={savingUpdate}
          students={students}
          courses={courses}
          onClose={handleCloseEditDialog}
          onChange={handleChangeEditForm}
          onSubmit={handleUpdateGrade}
        />
      )}

      <GradeDetails grade={viewGrade} onClose={() => setViewGrade(null)} />

      <DeleteGrade
        open={!!gradeToDelete}
        grade={gradeToDelete}
        onClose={() => setGradeToDelete(null)}
        onDeleted={(deletedId) => {
          setGrades((prev) => prev.filter((grade) => grade.id !== deletedId));
          setArchivedCount((prev) => prev + 1);
          setGradeToDelete(null);
        }}
      />

      <ArchivedGrade
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredGrade) => {
          setGrades((prev) => [restoredGrade, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}