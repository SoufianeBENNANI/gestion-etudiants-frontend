import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../modules/metier/admin/DashboardAdmin/pages/AdminDashboard";
import StudentOverview from "../modules/metier/admin/students/pages/StudentOverview";
import AllStudents from "../modules/metier/admin/students/pages/AllStudents";
import AddStudent from "../modules/metier/admin/students/pages/AddStudent";
import DeleteStudent from "../modules/metier/admin/students/pages/DeleteStudent";
import ArchivedStudents from "../modules/metier/admin/students/pages/ArchivedStudents";
import StudentPerformance from "../modules/metier/admin/students/pages/StudentPerformance";
import StudentAttendance from "../modules/metier/admin/students/pages/StudentAttendance";
import StudentPredictions from "../modules/metier/admin/students/pages/StudentPredictions";
import ArchivedAttendance from "../modules/metier/admin/students/pages/ArchivedAttendance";

import AllClasses from "../modules/metier/admin/classes/pages/AllClasses";
import AllCourses from "../modules/metier/admin/courses/pages/AllCourses";
import AllDepartements from "../modules/metier/admin/departements/pages/AllDepartements";
import AllTeachers from "../modules/metier/admin/teachers/pages/AllTeachers";
import AllModels from "../modules/metier/admin/AImodels/pages/AllModels";
import Alllogs from "../modules/metier/admin/AIlogs/pages/Alllogs";
import AllGrades from "../modules/metier/admin/grades/pages/AllGrades";
import AllPayements from "../modules/metier/admin/payments/pages/AllPayements";
import Settings from "../modules/metier/settings/pages/Settings";

export default function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <PrivateRoute role="ADMIN">
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="students" element={<StudentOverview />} />
      <Route path="students/all" element={<AllStudents />} />
      <Route path="students/add" element={<AddStudent />} />
      <Route path="students/delete/:id" element={<DeleteStudent />} />
      <Route path="students/archive" element={<ArchivedStudents />} />
      <Route path="students/performance" element={<StudentPerformance />} />
      <Route path="students/attendance" element={<StudentAttendance />} />
      <Route path="students/predictions" element={<StudentPredictions />} />
      <Route path="students/attendance/archive" element={<ArchivedAttendance />} />

      <Route path="classes" element={<AllClasses />} />
      <Route path="courses" element={<AllCourses />} />
      <Route path="departements" element={<AllDepartements />} />
      <Route path="departments" element={<AllDepartements />} />
      <Route path="teachers" element={<AllTeachers />} />
      <Route path="AImodels" element={<AllModels />} />
      <Route path="AIlogs" element={<Alllogs />} />
      <Route path="grades" element={<AllGrades />} />
      <Route path="payments" element={<AllPayements />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  );
}