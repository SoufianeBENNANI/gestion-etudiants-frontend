import api from "../../../../api/axios";

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