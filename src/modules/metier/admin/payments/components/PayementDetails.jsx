import { useEffect, useState } from "react";
import {
  X,
  CreditCard,
  User,
  DollarSign,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

const translations = {
  EN: {
    management: "Payment Management",
    title: "Payment Details",
    subtitle: "Full payment information",

    student: "Student",
    amount: "Amount",
    paymentMode: "Payment Mode",
    paymentDate: "Payment Date",
    status: "Status",

    notAvailable: "N/A",
  },

  FR: {
    management: "Gestion des paiements",
    title: "Détails du paiement",
    subtitle: "Informations complètes du paiement",

    student: "Étudiant",
    amount: "Montant",
    paymentMode: "Mode de paiement",
    paymentDate: "Date de paiement",
    status: "Statut",

    notAvailable: "N/A",
  },

  AR: {
    management: "إدارة المدفوعات",
    title: "تفاصيل الدفع",
    subtitle: "معلومات الدفع الكاملة",

    student: "الطالب",
    amount: "المبلغ",
    paymentMode: "طريقة الدفع",
    paymentDate: "تاريخ الدفع",
    status: "الحالة",

    notAvailable: "N/A",
  },
};

export default function PayementDetails({ payement, onClose }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event.detail || localStorage.getItem("app-language") || "EN";

      setLanguage(nextLanguage);
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

  if (!payement) return null;

  const studentName =
    `${payement.studentNom || ""} ${payement.studentPrenom || ""}`.trim() ||
    `${payement.student?.nom || ""} ${payement.student?.prenom || ""}`.trim() ||
    `${payement.etudiant?.nom || ""} ${payement.etudiant?.prenom || ""}`.trim() ||
    payement.studentName ||
    payement.etudiantName ||
    t.notAvailable;

  const amount = payement.amount ?? payement.montant ?? t.notAvailable;
  const mode = payement.modePayement ?? payement.mode ?? t.notAvailable;
  const date = payement.datePayement ?? payement.date ?? t.notAvailable;
  const status = payement.statut ?? payement.status ?? t.notAvailable;

  const items = [
    {
      label: t.student,
      value: studentName,
      icon: User,
    },
    {
      label: t.amount,
      value: amount !== t.notAvailable ? `${amount} DH` : t.notAvailable,
      icon: DollarSign,
    },
    {
      label: t.paymentMode,
      value: mode,
      icon: CreditCard,
    },
    {
      label: t.paymentDate,
      value: date,
      icon: CalendarDays,
    },
    {
      label: t.status,
      value: status,
      icon: BadgeCheck,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={language === "AR" ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-24 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <CreditCard size={24} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-1 text-xs text-slate-300">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-4 bg-white p-6">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-1 truncate text-sm font-black text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}