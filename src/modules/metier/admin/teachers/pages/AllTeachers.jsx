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
import CreatedTeacherAccountModal from "../components/CreatedTeacherAccountModal";

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
    localStorage.getItem("app-language") || "EN",
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
  const [createdAccount, setCreatedAccount] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [addError, setAddError] = useState("");

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

    setAddError("");
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    if (savingAdd) return;

    setOpenAddDialog(false);
    setAddError("");

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
      setAddError("");

      const response = await addTeacher(addFormData);
      const newTeacher = response?.teacher ?? response?.teacherDTO ?? null;
      const username =
        response?.username ??
        response?.email ??
        newTeacher?.email ??
        addFormData.email;
      const temporaryPassword =
        response?.temporaryPassword ??
        response?.tempPassword ??
        response?.password;

      if (!temporaryPassword) {
        throw new Error(
          "L’enseignant a été créé, mais aucun mot de passe temporaire n’a été retourné.",
        );
      }

      setOpenAddDialog(false);
      setAddFormData({
        nom: "",
        prenom: "",
        email: "",
        specialite: "",
        departementId: "",
      });
      setCreatedAccount({ username, temporaryPassword });

      if (newTeacher?.id) {
        setTeachers((prev) => [newTeacher, ...prev]);
        setTotalTeachers((prev) => prev + 1);
      } else {
        await loadTeachers();
      }
    } catch (error) {
      console.error("Add teacher error:", error);
      setAddError(
        error.response?.data?.message ??
          error.response?.data?.error ??
          error.message ??
          t.addError,
      );
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
          teacher.id === id ? updatedTeacher : teacher,
        ),
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
    (_, index) => index + 1,
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const stats = [
    {
      title: t.totalTeachers,
      value: totalTeachers,
      label: t.records,
      icon: GraduationCap,
      iconBg: "bg-orange-500",
      labelClass: "bg-orange-50 text-orange-600",
    },
    {
      title: t.displayedTeachers,
      value: teachers.length,
      label: t.results,
      icon: Search,
      iconBg: "bg-blue-500",
      labelClass: "bg-blue-50 text-blue-600",
    },
    {
      title: t.archived,
      value: archivedCount,
      label: t.status,
      icon: AlertTriangle,
      iconBg: "bg-red-500",
      labelClass: "bg-red-50 text-red-600",
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
          <p className="text-xs font-semibold text-blue-200">{t.management}</p>

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
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
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

          <button
            type="button"
            onClick={downloadTeachersPdf}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
          >
            <FileDown size={17} />
            {t.pdf}
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

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${item.labelClass}`}
                >
                  {item.label}
                </span>
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
              <Users size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.teachersList}
              </h2>

              <p
                className="mt-0.5 text-xs font-semibold"
                style={mutedTextStyle}
              >
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
          <table className="w-full min-w-[980px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[24%] px-5 py-4 font-black">{t.teacher}</th>
                <th className="w-[26%] px-5 py-4 font-black">{t.email}</th>
                <th className="w-[18%] px-5 py-4 font-black">{t.speciality}</th>
                <th className="w-[17%] px-5 py-4 font-black">{t.department}</th>
                <th className="w-[15%] px-5 py-4 font-black">{t.actions}</th>
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
                      {t.loadingTeachers}
                    </div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
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
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(fullName || "-")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p
                              className="truncate font-black"
                              style={textStyle}
                            >
                              {fullName || "-"}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.teacher}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {teacher.email || "-"}
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
                          {teacher.specialite || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {department}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewTeacher(teacher)}
                            title={t.view}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedTeacher(teacher)}
                            disabled={!teacher.id}
                            title={t.edit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setTeacherToDelete(teacher)}
                            disabled={!teacher.id}
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
              {startTeacher}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endTeacher}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {teachers.length}
            </span>{" "}
            {t.teachers}
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

      <AddTeacher
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        error={addError}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddTeacher}
      />

      <CreatedTeacherAccountModal
        account={createdAccount}
        onClose={() => setCreatedAccount(null)}
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
            prev.filter((teacher) => teacher.id !== deletedId),
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