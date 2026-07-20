import { CircleDollarSign, X } from "lucide-react";

const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
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

export default function DetailsPayments({
  open,
  payement,
  onClose,
}) {
  if (!open || !payement) {
    return null;
  }

  const studentName = `${payement.studentNom || ""} ${
    payement.studentPrenom || ""
  }`.trim();

  const details = [
    {
      label: "ID du paiement",
      value: payement.id ?? "-",
    },
    {
      label: "ID étudiant",
      value: payement.studentId ?? "-",
    },
    {
      label: "Étudiant",
      value: studentName || "-",
    },
    {
      label: "Montant",
      value: `${formatAmount(payement.amount)} MAD`,
    },
    {
      label: "Date",
      value: formatDate(payement.date),
    },
    {
      label: "Statut",
      value: payement.status || "-",
    },
    {
      label: "Archivé",
      value: payement.archived ? "Oui" : "Non",
    },
    {
      label: "Date d'archivage",
      value: payement.archivedAt
        ? formatDate(payement.archivedAt)
        : "-",
    },
  ];

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
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <CircleDollarSign size={22} />
            </div>

            <div>
              <p className="text-xs font-bold text-orange-200">
                Manager / Paiements
              </p>

              <h2 className="mt-1 text-xl font-black">
                Détails du paiement
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--section-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <p
                className="text-xs font-bold"
                style={{ color: "var(--muted-text)" }}
              >
                {detail.label}
              </p>

              <p className="mt-1 break-words text-sm font-black">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div
          className="flex justify-end border-t px-6 py-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-orange-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}