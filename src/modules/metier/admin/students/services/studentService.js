import api from "../../../../../api/axios";
import { getAllAttendances } from "./attendanceService";

export const addStudent = async (studentData) => {
  const payload = {
    prenom: studentData.prenom.trim(),
    nom: studentData.nom.trim(),
    email: studentData.email.trim().toLowerCase(),
    dateNaissance: studentData.dateNaissance || null,
    genre: studentData.genre || null,
    adresse: studentData.adresse?.trim() || null,
    telephone: studentData.telephone?.trim() || null,
  };

  console.log("PAYLOAD ÉTUDIANT :", payload);

  try {
    const response = await api.post("/Students/Ajouter", payload);
    return response.data;
  } catch (error) {
    console.error("STATUT BACKEND :", error.response?.status);
    console.error("RÉPONSE BACKEND :", error.response?.data);
    throw error;
  }
};

export const getAllStudents = async () => {
  const response = await api.get("/Students/AllStudents");
  return response.data;
};

export const deleteStudent = async (id) => {
  await api.delete(`/Students/Supprimer/${id}`);
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
    const archived = Array.isArray(archivedStudentsData)
      ? archivedStudentsData
      : [];
    const performances = Array.isArray(performancesData)
      ? performancesData
      : [];
    const attendances = Array.isArray(attendancesData)
      ? attendancesData
      : [];

    const predictedStudents = performances.filter(
      (item) => item.hasPrediction === true
    );

    const sum = predictedStudents.reduce((total, item) => {
      const value = Number(
        item.moyenne ??
          item.average ??
          item.averageGrade ??
          item.note ??
          item.performance ??
          0
      );

      return total + (Number.isNaN(value) ? 0 : value);
    }, 0);

    const average = predictedStudents.length
      ? sum / predictedStudents.length
      : 0;

    return {
      totalStudents: students.length,
      totalArchivedStudents: archived.length,
      totalPredictions: predictedStudents.length,
      totalAttendance: attendances.length,
      averagePerformance:
        average <= 20
          ? Math.round((average / 20) * 100)
          : Math.round(average),
    };
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques :", error);

    return {
      totalStudents: 0,
      totalArchivedStudents: 0,
      totalPredictions: 0,
      totalAttendance: 0,
      averagePerformance: 0,
    };
  }
};

export const downloadStudentsPdf = async () => {
  const response = await api.get("/Students/DownloadPdf", {
    responseType: "blob",
  });

  const fileUrl = URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "liste_etudiants.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(fileUrl);
};