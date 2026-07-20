import { Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import ManagerLayout from "../layouts/ManagerLayout";

import ManagerDashboard from "../modules/metier/manager/DashboardManager/pages/ManagerDashboard";

import StudentPage from "../modules/metier/manager/students/pages/StudentPage";

import ManagerTeachersPage from "../modules/metier/manager/teacher/pages/ManagerTeachersPage";

import PaymentsList from "../modules/metier/manager/payments/pages/PaymentsList";

import ManagerArchivedPaymentsPage from "../modules/metier/manager/payments/pages/ManagerArchivedPaymentsPage";

import ManagerSetting from "../modules/metier/manager/settings/pages/ManagerSetting";

export default function ManagerRoutes() {
  return (
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

      <Route
        path="students"
        element={<StudentPage />}
      />

      <Route
        path="teachers"
        element={<ManagerTeachersPage />}
      />

      <Route
        path="payments"
        element={<PaymentsList />}
      />

      <Route
        path="payments/archive"
        element={
          <ManagerArchivedPaymentsPage />
        }
      />

      <Route
        path="settings"
        element={<ManagerSetting />}
      />
    </Route>
  );
}