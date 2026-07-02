import { useEffect, useMemo, useState } from "react";
import {
    UserRound,
    Loader2,
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    getAllTeachers,
    searchTeachersByNom,
} from "../services/teacherService";

import TeacherDetails from "../components/TeacherDetails";

export default function TeacherTeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const cardStyle = {
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
        color: "var(--text-color)",
    };

    const inputStyle = {
        backgroundColor: "var(--input-bg)",
        color: "var(--text-color)",
        borderColor: "var(--border-color)",
    };

    const mutedTextStyle = { color: "var(--muted-text)" };
    const textStyle = { color: "var(--text-color)" };

    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const loadTeachers = async () => {
        try {
            setLoading(true);
            const data = await getAllTeachers();
            setTeachers(Array.isArray(data) ? data : []);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeachers();
    }, []);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);

        if (!value.trim()) {
            loadTeachers();
            return;
        }

        try {
            setLoading(true);
            const data = await searchTeachersByNom(value.trim());
            setTeachers(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
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

    return (
        <div
            className="min-h-screen space-y-5 px-2 py-1"
            style={{
                backgroundColor: "var(--app-bg)",
                color: "var(--text-color)",
            }}
        >
            <div
                className="flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
                style={{
                    borderColor: "var(--border-color)",
                    background: "linear-gradient(135deg, #2e1a72, #4c1d95, #6d4aff)",
                }}
            >
                <div>
                    <p className="text-xs font-semibold text-purple-200">
                        Teachers Management
                    </p>

                    <h1 className="mt-1 text-2xl font-black text-white">
                        Teacher Teachers
                    </h1>

                    <p className="mt-1 text-sm font-semibold text-purple-100">
                        View and search available teachers.
                    </p>
                </div>

                <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search teacher..."
                        className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-purple-200 sm:w-64"
                    />

                    <Search size={17} className="text-purple-100" />
                </div>
            </div>

            <div
                className="overflow-hidden rounded-[1.4rem] border shadow-sm"
                style={cardStyle}
            >
                <div
                    className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                    style={{
                        backgroundColor: "var(--section-bg)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                            <UserRound size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-black" style={textStyle}>
                                Teachers List
                            </h2>

                            <p className="text-xs font-semibold" style={mutedTextStyle}>
                                Showing {startTeacher} to {endTeacher} of {teachers.length} teachers
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black" style={mutedTextStyle}>
                            Rows:
                        </span>

                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
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
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr
                                className="border-b text-center text-[11px] uppercase"
                                style={{
                                    borderColor: "var(--border-color)",
                                    color: "var(--muted-text)",
                                }}
                            >
                                <th className="px-5 py-4 font-black">Teacher</th>
                                <th className="px-5 py-4 font-black">Email</th>
                                <th className="px-5 py-4 font-black">Department</th>
                                <th className="px-5 py-4 font-black">Speciality</th>
                                <th className="px-5 py-4 font-black">Action</th>
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
                                            Loading teachers...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-10 text-center">
                                        <span className="text-sm font-bold" style={mutedTextStyle}>
                                            No teachers found.
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTeachers.map((teacher) => {
                                    const fullName = `${teacher.nom || ""} ${teacher.prenom || ""
                                        }`.trim();

                                    return (
                                        <tr
                                            key={teacher.id}
                                            className="border-b text-center text-sm last:border-none"
                                            style={{
                                                borderColor: "var(--border-color)",
                                                color: "var(--text-color)",
                                            }}
                                        >
                                            <td className="px-5 py-4 font-black">
                                                {fullName || "-"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span style={mutedTextStyle}>{teacher.email || "-"}</span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className="rounded-full px-3 py-1.5 text-xs font-black"
                                                    style={{
                                                        backgroundColor: "var(--section-bg)",
                                                        color: "var(--primary-color)",
                                                    }}
                                                >
                                                    {teacher.departementNom || "-"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className="rounded-full px-3 py-1.5 text-xs font-black"
                                                    style={{
                                                        backgroundColor: "var(--section-bg)",
                                                        color: "var(--primary-color)",
                                                    }}
                                                >
                                                    {teacher.specialite || teacher.speciality || "-"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedTeacher(teacher)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div
                    className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                    style={{
                        backgroundColor: "var(--section-bg)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    <p className="text-xs font-semibold" style={mutedTextStyle}>
                        Showing{" "}
                        <span className="font-black" style={textStyle}>
                            {startTeacher}
                        </span>{" "}
                        to{" "}
                        <span className="font-black" style={textStyle}>
                            {endTeacher}
                        </span>{" "}
                        of{" "}
                        <span className="font-black" style={textStyle}>
                            {teachers.length}
                        </span>{" "}
                        teachers
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
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
                            Page {currentPage} / {totalPages}
                        </span>
                    </div>
                </div>
            </div>
            <TeacherDetails
                teacher={selectedTeacher}
                onClose={() => setSelectedTeacher(null)}
            />
        </div>
    );
}