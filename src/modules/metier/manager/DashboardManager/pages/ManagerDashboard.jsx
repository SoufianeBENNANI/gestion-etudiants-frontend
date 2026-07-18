import {
  BookOpen,
  Building2,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statistics = [
  {
    title: "Total students",
    value: 120,
    percentage: "73%",
    evolution: "22%",
    icon: GraduationCap,
    iconBackground: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Total teachers",
    value: 18,
    percentage: "82%",
    evolution: "9%",
    icon: Users,
    iconBackground: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Total courses",
    value: 24,
    percentage: "90%",
    evolution: "17%",
    icon: BookOpen,
    iconBackground: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Total classes",
    value: 12,
    percentage: "76%",
    evolution: "12%",
    icon: Building2,
    iconBackground: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const monthlyData = [
  {
    month: "Jan",
    students: 20,
    teachers: 4,
    courses: 3,
    attendance: 75,
  },
  {
    month: "Feb",
    students: 35,
    teachers: 5,
    courses: 4,
    attendance: 78,
  },
  {
    month: "Mar",
    students: 50,
    teachers: 7,
    courses: 8,
    attendance: 80,
  },
  {
    month: "Apr",
    students: 65,
    teachers: 8,
    courses: 10,
    attendance: 84,
  },
  {
    month: "May",
    students: 80,
    teachers: 10,
    courses: 13,
    attendance: 86,
  },
  {
    month: "Jun",
    students: 95,
    teachers: 12,
    courses: 17,
    attendance: 89,
  },
  {
    month: "Jul",
    students: 120,
    teachers: 18,
    courses: 24,
    attendance: 92,
  },
];

const attendanceData = [
  {
    name: "Present",
    value: 68,
    color: "#f97316",
  },
  {
    name: "Absent",
    value: 12,
    color: "#ef4444",
  },
  {
    name: "Late",
    value: 10,
    color: "#facc15",
  },
  {
    name: "Excused",
    value: 10,
    color: "#22c55e",
  },
];

function StatisticCard({
  title,
  value,
  percentage,
  evolution,
  icon: Icon,
  iconBackground,
  iconColor,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBackground}`}
          >
            <Icon className={iconColor} size={23} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {value}
            </h3>

            <p className="text-sm text-slate-500">
              {title}
            </p>
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">
          {percentage}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm">
        <span className="text-slate-500">
          Last 30 days
        </span>

        <span className="font-semibold text-emerald-500">
          {evolution}
        </span>

        <TrendingUp
          size={16}
          className="text-emerald-500"
        />
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
            {/* STATISTICS */}
      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <StatisticCard
            key={statistic.title}
            {...statistic}
          />
        ))}
      </section>

      {/* CHARTS */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* LINE CHART */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Monthly Overview
          </h2>

          <div className="h-[360px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

                <Line
                  type="monotone"
                  dataKey="teachers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="courses"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATTENDANCE */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Attendance
          </h2>

          <div className="h-[290px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {attendanceData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {attendanceData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span>{item.name}</span>

                <span className="font-semibold text-slate-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}