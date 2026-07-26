import api from "../../../../../api/axios";


export const getAllPayements = async () => {
  const response = await api.get(
    "/Payement/AllPayement"
  );

  return response.data;
};

export const getPayementById = async (id) => {
  const response = await api.get(
    `/Payement/Recherche/${id}`
  );

  return response.data;
};