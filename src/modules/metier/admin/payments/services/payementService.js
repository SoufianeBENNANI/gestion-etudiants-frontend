import api from "../../../../../api/axios";

export const getAllPayementsAdmin = async () => {
  const response = await api.get("/Payement/AllPayement");
  return response.data;
};

export const getPayementByIdAdmin = async (id) => {
  const response = await api.get(`/Payement/Recherche/${id}`);
  return response.data;
};

export const getArchivedPayementsAdmin = async () => {
  const response = await api.get("/Payement/Archive");
  return response.data;
};

export const restorePayementAdmin = async (id) => {
  const response = await api.put(`/Payement/Restaurer/${id}`);
  return response.data;
};

export const downloadPayementsPdfAdmin = async () => {
  const response = await api.get("/Payement/DownloadPDF", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "payements-list.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};