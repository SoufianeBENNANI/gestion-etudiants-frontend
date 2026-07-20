import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";

import { updatePayement } from "../services/payementService";

export default function EditPayments({
  open,
  payement,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    date: "",
    status: "PAYE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !payement) {
      return;
    }

    setForm({
      studentId:
        payement.studentId ??
        payement.student?.id ??
        "",
      amount:
        payement.amount ??
        payement.montant ??
        "",
      date:
        payement.date ??
        payement.datePayement ??
        "",
      status:
        payement.status ??
        payement.statut ??
        "PAYE",
    });

    setError("");
  }, [open, payement]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Le montant doit être supérieur à zéro.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updatePayement(payement.id, {
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        date: form.date,
        status: form.status,
      });

      await onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erreur modification paiement :", error);

      setError(
        error?.response?.data?.message ||
          "Impossible de modifier le paiement."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !payement) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-xl overflow-hidden rounded-[1.7rem] border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-[#c2410c] via-[#9a3412] to-[#431407] px-6 py-5 text-white">
          <div>
            <p className="text-xs font-bold text-orange-200">
              Manager / Paiements
            </p>

            <h2 className="mt-1 text-xl font-black">
              Modifier le paiement
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

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-black">
              Étudiant
            </label>

            <input
              type="text"
              value={`${payement.studentNom || ""} ${
                payement.studentPrenom || ""
              }`.trim()}
              disabled
              className="w-full rounded-xl border px-4 py-3 text-sm font-semibold opacity-70"
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black">
                Montant
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black">
              Statut
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              <option value="PAYE">PAYE</option>
              <option value="EN_ATTENTE">EN ATTENTE</option>
              <option value="IMPAYE">IMPAYE</option>
              <option value="ANNULE">ANNULE</option>
            </select>
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
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}