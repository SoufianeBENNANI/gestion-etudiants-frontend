import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Layers3,
  School,
  Archive,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
} from "lucide-react";

import {
  getAllClasses,
  getArchivedClasses,
  addClasse,
  updateClasse,
} from "../services/classeService";

import AddClasse from "../components/AddClasse";
import ClasseDetails from "../components/ClasseDetails";
import EditClasse from "../components/EditClasse";
import ArchivedClasses from "../components/ArchivedClasses";
import DeleteClasse from "../components/DeleteClasse";

const translations = {
  EN: {
    management: "Academics Management",
    title: "All Classes",
    subtitle: "Manage, view and archive class records.",

    searchPlaceholder: "Search class...",
    add: "Add",
    archive: "Archive",

    records: "Records",
    results: "Results",
    status: "Status",

    totalClasses: "Total Classes",
    displayedClasses: "Displayed Classes",
    archived: "Archived",

    classesList: "Classes List",
    showing: "Showing",
    to: "to",
    of: "of",
    classes: "classes",
    rows: "Rows:",

    class: "Class",
    level: "Level",
    academicYear: "Academic Year",
    actions: "Actions",

    loadingClasses: "Loading classes...",
    noClasses: "No classes found.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    noName: "No name",
    notDefined: "Not defined",

    page: "Page",
    previous: "Previous",
    next: "Next",

    addError: "Error while adding the class",
    updateError: "Error while updating the class",
    classIdNotFound: "Class ID not found",
  },

  FR: {
    management: "Gestion académique",
    title: "Toutes les classes",
    subtitle: "Gérer, consulter et archiver les classes.",

    searchPlaceholder: "Rechercher une classe...",
    add: "Ajouter",
    archive: "Archive",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",

    totalClasses: "Total classes",
    displayedClasses: "Classes affichées",
    archived: "Archivées",

    classesList: "Liste des classes",
    showing: "Affichage",
    to: "à",
    of: "sur",
    classes: "classes",
    rows: "Lignes :",

    class: "Classe",
    level: "Niveau",
    academicYear: "Année scolaire",
    actions: "Actions",

    loadingClasses: "Chargement des classes...",
    noClasses: "Aucune classe trouvée.",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",

    noName: "Sans nom",
    notDefined: "Non défini",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    addError: "Erreur lors de l’ajout de la classe",
    updateError: "Erreur lors de la modification de la classe",
    classIdNotFound: "ID de la classe introuvable",
  },

  AR: {
    management: "الإدارة الأكاديمية",
    title: "كل الأقسام",
    subtitle: "إدارة وعرض وأرشفة سجلات الأقسام.",

    searchPlaceholder: "البحث عن قسم...",
    add: "إضافة",
    archive: "الأرشيف",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",

    totalClasses: "إجمالي الأقسام",
    displayedClasses: "الأقسام المعروضة",
    archived: "المؤرشفة",

    classesList: "قائمة الأقسام",
    showing: "عرض",
    to: "إلى",
    of: "من",
    classes: "أقسام",
    rows: "الأسطر:",

    class: "القسم",
    level: "المستوى",
    academicYear: "السنة الدراسية",
    actions: "الإجراءات",

    loadingClasses: "جاري تحميل الأقسام...",
    noClasses: "لا توجد أقسام.",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",

    noName: "بدون اسم",
    notDefined: "غير محدد",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    addError: "حدث خطأ أثناء إضافة القسم",
    updateError: "حدث خطأ أثناء تعديل القسم",
    classIdNotFound: "معرف القسم غير موجود",
  },
};

export default function AllClasses() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [classes, setClasses] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [viewClasse, setViewClasse] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [classeToDelete, setClasseToDelete] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [addFormData, setAddFormData] = useState({
    nom: "",
    niveau: "",
    annee: "",
  });

  const [editFormData, setEditFormData] = useState({
    nom: "",
    niveau: "",
    annee: "",
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

  const loadArchivedCount = async () => {
    try {
      const archivedData = await getArchivedClasses();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived classes:", error);
      setArchivedCount(0);
    }
  };

  const loadClasses = async () => {
    try {
      setLoading(true);

      const data = await getAllClasses();
      setClasses(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading classes:", error);
      setClasses([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((classe) => {
      const name = String(classe.nom || classe.name || classe.className || "");
      const level = String(classe.niveau || classe.level || classe.grade || "");
      const year = String(classe.annee || "");

      return `${name} ${level} ${year}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [classes, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClasses.length / itemsPerPage)
  );

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClasses, currentPage, itemsPerPage]);

  const startClass =
    filteredClasses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endClass = Math.min(currentPage * itemsPerPage, filteredClasses.length);

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
    setAddFormData({
      nom: "",
      niveau: "",
      annee: "",
    });

    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);

    setAddFormData({
      nom: "",
      niveau: "",
      annee: "",
    });
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddClasse = async (e) => {
    e.preventDefault();

    try {
      setSavingAdd(true);

      const newClasse = await addClasse(addFormData);

      setClasses((prev) => [newClasse, ...prev]);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding class:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleViewClick = (classe) => {
    setViewClasse(classe);
  };

  const handleCloseViewDialog = () => {
    setViewClasse(null);
  };

  const handleEditClick = (classe) => {
    setSelectedClasse(classe);

    setEditFormData({
      nom: classe.nom || classe.name || classe.className || "",
      niveau: classe.niveau || classe.level || classe.grade || "",
      annee: classe.annee || "",
    });
  };

  const handleCloseEditDialog = () => {
    setSelectedClasse(null);

    setEditFormData({
      nom: "",
      niveau: "",
      annee: "",
    });
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateClasse = async (e) => {
    e.preventDefault();

    if (!selectedClasse?.id) {
      alert(t.classIdNotFound);
      return;
    }

    try {
      setSavingUpdate(true);

      const updatedClasse = await updateClasse(selectedClasse.id, editFormData);

      setClasses((prev) =>
        prev.map((classe) =>
          classe.id === selectedClasse.id ? updatedClasse : classe
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating class:", error);
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
              <Layers3 size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                {t.management}
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                {t.title}
              </h1>

              <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
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
              <School size={22} />
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
            {t.totalClasses}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {classes.length}
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
            {t.displayedClasses}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {filteredClasses.length}
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
              <Layers3 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.classesList}
              </h2>

              <p className="mt-0.5 text-xs" style={mutedTextStyle}>
                {t.showing} {startClass} {t.to} {endClass} {t.of}{" "}
                {filteredClasses.length} {t.classes}
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
              <th className="w-[30%] px-3 py-3 font-black">{t.class}</th>
              <th className="w-[22%] px-3 py-3 font-black">{t.level}</th>
              <th className="w-[22%] px-3 py-3 font-black">
                {t.academicYear}
              </th>
              <th className="w-[26%] px-3 py-3 font-black">{t.actions}</th>
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
                    {t.loadingClasses}
                  </div>
                </td>
              </tr>
            ) : filteredClasses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-5 py-8 text-center">
                  <span className="text-sm font-bold" style={mutedTextStyle}>
                    {t.noClasses}
                  </span>
                </td>
              </tr>
            ) : (
              paginatedClasses.map((classe) => {
                const className =
                  classe.nom || classe.name || classe.className || t.noName;

                const level =
                  classe.niveau || classe.level || classe.grade || t.notDefined;

                const year = classe.annee || t.notDefined;

                return (
                  <tr
                    key={classe.id}
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
                          <Layers3 size={17} />
                        </div>

                        <span className="truncate font-black" style={textStyle}>
                          {className}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="block truncate text-sm font-semibold"
                        style={mutedTextStyle}
                      >
                        {level}
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
                        {year}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewClick(classe)}
                          title={t.view}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white transition hover:opacity-80"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(classe)}
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
                          onClick={() => setClasseToDelete(classe)}
                          disabled={!classe.id}
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
      <AddClasse
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddClasse}
      />

      <ClasseDetails classe={viewClasse} onClose={handleCloseViewDialog} />

      <EditClasse
        classe={selectedClasse}
        formData={editFormData}
        saving={savingUpdate}
        onClose={handleCloseEditDialog}
        onChange={handleChangeEditForm}
        onSubmit={handleUpdateClasse}
      />

      <DeleteClasse
        open={!!classeToDelete}
        classe={classeToDelete}
        onClose={() => setClasseToDelete(null)}
        onDeleted={(deletedId) => {
          setClasses((prev) => prev.filter((classe) => classe.id !== deletedId));
          setArchivedCount((prev) => prev + 1);
          setClasseToDelete(null);
        }}
      />

      <ArchivedClasses
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredClasse) => {
          setClasses((prev) => [restoredClasse, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}