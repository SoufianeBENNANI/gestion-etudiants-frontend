import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardRedirect from "./DashboardRedirect";
import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import Unauthorized from "./Unauthorized";

import StudentDashboard from "../modules/metier/student/StudentDashboard";

import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../modules/metier/manager/DashboardManager/pages/ManagerDashboard";

import Settings from "../modules/metier/settings/pages/Settings";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<DashboardRedirect />}
        />

        {AdminRoutes()}
        {TeacherRoutes()}

        <Route
          path="/student"
          element={
            <PrivateRoute role="STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* MANAGER ROUTES */}
        <Route
          path="/manager"
          element={
            <PrivateRoute role="MANAGER">
              <ManagerLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<ManagerDashboard />}
          />
        </Route>

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="*"
          element={<h1>Page introuvable</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;