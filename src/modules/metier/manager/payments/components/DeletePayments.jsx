import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";

import { deletePayement } from "../services/payementService";

export default function DeletePayments({
  open,
  payement,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deletePayement(payement.id);

      await onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erreur suppression paiement :", error);

      setError(
        error?.response?.data?.message ||
          "Impossible de supprimer le paiement."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !payement) {
    return null;
  }

  const studentName = `${payement.studentNom || ""} ${
    payement.studentPrenom || ""
  }`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md overflow-hidden rounded-[1.7rem] border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-red-950 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-bold text-red-200">
              Manager / Paiements
            </p>

            <h2 className="mt-1 text-xl font-black">
              Supprimer le paiement
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={28} />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-black">
              Confirmer la suppression
            </h3>

            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: "var(--muted-text)" }}
            >
              Voulez-vous supprimer le paiement de{" "}
              <strong>{studentName || "-"}</strong> ?
            </p>
          </div>

          <div
            className="rounded-xl border p-4 text-sm"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <p>
              <strong>Montant :</strong>{" "}
              {Number(payement.amount || 0).toFixed(2)} MAD
            </p>

            <p className="mt-1">
              <strong>Date :</strong> {payement.date || "-"}
            </p>
          </div>

          <div
            className="flex justify-end gap-3 border-t pt-5"
            style={{ borderColor: "var(--border-color)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-black"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Trash2 size={17} />
              )}

              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}