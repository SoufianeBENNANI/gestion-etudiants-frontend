export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm text-slate-400">Hey, Admin 👋</p>
        <h1 className="text-xl font-black text-slate-900">
          Welcome to your Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-green-500 p-6 text-white shadow">
          <p className="text-lg font-semibold">Students</p>
          <h2 className="mt-2 text-3xl font-black">302</h2>
        </div>

        <div className="rounded-2xl bg-yellow-500 p-6 text-white shadow">
          <p className="text-lg font-semibold">Teachers</p>
          <h2 className="mt-2 text-3xl font-black">33</h2>
        </div>

        <div className="rounded-2xl bg-blue-500 p-6 text-white shadow">
          <p className="text-lg font-semibold">Courses</p>
          <h2 className="mt-2 text-3xl font-black">25</h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-black">Attendance Overview</h2>
        <div className="flex h-44 items-center justify-center rounded-xl bg-slate-100">
          Graph ici
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-black">Students List</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-slate-500">
              <th className="py-3">Name</th>
              <th className="py-3">Class</th>
              <th className="py-3">Email</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-3">Ali</td>
              <td className="py-3">S1</td>
              <td className="py-3">ali@mail.com</td>
            </tr>

            <tr>
              <td className="py-3">Sara</td>
              <td className="py-3">S2</td>
              <td className="py-3">sara@mail.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}