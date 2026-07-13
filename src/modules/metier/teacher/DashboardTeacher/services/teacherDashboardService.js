import {
  getAllStudents,
  getArchivedStudents,
} from "../../students/services/studentService";

import { getAllAttendances } from "../../attendance/services/attendanceService";
import { getAllGrades } from "../../grades/services/gradeService";
import { getAllPredictions } from "../../predictions/services/predictionService";
import { getAllCourses } from "../../courses/services/courseService";
import { getAllClasses } from "../../classes/services/classService";
import { getAllTeachers } from "../../teachers/services/teacherService";

const safeArray = (data) => {
  return Array.isArray(data) ? data : [];
};

const getValue = (result) => {
  return result.status === "fulfilled" ? safeArray(result.value) : [];
};

const getStudentClassId = (student) => {
  return (
    student.classeId ||
    student.classId ||
    student.idClasse ||
    student.id_class ||
    student.classe?.id ||
    student.class?.id ||
    null
  );
};

const getClassName = (classe) => {
  return (
    classe?.nom ||
    classe?.name ||
    classe?.libelle ||
    classe?.classeName ||
    classe?.niveau ||
    "-"
  );
};

const attachClassesToStudents = (students, classes) => {
  return students.map((student) => {
    const studentClassId = getStudentClassId(student);

    const matchedClass = classes.find((classe) => {
      return String(classe.id) === String(studentClassId);
    });

    return {
      ...student,
      classe: matchedClass || student.classe || null,
      classeName: matchedClass ? getClassName(matchedClass) : student.classeName || "-",
    };
  });
};

export const getDashboardData = async () => {
  const [
    studentsResult,
    archivedStudentsResult,
    attendancesResult,
    gradesResult,
    predictionsResult,
    coursesResult,
    classesResult,
    teachersResult,
  ] = await Promise.allSettled([
    getAllStudents(),
    getArchivedStudents(),
    getAllAttendances(),
    getAllGrades(),
    getAllPredictions(),
    getAllCourses(),
    getAllClasses(),
    getAllTeachers(),
  ]);

  const students = getValue(studentsResult);
  const classes = getValue(classesResult);

  return {
    students: attachClassesToStudents(students, classes),
    archivedStudents: getValue(archivedStudentsResult),
    attendances: getValue(attendancesResult),
    grades: getValue(gradesResult),
    predictions: getValue(predictionsResult),
    courses: getValue(coursesResult),
    classes,
    teachers: getValue(teachersResult),
    departements: [],
    payements: [],
    models: [],
  };
};

export const getTeacherDashboardData = getDashboardData;