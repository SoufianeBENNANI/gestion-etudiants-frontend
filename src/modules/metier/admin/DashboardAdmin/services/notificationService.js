export function connectKafkaNotifications(onNotification) {
  const eventSource = new EventSource(
    "http://localhost:8080/api/notifications/stream"
  );

  const handleNotification = (event) => {
    console.log("SSE EVENT:", event);
    console.log("SSE DATA:", event.data);

    if (!event.data || event.data === "CONNECTED" || event.data === "SSE connected") {
      return;
    }

    try {
      const notification = JSON.parse(event.data);

      onNotification({
        entity: String(notification.entity || "KAFKA").toUpperCase(),
        action: String(notification.action || "EVENT").toUpperCase(),
        entityId: notification.entityId ?? null,
        message: notification.message || "Nouvelle notification reçue",
        createdAt: notification.createdAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erreur SSE JSON:", error);
    }
  };

  eventSource.onopen = () => {
    console.log("SSE frontend connecté");
  };

  eventSource.addEventListener("notification", handleNotification);

  eventSource.addEventListener("connected", (event) => {
    console.log("SSE connected:", event.data);
  });

  eventSource.onerror = (error) => {
    console.error("Erreur SSE frontend:", error);
  };

  return () => {
    eventSource.close();
  };
}