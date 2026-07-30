import api from "../../../../../api/axios";

export const getMyPrediction = async (studentId) => {
  if (!studentId) {
    throw new Error(
      "L'identifiant de l'étudiant est obligatoire."
    );
  }

  const { data } = await api.get(
    `/predictions/my/${studentId}`
  );

  return data;
};