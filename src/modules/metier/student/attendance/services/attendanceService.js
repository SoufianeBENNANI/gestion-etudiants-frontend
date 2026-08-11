import api from "../../../../../api/axios";

export const getMyAttendances = async () => {
  const response = await api.get("/Attendance/my");
  return response.data;
};