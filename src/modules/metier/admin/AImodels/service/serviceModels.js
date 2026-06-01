import api from "../../../../../api/axios";


export const addModel = async (modelData) => {
  const response = await api.post("/ai/models/Ajouter", modelData);
  return response.data;
};

export const getAllModels = async () => {
  const response = await api.get("/ai/models/AllModels");
  return response.data;
};

export const getArchivedModels = async () => {
  const response = await api.get("/ai/models/Archive");
  return response.data;
};

export const getModelById = async (id) => {
  const response = await api.get(`/ai/models/Recherche/${id}`);
  return response.data;
};

export const updateModel = async (id, modelData) => {
  const response = await api.put(`/ai/models/Modifier/${id}`, modelData);
  return response.data;
};

export const deleteModel = async (id) => {
  const response = await api.delete(`/ai/models/Supprimer/${id}`);
  return response.data;
};

export const restoreModel = async (id) => {
  const response = await api.put(`/ai/models/Restaurer/${id}`);
  return response.data;
};