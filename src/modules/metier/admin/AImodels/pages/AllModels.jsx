import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Brain,
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
  addModel,
  getAllModels,
  getArchivedModels,
  updateModel,
} from "../service/serviceModels";

import AddModel from "../components/AddModel";
import EditModel from "../components/EditModel";
import ModelDetails from "../components/ModelDetails";
import ArchivedModel from "../components/ArchivedModel";
import DeleteModel from "../components/DeleteModel";

const translations = {
  EN: {
    management: "Artificial Intelligence",
    title: "All Models",
    subtitle: "Manage, view and archive AI model records.",

    searchPlaceholder: "Search model...",
    add: "Add",
    archive: "Archive",

    records: "Records",
    results: "Results",
    status: "Status",

    totalModels: "Total Models",
    displayedModels: "Displayed Models",
    archived: "Archived",

    modelsList: "Models List",
    showing: "Showing",
    to: "to",
    of: "of",
    models: "models",
    rows: "Rows:",

    model: "Model",
    version: "Version",
    accuracy: "Accuracy",
    created: "Created",
    actions: "Actions",

    loadingModels: "Loading AI models...",
    noModels: "No AI models found.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    page: "Page",
    previous: "Previous",
    next: "Next",

    modelNameRequired: "Model name is required",
    versionRequired: "Version is required",
    accuracyRange: "Accuracy must be between 0 and 100",
    addError: "Error while adding the model",
    modelIdNotFound: "Model ID not found",
    updateError: "Error while updating the model",

    noName: "No name",
    notAvailable: "N/A",
  },

  FR: {
    management: "Intelligence artificielle",
    title: "Tous les modèles",
    subtitle: "Gérer, consulter et archiver les modèles d’IA.",

    searchPlaceholder: "Rechercher un modèle...",
    add: "Ajouter",
    archive: "Archive",

    records: "Dossiers",
    results: "Résultats",
    status: "Statut",

    totalModels: "Total modèles",
    displayedModels: "Modèles affichés",
    archived: "Archivés",

    modelsList: "Liste des modèles",
    showing: "Affichage",
    to: "à",
    of: "sur",
    models: "modèles",
    rows: "Lignes :",

    model: "Modèle",
    version: "Version",
    accuracy: "Précision",
    created: "Créé le",
    actions: "Actions",

    loadingModels: "Chargement des modèles d’IA...",
    noModels: "Aucun modèle d’IA trouvé.",

    view: "Voir",
    edit: "Modifier",
    delete: "Supprimer",

    page: "Page",
    previous: "Précédent",
    next: "Suivant",

    modelNameRequired: "Le nom du modèle est obligatoire",
    versionRequired: "La version est obligatoire",
    accuracyRange: "La précision doit être entre 0 et 100",
    addError: "Erreur lors de l’ajout du modèle",
    modelIdNotFound: "ID du modèle introuvable",
    updateError: "Erreur lors de la modification du modèle",

    noName: "Sans nom",
    notAvailable: "N/A",
  },

  AR: {
    management: "الذكاء الاصطناعي",
    title: "كل النماذج",
    subtitle: "إدارة وعرض وأرشفة نماذج الذكاء الاصطناعي.",

    searchPlaceholder: "البحث عن نموذج...",
    add: "إضافة",
    archive: "الأرشيف",

    records: "السجلات",
    results: "النتائج",
    status: "الحالة",

    totalModels: "إجمالي النماذج",
    displayedModels: "النماذج المعروضة",
    archived: "المؤرشفة",

    modelsList: "قائمة النماذج",
    showing: "عرض",
    to: "إلى",
    of: "من",
    models: "نماذج",
    rows: "الأسطر:",

    model: "النموذج",
    version: "الإصدار",
    accuracy: "الدقة",
    created: "تاريخ الإنشاء",
    actions: "الإجراءات",

    loadingModels: "جاري تحميل نماذج الذكاء الاصطناعي...",
    noModels: "لا توجد نماذج ذكاء اصطناعي.",

    view: "عرض",
    edit: "تعديل",
    delete: "حذف",

    page: "الصفحة",
    previous: "السابق",
    next: "التالي",

    modelNameRequired: "اسم النموذج مطلوب",
    versionRequired: "الإصدار مطلوب",
    accuracyRange: "يجب أن تكون الدقة بين 0 و 100",
    addError: "حدث خطأ أثناء إضافة النموذج",
    modelIdNotFound: "معرف النموذج غير موجود",
    updateError: "حدث خطأ أثناء تعديل النموذج",

    noName: "بدون اسم",
    notAvailable: "N/A",
  },
};

export default function AllModels() {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  const [models, setModels] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [viewModel, setViewModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelToDelete, setModelToDelete] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);

  const emptyModelForm = {
    name: "",
    version: "",
    accuracy: "",
  };

  const [addFormData, setAddFormData] = useState(emptyModelForm);
  const [editFormData, setEditFormData] = useState(emptyModelForm);

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
      const archivedData = await getArchivedModels();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived models:", error);
      setArchivedCount(0);
    }
  };

  const loadModels = async () => {
    try {
      setLoading(true);

      const data = await getAllModels();
      setModels(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading AI models:", error);
      setModels([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const name = String(model.name || "");
      const version = String(model.version || "");
      const accuracy = String(model.accuracy || "");

      return `${name} ${version} ${accuracy}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [models, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredModels.length / itemsPerPage)
  );

  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModels.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModels, currentPage, itemsPerPage]);

  const startModel =
    filteredModels.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endModel = Math.min(currentPage * itemsPerPage, filteredModels.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const formatDate = (date) => {
    if (!date) return t.notAvailable;

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
    setAddFormData(emptyModelForm);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddFormData(emptyModelForm);
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildModelPayload = (formData) => {
    return {
      name: formData.name.trim(),
      version: formData.version.trim(),
      accuracy: formData.accuracy === "" ? null : Number(formData.accuracy),
    };
  };

  const validateModelPayload = (payload) => {
    if (!payload.name) {
      alert(t.modelNameRequired);
      return false;
    }

    if (!payload.version) {
      alert(t.versionRequired);
      return false;
    }

    if (
      payload.accuracy !== null &&
      (Number.isNaN(payload.accuracy) ||
        payload.accuracy < 0 ||
        payload.accuracy > 100)
    ) {
      alert(t.accuracyRange);
      return false;
    }

    return true;
  };

  const handleAddModel = async (e) => {
    e.preventDefault();

    const payload = buildModelPayload(addFormData);

    if (!validateModelPayload(payload)) return;

    try {
      setSavingAdd(true);

      const newModel = await addModel(payload);

      setModels((prev) => [newModel, ...prev]);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding AI model:", error);
      alert(t.addError);
    } finally {
      setSavingAdd(false);
    }
  };

  const handleViewClick = (model) => {
    setViewModel(model);
  };

  const handleCloseViewDialog = () => {
    setViewModel(null);
  };

  const handleEditClick = (model) => {
    setSelectedModel(model);

    setEditFormData({
      name: model.name || "",
      version: model.version || "",
      accuracy: model.accuracy ?? "",
    });
  };

  const handleCloseEditDialog = () => {
    setSelectedModel(null);
    setEditFormData(emptyModelForm);
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateModel = async (e) => {
    e.preventDefault();

    if (!selectedModel?.id) {
      alert(t.modelIdNotFound);
      return;
    }

    const payload = buildModelPayload(editFormData);

    if (!validateModelPayload(payload)) return;

    try {
      setSavingUpdate(true);

      const updatedModel = await updateModel(selectedModel.id, payload);

      setModels((prev) =>
        prev.map((model) =>
          model.id === selectedModel.id ? updatedModel : model
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating AI model:", error);
      alert(t.updateError);
    } finally {
      setSavingUpdate(false);
    }
  };

  const stats = [
    {
      title: t.totalModels,
      value: models.length,
      icon: Brain,
      iconBg: "bg-orange-500",
      percentBg: "bg-orange-50",
      percentText: "text-orange-600",
      percent: "76%",
      trend: "17%",
    },
    {
      title: t.displayedModels,
      value: filteredModels.length,
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
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black" style={textStyle}>
                {t.modelsList}
              </h2>

              <p className="mt-0.5 text-xs font-semibold" style={mutedTextStyle}>
                {t.showing} {startModel} {t.to} {endModel} {t.of}{" "}
                {filteredModels.length} {t.models}
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
          <table className="w-full min-w-[860px] table-fixed border-collapse">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase tracking-wide"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[28%] px-5 py-4 font-black">{t.model}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.version}</th>
                <th className="w-[14%] px-5 py-4 font-black">{t.accuracy}</th>
                <th className="w-[18%] px-5 py-4 font-black">{t.created}</th>
                <th className="w-[26%] px-5 py-4 font-black">{t.actions}</th>
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
                      {t.loadingModels}
                    </div>
                  </td>
                </tr>
              ) : filteredModels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center">
                    <span className="text-sm font-bold" style={mutedTextStyle}>
                      {t.noModels}
                    </span>
                  </td>
                </tr>
              ) : (
                paginatedModels.map((model) => {
                  const modelName = model.name || t.noName;
                  const version = model.version || t.notAvailable;
                  const accuracy =
                    model.accuracy !== null && model.accuracy !== undefined
                      ? `${model.accuracy}%`
                      : t.notAvailable;

                  return (
                    <tr
                      key={model.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-slate-50/40"
                      style={{
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="mx-auto flex max-w-full items-center justify-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">
                            <Brain size={17} />
                          </div>

                          <div className="min-w-0 text-center">
                            <p className="truncate font-black" style={textStyle}>
                              {modelName}
                            </p>

                            <p
                              className="mt-0.5 text-xs font-semibold"
                              style={mutedTextStyle}
                            >
                              {t.model}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="block truncate text-sm font-semibold"
                          style={mutedTextStyle}
                        >
                          {version}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                          {accuracy}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-bold"
                          style={mutedTextStyle}
                        >
                          {formatDate(model.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewClick(model)}
                            title={t.view}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(model)}
                            title={t.edit}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80"
                            style={inputStyle}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setModelToDelete(model)}
                            disabled={!model.id}
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
              {startModel}
            </span>{" "}
            {t.to}{" "}
            <span className="font-black" style={textStyle}>
              {endModel}
            </span>{" "}
            {t.of}{" "}
            <span className="font-black" style={textStyle}>
              {filteredModels.length}
            </span>{" "}
            {t.models}
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
      <AddModel
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddModel}
      />

      <ModelDetails model={viewModel} onClose={handleCloseViewDialog} />

      <EditModel
        model={selectedModel}
        formData={editFormData}
        saving={savingUpdate}
        onClose={handleCloseEditDialog}
        onChange={handleChangeEditForm}
        onSubmit={handleUpdateModel}
      />

      <DeleteModel
        open={!!modelToDelete}
        model={modelToDelete}
        onClose={() => setModelToDelete(null)}
        onDeleted={(deletedId) => {
          setModels((prev) => prev.filter((model) => model.id !== deletedId));
          setArchivedCount((prev) => prev + 1);
          setModelToDelete(null);
        }}
      />

      <ArchivedModel
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredModel) => {
          setModels((prev) => [restoredModel, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}