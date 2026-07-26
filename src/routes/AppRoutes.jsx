import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashboardRedirect from "./DashboardRedirect";

import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import ManagerRoutes from "./ManagerRoutes";
import StudentRoutes from "./StudentRoutes";

import Unauthorized from "./Unauthorized";

import Settings from "../modules/metier/settings/pages/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT */}
        <Route
          path="/"
          element={
            <DashboardRedirect />
          }
        />

        {AdminRoutes()}
        {TeacherRoutes()}
        {ManagerRoutes()}
        {StudentRoutes()}

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <Settings />
          }
        />

        {/* UNAUTHORIZED */}
        <Route
          path="/unauthorized"
          element={
            <Unauthorized />
          }
        />

        {/* NOT FOUND */}
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