import { fetchEventSource } from "@microsoft/fetch-event-source";

const SSE_URL =
  "http://localhost:8080/api/notifications/stream";

const getAccessToken = () => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token")
  );
};

const normalizeRole = (value) => {
  return String(value || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();
};

const createNotificationId = (data) => {
  return String(
    data.notificationId ||
      data.id ||
      [
        data.senderEmail,
        data.recipientEmail,
        data.recipientRole,
        data.entity,
        data.action,
        data.entityId,
        data.createdAt,
        data.message,
        Date.now(),
      ].join("-")
  );
};

export function connectKafkaNotifications({
  recipientRole = "ADMIN",
  onNotification,
  onConnected,
  onError,
}) {
  const controller = new AbortController();
  const expectedRole =
    normalizeRole(recipientRole);

  const token = getAccessToken();

  if (!token) {
    const error = new Error(
      "Token Keycloak introuvable."
    );

    console.error(error);
    onError?.(error);

    return () => controller.abort();
  }

  fetchEventSource(SSE_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    },

    signal: controller.signal,
    openWhenHidden: true,

    async onopen(response) {
      const contentType =
        response.headers.get("content-type") || "";

      console.log(
        "Réponse connexion SSE :",
        response.status,
        contentType
      );

      if (!response.ok) {
        throw new Error(
          `Connexion SSE refusée : ${response.status}`
        );
      }

      if (
        !contentType
          .toLowerCase()
          .includes("text/event-stream")
      ) {
        throw new Error(
          `Content-Type SSE invalide : ${contentType}`
        );
      }

      console.log(
        "Connexion SSE ADMIN établie."
      );

      onConnected?.();
    },

    onmessage(event) {
      console.log(
        "Événement SSE reçu :",
        event.event,
        event.data
      );

      if (
        event.event === "connected" ||
        event.event === "ping" ||
        event.event === "heartbeat"
      ) {
        return;
      }

      if (!event.data) {
        return;
      }

      try {
        const parsedData =
          JSON.parse(event.data);

        const data =
          parsedData.data ||
          parsedData.payload ||
          parsedData;

        const receivedRole =
          normalizeRole(
            data.recipientRole
          );

        console.log(
          "Rôle attendu :",
          expectedRole,
          "Rôle reçu :",
          receivedRole
        );

        if (
          receivedRole &&
          receivedRole !== expectedRole
        ) {
          return;
        }

        const entity = String(
          data.entity || "KAFKA"
        ).toUpperCase();

        const notification = {
          ...data,

          recipientRole:
            receivedRole || expectedRole,

          entity,

          action: String(
            data.action || "EVENT"
          ).toUpperCase(),

          message:
            data.message ||
            "Nouvelle notification reçue",

          createdAt:
            data.createdAt ||
            new Date().toISOString(),

          notificationId:
            createNotificationId(data),

          redirectUrl:
            data.redirectUrl ||
            (
              entity === "GMAIL"
                ? "https://mail.google.com/mail/u/0/#inbox"
                : null
            ),

          read: false,
        };

        console.log(
          "Notification envoyée à React :",
          notification
        );

        onNotification?.(
          notification
        );
      } catch (error) {
        console.error(
          "Erreur de lecture SSE :",
          error,
          event.data
        );

        onError?.(error);
      }
    },

    onclose() {
      if (!controller.signal.aborted) {
        throw new Error(
          "Le serveur a fermé la connexion SSE."
        );
      }
    },

    onerror(error) {
      if (controller.signal.aborted) {
        return;
      }

      console.error(
        "Erreur SSE :",
        error
      );

      onError?.(error);

      return 3000;
    },
  }).catch((error) => {
    if (
      error.name !== "AbortError" &&
      !controller.signal.aborted
    ) {
      console.error(
        "Connexion SSE interrompue :",
        error
      );

      onError?.(error);
    }
  });

  return () => {
    controller.abort();
  };
}