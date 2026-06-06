import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";

import { deleteStudent } from "../services/studentService";

export default function DeleteStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleClose = () => {
    navigate("/admin/students/all");
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);

      await deleteStudent(id);

      navigate("/admin/students/all");
    } catch (error) {
      console.error("Delete student error:", error);
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-6 py-5 text-white">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <AlertTriangle size={25} />
              </div>

              <div>
                <h2 className="text-lg font-black">Delete Student</h2>
                <p className="mt-1 text-xs font-semibold text-red-100">
                  Confirm student deletion.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={deleting}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 size={20} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  Are you sure you want to delete this student?
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-600">
                  This student will be removed from the list.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Student
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}