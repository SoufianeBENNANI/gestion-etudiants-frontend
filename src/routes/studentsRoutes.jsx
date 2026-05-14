import {
  Routes,
  Route
} from "react-router-dom";

import StudentsDashboard from "../students/pages/StudentsDashboard";
import AllStudents from "../students/pages/AllStudents";
import AddStudent from "../students/pages/AddStudent";
import EditStudent from "../students/pages/EditStudent";
import StudentDetails from "../students/pages/StudentDetails";

export default function StudentsRoutes() {
  return (
    <Routes>

      <Route index element={<StudentsDashboard />} />

      <Route path="all" element={<AllStudents />} />

      <Route path="add" element={<AddStudent />} />

      <Route path=":id" element={<StudentDetails />} />

      <Route path="edit/:id" element={<EditStudent />} />

    </Routes>
  );
}