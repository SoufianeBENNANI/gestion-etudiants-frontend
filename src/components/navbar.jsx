export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">

      <div>
        <p className="text-gray-400 text-sm">Hey, Admin 👋</p>
        <h2 className="font-semibold">Welcome to your Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search"
          className="border px-3 py-2 rounded-lg text-sm"
        />
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

    </div>
  );
}