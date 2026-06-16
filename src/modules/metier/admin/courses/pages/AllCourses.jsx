import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  BookOpen,
  Archive,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react";

import {
  getAllCourses,
  getArchivedCourses,
  addCourse,
  updateCourse,
} from "../services/courseService";

import AddCourse from "../components/AddCourse";
import CourseDetails from "../components/CourseDetails";
import EditCourse from "../components/EditCourse";
import ArchivedCourses from "../components/ArchivedCourses";
import DeleteCourse from "../components/DeleteCourse";

const translations = {
  EN: {
    management: "Academics Management",
    title: "All Courses",
    subtitle: "Manage, view and archive course records.",

    searchPlaceholder: "Search course...",
    add: "Add",
    archive: "Archive",

    records: "Records",
    results: "Results",
    status: "Status",

    totalCourses: "Total Courses",
    displayedCourses: "Displayed Courses",
    archived: "Archived",

    coursesList: "Courses List",
    showing: "Showing",
    to: "to",
    of: "of",
    courses: "courses",
    rows: "Rows:",

    course: "Course",
    description: "Description",
    credits: "Credits",
    actions: "Actions",

    loadingCourses: "Loading courses...",
    noCourses: "No courses found.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    noName: "No name",
    noDescription: "No description",
    notDefined: "Not defined",

    page: "Page",
    previous: "Previous",
    next: "Next",

    courseNameRequired: "Course name is required",
    descriptionRequired: "Description is required",
    creditsRequired: "Credits must be greater than 0",
    addError: "Error while adding the course",
    updateError: "Error while updating the course",
    courseIdNotFound: "Course ID not found",
  },

  FR: {
    management: "Gestion académique",
    title: "Tous les cours",
    subtitle: "Gérer, consulter et archiver les cours.",

    searchPlaceholder: "Rechercher un cours...",
    add: "Ajouter",
    archive: "Archive",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",

    totalCourses: "Total cours",
    displayedCourses: "Cours affichés",
    archived: "Archivés",

    coursesList: "Liste des cours",
    showing: "Affichage",
    to: "à",
    of: "sur",
    courses: "cours",
    rows: "Lignes :",

    course: "Cours",
    description: "Description",
    credits: "Crédits",
    actions: "Actions",

    loadingCourses: "Chargement des cours...",
    noCourses: "Aucun cours trouvé.",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",

    noName: "Sans nom",
    noDescription: "Sans description",
    notDefined: "Non défini",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    courseNameRequired: "Le nom du cours est obligatoire",
    descriptionRequired: "La description est obligatoire",
    creditsRequired: "Les crédits doivent être supérieurs à 0",
    addError: "Erreur lors de l’ajout du cours",
    updateError: "Erreur lors de la modification du cours",
    courseIdNotFound: "ID du cours introuvable",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "كل الدورات",
    subtitle: "إدارة وعرض وأرشفة سجلات الدورات.",

    searchPlaceholder: "البحث عن دورة...",
    add: "إضافة",
    archive: "الأرشيف",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",

    totalCourses: "إجمالي الدورات",
    displayedCourses: "الدورات المعروضة",
    archived: "المؤرشفة",

    coursesList: "قائمة الدورات",
    showing: "عرض",
    to: "إلى",
    of: "من",
    courses: "دورات",
    rows: "الأسطر:",

    course: "الدورة",
    description: "الوصف",
    credits: "الأرصدة",
    actions: "الإجراءات",

    loadingCourses: "جاري تحميل الدورات...",
    noCourses: "لا توجد دورات.",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",

    noName: "بدون اسم",
    noDescription: "بدون وصف",
    notDefined: "غير محدد",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    courseNameRequired: "اسم الدورة مطلوب",
    descriptionRequired: "الوصف مطلوب",
    creditsRequired: "يجب أن تكون الأرصدة أكبر من 0",
    addError: "حدث خطأ أثناء إضافة الدورة",
    updateError: "حدث خطأ أثناء تعديل الدورة",
    courseIdNotFound: "معرف الدورة غير موجود",
  },
};

export default function AllCourses() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [courses, setCourses] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [viewCourse, setViewCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const emptyCourseForm = {
    nom: "",
    description: "",
    credits: "",
  };

  const [addFormData, setAddFormData] = useState(emptyCourseForm);
  const [editFormData, setEditFormData] = useState(emptyCourseForm);

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
      const archivedData = await getArchivedCourses();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived courses:", error);
      setArchivedCount(0);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);

      const data = await getAllCourses();
      setCourses(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const name = String(course.nom || course.name || "");
      const description = String(course.description || "");
      const credits = String(course.credits || "");

      return `${name} ${description} ${credits}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [courses, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / itemsPerPage)
  );

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  const startCourse =
    filteredCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endCourse = Math.min(
    currentPage * itemsPerPage,
    filteredCourses.length
  );

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
    setAddFormData(emptyCourseForm);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddFormData(emptyCourseForm);
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildCoursePayload = (formData) => {
    const credits = Number(formData.credits);

    return {
      nom: formData.nom.trim(),
      description: formData.description.trim(),
      credits,
    };
  };

  const validateCoursePayload = (payload) => {
    if (!payload.nom) {
      alert(t.courseNameRequired);
      return false;
    }

    if (!payload.description) {
      alert(t.descriptionRequired);
      return false;
    }

    if (!payload.credits || payload.credits < 1) {
      alert(t.creditsRequired);
      return false;
    }

    return true;
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const payload = buildCoursePayload(addFormData);

    if (!validateCoursePayload(payload)) return;

    try {
      setSavingAdd(true);

      const newCourse = await addCourse(payload);

      setCourses((prev) => [newCourse, ...prev]);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding course:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleViewClick = (course) => {
    setViewCourse(course);
  };

  const handleCloseViewDialog = () => {
    setViewCourse(null);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);

    setEditFormData({
      nom: course.nom || course.name || "",
      description: course.description || "",
      credits: course.credits ?? "",
    });
  };

  const handleCloseEditDialog = () => {
    setSelectedCourse(null);
    setEditFormData(emptyCourseForm);
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!selectedCourse?.id) {
      alert(t.courseIdNotFound);
      return;
    }

    const payload = buildCoursePayload(editFormData);

    if (!validateCoursePayload(payload)) return;

    try {
      setSavingUpdate(true);

      const updatedCourse = await updateCourse(selectedCourse.id, payload);

      setCourses((prev) =>
        prev.map((course) =>
          course.id === selectedCourse.id ? updatedCourse : course
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating course:", error);
      alert(t.updateError);
    } finally {
      setSavingUpdate(false);
    }
  };

  const stats = [
    {
      title: t.totalCourses,
      value: courses.length,
      icon: BookOpen,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedCourses,
      value: filteredCourses.length,
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
          background: "linear-gradient(135deg, var(--secondary-color), #020617)",
        }}
      >
        <div>
          <p className="text-xs font-semibold text-blue-200">
            {t.management}
          </p>

          <h1 className="mt-1 text-2xl font-black text-white">
            {t.title}
          </h1>

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
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.coursesList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startCourse} {t.to} {endCourse} {t.of}{" "}
                {filteredCourses.length} {t.courses}
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
          <table className="w-full min-w-[760px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[28%] px-5 py-4 font-black">{t.course}</th>
                <th className="w-[36%] px-5 py-4 font-black">
                  {t.description}
                </th>
                <th className="w-[12%] px-5 py-4 font-black">{t.credits}</th>
                <th className="w-[24%] px-5 py-4 font-black">{t.actions}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingCourses}
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noCourses}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => {
                  const courseName = course.nom || course.name || t.noName;
                  const description = course.description || t.noDescription;
                  const credits = course.credits ?? t.notDefined;

                  return (
                    <tr
                      key={course.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(courseName).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
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
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {description}
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
                          {credits}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewClick(course)}
                            title={t.view}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(course)}
                            title={t.edit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setCourseToDelete(course)}
                            disabled={!course.id}
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
              {startCourse}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endCourse}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredCourses.length}
            </span>{" "}
            {t.courses}
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
      <AddCourse
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddCourse}
      />

      <CourseDetails course={viewCourse} onClose={handleCloseViewDialog} />

      <EditCourse
        course={selectedCourse}
        formData={editFormData}
        saving={savingUpdate}
        onClose={handleCloseEditDialog}
        onChange={handleChangeEditForm}
        onSubmit={handleUpdateCourse}
      />

      <DeleteCourse
        open={!!courseToDelete}
        course={courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onDeleted={(deletedId) => {
          setCourses((prev) => prev.filter((course) => course.id !== deletedId));
          setArchivedCount((prev) => prev + 1);
          setCourseToDelete(null);
        }}
      />

      <ArchivedCourses
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredCourse) => {
          setCourses((prev) => [restoredCourse, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}