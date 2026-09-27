// Service worker van Live OV: toont pushmeldingen van de backend ("Vertrek nu", "Je bus komt over 2 min", …)
// en opent de app als je op een melding tikt. Er wordt bewust niets gecachet: de data is live.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Live OV", body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Live OV", {
      body: data.body || "",
      tag: data.tag,
      icon: "/pwa-icon/192",
      badge: "/pwa-icon/192",
      data: { url: data.url || "/" },
      vibrate: [120, 60, 120],
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      // Staat de app al open? Dan die naar voren halen i.p.v. een nieuw venster.
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin)) return client.focus();
      }
      return self.clients.openWindow(url);
    })(),
  );
});
