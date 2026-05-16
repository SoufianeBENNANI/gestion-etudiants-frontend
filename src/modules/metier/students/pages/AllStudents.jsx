import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Pencil,
  Users,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Search,
  Archive,
  Loader2,
} from "lucide-react";

import {
  getAllStudents,
  deleteStudent,
  updateStudent,
  searchStudentsByName,
} from "../services/studentService";

import EditStudentModal from "../components/EditStudentModal";

export default function AllStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [savingUpdate, setSavingUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await getAllStudents();

      setStudents(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Load students error:", error);
      alert("Error while loading students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      loadStudents();
      return;
    }

    try {
      setSearching(true);

      const data = await searchStudentsByName(value.trim());
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search students error:", error);
      setStudents([]);
    } finally {
      setSearching(false);
    }
  };

  const handleUpdateStudent = async (id, studentData) => {
    try {
      setSavingUpdate(true);

      const updatedStudent = await updateStudent(id, studentData);

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id ? updatedStudent : student
        )
      );

      setSelectedStudent(null);
      alert("Student updated successfully");
    } catch (error) {
      console.error("Update student error:", error);
      alert("Error while updating the student");
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this student?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteStudent(id);

      setStudents((prevStudents) => {
        const updatedStudents = prevStudents.filter(
          (student) => student.id !== id
        );

        const newTotalPages = Math.max(
          1,
          Math.ceil(updatedStudents.length / itemsPerPage)
        );

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        return updatedStudents;
      });

      alert("Student archived successfully");
    } catch (error) {
      console.error("Archive student error:", error);
      alert("Error while archiving the student");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return students.slice(startIndex, endIndex);
  }, [students, currentPage, itemsPerPage]);

  const startStudent =
    students.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endStudent = Math.min(currentPage * itemsPerPage, students.length);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(
    Math.max(currentPage - 3, 0),
    Math.min(currentPage + 2, totalPages)
  );

  if (selectedStudent) {
    return (
      <EditStudentModal
        student={selectedStudent}
        saving={savingUpdate}
        onClose={() => setSelectedStudent(null)}
        onUpdate={handleUpdateStudent}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <Users size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight">
                All Students
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Manage, view and archive student records.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by last name..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72 lg:w-80"
              />
            </div>

            <button
              type="button"
              onClick={loadStudents}
              disabled={loading || searching}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || searching ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCcw size={18} />
              )}
              Refresh
            </button>

            <button
              type="button"
              onClick={() => navigate("/students/archive")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Archive size={18} />
              Archive
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 font-bold text-slate-600">
            <Loader2 size={20} className="animate-spin" />
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center font-bold text-slate-600">
            No students found.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Users size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Students List
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing {startStudent} to {endStudent} of {students.length}{" "}
                    students
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-600">Rows:</span>

                <select
                  value={itemsPerPage}
                  onChange={handleChangeItemsPerPage}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-white text-left text-sm text-slate-600">
                    <th className="px-6 py-4 font-black">Last Name</th>
                    <th className="px-6 py-4 font-black">First Name</th>
                    <th className="px-6 py-4 font-black">Email</th>
                    <th className="px-6 py-4 font-black">Gender</th>
                    <th className="px-6 py-4 font-black">Phone</th>
                    <th className="px-6 py-4 font-black">Address</th>
                    <th className="px-6 py-4 text-right font-black">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900">
                          {student.nom || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4">{student.prenom || "-"}</td>
                      <td className="px-6 py-4">{student.email || "-"}</td>
                      <td className="px-6 py-4">{student.genre || "-"}</td>
                      <td className="px-6 py-4">{student.telephone || "-"}</td>
                      <td className="px-6 py-4">{student.adresse || "-"}</td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            disabled={!student.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(student.id)}
                            disabled={deletingId === student.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === student.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}

                            {deletingId === student.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Page{" "}
                <span className="font-black text-slate-800">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-800">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black transition ${
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}