import api from "../../../../../api/axios";

export const getMyGrades = async () => {
  const response = await api.get("/Grade/my");
  return response.data;
};