import api from "../../../../../api/axios";

export const getSettings = async () => {
  const response =
    await api.get(
      "/settings"
    );

  return response.data;
};

export const updateAppearanceSettings = async (
  id,
  settingData
) => {
  const response =
    await api.put(
      `/settings/appearance/${id}`,
      {
        themeMode:
          settingData.themeMode,

        language:
          settingData.language,

        primaryColor:
          settingData.primaryColor,

        secondaryColor:
          settingData.secondaryColor,
      }
    );

  return response.data;
};