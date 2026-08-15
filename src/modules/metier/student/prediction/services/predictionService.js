import api from "../../../../../api/axios";

export const getMyPrediction = async () => {
  const { data } = await api.get(
    "/predictions/my"
  );

  return data;
};