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

export default function AllTeachers() {
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
      alert("Error while loading teachers.");
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
      alert("Error while adding the teacher.");
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
      alert("Error while updating the teacher.");
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
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <GraduationCap size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Teachers Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                All Teachers
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Manage, view and archive teacher records.
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
                placeholder="Search teacher..."
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

            <button
              type="button"
              onClick={downloadTeachersPdf}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 ring-1 ring-red-300/30 transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-red-500/40"
            >
              <FileDown size={17} />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <GraduationCap size={22} />
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Teachers</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {totalTeachers}
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
            Displayed Teachers
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {teachers.length}
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
              <Users size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Teachers List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startTeacher} to {endTeacher} of {teachers.length}{" "}
                teachers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600">Rows:</span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
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
              <th className="w-[22%] px-3 py-3 font-black">Teacher</th>
              <th className="w-[25%] px-3 py-3 font-black">Email</th>
              <th className="w-[19%] px-3 py-3 font-black">Speciality</th>
              <th className="w-[20%] px-3 py-3 font-black">Department</th>
              <th className="w-[14%] px-3 py-3 font-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Loading teachers...
                  </div>
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                >
                  No teachers found.
                </td>
              </tr>
            ) : (
              paginatedTeachers.map((teacher) => {
                const fullName = `${teacher.nom || ""} ${teacher.prenom || ""
                  }`.trim();

                const department =
                  teacher.departement?.nom ||
                  teacher.departementNom ||
                  teacher.nomDepartement ||
                  "-";

                return (
                  <tr
                    key={teacher.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                          <GraduationCap size={17} />
                        </div>

                        <span className="truncate font-black text-slate-900">
                          {fullName || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate">
                        {teacher.email || "-"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate font-semibold text-slate-600">
                        {teacher.specialite || "-"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="inline-flex max-w-full rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                        <span className="truncate">{department}</span>
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewTeacher(teacher)}
                          title="View"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTeacher(teacher)}
                          disabled={!teacher.id}
                          title="Edit"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setTeacherToDelete(teacher)}
                          disabled={!teacher.id}
                          title="Delete"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
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
            <span className="font-black text-slate-800">{currentPage}</span> of{" "}
            <span className="font-black text-slate-800">{totalPages}</span>
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
          setTeachers((prev) => prev.filter((teacher) => teacher.id !== deletedId));
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