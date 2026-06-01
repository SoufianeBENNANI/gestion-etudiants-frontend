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
  deleteDepartement,
  updateDepartement,
} from "../service/departementService";

import AddDepartement from "../components/AddDepartement";
import DepartementDetails from "../components/DepartementDetails";
import EditDepartement from "../components/EditDepartement";
import ArchivedDepartement from "../components/ArchivedDepartement";

export default function AllDepartements() {
  const [departements, setDepartements] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [viewDepartement, setViewDepartement] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);

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
      alert("Department name is required");
      return false;
    }

    if (!payload.description) {
      alert("Description is required");
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

      alert("Department added successfully");
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Error while adding the department");
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
      alert("Department ID not found");
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
      alert("Department updated successfully");
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Error while updating the department");
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this department?")) return;

    try {
      await deleteDepartement(id);

      setArchivedCount((prev) => prev + 1);

      setDepartements((prev) => {
        const updatedDepartements = prev.filter(
          (departement) => departement.id !== id
        );

        const newTotalPages = Math.max(
          1,
          Math.ceil(updatedDepartements.length / itemsPerPage)
        );

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        return updatedDepartements;
      });

      alert("Department archived successfully");
    } catch (error) {
      console.error("Error archiving department:", error);
      alert("Error while archiving the department");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Building2 size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Optional Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                All Departments
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Manage, view and archive department records.
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
                placeholder="Search department..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={22} />
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">
            Total Departments
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {departements.length}
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
            Displayed Departments
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredDepartements.length}
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
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Departments List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startDepartement} to {endDepartement} of{" "}
                {filteredDepartements.length} departments
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

        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-white text-center text-[11px] uppercase tracking-wide text-slate-500">
              <th className="w-[32%] px-3 py-3 font-black">Department</th>
              <th className="w-[42%] px-3 py-3 font-black">Description</th>
              <th className="w-[26%] px-3 py-3 font-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="px-5 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Loading departments...
                  </div>
                </td>
              </tr>
            ) : filteredDepartements.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                >
                  No departments found.
                </td>
              </tr>
            ) : (
              paginatedDepartements.map((departement) => {
                const departementName = departement.nom || "No name";
                const description =
                  departement.description || "No description";

                return (
                  <tr
                    key={departement.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                          <Building2 size={17} />
                        </div>

                        <span className="truncate font-black text-slate-900">
                          {departementName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate text-sm font-semibold text-slate-600">
                        {description}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewClick(departement)}
                          title="View"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(departement)}
                          title="Edit"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(departement.id)}
                          title="Archive"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
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
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Page{" "}
            <span className="font-black text-slate-800">{currentPage}</span>{" "}
            of <span className="font-black text-slate-800">{totalPages}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
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