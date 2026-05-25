import api from "../../../../../api/axios";

export const getAllAttendances = async () => {
  const response = await api.get("/Attendance/AllAttendance");
  return response.data;
};

export const getArchivedAttendances = async () => {
  const response = await api.get("/Attendance/Archive");
  return response.data;
};

export const getAttendanceById = async (id) => {
  const response = await api.get(`/Attendance/Recherche/${id}`);
  return response.data;
};

export const archiveAttendance = async (id) => {
  const response = await api.delete(`/Attendance/Supprimer/${id}`);
  return response.data;
};

export const restoreAttendance = async (id) => {
  const response = await api.put(`/Attendance/Restaurer/${id}`);
  return response.data;
};