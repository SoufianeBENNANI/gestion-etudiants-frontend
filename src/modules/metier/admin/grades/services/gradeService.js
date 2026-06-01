import api from "../../../../../api/axios";

export const addGrade = async (gradeData) => {
  const response = await api.post("/Grade/Ajouter", gradeData);
  return response.data;
};

export const getAllGrades = async () => {
  const response = await api.get("/Grade/AllGrades");
  return response.data;
};

export const getGradeById = async (id) => {
  const response = await api.get(`/Grade/Recherche/${id}`);
  return response.data;
};

export const updateGrade = async (id, gradeData) => {
  const response = await api.put(`/Grade/Modifier/${id}`, gradeData);
  return response.data;
};

export const deleteGrade = async (id) => {
  const response = await api.delete(`/Grade/Supprimer/${id}`);
  return response.data;
};

export const getArchivedGrades = async () => {
  const response = await api.get("/Grade/Archive");
  return response.data;
};

export const restoreGrade = async (id) => {
  const response = await api.put(`/Grade/Restaurer/${id}`);
  return response.data;
};