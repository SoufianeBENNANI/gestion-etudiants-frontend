import api from "../../../../../api/axios";

export const getAllClasses = async () => {
  const response = await api.get("/Classes/AllClasses");
  return response.data;
};

export const getClassById = async (id) => {
  const response = await api.get(`/Classes/Recherche/${id}`);
  return response.data;
};