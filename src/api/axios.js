import axios from "axios";
import keycloak from "../modules/auth/keycloak/keycloak";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  async (config) => {
    console.log("AXIOS authenticated:", keycloak.authenticated);
    console.log("AXIOS token exists:", !!keycloak.token);

    if (keycloak.authenticated && keycloak.token) {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;