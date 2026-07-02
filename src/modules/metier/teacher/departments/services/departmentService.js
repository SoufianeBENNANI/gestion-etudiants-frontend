import api from "../../../../../api/axios";

export const getAllDepartments = async () => {
  const response = await api.get("/departments/AllDepartments");
  return response.data;
};

export const searchDepartmentsByNom = async (nom) => {
  const response = await api.get("/departments/search", {
    params: { nom },
  });
  return response.data;
};