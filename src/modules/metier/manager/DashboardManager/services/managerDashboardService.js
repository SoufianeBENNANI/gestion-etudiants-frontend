import { getAllStudents } from "../../students/services/studentService";

import { getAllTeachers } from "../../teacher/services/teacherService";

import {
  getAllPayements,
  getArchivedPayements,
} from "../../payments/services/payementService";

/* =========================
   HELPERS
========================= */

const safeArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data?.content)) {
    return data.data.content;
  }

  return [];
};

const getValue = (result) => {
  return result.status === "fulfilled"
    ? safeArray(result.value)
    : [];
};

/* =========================
   MANAGER DASHBOARD
========================= */

export const getDashboardData = async () => {
  const [
    studentsResult,
    teachersResult,
    payementsResult,
    archivedPayementsResult,
  ] = await Promise.allSettled([
    getAllStudents(),
    getAllTeachers(),
    getAllPayements(),
    getArchivedPayements(),
  ]);

  return {
    students: getValue(studentsResult),

    teachers: getValue(teachersResult),

    payements: getValue(payementsResult),

    archivedPayements: getValue(
      archivedPayementsResult
    ),

    /* Ressources non utilisées actuellement */
    archivedStudents: [],
    attendances: [],
    grades: [],
    predictions: [],
    courses: [],
    classes: [],
    departements: [],
    models: [],
  };
};

/* même principe que TeacherDashboard */
export const getManagerDashboardData =
  getDashboardData;

export default getDashboardData;