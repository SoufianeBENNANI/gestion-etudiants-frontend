import api from "../../../../../api/axios";

export const getAllCourses = async () => {
  const response = await api.get("/Courses/AllCourses");
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/Courses/Recherche/${id}`);
  return response.data;
};