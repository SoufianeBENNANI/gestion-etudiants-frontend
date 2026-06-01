import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Search,
  RefreshCw,
  CalendarDays,
  User,
  FileInput,
  FileOutput,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Database,
  Activity,
} from "lucide-react";
import api from "../../../../../api/axios";

export default function Alllogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/logs");
      setLogs(Array.isArray(response.data) ? response.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error loading AI logs:", err);
      setLogs([]);
      setError("Failed to load AI logs. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
  };

  const filteredLogs = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    if (!value) return logs;

    return logs.filter((log) => {
      const studentName = `${log.student?.prenom || ""} ${
        log.student?.nom || ""
      }`.toLowerCase();

      return (
        String(log.id || "").includes(value) ||
        String(log.inputData || "").toLowerCase().includes(value) ||
        String(log.outputData || "").toLowerCase().includes(value) ||
        studentName.includes(value)
      );
    });
  }, [logs, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / itemsPerPage)
  );

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const startLog =
    filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endLog = Math.min(currentPage * itemsPerPage, filteredLogs.length);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages));

  const todayLogs = logs.filter((log) => {
    if (!log.createdAt) return false;
    return new Date(log.createdAt).toDateString() === new Date().toDateString();
  }).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (student) => {
    if (!student) return "No student";
    return `${student.prenom || ""} ${student.nom || ""}`.trim() || "No student";
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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/15">
              <Brain size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-cyan-200">
                Artificial Intelligence
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                AI Logs
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                Monitor, view and track AI prediction history.
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
                placeholder="Search log..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-72"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Database size={22} />
            </div>

            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Logs</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {logs.length}
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

          <p className="text-sm font-black text-slate-950">Displayed Logs</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredLogs.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Activity size={22} />
            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-500">
              Today
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Today Logs</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {todayLogs}
          </h2>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <Brain size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Logs List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startLog} to {endLog} of {filteredLogs.length} logs
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
              <th className="w-[17%] px-3 py-3 font-black">Log</th>
              <th className="w-[19%] px-3 py-3 font-black">Student</th>
              <th className="w-[24%] px-3 py-3 font-black">Input</th>
              <th className="w-[24%] px-3 py-3 font-black">Output</th>
              <th className="w-[16%] px-3 py-3 font-black">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Loading AI logs...
                  </div>
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                >
                  No AI logs found.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <td className="px-3 py-3">
                    <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 sm:flex">
                        <Brain size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-900">
                          Log #{log.id}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                          <ShieldCheck size={11} />
                          Saved
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 sm:flex">
                        <User size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-900">
                          {getStudentName(log.student)}
                        </p>
                        <p className="truncate text-xs font-bold text-slate-400">
                          ID: {log.student?.id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="mx-auto flex max-w-full items-start justify-center gap-2">
                      <FileInput
                        size={16}
                        className="mt-0.5 shrink-0 text-cyan-600"
                      />
                      <p className="line-clamp-2 text-left text-xs font-semibold text-slate-600">
                        {log.inputData || "No input data"}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="mx-auto flex max-w-full items-start justify-center gap-2">
                      <FileOutput
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <p className="line-clamp-2 text-left text-xs font-semibold text-slate-600">
                        {log.outputData || "No output data"}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <CalendarDays size={15} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
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
    </div>
  );
}