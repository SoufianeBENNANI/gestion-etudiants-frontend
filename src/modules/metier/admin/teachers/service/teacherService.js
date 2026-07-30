import api from "../../../../../api/axios";

const buildTeacherPayload = (teacherData) => {
  const payload = {
    nom: teacherData.nom?.trim() || "",
    prenom: teacherData.prenom?.trim() || "",
    email: teacherData.email?.trim().toLowerCase() || "",
    specialite: teacherData.specialite?.trim() || "",
    departementNom: teacherData.departementNom?.trim() || "",
  };

  if (!payload.departementNom) {
    throw new Error("Le département est obligatoire");
  }

  return payload;
};

const getErrorData = (error) =>
  error.response?.data || error.message || "Erreur inconnue";

export const addTeacher = async (teacherData) => {
  try {
    const payload = buildTeacherPayload(teacherData);

    console.log("Payload Add Teacher :", payload);

    const response = await api.post("/teachers/Add", payload);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur création enseignant :",
      getErrorData(error)
    );

    throw error;
  }
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
    params: {
      nom: nom?.trim() || "",
    },
  });

  return response.data;
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const payload = buildTeacherPayload(teacherData);

    console.log("Payload Update Teacher :", payload);

    const response = await api.put(
      `/teachers/Update/${id}`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur modification enseignant :",
      getErrorData(error)
    );

    throw error;
  }
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
  const response = await api.put(
    `/teachers/Restaurer/${id}`
  );

  return response.data;
};

export const downloadTeachersPdf = async () => {
  const response = await api.get("/teachers/pdf", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = url;
  link.download = "teachers.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};