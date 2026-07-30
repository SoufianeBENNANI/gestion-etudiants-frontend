import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

export default function CreatedStudentAccountModal({
  account,
  onClose,
}) {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);

  const isArabic = i18n.resolvedLanguage?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    if (!account) return;

    setShowPassword(true);
    setCopied(false);
  }, [account]);

  useEffect(() => {
    if (!account) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [account, onClose]);

  if (!account) return null;

  const username =
    account.username || t("createdStudentAccount.notProvided");

  const temporaryPassword =
    account.temporaryPassword ||
    t("createdStudentAccount.notProvided");

  const copyCredentials = async () => {
    const credentials = [
      `${t("createdStudentAccount.username")} : ${username}`,
      `${t(
        "createdStudentAccount.temporaryPassword"
      )} : ${temporaryPassword}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(credentials);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        t("createdStudentAccount.copyError"),
        error
      );
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="created-account-title"
      dir={direction}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[1.7rem] border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
          borderColor: "var(--border-color)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* En-tête */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-6 text-white sm:px-7"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-300/30">
              <CheckCircle2
                size={29}
                className="text-emerald-300"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-blue-200">
                {t("createdStudentAccount.section")}
              </p>

              <h2
                id="created-account-title"
                className="mt-1 text-xl font-black sm:text-2xl"
              >
                {t("createdStudentAccount.title")}
              </h2>

              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                {t("createdStudentAccount.subtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title={t("common.close")}
            aria-label={t("common.close")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <X size={19} />
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-5 p-6 sm:p-7">
          <div
            className="flex items-start gap-3 rounded-2xl border px-4 py-3"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-sm font-black text-emerald-500">
                {t("createdStudentAccount.accountCreated")}
              </p>

              <p
                className="mt-1 text-xs font-semibold opacity-70"
                style={{ color: "var(--text-color)" }}
              >
                {t("createdStudentAccount.secureCommunication")}
              </p>
            </div>
          </div>

          <CredentialField
            icon={<UserRound size={19} />}
            label={t("createdStudentAccount.username")}
            value={username}
            notProvided={t(
              "createdStudentAccount.notProvided"
            )}
          />

          {/* Mot de passe */}
          <div>
            <p
              className="mb-2 text-xs font-black"
              style={{ color: "var(--text-color)" }}
            >
              {t("createdStudentAccount.temporaryPassword")}
            </p>

            <div
              className="flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                <KeyRound size={19} />
              </div>

              <code
                dir="ltr"
                className={`min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm font-black sm:text-base ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {showPassword
                  ? temporaryPassword
                  : "••••••••••••"}
              </code>

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                title={
                  showPassword
                    ? t("createdStudentAccount.hidePassword")
                    : t("createdStudentAccount.showPassword")
                }
                aria-label={
                  showPassword
                    ? t("createdStudentAccount.hidePassword")
                    : t("createdStudentAccount.showPassword")
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition hover:opacity-70 focus:outline-none focus:ring-2"
                style={{ color: "var(--text-color)" }}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Avertissement adapté aux deux thèmes */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-600 dark:text-amber-300">
            <KeyRound size={19} className="mt-0.5 shrink-0" />

            <p className="text-sm font-semibold">
              {t("createdStudentAccount.warning")}
            </p>
          </div>

          {/* Boutons */}
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyCredentials}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition focus:outline-none focus:ring-2 ${
                copied
                  ? "bg-emerald-600 focus:ring-emerald-400"
                  : "hover:opacity-90"
              }`}
              style={
                copied
                  ? undefined
                  : {
                      backgroundColor:
                        "var(--secondary-color)",
                    }
              }
            >
              {copied ? (
                <Check size={18} />
              ) : (
                <Copy size={18} />
              )}

              {copied
                ? t("createdStudentAccount.copied")
                : t("createdStudentAccount.copy")}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition hover:opacity-80 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              <CheckCircle2 size={18} />
              {t("createdStudentAccount.saved")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CredentialField({
  icon,
  label,
  value,
  notProvided,
}) {
  return (
    <div>
      <p
        className="mb-2 text-xs font-black"
        style={{ color: "var(--text-color)" }}
      >
        {label}
      </p>

      <div
        className="flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          backgroundColor: "var(--input-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
          {icon}
        </div>

        <span
          dir="ltr"
          className="min-w-0 break-all text-sm font-bold sm:text-base"
        >
          {value || notProvided}
        </span>
      </div>
    </div>
  );
}