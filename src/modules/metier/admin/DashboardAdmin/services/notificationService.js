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

export function connectKafkaNotifications({
  recipientRole = "ADMIN",
  onNotification,
  onConnected,
  onError,
}) {
  const controller = new AbortController();
  const token = getAccessToken();

  if (!token) {
    const error = new Error(
      "Token Keycloak introuvable dans le navigateur."
    );

    console.error(error);
    onError?.(error);

    return () => controller.abort();
  }

  const connect = async () => {
    try {
      await fetchEventSource(SSE_URL, {
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

          if (!response.ok) {
            throw new Error(
              `Connexion SSE refusée : ${response.status}`
            );
          }

          if (!contentType.includes("text/event-stream")) {
            throw new Error(
              `Content-Type SSE invalide : ${contentType}`
            );
          }

          console.log("SSE Admin connecté");
          onConnected?.();
        },

        onmessage(event) {
          console.log("SSE événement :", event.event);
          console.log("SSE données :", event.data);

          if (event.event === "connected") {
            return;
          }

          if (
            event.event &&
            event.event !== "notification"
          ) {
            return;
          }

          if (!event.data) {
            return;
          }

          try {
            const data = JSON.parse(event.data);

            const role = String(
              data.recipientRole || ""
            ).toUpperCase();

            if (
              role !==
              String(recipientRole).toUpperCase()
            ) {
              return;
            }

            const notification = {
              ...data,

              entity: String(
                data.entity || "KAFKA"
              ).toUpperCase(),

              action: String(
                data.action || "EVENT"
              ).toUpperCase(),

              entityId: data.entityId ?? null,

              message:
                data.message ||
                "Nouvelle notification reçue",

              createdAt:
                data.createdAt ||
                new Date().toISOString(),

              notificationId:
                data.notificationId ||
                data.id ||
                `${role}-${data.entity}-${data.action}-${data.createdAt}-${data.message}`,

              redirectUrl:
                data.redirectUrl ||
                "https://mail.google.com/mail/u/0/#inbox",

              read: false,
            };

            console.log(
              "Notification Admin reçue dans React :",
              notification
            );

            onNotification?.(notification);
          } catch (error) {
            console.error(
              "Erreur parsing notification SSE :",
              error
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
            "Erreur connexion SSE :",
            error
          );

          onError?.(error);

          return 3000;
        },
      });
    } catch (error) {
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
    }
  };

  connect();

  return () => {
    controller.abort();
  };
}