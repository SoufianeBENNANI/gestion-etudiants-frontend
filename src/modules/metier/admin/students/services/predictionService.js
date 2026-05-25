import api from "../../../../../api/axios";

export const getAllPredictions = async () => {
  const response = await api.get("/predictions/All");
  return response.data;
};

export const getStudentPerformance = async () => {
  const response = await api.get("/predictions/Performance");
  return response.data;
};