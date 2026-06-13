import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Layers3,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import {
  getArchivedStudents,
  restoreStudent,
} from "../services/studentService";

const translations = {
  EN: {
    management: "Students Management",
    title: "Archived Students",
    subtitle: "View and restore archived student records.",
    listTitle: "Archived Students List",
    showing: "Showing",
    archivedStudents: "archived students",
    search: "Search archive...",
    refresh: "Refresh",
    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    gender: "Gender",
    phone: "Phone",
    address: "Address",
    action: "Action",
    loading: "Loading archived students...",
    empty: "No archived students found.",
    restore: "Restore",
    restoring: "Restoring...",
    close: "Close",
  },

  FR: {
    management: "Gestion des étudiants",
    title: "Étudiants archivés",
    subtitle: "Afficher et restaurer les dossiers étudiants archivés.",
    listTitle: "Liste des étudiants archivés",
    showing: "Affichage",
    archivedStudents: "étudiants archivés",
    search: "Rechercher dans l’archive...",
    refresh: "Actualiser",
    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    gender: "Genre",
    phone: "Téléphone",
    address: "Adresse",
    action: "Action",
    loading: "Chargement des étudiants archivés...",
    empty: "Aucun étudiant archivé trouvé.",
    restore: "Restaurer",
    restoring: "Restauration...",
    close: "Fermer",
  },

  AR: {
    management: "إدارة الطلاب",
    title: "الطلاب المؤرشفون",
    subtitle: "عرض واستعادة سجلات الطلاب المؤرشفة.",
    listTitle: "قائمة الطلاب المؤرشفين",
    showing: "عرض",
    archivedStudents: "طلاب مؤرشفين",
    search: "البحث في الأرشيف...",
    refresh: "تحديث",
    lastName: "الاسم العائلي",
    firstName: "الاسم الشخصي",
    email: "البريد الإلكتروني",
    gender: "الجنس",
    phone: "الهاتف",
    address: "العنوان",
    action: "الإجراء",
    loading: "جاري تحميل الطلاب المؤرشفين...",
    empty: "لا يوجد طلاب مؤرشفون.",
    restore: "استعادة",
    restoring: "جاري الاستعادة...",
    close: "إغلاق",
  },
};

export default function ArchivedStudents({ open, onClose, onRestored }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const [language, setLanguage] = useState(
    localStorage.getItem("app-language") || "EN"
  );

  const t = translations[language] || translations.EN;
  const isArabic = language === "AR";

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail || localStorage.getItem("app-language") || "EN");
    };

    window.addEventListener("app-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange);
    };
  }, []);

  const loadArchivedStudents = async () => {
    try {
      setLoading(true);

      const data = await getArchivedStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading archived students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadArchivedStudents();
    }
  }, [open]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const lastName = String(student.nom || "");
      const firstName = String(student.prenom || "");
      const email = String(student.email || "");

      return `${lastName} ${firstName} ${email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [students, searchTerm]);

  const handleRestore = async (student) => {
    if (!student?.id) return;

    try {
      setRestoringId(student.id);

      const restoredStudent = await restoreStudent(student.id);

      setStudents((prev) => prev.filter((item) => item.id !== student.id));

      if (onRestored) {
        onRestored(restoredStudent || student);
      }
    } catch (error) {
      console.error("Error restoring student:", error);
    } finally {
      setRestoringId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-6xl overflow-hidden rounded-[1.7rem] shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-7 py-7 text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary-color), #020617)",
          }}
        >
          <div
            className="absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl"
            style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
          />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

          <div
            className={`relative flex items-center justify-between gap-5 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-4 ${
                isArabic ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
                <Archive size={28} />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-200">
                  {t.management}
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t.title}
                </h2>

                <p className="mt-2 text-xs text-slate-300">{t.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className="flex flex-col gap-4 border-b px-6 py-5 md:flex-row md:items-center md:justify-between"
          style={{
            backgroundColor: "var(--section-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className={`flex items-center gap-3 ${
              isArabic ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Layers3 size={22} />
            </div>

            <div>
              <h3
                className="text-lg font-black"
                style={{ color: "var(--text-color)" }}
              >
                {t.listTitle}
              </h3>

              <p
                className="mt-1 text-xs"
                style={{ color: "var(--muted-text)" }}
              >
                {t.showing} {filteredStudents.length} {t.archivedStudents}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={17}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                  isArabic ? "right-4" : "left-4"
                }`}
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className={`w-full rounded-2xl border py-2.5 text-sm font-semibold outline-none transition placeholder:text-slate-400 sm:w-72 ${
                  isArabic ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                }`}
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-color)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>

            <button
              type="button"
              onClick={loadArchivedStudents}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--secondary-color)" }}
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RefreshCcw size={17} />
              )}
              {t.refresh}
            </button>
          </div>
        </div>

        <div className="max-h-[430px] overflow-y-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr
                className={`text-sm ${
                  isArabic ? "text-right" : "text-left"
                }`}
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--muted-text)",
                }}
              >
                <th className="px-6 py-4 font-black">{t.lastName}</th>
                <th className="px-6 py-4 font-black">{t.firstName}</th>
                <th className="px-6 py-4 font-black">{t.email}</th>
                <th className="px-6 py-4 font-black">{t.gender}</th>
                <th className="px-6 py-4 font-black">{t.phone}</th>
                <th className="px-6 py-4 font-black">{t.address}</th>
                <th
                  className={`px-6 py-4 font-black ${
                    isArabic ? "text-left" : "text-right"
                  }`}
                >
                  {t.action}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    <div
                      className="flex items-center justify-center gap-2 font-bold"
                      style={{ color: "var(--muted-text)" }}
                    >
                      <Loader2 size={20} className="animate-spin" />
                      {t.loading}
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    <span
                      className="font-bold"
                      style={{ color: "var(--muted-text)" }}
                    >
                      {t.empty}
                    </span>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-t text-sm transition ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="font-black"
                        style={{ color: "var(--text-color)" }}
                      >
                        {student.nom || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">{student.prenom || "-"}</td>
                    <td className="px-6 py-4">{student.email || "-"}</td>
                    <td className="px-6 py-4">{student.genre || "-"}</td>
                    <td className="px-6 py-4">{student.telephone || "-"}</td>
                    <td className="px-6 py-4">{student.adresse || "-"}</td>

                    <td
                      className={`px-6 py-4 ${
                        isArabic ? "text-left" : "text-right"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleRestore(student)}
                        disabled={restoringId === student.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {restoringId === student.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RotateCcw size={16} />
                        )}
                        {restoringId === student.id ? t.restoring : t.restore}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}