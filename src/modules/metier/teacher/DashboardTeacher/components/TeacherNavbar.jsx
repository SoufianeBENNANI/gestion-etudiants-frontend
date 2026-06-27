import { Search } from "lucide-react";

export default function TeacherNavbar() {
  return (
    <div
      className="flex flex-col gap-4 rounded-[1.7rem] border px-6 py-5 text-white shadow-sm lg:flex-row lg:items-center lg:justify-between"
      style={{
        borderColor: "var(--border-color)",
        background: "linear-gradient(135deg, #6d28d9, #020617)",
      }}
    >
      <div>
        <p className="text-xs font-semibold text-violet-200">
          Hey, Teacher 👋
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          Welcome to your Dashboard
        </h2>

        <p className="mt-1 text-sm font-semibold text-slate-300">
          Manage courses, students, attendance and grades
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 backdrop-blur-xl">
          <input
            placeholder="Search"
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-300 sm:w-64"
          />

          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15">
          Teacher
        </div>
      </div>
    </div>
  );
}