import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import TeacherLayout from "../layouts/TeacherLayout";

import TeacherDashboard from "../modules/metier/teacher/DashboardTeacher/pages/TeacherDashboard";
import StudentsList from "../modules/metier/teacher/students/pages/StudentsList";
import CoursesPage from "../modules/metier/teacher/courses/pages/CoursesPage";
import ClassesPage from "../modules/metier/teacher/classes/pages/ClassesPage";
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
      <Route path="courses" element={<CoursesPage />} />
      <Route path="classes" element={<ClassesPage />} />
      <Route path="settings" element={<TeacherSettings />} />
    </Route>
  );
}