import api from "../../../../../api/axios";

export const getAllPredictions = async () => {
  const response = await api.get("/predictions/All");
  return response.data;
};

export const getPerformancePredictions = async () => {
  const response = await api.get("/predictions/Performance");
  return response.data;
};

export const getMyPredictions = async (studentId) => {
  const response = await api.get(`/predictions/my/${studentId}`);
  return response.data;
};