import { GraduationCap, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";
import { addStudent } from "../services/studentService";

export default function AddStudent() {
  const navigate = useNavigate();

  const handleAddStudent = async (studentData) => {
    try {
      console.log("JSON sent:", studentData);

      await addStudent(studentData);

      alert("Student added successfully");

      navigate("/students/all");

      return true;
    } catch (error) {
      console.error("Add student error:", error);
      alert("Error while adding the student");

      return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/15">
              <GraduationCap size={34} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-200">
                Students Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight">
                Add Student
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Enter the student&apos;s personal information to create a new
                profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <UserPlus size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Student Information
            </h2>
            <p className="text-sm text-slate-500">
              Fill in the form below to add a new student.
            </p>
          </div>
        </div>

        <StudentForm
          onSubmit={handleAddStudent}
          onBack={() => navigate("/students/all")}
        />
      </div>
    </div>
  );
}