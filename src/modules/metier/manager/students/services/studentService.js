import api from "../../../../../api/axios";

export const getAllStudents = async () => {
  const response = await api.get(
    "/Students/AllStudents"
  );

  return response.data;
};


export const searchStudentsByNom = async (nom) => {
  const response = await api.get("/Students/Recherche", {
    params: { nom },
  });
  return response.data;
};


export const downloadStudentsPdf = async () => {
  const response = await api.get(
    "/Students/DownloadPdf",
    {
      responseType: "blob",
    }
  );

  return response.data;
};