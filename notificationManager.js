class NotificationManager {
  static async push(message) {
    const canPush = await NotificationManager.#requestPermission();

    if (canPush) {
      const notify = new Notification("Self driving car", {
        body: message,
      });

      notify.addEventListener("show", () => console.log("notification sent"));
    } else {
      console.log("Sorry notification isn't granted!");
    }
  }

  static async #requestPermission() {
    if (Notification.permission !== "granted") {
      const response = await Notification.requestPermission();
      return response === "granted";
    }

    return true;
  }
}
