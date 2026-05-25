import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DashboardRedirect from "./DashboardRedirect";

import AdminLayout from "../layouts/AdminLayout";

// Dashboards
import AdminDashboard from "../modules/metier/admin/pages/AdminDashboard";
import TeacherDashboard from "../modules/optionnel/teachers/pages/TeacherDashboard";
import StudentDashboard from "../modules/metier/admin/students/pages/StudentDashboard";
import ManagerDashboard from "../modules/metier/admin/manager/pages/ManagerDashboard";

// Students pages
import StudentOverview from "../modules/metier/admin/students/pages/StudentOverview";
import AllStudents from "../modules/metier/admin/students/pages/AllStudents";
import AddStudent from "../modules/metier/admin/students/pages/AddStudent";
import ArchivedStudents from "../modules/metier/admin/students/pages/ArchivedStudents";
import StudentPerformance from "../modules/metier/admin/students/pages/StudentPerformance";
import StudentAttendance from "../modules/metier/admin/students/pages/StudentAttendance";
import StudentPredictions from "../modules/metier/admin/students/pages/StudentPredictions";
import ArchivedAttendance from "../modules/metier/admin/students/pages/ArchivedAttendance";

// Classes pages
import AllClasses from "../modules/metier/admin/classes/pages/AllClasses";
import AddClasse from "../modules/metier/admin/classes/pages/AddClasse";
import EditClasse from "../modules/metier/admin/classes/pages/EditClasse";
import ClasseDetails from "../modules/metier/admin/classes/pages/ClasseDetails";
import ArchivedClasses from "../modules/metier/admin/classes/pages/ArchivedClasses";

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
          <Route path="classes/add" element={<AddClasse />} />
          <Route path="classes/edit/:id" element={<EditClasse />} />
          <Route path="classes/archive" element={<ArchivedClasses />} />
          <Route path="classes/:id" element={<ClasseDetails />} />
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