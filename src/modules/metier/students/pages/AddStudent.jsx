import { GraduationCap, Sparkles, ArrowLeft } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-8 py-8 text-white shadow-2xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
            <GraduationCap size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-black">Add Student</h1>
            <p className="mt-1 text-sm text-white/80">
              Enter the student&apos;s personal information to create a new
              profile.
            </p>
          </div>
        </div>

        
      </div>
    </div>

    {/* FORM CARD */}
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-2xl md:px-10 md:py-10">
      <StudentForm
        onSubmit={handleAddStudent}
        onBack={() => navigate("/admin")}
      />
    </div>
  </div>
);
}