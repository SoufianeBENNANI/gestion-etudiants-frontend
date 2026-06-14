import {
  getAllStudents,
  getArchivedStudents,
} from "../../students/services/studentService";

import { getAllAttendances } from "../../students/services/attendanceService";
import { getAllPredictions } from "../../students/services/predictionService";

import { getAllTeachers } from "../../teachers/service/teacherService";
import { getAllCourses } from "../../courses/services/courseService";
import { getAllClasses } from "../../classes/services/classeService";
import { getAllDepartements } from "../../departements/service/departementService";
import { getAllGrades } from "../../grades/services/gradeService";
import { getAllPayementsAdmin } from "../../payments/services/payementService";
import { getAllModels } from "../../AImodels/service/serviceModels";

const safeArray = (data) => {
  return Array.isArray(data) ? data : [];
};

const emptyDashboardData = {
  students: [],
  archivedStudents: [],
  teachers: [],
  courses: [],
  classes: [],
  departements: [],
  grades: [],
  payements: [],
  attendances: [],
  predictions: [],
  models: [],
};

export const getDashboardData = async () => {
  try {
    const [
      students,
      archivedStudents,
      teachers,
      courses,
      classes,
      departements,
      grades,
      payements,
      attendances,
      predictions,
      models,
    ] = await Promise.all([
      getAllStudents(),
      getArchivedStudents(),
      getAllTeachers(),
      getAllCourses(),
      getAllClasses(),
      getAllDepartements(),
      getAllGrades(),
      getAllPayementsAdmin(),
      getAllAttendances(),
      getAllPredictions(),
      getAllModels(),
    ]);

    return {
      students: safeArray(students),
      archivedStudents: safeArray(archivedStudents),
      teachers: safeArray(teachers),
      courses: safeArray(courses),
      classes: safeArray(classes),
      departements: safeArray(departements),
      grades: safeArray(grades),
      payements: safeArray(payements),
      attendances: safeArray(attendances),
      predictions: safeArray(predictions),
      models: safeArray(models),
    };
  } catch (error) {
    console.error("Dashboard service error:", error);
    return emptyDashboardData;
  }
};