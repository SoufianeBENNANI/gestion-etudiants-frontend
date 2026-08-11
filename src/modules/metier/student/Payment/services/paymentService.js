import api from "../../../../../api/axios";

export const getMyPayements = async () => {
  const response = await api.get("/Payement/my");
  return response.data;
};