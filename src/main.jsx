import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import keycloak from "./modules/auth/keycloak/keycloak";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import './index.css';

keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
  })
  .catch((err) => console.error(err));