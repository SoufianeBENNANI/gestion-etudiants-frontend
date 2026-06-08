import api from "../../../../api/axios";

export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const createDefaultSettings = async () => {
  const response = await api.post("/settings/default");
  return response.data;
};

export const updateSettings = async (id, settingData) => {
  const response = await api.put(`/settings/update/${id}`, settingData);
  return response.data;
};