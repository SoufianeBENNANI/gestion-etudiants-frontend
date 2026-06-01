import { useEffect, useState } from "react";
import { ScrollText, RefreshCcw, Clock, User, AlertCircle } from "lucide-react";
import { getAllLogs } from "../service/logService";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading AI logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <ScrollText size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900">AI Logs</h1>
            <p className="text-sm font-semibold text-slate-500">
              View AI activity logs
            </p>
          </div>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold text-slate-500">Total Logs</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">
          {logs.length}
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Message
              </th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-sm font-bold text-slate-500"
                >
                  Loading AI logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-sm font-bold text-slate-500"
                >
                  No AI logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <ScrollText size={19} />
                      </div>

                      <div>
                        <p className="font-black text-slate-900">
                          {log.message ||
                            log.prompt ||
                            log.question ||
                            "No message"}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {log.response ||
                            log.result ||
                            log.description ||
                            "No details"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {log.userEmail || log.username || log.user || "N/A"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                      <AlertCircle size={14} />
                      {log.type || log.level || "INFO"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : log.date
                        ? new Date(log.date).toLocaleString()
                        : "N/A"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}