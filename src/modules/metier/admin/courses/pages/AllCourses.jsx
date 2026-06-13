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
              <BookOpen size={28} />
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

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddDialog}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Plus size={17} />
              {t.add}
            </button>

            <button
              type="button"
              onClick={() => setOpenArchiveDialog(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Archive size={17} />
              {t.archive}
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={cardStyle}
        >
          <div className="mb-5 flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <BookOpen size={22} />
            </div>

            <span
              className="rounded-full px-3 py-1.5 text-xs font-black"
              style={{
                backgroundColor: "var(--section-bg)",
                color: "var(--primary-color)",
              }}
            >
              {t.records}
            </span>
          </div>

          <p className="text-sm font-black" style={textStyle}>
            {t.totalCourses}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {courses.length}
          </h2>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={cardStyle}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <Search size={22} />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
              {t.results}
            </span>
          </div>

          <p className="text-sm font-black" style={textStyle}>
            {t.displayedCourses}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {filteredCourses.length}
          </h2>
        </div>

        <div
          className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={cardStyle}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
              <AlertTriangle size={22} />
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-500">
              {t.status}
            </span>
          </div>

          <p className="text-sm font-black" style={textStyle}>
            {t.archived}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {archivedCount}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm transition-colors duration-300"
        style={cardStyle}
      >
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.coursesList}
              </h2>

              <p className="mt-0.5 text-xs" style={mutedTextStyle}>
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

        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr
              className="text-center text-[11px] uppercase tracking-wide"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--muted-text)",
              }}
            >
              <th className="w-[28%] px-3 py-3 font-black">{t.course}</th>
              <th className="w-[36%] px-3 py-3 font-black">
                {t.description}
              </th>
              <th className="w-[12%] px-3 py-3 font-black">{t.credits}</th>
              <th className="w-[24%] px-3 py-3 font-black">{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-5 py-8 text-center">
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
                <td colSpan="4" className="px-5 py-8 text-center">
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
                    className="border-t text-center text-sm transition"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div
                          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white sm:flex"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <BookOpen size={17} />
                        </div>

                        <span className="truncate font-black" style={textStyle}>
                          {courseName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {description}
                      </span>
                    </td>

                    <td className="px-3 py-3">
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

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewClick(course)}
                          title={t.view}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white transition hover:opacity-80"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(course)}
                          title={t.edit}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                          style={{
                            backgroundColor: "var(--section-bg)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-color)",
                          }}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCourseToDelete(course)}
                          disabled={!course.id}
                          title={t.delete}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* PAGINATION */}
        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p className="text-xs font-semibold" style={mutedTextStyle}>
            {t.page}{" "}
            <span className="font-black" style={textStyle}>
              {currentPage}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {totalPages}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
              {t.previous}
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
                  color:
                    currentPage === page ? "#ffffff" : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={inputStyle}
            >
              {t.next}
              <ChevronRight size={16} />
            </button>
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