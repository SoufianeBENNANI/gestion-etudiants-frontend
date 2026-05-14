import api from "../../../../api/axios";

export const getStudentPerformance = async () => {
  const response = await api.get("/predictions/Performance");
  return response.data;
};