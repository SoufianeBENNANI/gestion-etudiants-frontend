export function connectKafkaNotifications(onNotification) {
  const eventSource = new EventSource(
    "http://localhost:8080/api/notifications/stream"
  );

  eventSource.onopen = () => {
    console.log("SSE connecté avec succès");
  };

  eventSource.onmessage = (event) => {
    console.log("Notification reçue :", event.data);

    try {
      const notification = JSON.parse(event.data);

      onNotification({
        entity: notification.entity || "KAFKA",
        action: notification.action || "EVENT",
        entityId: notification.entityId || null,
        message: notification.message || "Nouvelle notification reçue",
      });
    } catch (error) {
      console.error("Erreur parsing notification :", error);

      onNotification({
        entity: "KAFKA",
        action: "EVENT",
        entityId: null,
        message: event.data || "Nouvelle notification reçue",
      });
    }
  };

  eventSource.onerror = (error) => {
    console.error("Erreur connexion SSE :", error);
  };

  return () => {
    console.log("SSE fermé");
    eventSource.close();
  };
}