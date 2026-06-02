function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Manager
        </h1>
        <p className="mt-2 text-slate-500">
          Gestion globale de la plateforme
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">
            Total Students
          </h2>
          <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">
            Total Teachers
          </h2>
          <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">
            Total Classes
          </h2>
          <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
        </div>
      </div>

      {/* SECTION */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Manager Overview
        </h2>
        <p className="mt-2 text-slate-500">
          Ici, le manager peut consulter les statistiques globales, suivre les
          classes, les enseignants, les étudiants et les performances générales.
        </p>
      </div>
    </div>
  );
}

export default ManagerDashboard;