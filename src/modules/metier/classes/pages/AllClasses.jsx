import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  deleteClasse,
  updateClasse,
} from "../services/classeService";

import AddClasse from "./AddClasse";
import ClasseDetails from "./ClasseDetails";
import EditClasse from "./EditClasse";
import ArchivedClasses from "./ArchivedClasses";

export default function AllClasses() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [viewClasse, setViewClasse] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);

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

      alert("Class added successfully");
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Error while adding the class");
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
      alert("Class ID not found");
      return;
    }

    try {
      setSavingUpdate(true);

      const updatedClasse = await updateClasse(
        selectedClasse.id,
        editFormData
      );

      setClasses((prev) =>
        prev.map((classe) =>
          classe.id === selectedClasse.id ? updatedClasse : classe
        )
      );

      handleCloseEditDialog();
      alert("Class updated successfully");
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Error while updating the class");
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this class?")) return;

    try {
      await deleteClasse(id);

      setArchivedCount((prev) => prev + 1);

      setClasses((prev) => {
        const updatedClasses = prev.filter((classe) => classe.id !== id);

        const newTotalPages = Math.max(
          1,
          Math.ceil(updatedClasses.length / itemsPerPage)
        );

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        return updatedClasses;
      });

      alert("Class archived successfully");
    } catch (error) {
      console.error("Error archiving class:", error);
      alert("Error while archiving the class");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-7 py-7 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Layers3 size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Academics Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                All Classes
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Manage, view and archive class records.
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
                placeholder="Search class..."
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <School size={22} />
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Classes</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {classes.length}
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
            Displayed Classes
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredClasses.length}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Layers3 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Classes List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startClass} to {endClass} of {filteredClasses.length}{" "}
                classes
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
          <table className="w-full min-w-[850px] table-fixed border-collapse">
            <thead>
              <tr className="bg-white text-center text-xs uppercase tracking-wide text-slate-500">
                <th className="w-1/4 px-5 py-3 font-black">Class Name</th>
                <th className="w-1/4 px-5 py-3 font-black">Level</th>
                <th className="w-1/4 px-5 py-3 font-black">Academic Year</th>
                <th className="w-1/4 px-5 py-3 font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                      <Loader2 size={18} className="animate-spin" />
                      Loading classes...
                    </div>
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                  >
                    No classes found.
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((classe) => {
                  const className =
                    classe.nom ||
                    classe.name ||
                    classe.className ||
                    "No name";

                  const level =
                    classe.niveau ||
                    classe.level ||
                    classe.grade ||
                    "Not defined";

                  const year = classe.annee || "Not defined";

                  return (
                    <tr
                      key={classe.id}
                      className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <span className="font-black text-slate-900">
                          {className}
                        </span>
                      </td>

                      <td className="px-5 py-3">{level}</td>

                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                          {year}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewClick(classe)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(classe)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(classe.id)}
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
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${currentPage === page
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