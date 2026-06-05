import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCcw,
  Eye,
  Archive,
  CreditCard,
  DollarSign,
  Users,
  FileDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAllPayementsAdmin,
  downloadPayementsPdfAdmin,
  getArchivedPayementsAdmin,
} from "../services/payementService";

import PayementDetails from "../components/PayementDetails";
import ArchivedPayements from "../components/ArchivedPayements";

export default function AllPayements() {
  const [payements, setPayements] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayement, setSelectedPayement] = useState(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getAmount = (payement) => {
    return payement.amount ?? payement.montant ?? 0;
  };

  const getDate = (payement) => {
    return payement.date ?? payement.datePayement ?? "N/A";
  };

  const getStatus = (payement) => {
    return payement.status ?? payement.statut ?? "PAID";
  };

  const getMode = (payement) => {
    return payement.modePayement ?? payement.mode ?? "N/A";
  };

  const getStudentName = (payement) => {
    return (
      payement.studentName ||
      `${payement.student?.prenom || ""} ${payement.student?.nom || ""}`.trim() ||
      "N/A"
    );
  };

  const loadArchivedCount = async () => {
    try {
      const data = await getArchivedPayementsAdmin();
      setArchivedCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Load archived payments count error:", error);
      setArchivedCount(0);
    }
  };

  const fetchPayements = async () => {
    try {
      setLoading(true);

      const data = await getAllPayementsAdmin();
      const list = Array.isArray(data) ? data : [];

      setPayements(list);
      setCurrentPage(1);

      await loadArchivedCount();
    } catch (error) {
      console.error("Error loading payments:", error);
      alert("Error while loading payments");
      setPayements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayements();
  }, []);

  const filteredPayements = useMemo(() => {
    const value = searchTerm.toLowerCase();

    return payements.filter((payement) => {
      const studentName = getStudentName(payement);

      return (
        String(payement.id || "").toLowerCase().includes(value) ||
        String(getAmount(payement)).toLowerCase().includes(value) ||
        String(getMode(payement)).toLowerCase().includes(value) ||
        String(getStatus(payement)).toLowerCase().includes(value) ||
        String(getDate(payement)).toLowerCase().includes(value) ||
        String(studentName).toLowerCase().includes(value)
      );
    });
  }, [payements, searchTerm]);

  const totalAmount = payements.reduce(
    (sum, item) => sum + Number(getAmount(item) || 0),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayements.length / itemsPerPage)
  );

  const paginatedPayements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayements, currentPage, itemsPerPage]);

  const startPayement =
    filteredPayements.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endPayement = Math.min(
    currentPage * itemsPerPage,
    filteredPayements.length
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

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadPayementsPdfAdmin();
    } catch (error) {
      console.error("Error downloading payments PDF:", error);
      alert("Error while downloading payments PDF");
    } finally {
      setDownloading(false);
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
              <CreditCard size={28} />
            </div>

            <div>
              <p className="text-xs font-bold text-blue-200">
                Payment Management
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight">
                Payments Management
              </h1>

              <p className="mt-2 text-xs text-slate-300">
                View student payments, status, and payment history.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search payment..."
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-12 pr-4 text-sm font-bold text-white outline-none backdrop-blur-xl transition placeholder:text-slate-300 focus:border-white/30 focus:bg-white/15 sm:w-[360px]"
              />

              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              />
            </div>

            <button
              type="button"
              onClick={fetchPayements}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowArchiveDialog(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <Archive size={18} />
              Archive
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 ring-1 ring-red-300/30 transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileDown size={18} />
              )}
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
              <CreditCard size={22} />
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
              Records
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Payments</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {payements.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Users size={22} />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
              Results
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">
            Displayed Payments
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {filteredPayements.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <DollarSign size={22} />
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-600">
              Amount
            </span>
          </div>

          <p className="text-sm font-black text-slate-950">Total Amount</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {totalAmount} DH
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CreditCard size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Payments List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {startPayement} to {endPayement} of{" "}
                {filteredPayements.length} payments
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
              <th className="w-[10%] px-3 py-3 font-black">ID</th>
              <th className="w-[20%] px-3 py-3 font-black">Student</th>
              <th className="w-[14%] px-3 py-3 font-black">Amount</th>
              <th className="w-[16%] px-3 py-3 font-black">Mode</th>
              <th className="w-[16%] px-3 py-3 font-black">Date</th>
              <th className="w-[14%] px-3 py-3 font-black">Status</th>
              <th className="w-[10%] px-3 py-3 font-black">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-5 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                    <Loader2 size={18} className="animate-spin" />
                    Loading payments...
                  </div>
                </td>
              </tr>
            ) : filteredPayements.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-8 text-center text-sm font-bold text-slate-600"
                >
                  No payments found.
                </td>
              </tr>
            ) : (
              paginatedPayements.map((payement) => {
                const studentName = getStudentName(payement);
                const amount = getAmount(payement);
                const mode = getMode(payement);
                const date = getDate(payement);
                const status = getStatus(payement);

                return (
                  <tr
                    key={payement.id}
                    className="border-t border-slate-100 text-center text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
                      <span className="font-black text-slate-900">
                        #{payement.id}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="mx-auto flex max-w-full items-center justify-center gap-2">
                        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                          <Users size={17} />
                        </div>

                        <span className="truncate font-black text-slate-900">
                          {studentName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="font-bold text-slate-700">
                        {amount ?? "N/A"} DH
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate text-sm font-semibold text-slate-600">
                        {mode}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="block truncate text-sm font-semibold text-slate-600">
                        {date}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">
                        {status}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPayement(payement)}
                        title="View"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
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

      <PayementDetails
        payement={selectedPayement}
        onClose={() => setSelectedPayement(null)}
      />

      <ArchivedPayements
        open={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onRestored={() => {
          fetchPayements();
          loadArchivedCount();
        }}
      />
    </div>
  );
}