import api from "../../../../../api/axios";

export const addDepartement = async (departementData) => {
  const response = await api.post("/departments/Add", departementData);
  return response.data;
};

export const getAllDepartements = async () => {
  const response = await api.get("/departments/AllDepartments");
  return response.data;
};

export const getDepartementById = async (id) => {
  const response = await api.get(`/departments/Recherche/${id}`);
  return response.data;
};

export const updateDepartement = async (id, departementData) => {
  const response = await api.put(`/departments/Update/${id}`,
    departementData
  );
  return response.data;
};

export const deleteDepartement = async (id) => {
  const response = await api.delete(`/departments/Delete/${id}`);
  return response.data;
};

export const getArchivedDepartements = async () => {
  const response = await api.get("/departments/Archive");
  return response.data;
};

export const restoreDepartement = async (id) => {
  const response = await api.put(`/departments/Restaurer/${id}`);
  return response.data;
};

export const searchDepartementsByNom = async (nom) => {
  const response = await api.get("/departments/search", {
    params: { nom },
  });
  return response.data;
};