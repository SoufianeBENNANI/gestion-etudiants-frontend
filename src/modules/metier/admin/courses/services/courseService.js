import api from "../../../../../api/axios";

export const addCourse = async (courseData) => {
  const response = await api.post("/Courses/Ajouter", courseData);
  return response.data;
};

export const getAllCourses = async () => {
  const response = await api.get("/Courses/AllCourses");
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/Courses/Recherche/${id}`);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/Courses/Modifier/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/Courses/Supprimer/${id}`);
  return response.data;
};

export const getArchivedCourses = async () => {
  const response = await api.get("/Courses/Archive");
  return response.data;
};

export const restoreCourse = async (id) => {
  const response = await api.put(`/Courses/Restaurer/${id}`);
  return response.data;
};