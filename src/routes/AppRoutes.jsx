import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashboardRedirect from "./DashboardRedirect";
import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import ManagerRoutes from "./ManagerRoutes";

import Unauthorized from "./Unauthorized";

import StudentDashboard from "../modules/metier/student/StudentDashboard";

import Settings from "../modules/metier/settings/pages/Settings";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardRedirect />
          }
        />

        {AdminRoutes()}

        {TeacherRoutes()}

        {ManagerRoutes()}

        <Route
          path="/student"
          element={
            <PrivateRoute role="STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <Settings />
          }
        />

        <Route
          path="/unauthorized"
          element={
            <Unauthorized />
          }
        />

        <Route
          path="*"
          element={
            <h1>
              Page introuvable
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;