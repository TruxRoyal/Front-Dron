import wifi from "node-wifi";

wifi.init({
  iface: null,
});

export async function scanWifiNetworks() {
  return wifi.scan();
}

export async function connectToWifi(ssid: string, password?: string) {
  return wifi.connect({ ssid, password: password ?? "" });
}

export async function getCurrentWifiConnection() {
  const connections = await wifi.getCurrentConnections();
  return connections[0] ?? null;
}