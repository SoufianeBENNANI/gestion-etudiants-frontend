import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DashboardRedirect from "./DashboardRedirect";

import AdminLayout from "../layouts/AdminLayout";

// Dashboards
import AdminDashboard from "../modules/metier/admin/pages/AdminDashboard";
import TeacherDashboard from "../modules/metier/teacher/TeacherDashboard";
import StudentDashboard from "../modules/metier/admin/students/pages/StudentDashboard";
import ManagerDashboard from "../modules/metier/Manager/ManagerDashboard";

// Students pages
import StudentOverview from "../modules/metier/admin/students/pages/StudentOverview";
import AllStudents from "../modules/metier/admin/students/pages/AllStudents";
import AddStudent from "../modules/metier/admin/students/pages/AddStudent";
import DeleteStudent from "../modules/metier/admin/students/pages/DeleteStudent";
import ArchivedStudents from "../modules/metier/admin/students/pages/ArchivedStudents";
import StudentPerformance from "../modules/metier/admin/students/pages/StudentPerformance";
import StudentAttendance from "../modules/metier/admin/students/pages/StudentAttendance";
import StudentPredictions from "../modules/metier/admin/students/pages/StudentPredictions";
import ArchivedAttendance from "../modules/metier/admin/students/pages/ArchivedAttendance";

// Classes pages
import AllClasses from "../modules/metier/admin/classes/pages/AllClasses";

// Courses pages
import AllCourses from "../modules/metier/admin/courses/pages/AllCourses";

// Departements pages
import AllDepartements from "../modules/metier/admin/departements/pages/AllDepartements";

// Teachers pages
import AllTeachers from "../modules/metier/admin/teachers/pages/AllTeachers";

// AI pages
import AllModels from "../modules/metier/admin/AImodels/pages/AllModels";
import Alllogs from "../modules/metier/admin/AIlogs/pages/Alllogs";

//Grade pages
import AllGrades from "../modules/metier/admin/grades/pages/AllGrades";

//Payement pages
import AllPayements from "../modules/metier/admin/payments/pages/AllPayements";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* REDIRECTION */}
        <Route path="/" element={<DashboardRedirect />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          {/* STUDENTS */}
          <Route path="students" element={<StudentOverview />} />
          <Route path="students/all" element={<AllStudents />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/delete/:id" element={<DeleteStudent />} />
          <Route path="students/archive" element={<ArchivedStudents />} />
          <Route path="students/performance" element={<StudentPerformance />} />
          <Route path="students/attendance" element={<StudentAttendance />} />
          <Route path="students/predictions" element={<StudentPredictions />} />
          <Route
            path="students/attendance/archive"
            element={<ArchivedAttendance />}
          />

          {/* CLASSES */}
          <Route path="classes" element={<AllClasses />} />

          {/* COURSES */}
          <Route path="courses" element={<AllCourses />} />

          {/* DEPARTEMENTS */}
          <Route path="departements" element={<AllDepartements />} />
          <Route path="departments" element={<AllDepartements />} />

          {/* TEACHERS */}
          <Route path="teachers" element={<AllTeachers />} />

          {/* AI */}
          <Route path="AImodels" element={<AllModels />} />
          <Route path="AIlogs" element={<Alllogs />} />

          {/* GRADE */}
          <Route path="/admin/grades" element={<AllGrades />} />

          {/* PAYEMENT */}
          <Route path="/admin/payments" element={<AllPayements />} />
        </Route>

        {/* TEACHER */}
        <Route
          path="/teacher"
          element={
            <PrivateRoute role="TEACHER">
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <PrivateRoute role="STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* MANAGER */}
        <Route
          path="/manager"
          element={
            <PrivateRoute role="MANAGER">
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        {/* ERROR */}
        <Route path="/unauthorized" element={<h1>Accès refusé</h1>} />
        <Route path="*" element={<h1>Page introuvable</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;