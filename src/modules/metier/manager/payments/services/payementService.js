import api from "../../../../../api/axios";

export const addPayement = async (payementData) => {
  const response = await api.post("/Payement/Ajouter", payementData);
  return response.data;
};

export const getAllPayements = async () => {
  const response = await api.get("/Payement/AllPayement");
  return response.data;
};

export const getPayementById = async (id) => {
  const response = await api.get(`/Payement/${id}`);
  return response.data;
};

export const updatePayement = async (id, payementData) => {
  const response = await api.put(
    `/Payement/Modifier/${id}`,
    payementData
  );

  return response.data;
};

export const deletePayement = async (id) => {
  const response = await api.delete(`/Payement/Supprimer/${id}`);
  return response.data;
};

export const getArchivedPayements = async () => {
  const response = await api.get("/Payement/Archive");
  return response.data;
};

export const restorePayement = async (id) => {
  const response = await api.put(`/Payement/Restaurer/${id}`);
  return response.data;
};

export const searchPayementsByNom = async (nom) => {
  const response = await api.get("/Payement/Recherche", {
    params: { nom },
  });

  return response.data;
};

export const downloadPayementsPdf = async () => {
  const response = await api.get("/Payement/DownloadPDF", {
    responseType: "blob",
  });

  return response.data;
};