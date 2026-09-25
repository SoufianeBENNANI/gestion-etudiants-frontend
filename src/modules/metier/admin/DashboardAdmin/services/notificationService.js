import { fetchEventSource } from "@microsoft/fetch-event-source";

const API_BASE =
  "http://localhost:8080/api/notifications";

const SSE_URL =
  `${API_BASE}/stream`;


export const getAccessToken = () => {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token")
  );
};

const getAuthHeaders = () => {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "Token Keycloak introuvable."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const normalizeRole = (value) => {
  return String(value || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();
};

const normalizeNotification = (data) => {

  const entity =
    String(
      data.entity || "KAFKA"
    ).toUpperCase();

  const role =
    normalizeRole(
      data.recipientRole || "ADMIN"
    );

  return {
    ...data,

    /*
     * ID PostgreSQL si disponible.
     */
    id:
      data.id ??
      data.notificationId ??
      null,

    notificationId:
      String(
        data.id ??
        data.notificationId ??
        [
          data.senderEmail,
          data.entity,
          data.action,
          data.entityId,
          data.createdAt,
          data.message,
          Date.now(),
        ].join("-")
      ),

    recipientRole:
      role,

    entity,

    action:
      String(
        data.action || "EVENT"
      ).toUpperCase(),

    subject:
      data.subject ||
      "Notification",

    message:
      data.message ||
      "Nouvelle notification reçue",

    createdAt:
      data.createdAt ||
      new Date().toISOString(),

    /*
     * Le backend utilise readStatus.
     */
    read:
      data.readStatus ??
      data.read ??
      false,

    readStatus:
      data.readStatus ??
      data.read ??
      false,

    redirectUrl:
      data.redirectUrl ||
      (
        entity === "GMAIL"
          ? "https://mail.google.com/mail/u/0/#inbox"
          : null
      ),
  };
};


export async function fetchMyNotifications() {

  const response =
    await fetch(
      `${API_BASE}/me`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Erreur notifications : ${response.status}`
    );
  }

  const data =
    await response.json();

  return Array.isArray(data)
    ? data.map(normalizeNotification)
    : [];
}


export async function fetchUnreadNotifications() {

  const response =
    await fetch(
      `${API_BASE}/me/unread`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Erreur notifications non lues : ${response.status}`
    );
  }

  const data =
    await response.json();

  return Array.isArray(data)
    ? data.map(normalizeNotification)
    : [];
}


/*
 * =========================================================
 * COMPTEUR NON LU
 * =========================================================
 *
 * GET /api/notifications/me/unread/count
 */
export async function fetchUnreadCount() {

  const response =
    await fetch(
      `${API_BASE}/me/unread/count`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Erreur compteur notification : ${response.status}`
    );
  }

  return await response.json();
}

export async function markNotificationAsRead(
  notificationId
) {

  if (!notificationId) {
    throw new Error(
      "ID notification obligatoire."
    );
  }

  const response =
    await fetch(
      `${API_BASE}/${notificationId}/read`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Impossible de marquer la notification comme lue : ${response.status}`
    );
  }

  const data =
    await response.json();

  return normalizeNotification(
    data
  );
}

export function connectKafkaNotifications({
  recipientRole = "ADMIN",
  onNotification,
  onConnected,
  onError,
}) {

  const controller =
    new AbortController();

  const expectedRole =
    normalizeRole(
      recipientRole
    );

  const token =
    getAccessToken();

  if (!token) {

    const error =
      new Error(
        "Token Keycloak introuvable."
      );

    console.error(error);

    onError?.(
      error
    );

    return () =>
      controller.abort();
  }


  fetchEventSource(
    SSE_URL,
    {

      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,

        Accept:
          "text/event-stream",

        "Cache-Control":
          "no-cache",
      },

      signal:
        controller.signal,

      openWhenHidden:
        true,

      async onopen(
        response
      ) {

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";


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
            .includes(
              "text/event-stream"
            )
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

      onmessage(
        event
      ) {

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
            JSON.parse(
              event.data
            );


          const data =
            parsedData.data ||
            parsedData.payload ||
            parsedData;


          const receivedRole =
            normalizeRole(
              data.recipientRole
            );


          if (
            receivedRole &&
            receivedRole !==
              expectedRole
          ) {

            console.log(
              "Notification ignorée. Rôle reçu :",
              receivedRole
            );

            return;
          }


          const notification =
            normalizeNotification(
              data
            );


          console.log(
            "Nouvelle notification ADMIN :",
            notification
          );


          onNotification?.(
            notification
          );

        } catch (
          error
        ) {

          console.error(
            "Erreur lecture SSE :",
            error,
            event.data
          );


          onError?.(
            error
          );
        }
      },


      onclose() {

        if (
          !controller.signal.aborted
        ) {

          throw new Error(
            "Le serveur a fermé la connexion SSE."
          );
        }
      },


      onerror(
        error
      ) {

        if (
          controller.signal.aborted
        ) {

          return;
        }


        console.error(
          "Erreur SSE :",
          error
        );


        onError?.(
          error
        );


        /*
         * Reconnexion dans 3 secondes.
         */
        return 3000;
      },
    }
  )
    .catch(
      (error) => {

        if (
          error.name !==
            "AbortError" &&
          !controller.signal.aborted
        ) {

          console.error(
            "Connexion SSE interrompue :",
            error
          );


          onError?.(
            error
          );
        }
      }
    );


  return () => {

    controller.abort();
  };
}