import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DashboardRedirect from "./DashboardRedirect";

import AdminLayout from "../layouts/AdminLayout";

// Dashboards
import AdminDashboard from "../modules/metier/admin/pages/AdminDashboard";
import TeacherDashboard from "../modules/optionnel/teachers/pages/TeacherDashboard";
import StudentDashboard from "../modules/metier/students/pages/StudentDashboard";
import ManagerDashboard from "../modules/metier/manager/pages/ManagerDashboard";

// Student
import AddStudent from "../modules/metier/students/pages/AddStudent";
import AllStudents from "../modules/metier/students/pages/AllStudents";
import ArchivedStudents from "../modules/metier/students/pages/ArchivedStudents";
import StudentPerformance from "../modules/metier/students/pages/StudentPerformance";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* REDIRECTION AUTOMATIQUE */}
        <Route path="/" element={<DashboardRedirect />} />

        {/* ADMIN LAYOUT AVEC SIDEBAR FIXE */}
        <Route
          element={
            <PrivateRoute role="ADMIN">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/all" element={<AllStudents />} />
          <Route path="/students/archive" element={<ArchivedStudents />} />
          <Route path="/students/performance" element={<StudentPerformance />} />
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

        {/* PAGE ERREUR */}
        <Route path="/unauthorized" element={<h1>Accès refusé</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;