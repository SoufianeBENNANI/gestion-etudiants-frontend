function TeacherNavbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-violet-100 bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Teacher Dashboard
        </h2>
        <p className="text-sm font-semibold text-slate-500">
          Manage courses, students, attendance and grades
        </p>
      </div>

      <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
        Teacher
      </div>
    </header>
  );
}

export default TeacherNavbar;