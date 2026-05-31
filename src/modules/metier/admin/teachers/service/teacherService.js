import api from "../../../../../api/axios";

export const addTeacher = async (teacherData) => {
  const response = await api.post("/teachers/Add", teacherData);
  return response.data;
};

export const getAllTeachers = async () => {
  const response = await api.get("/teachers/AllTeachers");
  return response.data;
};

export const getTeacherById = async (id) => {
  const response = await api.get(`/teachers/Search/${id}`);
  return response.data;
};

export const searchTeachersByName = async (nom) => {
  const response = await api.get("/teachers/Search", {
    params: { nom },
  });
  return response.data;
};

export const updateTeacher = async (id, teacherData) => {
  const response = await api.put(`/teachers/Update/${id}`, teacherData);
  return response.data;
};

export const deleteTeacher = async (id) => {
  const response = await api.delete(`/teachers/Delete/${id}`);
  return response.data;
};

export const getArchivedTeachers = async () => {
  const response = await api.get("/teachers/Archive");
  return response.data;
};

export const restoreTeacher = async (id) => {
  const response = await api.put(`/teachers/Restaurer/${id}`);
  return response.data;
};

export const downloadTeachersPdf = async () => {
  const response = await api.get("/teachers/pdf", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "teachers.pdf");
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};