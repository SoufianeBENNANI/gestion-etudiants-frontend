import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import TeacherLayout from "../layouts/TeacherLayout";

import TeacherDashboard from "../modules/metier/teacher/DashboardTeacher/pages/TeacherDashboard";

export default function TeacherRoutes() {
  return (
    <Route
      path="/teacher"
      element={
        <PrivateRoute role="TEACHER">
          <TeacherLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<TeacherDashboard />} />
    </Route>
  );
}