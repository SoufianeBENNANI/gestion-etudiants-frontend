import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <div className="p-4">
          <Navbar />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}