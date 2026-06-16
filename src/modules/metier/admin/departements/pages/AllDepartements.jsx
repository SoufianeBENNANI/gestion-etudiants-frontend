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
  TrendingUp,
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

  const stats = [
    {
      title: t.totalDepartments,
      value: departements.length,
      icon: Building2,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedDepartments,
      value: filteredDepartements.length,
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
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.departmentsList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
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
                <th className="w-[32%] px-5 py-4 font-black">
                  {t.department}
                </th>
                <th className="w-[42%] px-5 py-4 font-black">
                  {t.description}
                </th>
                <th className="w-[26%] px-5 py-4 font-black">{t.actions}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-5 py-10 text-center">
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
                  <td colSpan="3" className="px-5 py-10 text-center">
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
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            {String(departementName).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {departementName}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.department}
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewClick(departement)}
                            title={t.view}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(departement)}
                            title={t.edit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDepartementToDelete(departement)}
                            disabled={!departement.id}
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
              {startDepartement}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endDepartement}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredDepartements.length}
            </span>{" "}
            {t.departments}
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