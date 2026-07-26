import api from "../../../../../api/axios";

export const getAllGrades = async () => {
  const response = await api.get(
    "/Grade/AllGrades"
  );

  return response.data;
};

export const getGradeById = async (id) => {
  const response = await api.get(
    `/Grade/Recherche/${id}`
  );

  return response.data;
};