import api from "../../../../../api/axios";

export const getAllTeachers = async () => {
  const response = await api.get("/teachers/AllTeachers");
  return response.data;
};

export const searchTeachersByNom = async (nom) => {
  const response = await api.get("/teachers/Search", {
    params: { nom },
  });
  return response.data;
};