import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  BookOpen,
  Archive,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
} from "lucide-react";

import {
  getAllCourses,
  getArchivedCourses,
  addCourse,
  updateCourse,
} from "../services/courseService";

import AddCourse from "../components/AddCourse";
import CourseDetails from "../components/CourseDetails";
import EditCourse from "../components/EditCourse";
import ArchivedCourses from "../components/ArchivedCourses";
import DeleteCourse from "../components/DeleteCourse";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [viewCourse, setViewCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const emptyCourseForm = {
    nom: "",
    description: "",
    credits: "",
  };

  const [addFormData, setAddFormData] = useState(emptyCourseForm);
  const [editFormData, setEditFormData] = useState(emptyCourseForm);

  const loadArchivedCount = async () => {
    try {
      const archivedData = await getArchivedCourses();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived courses:", error);
      setArchivedCount(0);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);

      const data = await getAllCourses();
      setCourses(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const name = String(course.nom || course.name || "");
      const description = String(course.description || "");
      const credits = String(course.credits || "");

      return `${name} ${description} ${credits}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [courses, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / itemsPerPage)
  );

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  const startCourse =
    filteredCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endCourse = Math.min(
    currentPage * itemsPerPage,
    filteredCourses.length
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
    setAddFormData(emptyCourseForm);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddFormData(emptyCourseForm);
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildCoursePayload = (formData) => {
    const credits = Number(formData.credits);

    return {
      nom: formData.nom.trim(),
      description: formData.description.trim(),
      credits,
    };
  };

  const validateCoursePayload = (payload) => {
    if (!payload.nom) {
      alert("Course name is required");
      return false;
    }

    if (!payload.description) {
      alert("Description is required");
      return false;
    }

    if (!payload.credits || payload.credits < 1) {
      alert("Credits must be greater than 0");
      return false;
    }

    return true;
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const payload = buildCoursePayload(addFormData);

    if (!validateCoursePayload(payload)) return;

    try {
      setSavingAdd(true);

      const newCourse = await addCourse(payload);

      setCourses((prev) => [newCourse, ...prev]);
      handleCloseAddDialog();

    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error while adding the course");
    } finally {
      setSavingAdd(false);
    }
  };

  const handleViewClick = (course) => {
    setViewCourse(course);
  };

  const handleCloseViewDialog = () => {
    setViewCourse(null);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);

    setEditFormData({
      nom: course.nom || course.name || "",
      description: course.description || "",
      credits: course.credits ?? "",
    });
  };

  const handleCloseEditDialog = () => {
    setSelectedCourse(null);
    setEditFormData(emptyCourseForm);
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!selectedCourse?.id) {
      alert("Course ID not found");
      return;
    }

    const payload = buildCoursePayload(editFormData);

    if (!validateCoursePayload(payload)) return;

    try {
      setSavingUpdate(true);

      const updatedCourse = await updateCourse(selectedCourse.id, payload);

      setCourses((prev) =>
        prev.map((course) =>
          course.id === selectedCourse.id ? updatedCourse : course
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error while updating the course");
    } finally {
      setSavingUpdate(false);
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
              <BookOpen size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Academics Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                All Courses
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Manage, view and archive course records.
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
                placeholder="Search course..."
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
              <BookOpen size={22} />
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Courses</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {courses.length}
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
            Displayed Courses
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredCourses.length}
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
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Courses List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startCourse} to {endCourse} of{" "}
                {filteredCourses.length} courses
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
              <th className="w-[28%] px-3 py-3 font-black">Course</th>
              <th className="w-[36%] px-3 py-3 font-black">Description</th>
              <th className="w-[12%] px-3 py-3 font-black">Credits</th>
              <th className="w-[24%] px-3 py-3 font-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-5 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Loading courses...
                  </div>
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              paginatedCourses.map((course) => {
                const courseName = course.nom || course.name || "No name";
                const description = course.description || "No description";
                const credits = course.credits ?? "Not defined";

                return (
                  <tr
                    key={course.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                          <BookOpen size={17} />
                        </div>

                        <span className="truncate font-black text-slate-900">
                          {courseName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate text-sm font-semibold text-slate-600">
                        {description}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                        {credits}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewClick(course)}
                          title="View"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(course)}
                          title="Edit"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCourseToDelete(course)}
                          disabled={!course.id}
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
      <AddCourse
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddCourse}
      />

      <CourseDetails course={viewCourse} onClose={handleCloseViewDialog} />

      <EditCourse
        course={selectedCourse}
        formData={editFormData}
        saving={savingUpdate}
        onClose={handleCloseEditDialog}
        onChange={handleChangeEditForm}
        onSubmit={handleUpdateCourse}
      />

      <DeleteCourse
        open={!!courseToDelete}
        course={courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onDeleted={(deletedId) => {
          setCourses((prev) => prev.filter((course) => course.id !== deletedId));
          setArchivedCount((prev) => prev + 1);
          setCourseToDelete(null);
        }}
      />

      <ArchivedCourses
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredCourse) => {
          setCourses((prev) => [restoredCourse, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}