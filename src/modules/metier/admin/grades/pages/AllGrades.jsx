import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  GraduationCap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  AlertTriangle,
  Archive,
  BookOpen,
  User,
} from "lucide-react";

import api from "../../../../../api/axios";

import {
  addGrade,
  deleteGrade,
  getAllGrades,
  getArchivedGrades,
  updateGrade,
} from "../services/gradeService";

import AddGrade from "../components/AddGrade";
import EditGrade from "../components/EditGrade";
import GradeDetails from "../components/GradeDetails";
import ArchivedGrade from "../components/ArchivedGrade";

export default function AllGrades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [archivedCount, setArchivedCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [viewGrade, setViewGrade] = useState(null);

  const [savingAdd, setSavingAdd] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const emptyGradeForm = {
    note: "",
    semestre: "",
    studentId: "",
    courseId: "",
  };

  const [addFormData, setAddFormData] = useState(emptyGradeForm);
  const [editFormData, setEditFormData] = useState(emptyGradeForm);

  const loadArchivedCount = async () => {
    try {
      const archivedData = await getArchivedGrades();
      setArchivedCount(Array.isArray(archivedData) ? archivedData.length : 0);
    } catch (error) {
      console.error("Error loading archived grades:", error);
      setArchivedCount(0);
    }
  };

  const loadStudentsAndCourses = async () => {
    try {
      const [studentsResponse, coursesResponse] = await Promise.all([
        api.get("/Students/AllStudents"),
        api.get("/Courses/AllCourses"),
      ]);

      setStudents(
        Array.isArray(studentsResponse.data) ? studentsResponse.data : []
      );

      setCourses(
        Array.isArray(coursesResponse.data) ? coursesResponse.data : []
      );
    } catch (error) {
      console.error("Error loading students/courses:", error);
      setStudents([]);
      setCourses([]);
    }
  };

  const loadGrades = async () => {
    try {
      setLoading(true);

      const data = await getAllGrades();
      setGrades(Array.isArray(data) ? data : []);

      await loadArchivedCount();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading grades:", error);
      setGrades([]);
      setArchivedCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
    loadStudentsAndCourses();
  }, []);

  const getStudentName = (grade) => {
    return (
      grade.studentName ||
      `${grade.student?.prenom || ""} ${grade.student?.nom || ""}`.trim() ||
      grade.student?.name ||
      "N/A"
    );
  };

  const getCourseName = (grade) => {
    return (
      grade.courseName ||
      grade.courses?.nom ||
      grade.courses?.name ||
      grade.course?.nom ||
      grade.course?.name ||
      "N/A"
    );
  };

  const getCourseId = (grade) => {
    return grade.courseId || grade.courses?.id || grade.course?.id || "";
  };

  const filteredGrades = useMemo(() => {
    return grades.filter((grade) => {
      const note = String(grade.note || "");
      const semestre = String(grade.semestre || "");
      const studentName = getStudentName(grade);
      const courseName = getCourseName(grade);

      return `${note} ${semestre} ${studentName} ${courseName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [grades, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGrades.length / itemsPerPage)
  );

  const paginatedGrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGrades.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGrades, currentPage, itemsPerPage]);

  const startGrade =
    filteredGrades.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endGrade = Math.min(currentPage * itemsPerPage, filteredGrades.length);

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
    setAddFormData(emptyGradeForm);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setAddFormData(emptyGradeForm);
  };

  const handleChangeAddForm = (e) => {
    const { name, value } = e.target;

    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildGradePayload = (formData) => {
    return {
      note: formData.note === "" ? null : Number(formData.note),
      semestre: formData.semestre.trim(),
      studentId: formData.studentId === "" ? null : Number(formData.studentId),
      courseId: formData.courseId === "" ? null : Number(formData.courseId),
    };
  };

  const validateGradePayload = (payload) => {
    if (payload.note === null || Number.isNaN(payload.note)) {
      alert("Note is required");
      return false;
    }

    if (payload.note < 0 || payload.note > 20) {
      alert("Note must be between 0 and 20");
      return false;
    }

    if (!payload.semestre) {
      alert("Semester is required");
      return false;
    }

    if (!payload.studentId) {
      alert("Student is required");
      return false;
    }

    if (!payload.courseId) {
      alert("Course is required");
      return false;
    }

    return true;
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();

    const payload = buildGradePayload(addFormData);

    if (!validateGradePayload(payload)) return;

    try {
      setSavingAdd(true);

      const newGrade = await addGrade(payload);

      setGrades((prev) => [newGrade, ...prev]);
      handleCloseAddDialog();

      alert("Grade added successfully");
    } catch (error) {
      console.error("Error adding grade:", error);
      alert("Error while adding grade");
    } finally {
      setSavingAdd(false);
    }
  };

  const handleEditClick = (grade) => {
    setSelectedGrade(grade);

    setEditFormData({
      note: grade.note ?? "",
      semestre: grade.semestre || "",
      studentId: grade.studentId || grade.student?.id || "",
      courseId: getCourseId(grade),
    });

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedGrade(null);
    setEditFormData(emptyGradeForm);
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();

    if (!selectedGrade?.id) {
      alert("Grade ID not found");
      return;
    }

    const payload = buildGradePayload(editFormData);

    if (!validateGradePayload(payload)) return;

    try {
      setSavingUpdate(true);

      const updatedGrade = await updateGrade(selectedGrade.id, payload);

      setGrades((prev) =>
        prev.map((grade) =>
          grade.id === selectedGrade.id ? updatedGrade : grade
        )
      );

      handleCloseEditDialog();
      alert("Grade updated successfully");
    } catch (error) {
      console.error("Error updating grade:", error);
      alert("Error while updating grade");
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this grade?")) return;

    try {
      await deleteGrade(id);

      setArchivedCount((prev) => prev + 1);

      setGrades((prev) => {
        const updatedGrades = prev.filter((grade) => grade.id !== id);

        const newTotalPages = Math.max(
          1,
          Math.ceil(updatedGrades.length / itemsPerPage)
        );

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        return updatedGrades;
      });

      alert("Grade archived successfully");
    } catch (error) {
      console.error("Error archiving grade:", error);
      alert("Error while archiving grade");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
              <GraduationCap size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-cyan-200">Evaluation</p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                All Grades
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Manage, view and archive student grade records.
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
                placeholder="Search grade..."
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <GraduationCap size={22} />
            </div>

            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Grades</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {grades.length}
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
            Displayed Grades
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredGrades.length}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <GraduationCap size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Grades List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startGrade} to {endGrade} of {filteredGrades.length}{" "}
                grades
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
              <th className="w-[16%] px-3 py-3 font-black">Note</th>
              <th className="w-[16%] px-3 py-3 font-black">Semester</th>
              <th className="w-[24%] px-3 py-3 font-black">Student</th>
              <th className="w-[24%] px-3 py-3 font-black">Course</th>
              <th className="w-[20%] px-3 py-3 font-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Loading grades...
                  </div>
                </td>
              </tr>
            ) : filteredGrades.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                >
                  No grades found.
                </td>
              </tr>
            ) : (
              paginatedGrades.map((grade) => {
                const note = grade.note ?? "N/A";
                const semestre = grade.semestre || "N/A";
                const studentName = getStudentName(grade);
                const courseName = getCourseName(grade);

                return (
                  <tr
                    key={grade.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                        {note}/20
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-600">
                        {semestre}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 sm:flex">
                          <User size={17} />
                        </div>

                        <span className="truncate font-black text-slate-900">
                          {studentName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                          <BookOpen size={17} />
                        </div>

                        <span className="truncate font-bold text-slate-700">
                          {courseName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewGrade(grade)}
                          title="View"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditClick(grade)}
                          title="Edit"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(grade.id)}
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
      <AddGrade
        open={openAddDialog}
        formData={addFormData}
        saving={savingAdd}
        students={students}
        courses={courses}
        onClose={handleCloseAddDialog}
        onChange={handleChangeAddForm}
        onSubmit={handleAddGrade}
      />

      {openEditDialog && (
        <EditGrade
          grade={selectedGrade}
          formData={editFormData}
          saving={savingUpdate}
          students={students}
          courses={courses}
          onClose={handleCloseEditDialog}
          onChange={handleChangeEditForm}
          onSubmit={handleUpdateGrade}
        />
      )}

      <GradeDetails grade={viewGrade} onClose={() => setViewGrade(null)} />

      <ArchivedGrade
        open={openArchiveDialog}
        onClose={() => setOpenArchiveDialog(false)}
        onRestored={(restoredGrade) => {
          setGrades((prev) => [restoredGrade, ...prev]);
          setArchivedCount((prev) => Math.max(prev - 1, 0));
        }}
      />
    </div>
  );
}