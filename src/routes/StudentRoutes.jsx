import {
  Route,
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";

import StudentLayout from "../layouts/StudentLayout";

import StudentDashboard from "../modules/metier/student/StudentDashboard/page/StudentDashboard";

import StudentAttendancePage from "../modules/metier/student/attendance/page/StudentAttendancePage";

import StudentGrade from "../modules/metier/student/grade/page/StudentGrade";

import StudentSettings from "../modules/metier/student/settings/pages/StudentSettings";

function StudentRoutes() {
  return (
    <Route
      path="/student"
      element={
        <PrivateRoute role="STUDENT">
          <StudentLayout />
        </PrivateRoute>
      }
    >
      {/* DASHBOARD */}

      <Route
        index
        element={
          <StudentDashboard />
        }
      />

      {/* ATTENDANCE */}

      <Route
        path="attendance"
        element={
          <StudentAttendancePage />
        }
      />

      {/* GRADES */}

      <Route
        path="grades"
        element={
          <StudentGrade />
        }
      />

      {/* SETTINGS */}

      <Route
        path="settings"
        element={
          <StudentSettings />
        }
      />
    </Route>
  );
}

export default StudentRoutes;