import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Building2,
  Archive,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
} from "lucide-react";

import {
  getAllDepartements,
  getArchivedDepartements,
  addDepartement,
  updateDepartement,
} from "../service/departementService";

import AddDepartement from "../components/AddDepartement";
import DepartementDetails from "../components/DepartementDetails";
import EditDepartement from "../components/EditDepartement";
import ArchivedDepartement from "../components/ArchivedDepartement";
import DeleteDepartement from "../components/DeleteDepartement";

const translations = {
  EN: {
    management: "Optional Management",
    title: "All Departments",
    subtitle: "Manage, view and archive department records.",

    searchPlaceholder: "Search department...",
    add: "Add",
    archive: "Archive",

    records: "Records",
    results: "Results",
    status: "Status",

    totalDepartments: "Total Departments",
    displayedDepartments: "Displayed Departments",
    archived: "Archived",

    departmentsList: "Departments List",
    showing: "Showing",
    to: "to",
    of: "of",
    departments: "departments",
    rows: "Rows:",

    department: "Department",
    description: "Description",
    actions: "Actions",

    loadingDepartments: "Loading departments...",
    noDepartments: "No departments found.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    noName: "No name",
    noDescription: "No description",

    page: "Page",
    previous: "Previous",
    next: "Next",

    departmentNameRequired: "Department name is required",
    descriptionRequired: "Description is required",
    addError: "Error while adding the department",
    updateError: "Error while updating the department",
    departmentIdNotFound: "Department ID not found",
  },

  FR: {
    management: "Gestion optionnelle",
    title: "Tous les départements",
    subtitle: "Gérer, consulter et archiver les départements.",

    searchPlaceholder: "Rechercher un département...",
    add: "Ajouter",
    archive: "Archive",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",

    totalDepartments: "Total départements",
    displayedDepartments: "Départements affichés",
    archived: "Archivés",

    departmentsList: "Liste des départements",
    showing: "Affichage",
    to: "à",
    of: "sur",
    departments: "départements",
    rows: "Lignes :",

    department: "Département",
    description: "Description",
    actions: "Actions",

    loadingDepartments: "Chargement des départements...",
    noDepartments: "Aucun département trouvé.",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",

    noName: "Sans nom",
    noDescription: "Sans description",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    departmentNameRequired: "Le nom du département est obligatoire",
    descriptionRequired: "La description est obligatoire",
    addError: "Erreur lors de l’ajout du département",
    updateError: "Erreur lors de la modification du département",
    departmentIdNotFound: "ID du département introuvable",
  },

  AR: {
    management: "الإدارة الاختيارية",
    title: "كل الأقسام",
    subtitle: "إدارة وعرض وأرشفة سجلات الأقسام.",

    searchPlaceholder: "البحث عن قسم...",
    add: "إضافة",
    archive: "الأرشيف",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",

    totalDepartments: "إجمالي الأقسام",
    displayedDepartments: "الأقسام المعروضة",
    archived: "المؤرشفة",

    departmentsList: "قائمة الأقسام",
    showing: "عرض",
    to: "إلى",
    of: "من",
    departments: "أقسام",
    rows: "الأسطر:",

    department: "القسم",
    description: "الوصف",
    actions: "الإجراءات",

    loadingDepartments: "جاري تحميل الأقسام...",
    noDepartments: "لا توجد أقسام.",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",

    noName: "بدون اسم",
    noDescription: "بدون وصف",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    departmentNameRequired: "اسم القسم مطلوب",
    descriptionRequired: "الوصف مطلوب",
    addError: "حدث خطأ أثناء إضافة القسم",
    updateError: "حدث خطأ أثناء تعديل القسم",
    departmentIdNotFound: "معرف القسم غير موجود",
  },
};

export default function AllDepartements() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [departements, setDepartements] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [viewDepartement, setViewDepartement] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [departementToDelete, setDepartementToDelete] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);

  const emptyDepartementForm = {
    nom: "",
    description: "",
  };

  const [addFormData, setAddFormData] = useState(emptyDepartementForm);
  const [editFormData, setEditFormData] = useState(emptyDepartementForm);

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
      const archivedData = await getArchivedDepartements();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived departments:", error);
      setArchivedCount(0);
    }
  };

  const loadDepartements = async () => {
    try {
      setLoading(true);

      const data = await getAllDepartements();
      setDepartements(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading departments:", error);
      setDepartements([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartements();
  }, []);

  const filteredDepartements = useMemo(() => {
    return departements.filter((departement) => {
      const name = String(departement.nom || "");
      const description = String(departement.description || "");

      return `${name} ${description}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [departements, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDepartements.length / itemsPerPage)
  );

  const paginatedDepartements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDepartements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDepartements, currentPage, itemsPerPage]);

  const startDepartement =
    filteredDepartements.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endDepartement = Math.min(
    currentPage * itemsPerPage,
    filteredDepartements.length
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
    setAddFormData(emptyDepartementForm);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddFormData(emptyDepartementForm);
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildDepartementPayload = (formData) => {
    return {
      nom: formData.nom.trim(),
      description: formData.description.trim(),
    };
  };

  const validateDepartementPayload = (payload) => {
    if (!payload.nom) {
      alert(t.departmentNameRequired);
      return false;
    }

    if (!payload.description) {
      alert(t.descriptionRequired);
      return false;
    }

    return true;
  };

  const handleAddDepartement = async (e) => {
    e.preventDefault();

    const payload = buildDepartementPayload(addFormData);

    if (!validateDepartementPayload(payload)) return;

    try {
      setSavingAdd(true);

      const newDepartement = await addDepartement(payload);

      setDepartements((prev) => [newDepartement, ...prev]);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding department:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleViewClick = (departement) => {
    setViewDepartement(departement);
  };

  const handleCloseViewDialog = () => {
    setViewDepartement(null);
  };

  const handleEditClick = (departement) => {
    setSelectedDepartement(departement);

    setEditFormData({
      nom: departement.nom || "",
      description: departement.description || "",
    });
  };

  const handleCloseEditDialog = () => {
    setSelectedDepartement(null);
    setEditFormData(emptyDepartementForm);
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateDepartement = async (e) => {
    e.preventDefault();

    if (!selectedDepartement?.id) {
      alert(t.departmentIdNotFound);
      return;
    }

    const payload = buildDepartementPayload(editFormData);

    if (!validateDepartementPayload(payload)) return;

    try {
      setSavingUpdate(true);

      const updatedDepartement = await updateDepartement(
        selectedDepartement.id,
        payload
      );

      setDepartements((prev) =>
        prev.map((departement) =>
          departement.id === selectedDepartement.id
            ? updatedDepartement
            : departement
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating department:", error);
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
              <Building2 size={28} />
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
              <Building2 size={22} />
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
            {t.totalDepartments}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {departements.length}
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
            {t.displayedDepartments}
          </p>

          <h2 className="mt-3 text-2xl font-black" style={textStyle}>
            {filteredDepartements.length}
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
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.departmentsList}
              </h2>

              <p className="mt-0.5 text-xs" style={mutedTextStyle}>
                {t.showing} {startDepartement} {t.to} {endDepartement} {t.of}{" "}
                {filteredDepartements.length} {t.departments}
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
              <th className="w-[32%] px-3 py-3 font-black">
                {t.department}
              </th>
              <th className="w-[42%] px-3 py-3 font-black">
                {t.description}
              </th>
              <th className="w-[26%] px-3 py-3 font-black">{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="px-5 py-8 text-center">
                  <div
                    className="flex items-center justify-center gap-2 text-sm font-bold"
                    style={mutedTextStyle}
                  >
                    <Loader2 size={18} className="animate-spin" />
                    {t.loadingDepartments}
                  </div>
                </td>
              </tr>
            ) : filteredDepartements.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-5 py-8 text-center">
                  <span className="text-sm font-bold" style={mutedTextStyle}>
                    {t.noDepartments}
                  </span>
                </td>
              </tr>
            ) : (
              paginatedDepartements.map((departement) => {
                const departementName = departement.nom || t.noName;
                const description = departement.description || t.noDescription;

                return (
                  <tr
                    key={departement.id}
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
                          <Building2 size={17} />
                        </div>

                        <span className="truncate font-black" style={textStyle}>
                          {departementName}
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewClick(departement)}
                          title={t.view}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white transition hover:opacity-80"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(departement)}
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
                          onClick={() => setDepartementToDelete(departement)}
                          disabled={!departement.id}
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
      <AddDepartement
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddDepartement}
      />

      <DepartementDetails
        departement={viewDepartement}
        onClose={handleCloseViewDialog}
      />

      <EditDepartement
        departement={selectedDepartement}
        formData={editFormData}
        saving={savingUpdate}
        onClose={handleCloseEditDialog}
        onChange={handleChangeEditForm}
        onSubmit={handleUpdateDepartement}
      />

      <DeleteDepartement
        open={!!departementToDelete}
        departement={departementToDelete}
        onClose={() => setDepartementToDelete(null)}
        onDeleted={(deletedId) => {
          setDepartements((prev) =>
            prev.filter((departement) => departement.id !== deletedId)
          );

          setArchivedCount((prev) => prev + 1);
          setDepartementToDelete(null);
        }}
      />

      <ArchivedDepartement
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredDepartement) => {
          setDepartements((prev) => [restoredDepartement, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}