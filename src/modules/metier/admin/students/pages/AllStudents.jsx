import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import {
  getAllStudents,
  addStudent,
  updateStudent,
  searchStudentsByName,
  downloadStudentsPdf,
  getArchivedStudents,
} from "../services/studentService";

import AddStudent from "./AddStudent";
import ArchivedStudents from "./ArchivedStudents";
import StudentDetails from "./StudentDetails";
import EditStudent from "./EditStudent";
import CreatedStudentAccountModal from "../components/CreatedStudentAccountModal";

const initialAddFormData = {
  nom: "",
  prenom: "",
  email: "",
  dateNaissance: "",
  genre: "",
  telephone: "",
  adresse: "",
};

const translations = {
  EN: {
    management: "Students Management",
    title: "All Students",
    subtitle: "Manage, view and archive student records.",
    search: "Search by last name...",
    add: "Add",
    archive: "Archive",
    pdf: "PDF",

    records: "Records",
    results: "Results",
    status: "Status",
    totalStudents: "Total Students",
    displayedStudents: "Displayed Students",
    archived: "Archived",

    studentsList: "Students List",
    showing: "Showing",
    to: "to",
    of: "of",
    students: "students",
    rows: "Rows:",
    page: "Page",
    previous: "Previous",
    next: "Next",

    student: "Student",
    email: "Email",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    actions: "Actions",

    loadingStudents: "Loading students...",
    noStudents: "No students found.",
    loadError: "Error while loading students",
    addError: "Error while adding the student",
    updateError: "Error while updating the student",

    view: "View",
    edit: "Edit",
    delete: "Delete",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Tous les étudiants",
    subtitle: "Gérer, consulter et archiver les dossiers des étudiants.",
    search: "Rechercher par nom...",
    add: "Ajouter",
    archive: "Archive",
    pdf: "PDF",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",
    totalStudents: "Total étudiants",
    displayedStudents: "Étudiants affichés",
    archived: "Archivés",

    studentsList: "Liste des étudiants",
    showing: "Affichage",
    to: "à",
    of: "sur",
    students: "étudiants",
    rows: "Lignes :",
    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    student: "Étudiant",
    email: "Email",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",
    actions: "Actions",

    loadingStudents: "Chargement des étudiants...",
    noStudents: "Aucun étudiant trouvé.",
    loadError: "Erreur lors du chargement des étudiants",
    addError: "Erreur lors de l’ajout de l’étudiant",
    updateError: "Erreur lors de la modification de l’étudiant",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "كل الطلاب",
    subtitle: "إدارة وعرض وأرشفة سجلات الطلاب.",
    search: "البحث بالاسم...",
    add: "إضافة",
    archive: "الأرشيف",
    pdf: "PDF",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",
    totalStudents: "إجمالي الطلاب",
    displayedStudents: "الطلاب المعروضون",
    archived: "المؤرشفون",

    studentsList: "قائمة الطلاب",
    showing: "عرض",
    to: "إلى",
    of: "من",
    students: "طلاب",
    rows: "الأسطر:",
    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    student: "الطالب",
    email: "البريد الإلكتروني",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
    actions: "الإجراءات",

    loadingStudents: "جاري تحميل الطلاب...",
    noStudents: "لا يوجد طلاب.",
    loadError: "حدث خطأ أثناء تحميل الطلاب",
    addError: "حدث خطأ أثناء إضافة الطالب",
    updateError: "حدث خطأ أثناء تعديل الطالب",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",
  },
};

export default function AllStudents() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [createdAccount, setCreatedAccount] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [addError, setAddError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const [addFormData, setAddFormData] = useState(initialAddFormData);

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
      const data = await getArchivedStudents();
      setArchivedCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Load archived students count error:", error);
      setArchivedCount(0);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await getAllStudents();
      const list = Array.isArray(data) ? data : [];

      setStudents(list);
      setTotalStudents(list.length);
      setCurrentPage(1);

      await loadArchivedCount();
    } catch (error) {
      console.error("Load students error:", error);
      alert(t.loadError);
      setStudents([]);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      loadStudents();
      return;
    }

    try {
      setSearching(true);

      const data = await searchStudentsByName(value.trim());
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search students error:", error);
      setStudents([]);
    } finally {
      setSearching(false);
    }
  };

  const handleOpenAddDialog = () => {
    setAddFormData(initialAddFormData);
    setAddError("");
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    if (savingAdd) return;

    setOpenAddDialog(false);
    setAddFormData(initialAddFormData);
    setAddError("");
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
      setAddError("");

      const response = await addStudent(addFormData);

      const newStudent = response?.student ?? response?.studentDTO ?? null;
      const username =
        response?.username ??
        response?.email ??
        newStudent?.email ??
        addFormData.email;
      const temporaryPassword =
        response?.temporaryPassword ??
        response?.tempPassword ??
        response?.password;

      if (!temporaryPassword) {
        throw new Error(
          "L’étudiant a été créé, mais aucun mot de passe temporaire n’a été retourné."
        );
      }

      setOpenAddDialog(false);
      setAddFormData(initialAddFormData);
      setCreatedAccount({
        username,
        temporaryPassword,
      });

      if (newStudent?.id) {
        setStudents((prev) => [newStudent, ...prev]);
        setTotalStudents((prev) => prev + 1);
      } else {
        await loadStudents();
      }
    } catch (error) {
      console.error("Add student error:", error);
      setAddError(
        error.response?.data?.message ??
          error.response?.data?.error ??
          error.message ??
          t.addError
      );
    } finally {
      setSavingAdd(false);
    }
  };

  const handleUpdateStudent = async (id, studentData) => {
    try {
      setSavingUpdate(true);

      const updatedStudent = await updateStudent(id, studentData);

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id ? updatedStudent : student
        )
      );

      setSelectedStudent(null);
    } catch (error) {
      console.error("Update student error:", error);
      alert(t.updateError);
    } finally {
      setSavingUpdate(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return students.slice(startIndex, startIndex + itemsPerPage);
  }, [students, currentPage, itemsPerPage]);

  const startStudent =
    students.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endStudent = Math.min(currentPage * itemsPerPage, students.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const stats = [
    {
      title: t.totalStudents,
      value: totalStudents,
      icon: Users,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedStudents,
      value: students.length,
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
              placeholder={t.search}
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
            onClick={downloadStudentsPdf}
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
              <Users size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.studentsList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startStudent} {t.to} {endStudent} {t.of}{" "}
                {students.length} {t.students}
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
          <table className="w-full min-w-[1080px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[18%] px-5 py-4 font-black">{t.student}</th>
                <th className="w-[21%] px-5 py-4 font-black">{t.email}</th>
                <th className="w-[10%] px-5 py-4 font-black">{t.gender}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.phone}</th>
                <th className="w-[17%] px-5 py-4 font-black">{t.address}</th>
                <th className="w-[20%] px-5 py-4 font-black">{t.actions}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 text-sm font-bold"
                      style={mutedTextStyle}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      {t.loadingStudents}
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noStudents}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const fullName = `${student.nom || ""} ${
                    student.prenom || ""
                  }`.trim();

                  return (
                    <tr
                      key={student.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(fullName || "-").charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {fullName || "-"}
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
                          {student.email || "-"}
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
                          {student.genre || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {student.telephone || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {student.adresse || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewStudent(student)}
                            title={t.view}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            disabled={!student.id}
                            title={t.edit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/students/delete/${student.id}`)
                            }
                            disabled={!student.id}
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
              {startStudent}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endStudent}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {students.length}
            </span>{" "}
            {t.students}
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

      <AddStudent
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        error={addError}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddStudent}
      />

      <CreatedStudentAccountModal
        account={createdAccount}
        onClose={() => setCreatedAccount(null)}
      />

      <StudentDetails
        student={viewStudent}
        onClose={() => setViewStudent(null)}
      />

      <EditStudent
        student={selectedStudent}
        saving={savingUpdate}
        onClose={() => setSelectedStudent(null)}
        onSubmit={handleUpdateStudent}
      />

      <ArchivedStudents
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredStudent) => {
          setStudents((prev) => [restoredStudent, ...prev]);
          setTotalStudents((prev) => prev + 1);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}