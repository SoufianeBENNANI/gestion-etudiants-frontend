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
} from "lucide-react";

import {
  addModel,
  deleteModel,
  getAllModels,
  getArchivedModels,
  updateModel,
} from "../service/serviceModels";

import AddModel from "./AddModel";
import EditModel from "./EditModel";
import ModelDetails from "./ModelDetails";
import ArchivedModel from "./ArchivedModel";

export default function AllModels() {
  const [models, setModels] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [viewModel, setViewModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

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

  const totalPages = Math.max(1, Math.ceil(filteredModels.length / itemsPerPage));

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
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
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
      alert("Model name is required");
      return false;
    }

    if (!payload.version) {
      alert("Version is required");
      return false;
    }

    if (payload.accuracy !== null && (payload.accuracy < 0 || payload.accuracy > 100)) {
      alert("Accuracy must be between 0 and 100");
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

      alert("Model added successfully");
    } catch (error) {
      console.error("Error adding AI model:", error);
      alert("Error while adding the model");
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
      alert("Model ID not found");
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
      alert("Model updated successfully");
    } catch (error) {
      console.error("Error updating AI model:", error);
      alert("Error while updating the model");
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleArchiveModel = async (id) => {
    if (!window.confirm("Archive this model?")) return;

    try {
      await deleteModel(id);

      setArchivedCount((prev) => prev + 1);

      setModels((prev) => {
        const updatedModels = prev.filter((model) => model.id !== id);

        const newTotalPages = Math.max(
          1,
          Math.ceil(updatedModels.length / itemsPerPage)
        );

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        return updatedModels;
      });

      alert("Model archived successfully");
    } catch (error) {
      console.error("Error archiving AI model:", error);
      alert("Error while archiving the model");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
              <Brain size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-cyan-200">
                Artificial Intelligence
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                All Models
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Manage, view and archive AI model records.
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
                placeholder="Search model..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72 lg:w-80"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddDialog}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Plus size={17} />
              Add
            </button>

            <button
              type="button"
              onClick={() => setOpenArchiveDialog(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Archive size={17} />
              Archive
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Brain size={22} />
            </div>

            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Models</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {models.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Search size={22} />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
              Results
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">
            Displayed Models
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredModels.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle size={22} />
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-500">
              Status
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Archived</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {archivedCount}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Models List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startModel} to {endModel} of {filteredModels.length}{" "}
                models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600">Rows:</span>

            <select
              value={itemsPerPage}
              onChange={handleChangeItemsPerPage}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/5 px-5 py-3 font-black">Model Name</th>
                <th className="w-1/5 px-5 py-3 font-black">Version</th>
                <th className="w-1/5 px-5 py-3 font-black">Accuracy</th>
                <th className="w-1/5 px-5 py-3 font-black">Created At</th>
                <th className="w-1/5 px-5 py-3 font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      Loading AI models...
                    </div>
                  </td>
                </tr>
              ) : filteredModels.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                  >
                    No AI models found.
                  </td>
                </tr>
              ) : (
                paginatedModels.map((model) => {
                  const modelName = model.name || "No name";
                  const version = model.version || "N/A";
                  const accuracy =
                    model.accuracy !== null && model.accuracy !== undefined
                      ? `${model.accuracy}%`
                      : "N/A";

                  return (
                    <tr
                      key={model.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-900">
                          {modelName}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="font-bold text-slate-700">
                          {version}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="font-bold text-slate-700">
                          {accuracy}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="font-bold text-slate-700">
                          {formatDate(model.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewClick(model)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(model)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleArchiveModel(model.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                          >
                            <Trash2 size={14} />
                            Delete
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
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Page{" "}
            <span className="font-black text-slate-800">{currentPage}</span>{" "}
            of <span className="font-black text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                  currentPage === page
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
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