import api from "../../../../../api/axios";

export const getAllDepartments = async () => {
  const { data } = await api.get(
    "/departments/AllDepartments"
  );

  return data;
};

export const searchDepartmentByName = async (nom) => {
  if (!nom?.trim()) {
    throw new Error(
      "Le nom du département est obligatoire."
    );
  }

  const { data } = await api.get(
    "/departments/search",
    {
      params: {
        nom: nom.trim(),
      },
    }
  );

  return data;
};