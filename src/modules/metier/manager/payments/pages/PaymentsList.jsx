import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  FileDown,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import {
  downloadPayementsPdf,
  getAllPayements,
} from "../services/payementService";

import AddPayments from "../components/AddPayments";
import EditPayments from "../components/EditPayments";
import DeletePayments from "../components/DeletePayments";
import DetailsPayments from "../components/DetailsPayments";

const normalizePayements = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data?.content)) {
    return data.data.content;
  }

  return [];
};

const getStudentName = (payement) => {
  return `${payement?.studentNom || ""} ${
    payement?.studentPrenom || ""
  }`.trim() || "-";
};

const getAmount = (payement) => {
  const amount = Number(
    payement?.amount ??
      payement?.montant ??
      0
  );

  return Number.isFinite(amount) ? amount : 0;
};

const getStatus = (payement) => {
  return String(
    payement?.status ??
      payement?.statut ??
      "-"
  )
    .trim()
    .toUpperCase();
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("fr-FR");
};

const isPaid = (payement) => {
  return [
    "PAYE",
    "PAYÉ",
    "PAID",
    "COMPLETE",
    "COMPLETED",
  ].includes(getStatus(payement));
};

const getStatusStyle = (status) => {
  if (
    ["PAYE", "PAYÉ", "PAID", "COMPLETE", "COMPLETED"].includes(
      status
    )
  ) {
    return {
      backgroundColor: "rgba(34, 197, 94, 0.14)",
      color: "#16a34a",
    };
  }

  if (
    [
      "PENDING",
      "EN_ATTENTE",
      "EN ATTENTE",
      "IMPAYE",
      "IMPAYÉ",
      "UNPAID",
    ].includes(status)
  ) {
    return {
      backgroundColor: "rgba(245, 158, 11, 0.14)",
      color: "#d97706",
    };
  }

  if (
    [
      "CANCELLED",
      "CANCELED",
      "ANNULE",
      "ANNULÉ",
      "REFUSED",
    ].includes(status)
  ) {
    return {
      backgroundColor: "rgba(239, 68, 68, 0.14)",
      color: "#dc2626",
    };
  }

  return {
    backgroundColor: "rgba(234, 88, 12, 0.12)",
    color: "#c2410c",
  };
};

export default function PaymentsList() {
  const [payements, setPayements] = useState([]);
  const [selectedPayement, setSelectedPayement] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--text-color)",
  };

  const sectionStyle = {
    backgroundColor: "var(--section-bg)",
    borderColor: "var(--border-color)",
  };

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    color: "var(--text-color)",
    borderColor: "var(--border-color)",
  };

  const loadPayements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllPayements();

      setPayements(normalizePayements(data));
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur chargement paiements :", error);

      setPayements([]);

      setError(
        error?.response?.data?.message ||
          `Impossible de charger les paiements. ${
            error?.response?.status
              ? `Code : ${error.response.status}`
              : ""
          }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayements();
  }, []);

  const filteredPayements = useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    if (!value) {
      return payements;
    }

    return payements.filter((payement) => {
      const studentName = getStudentName(payement).toLowerCase();
      const amount = String(getAmount(payement)).toLowerCase();
      const status = getStatus(payement).toLowerCase();
      const date = String(payement.date || "").toLowerCase();

      return (
        studentName.includes(value) ||
        amount.includes(value) ||
        status.includes(value) ||
        date.includes(value)
      );
    });
  }, [payements, searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const totalAmount = useMemo(() => {
    return payements.reduce(
      (total, payement) => total + getAmount(payement),
      0
    );
  }, [payements]);

  const paidPayments = useMemo(() => {
    return payements.filter(isPaid).length;
  }, [payements]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayements.length / itemsPerPage)
  );

  const paginatedPayements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredPayements.slice(
      startIndex,
      startIndex + itemsPerPage
    );
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
  ).slice(
    Math.max(currentPage - 3, 0),
    Math.min(currentPage + 2, totalPages)
  );

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      setError("");

      const pdfData = await downloadPayementsPdf();

      const blob = new Blob([pdfData], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "liste_paiements.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement PDF :", error);
      setError("Impossible de télécharger le PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  const openDetails = (payement) => {
    setSelectedPayement(payement);
    setDetailsOpen(true);
  };

  const openEdit = (payement) => {
    setSelectedPayement(payement);
    setEditOpen(true);
  };

  const openDelete = (payement) => {
    setSelectedPayement(payement);
    setDeleteOpen(true);
  };

  return (
    <div
      className="min-h-screen space-y-5 px-2 py-1"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--text-color)",
      }}
    >
      <div className="flex flex-col gap-4 rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-[#c2410c] via-[#9a3412] to-[#431407] px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-200">
            Manager / Paiements
          </p>

          <h1 className="mt-1 text-2xl font-black">
            Liste des paiements
          </h1>

          <p className="mt-1 text-sm font-semibold text-orange-100/80">
            Gestion, modification et archivage des paiements.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4">
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Rechercher un paiement..."
              className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-orange-100/70 sm:w-60"
            />

            <Search size={17} />
          </div>

          <button
            type="button"
            onClick={loadPayements}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Actualiser
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-60"
          >
            {pdfLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <FileDown size={17} />
            )}

            PDF
          </button>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-black transition hover:bg-orange-600"
          >
            <Plus size={17} />
            Ajouter
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div
          className="rounded-[1.4rem] border p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white">
              <CircleDollarSign size={21} />
            </div>

            <div>
              <h3 className="text-2xl font-black">
                {payements.length}
              </h3>

              <p
                className="text-xs font-semibold"
                style={{ color: "var(--muted-text)" }}
              >
                Total paiements
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-[1.4rem] border p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
              <CircleDollarSign size={21} />
            </div>

            <div>
              <h3 className="text-xl font-black">
                {formatAmount(totalAmount)} MAD
              </h3>

              <p
                className="text-xs font-semibold"
                style={{ color: "var(--muted-text)" }}
              >
                Montant total
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-[1.4rem] border p-5 shadow-sm"
          style={cardStyle}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
              <CircleDollarSign size={21} />
            </div>

            <div>
              <h3 className="text-2xl font-black">
                {paidPayments}
              </h3>

              <p
                className="text-xs font-semibold"
                style={{ color: "var(--muted-text)" }}
              >
                Paiements effectués
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[1.4rem] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div
        className="overflow-hidden rounded-[1.4rem] border shadow-sm"
        style={cardStyle}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={sectionStyle}
        >
          <div>
            <h2 className="text-lg font-black">
              Liste des paiements
            </h2>

            <p
              className="mt-1 text-xs font-semibold"
              style={{ color: "var(--muted-text)" }}
            >
              Affichage {startPayement} à {endPayement} sur{" "}
              {filteredPayements.length} paiements
            </p>
          </div>

          <select
            value={itemsPerPage}
            onChange={(event) => {
              setItemsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="rounded-xl border px-3 py-2 text-xs font-bold outline-none"
            style={inputStyle}
          >
            <option value={5}>5 lignes</option>
            <option value={10}>10 lignes</option>
            <option value={15}>15 lignes</option>
            <option value={20}>20 lignes</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] table-fixed">
            <thead>
              <tr
                className="border-b text-center text-[11px] uppercase"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="w-[27%] px-5 py-4">
                  Étudiant
                </th>

                <th className="w-[18%] px-5 py-4">
                  Montant
                </th>

                <th className="w-[17%] px-5 py-4">
                  Date
                </th>

                <th className="w-[17%] px-5 py-4">
                  Statut
                </th>

                <th className="w-[21%] px-5 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold">
                      <Loader2 className="animate-spin" size={20} />
                      Chargement des paiements...
                    </div>
                  </td>
                </tr>
              ) : paginatedPayements.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center font-bold"
                  >
                    Aucun paiement trouvé.
                  </td>
                </tr>
              ) : (
                paginatedPayements.map((payement) => {
                  const studentName = getStudentName(payement);
                  const status = getStatus(payement);

                  return (
                    <tr
                      key={payement.id}
                      className="border-b text-center text-sm transition last:border-none hover:bg-orange-500/5"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-black text-orange-700">
                            {studentName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-black">
                              {studentName}
                            </p>

                            <p
                              className="text-xs font-semibold"
                              style={{
                                color: "var(--muted-text)",
                              }}
                            >
                              ID : {payement.studentId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-black text-orange-600">
                        {formatAmount(getAmount(payement))} MAD
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatDate(payement.date)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                          style={getStatusStyle(status)}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDetails(payement)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            title="Voir"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEdit(payement)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-700"
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDelete(payement)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700"
                            title="Supprimer"
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
        </div>

        <div
          className="flex flex-col gap-3 border-t px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          style={sectionStyle}
        >
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--muted-text)" }}
          >
            Affichage {startPayement} à {endPayement} sur{" "}
            {filteredPayements.length} paiements
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border disabled:opacity-40"
              style={inputStyle}
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black"
                style={{
                  backgroundColor:
                    currentPage === page
                      ? "#c2410c"
                      : "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color:
                    currentPage === page
                      ? "#ffffff"
                      : "var(--text-color)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border disabled:opacity-40"
              style={inputStyle}
            >
              <ChevronRight size={16} />
            </button>

            <span
              className="rounded-xl border px-4 py-2 text-xs font-black"
              style={inputStyle}
            >
              Page {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      <AddPayments
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={loadPayements}
      />

      <EditPayments
        open={editOpen}
        payement={selectedPayement}
        onClose={() => {
          setEditOpen(false);
          setSelectedPayement(null);
        }}
        onSuccess={loadPayements}
      />

      <DeletePayments
        open={deleteOpen}
        payement={selectedPayement}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedPayement(null);
        }}
        onSuccess={loadPayements}
      />

      <DetailsPayments
        open={detailsOpen}
        payement={selectedPayement}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPayement(null);
        }}
      />
    </div>
  );
}