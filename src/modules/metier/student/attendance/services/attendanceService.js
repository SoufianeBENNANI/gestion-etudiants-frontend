import api from "../../../../../api/axios";

export const getAllAttendances = async () => {
  const response = await api.get(
    "/Attendance/AllAttendance"
  );

  return response.data;
};

export const getAttendanceById = async (id) => {
  const response = await api.get(
    `/Attendance/Recherche/${id}`
  );

  return response.data;
};