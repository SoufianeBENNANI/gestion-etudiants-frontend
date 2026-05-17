import api from "../../../../api/axios";
import { getAllAttendances } from "./attendanceService";

export const addStudent = async (studentData) => {
  const response = await api.post("/Students/Ajouter", studentData);
  return response.data;
};

export const getAllStudents = async () => {
  const response = await api.get("/Students/AllStudents");
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/Students/Supprimer/${id}`);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/Students/Modifier/${id}`, studentData);
  return response.data;
};

export const searchStudentsByName = async (nom) => {
  const response = await api.get("/Students/Recherche", {
    params: { nom },
  });

  return response.data;
};

export const archiveStudent = async (id) => {
  const response = await api.put(`/Students/Archiver/${id}`);
  return response.data;
};

export const getArchivedStudents = async () => {
  const response = await api.get("/Students/Archive");
  return response.data;
};

export const restoreStudent = async (id) => {
  const response = await api.put(`/Students/Restaurer/${id}`);
  return response.data;
};

export const getStudentPerformance = async () => {
  const response = await api.get("/predictions/Performance");
  return response.data;
};

export const generateStudentPrediction = async (id) => {
  const response = await api.get(`/ai/predict/${id}`);
  return response.data;
};

const getNumberValue = (...values) => {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "") {
      const number = Number(value);

      if (!Number.isNaN(number)) {
        return number;
      }
    }
  }

  return 0;
};

export const getStudentOverviewStats = async () => {
  try {
    const [
      studentsData,
      archivedStudentsData,
      performancesData,
      attendancesData,
    ] = await Promise.all([
      getAllStudents(),
      getArchivedStudents(),
      getStudentPerformance(),
      getAllAttendances(),
    ]);

    const students = Array.isArray(studentsData) ? studentsData : [];

    const archivedStudents = Array.isArray(archivedStudentsData)
      ? archivedStudentsData
      : [];

    const performances = Array.isArray(performancesData)
      ? performancesData
      : [];

    const attendances = Array.isArray(attendancesData)
      ? attendancesData
      : [];

    const totalStudents = students.length;
    const totalArchivedStudents = archivedStudents.length;
    const totalAttendance = attendances.length;

    const predictedStudents = performances.filter((item) => {
      const hasPrediction = item.hasPrediction === true;

      const prediction = String(item.prediction || "")
        .trim()
        .toLowerCase();

      const status = String(item.status || "")
        .trim()
        .toLowerCase();

      const scoreRisque = item.scoreRisque;

      const hasValidPredictionText =
        prediction !== "" &&
        prediction !== "-" &&
        prediction !== "no prediction" &&
        prediction !== "no prediction yet";

      const hasValidStatus =
        status !== "" &&
        status !== "-" &&
        status !== "no prediction" &&
        status !== "no prediction yet";

      const hasValidScore =
        scoreRisque !== null &&
        scoreRisque !== undefined &&
        scoreRisque !== "" &&
        !Number.isNaN(Number(scoreRisque));

      return (
        hasPrediction &&
        (hasValidPredictionText || hasValidStatus || hasValidScore)
      );
    });

    const totalPredictions = predictedStudents.length;

    let averagePerformance = 0;

    if (predictedStudents.length > 0) {
      const performanceSum = predictedStudents.reduce((sum, item) => {
        const moyenne = getNumberValue(
          item.moyenne,
          item.average,
          item.averageGrade,
          item.note,
          item.performance
        );

        return sum + moyenne;
      }, 0);

      const averageGrade = performanceSum / predictedStudents.length;

      // Si moyenne est sur 20 => convertir en %
      // Si performance est déjà sur 100 => garder comme %
      averagePerformance =
        averageGrade <= 20
          ? Math.round((averageGrade / 20) * 100)
          : Math.round(averageGrade);
    }

    return {
      totalStudents,
      totalArchivedStudents,
      totalPredictions,
      totalAttendance,
      averagePerformance,
    };
  } catch (error) {
    console.error("Error loading student overview stats:", error);

    return {
      totalStudents: 0,
      totalArchivedStudents: 0,
      totalPredictions: 0,
      totalAttendance: 0,
      averagePerformance: 0,
    };
  }
};