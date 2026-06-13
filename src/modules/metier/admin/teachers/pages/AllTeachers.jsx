import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  Pencil,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Archive,
  Loader2,
  Plus,
  Eye,
  FileDown,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";

import {
  getAllTeachers,
  addTeacher,
  updateTeacher,
  searchTeachersByName,
  downloadTeachersPdf,
  getArchivedTeachers,
} from "../service/teacherService";

import AddTeacher from "../components/AddTeacher";
import ArchivedTeachers from "../components/ArchivedTeachers";
import TeacherDetails from "../components/TeacherDetails";
import EditTeacher from "../components/EditTeacher";
import DeleteTeacher from "../components/DeleteTeacher";

const translations = {
  EN: {
    management: "Teachers Management",
    title: "All Teachers",
    subtitle: "Manage, view and archive teacher records.",

    searchPlaceholder: "Search teacher...",
    add: "Add",
    archive: "Archive",
    pdf: "PDF",

    records: "Records",
    results: "Results",
    status: "Status",

    totalTeachers: "Total Teachers",
    displayedTeachers: "Displayed Teachers",
    archived: "Archived",

    teachersList: "Teachers List",
    showing: "Showing",
    to: "to",
    of: "of",
    teachers: "teachers",
    rows: "Rows:",

    teacher: "Teacher",
    email: "Email",
    speciality: "Speciality",
    department: "Department",
    actions: "Actions",

    loadingTeachers: "Loading teachers...",
    noTeachers: "No teachers found.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    page: "Page",
    previous: "Previous",
    next: "Next",

    loadError: "Error while loading teachers.",
    addError: "Error while adding the teacher.",
    updateError: "Error while updating the teacher.",
  },

  FR: {
    management: "Gestion des enseignants",
    title: "Tous les enseignants",
    subtitle: "Gérer, consulter et archiver les enseignants.",

    searchPlaceholder: "Rechercher un enseignant...",
    add: "Ajouter",
    archive: "Archive",
    pdf: "PDF",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",

    totalTeachers: "Total enseignants",
    displayedTeachers: "Enseignants affichés",
    archived: "Archivés",

    teachersList: "Liste des enseignants",
    showing: "Affichage",
    to: "à",
    of: "sur",
    teachers: "enseignants",
    rows: "Lignes :",

    teacher: "Enseignant",
    email: "Email",
    speciality: "Spécialité",
    department: "Département",
    actions: "Actions",

    loadingTeachers: "Chargement des enseignants...",
    noTeachers: "Aucun enseignant trouvé.",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    loadError: "Erreur lors du chargement des enseignants.",
    addError: "Erreur lors de l’ajout de l’enseignant.",
    updateError: "Erreur lors de la modification de l’enseignant.",
  },

  AR: {
    management: "إدارة الأساتذة",
    title: "كل الأساتذة",
    subtitle: "إدارة وعرض وأرشفة سجلات الأساتذة.",

    searchPlaceholder: "البحث عن أستاذ...",
    add: "إضافة",
    archive: "الأرشيف",
    pdf: "PDF",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",

    totalTeachers: "إجمالي الأساتذة",
    displayedTeachers: "الأساتذة المعروضون",
    archived: "المؤرشفون",

    teachersList: "قائمة الأساتذة",
    showing: "عرض",
    to: "إلى",
    of: "من",
    teachers: "أساتذة",
    rows: "الأسطر:",

    teacher: "الأستاذ",
    email: "البريد الإلكتروني",
    speciality: "التخصص",
    department: "القسم",
    actions: "الإجراءات",

    loadingTeachers: "جاري تحميل الأساتذة...",
    noTeachers: "لا يوجد أساتذة.",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    loadError: "حدث خطأ أثناء تحميل الأساتذة.",
    addError: "حدث خطأ أثناء إضافة الأستاذ.",
    updateError: "حدث خطأ أثناء تعديل الأستاذ.",
  },
};

export default function AllTeachers() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [teachers, setTeachers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [viewTeacher, setViewTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const [addFormData, setAddFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
    departementId: "",
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

  const normalizeTeachers = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadArchivedCount = async () => {
    try {
      const data = await getArchivedTeachers();
      const archivedTeachers = normalizeTeachers(data);
      setArchivedCount(archivedTeachers.length);
    } catch (error) {
      console.error("Load archived teachers count error:", error);
      setArchivedCount(0);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoading(true);

      const data = await getAllTeachers();
      const teachersList = normalizeTeachers(data);

      setTeachers(teachersList);
      setTotalTeachers(teachersList.length);
      setCurrentPage(1);

      await loadArchivedCount();
    } catch (error) {
      console.error("Load teachers error:", error);
      alert(t.loadError);
      setTeachers([]);
      setTotalTeachers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      loadTeachers();
      return;
    }

    try {
      setSearching(true);

      const data = await searchTeachersByName(value.trim());
      const teachersList = normalizeTeachers(data);

      setTeachers(teachersList);
    } catch (error) {
      console.error("Search teachers error:", error);
      setTeachers([]);
    } finally {
      setSearching(false);
    }
  };

  const handleOpenAddDialog = () => {
    setAddFormData({
      nom: "",
      prenom: "",
      email: "",
      specialite: "",
      departementId: "",
    });

    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);

    setAddFormData({
      nom: "",
      prenom: "",
      email: "",
      specialite: "",
      departementId: "",
    });
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();

    try {
      setSavingAdd(true);

      const newTeacher = await addTeacher(addFormData);

      setTeachers((prev) => [newTeacher, ...prev]);
      setTotalTeachers((prev) => prev + 1);

      handleCloseAddDialog();
    } catch (error) {
      console.error("Add teacher error:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleUpdateTeacher = async (id, teacherData) => {
    if (!id) return;

    try {
      setSavingUpdate(true);

      const updatedTeacher = await updateTeacher(id, teacherData);

      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === id ? updatedTeacher : teacher
        )
      );

      setSelectedTeacher(null);
    } catch (error) {
      console.error("Update teacher error:", error);
      alert(t.updateError);
    } finally {
      setSavingUpdate(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(teachers.length / itemsPerPage));

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return teachers.slice(startIndex, startIndex + itemsPerPage);
  }, [teachers, currentPage, itemsPerPage]);

  const startTeacher =
    teachers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endTeacher = Math.min(currentPage * itemsPerPage, teachers.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-10 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />

              {searching && (
                <Loader2
                  size={17}
                  className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-300"
                />
              )}
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

            <button
              type="button"
              onClick={downloadTeachersPdf}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 ring-1 ring-red-300/30 transition hover:-translate-y-0.5 hover:opacity-80"
            >
              <FileDown size={17} />
              {t.pdf}
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
              <GraduationCap size={22} />
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
            {t.totalTeachers}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {totalTeachers}
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
            {t.displayedTeachers}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {teachers.length}
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
              <Users size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.teachersList}
              </h2>

              <p className="mt-0.5 text-xs" style={mutedTextStyle}>
                {t.showing} {startTeacher} {t.to} {endTeacher} {t.of}{" "}
                {teachers.length} {t.teachers}
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

        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr
              className="text-center text-[11px] uppercase tracking-wide"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--muted-text)",
              }}
            >
              <th className="w-[22%] px-3 py-3 font-black">{t.teacher}</th>
              <th className="w-[25%] px-3 py-3 font-black">{t.email}</th>
              <th className="w-[19%] px-3 py-3 font-black">
                {t.speciality}
              </th>
              <th className="w-[20%] px-3 py-3 font-black">
                {t.department}
              </th>
              <th className="w-[14%] px-3 py-3 font-black">{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center">
                  <div
                    className="flex items-center justify-center gap-2 text-sm font-bold"
                    style={mutedTextStyle}
                  >
                    <Loader2 size={18} className="animate-spin" />
                    {t.loadingTeachers}
                  </div>
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center">
                  <span className="text-sm font-bold" style={mutedTextStyle}>
                    {t.noTeachers}
                  </span>
                </td>
              </tr>
            ) : (
              paginatedTeachers.map((teacher) => {
                const fullName = `${teacher.nom || ""} ${
                  teacher.prenom || ""
                }`.trim();

                const department =
                  teacher.departement?.nom ||
                  teacher.departementNom ||
                  teacher.nomDepartement ||
                  "-";

                return (
                  <tr
                    key={teacher.id}
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
                          <GraduationCap size={17} />
                        </div>

                        <span className="truncate font-black" style={textStyle}>
                          {fullName || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate" style={mutedTextStyle}>
                        {teacher.email || "-"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="block truncate font-semibold"
                        style={mutedTextStyle}
                      >
                        {teacher.specialite || "-"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="inline-flex max-w-full rounded-full px-3 py-1.5 text-xs font-black"
                        style={{
                          backgroundColor: "var(--section-bg)",
                          color: "var(--primary-color)",
                        }}
                      >
                        <span className="truncate">{department}</span>
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewTeacher(teacher)}
                          title={t.view}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white transition hover:opacity-80"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTeacher(teacher)}
                          disabled={!teacher.id}
                          title={t.edit}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
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
                          onClick={() => setTeacherToDelete(teacher)}
                          disabled={!teacher.id}
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

      <AddTeacher
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddTeacher}
      />

      <TeacherDetails
        teacher={viewTeacher}
        onClose={() => setViewTeacher(null)}
      />

      <EditTeacher
        teacher={selectedTeacher}
        saving={savingUpdate}
        onClose={() => setSelectedTeacher(null)}
        onSubmit={handleUpdateTeacher}
      />

      <DeleteTeacher
        open={!!teacherToDelete}
        teacher={teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        onDeleted={(deletedId) => {
          setTeachers((prev) =>
            prev.filter((teacher) => teacher.id !== deletedId)
          );
          setTotalTeachers((prev) => Math.max(prev - 1, 0));
          setArchivedCount((prev) => prev + 1);
          setTeacherToDelete(null);
        }}
      />

      <ArchivedTeachers
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredTeacher) => {
          setTeachers((prev) => [restoredTeacher, ...prev]);
          setTotalTeachers((prev) => prev + 1);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}