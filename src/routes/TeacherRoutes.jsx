import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import TeacherLayout from "../layouts/TeacherLayout";

import TeacherDashboard from "../modules/metier/teacher/DashboardTeacher/pages/TeacherDashboard";
import StudentsList from "../modules/metier/teacher/students/pages/StudentsList";
import TeacherSettings from "../modules/metier/teacher/settings/pages/TeacherSettings";


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
      <Route path="students" element={<StudentsList />} />
     <Route path="settings" element={<TeacherSettings />} />
    </Route>
  );
}