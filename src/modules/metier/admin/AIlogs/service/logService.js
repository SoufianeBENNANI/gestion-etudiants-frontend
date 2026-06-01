import api from "../../../../../api/axios";

export const getAllLogs = async () => {
  const response = await api.get("/logs");
  return response.data;
};