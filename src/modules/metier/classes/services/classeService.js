import api from "../../../../api/axios";

export const getAllClasses = async () => {
  const response = await api.get("/Classes/AllClasses");
  return response.data;
};

export const getArchivedClasses = async () => {
  const response = await api.get("/Classes/Archive");
  return response.data;
};

export const getClasseById = async (id) => {
  const response = await api.get(`/Classes/Recherche/${id}`);
  return response.data;
};

export const addClasse = async (classeData) => {
  const response = await api.post("/Classes/Ajouter", classeData);
  return response.data;
};

export const updateClasse = async (id, classeData) => {
  const response = await api.put(`/Classes/Modifier/${id}`, classeData);
  return response.data;
};

export const deleteClasse = async (id) => {
  const response = await api.delete(`/Classes/Supprimer/${id}`);
  return response.data;
};

export const restoreClasse = async (id) => {
  const response = await api.put(`/Classes/Restaurer/${id}`);
  return response.data;
};