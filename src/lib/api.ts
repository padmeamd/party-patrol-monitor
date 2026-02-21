import type { Alert, Room } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// --- Mock Data ---
const MOCK_ROOMS: Room[] = [
  { id: 1, name: "Room 101", floor: 1, deviceId: "ESP32-001", currentNoise: 42, lastUpdate: new Date(Date.now() - 30000).toISOString() },
  { id: 2, name: "Room 102", floor: 1, deviceId: "ESP32-002", currentNoise: 78, lastUpdate: new Date(Date.now() - 15000).toISOString() },
  { id: 3, name: "Room 201", floor: 2, deviceId: "ESP32-003", currentNoise: 35, lastUpdate: new Date(Date.now() - 60000).toISOString() },
  { id: 4, name: "Room 202", floor: 2, deviceId: "ESP32-004", currentNoise: 91, lastUpdate: new Date(Date.now() - 5000).toISOString() },
  { id: 5, name: "Room 301", floor: 3, deviceId: "ESP32-005", currentNoise: 55, lastUpdate: new Date(Date.now() - 45000).toISOString() },
  { id: 6, name: "Room 302", floor: 3, deviceId: "ESP32-006", currentNoise: 63, lastUpdate: new Date(Date.now() - 20000).toISOString() },
  { id: 7, name: "Room 401", floor: 4, deviceId: "ESP32-007", currentNoise: 28, lastUpdate: new Date(Date.now() - 120000).toISOString() },
  { id: 8, name: "Room 402", floor: 4, deviceId: "ESP32-008", currentNoise: 87, lastUpdate: new Date(Date.now() - 8000).toISOString() },
];

let mockAlertId = 5;
const MOCK_ALERTS: Alert[] = [
  { id: 1, deviceId: "ESP32-002", location: "Room 102", noiseLevel: 82, duration: 120, createdAt: new Date(Date.now() - 3600000).toISOString(), status: "RESOLVED" },
  { id: 2, deviceId: "ESP32-004", location: "Room 202", noiseLevel: 95, duration: 45, createdAt: new Date(Date.now() - 1800000).toISOString(), status: "ACKNOWLEDGED" },
  { id: 3, deviceId: "ESP32-008", location: "Room 402", noiseLevel: 88, duration: 60, createdAt: new Date(Date.now() - 600000).toISOString(), status: "NEW" },
  { id: 4, deviceId: "ESP32-004", location: "Room 202", noiseLevel: 91, duration: 30, createdAt: new Date(Date.now() - 120000).toISOString(), status: "NEW" },
];

const useMock = !API_BASE;

// Simulate fluctuation
function simulateNoise() {
  MOCK_ROOMS.forEach((room) => {
    const delta = Math.floor(Math.random() * 11) - 5;
    room.currentNoise = Math.max(20, Math.min(100, room.currentNoise + delta));
    room.lastUpdate = new Date().toISOString();
  });

  // Randomly generate new alert
  if (Math.random() < 0.15) {
    const room = MOCK_ROOMS[Math.floor(Math.random() * MOCK_ROOMS.length)];
    if (room.currentNoise > 75) {
      MOCK_ALERTS.unshift({
        id: ++mockAlertId,
        deviceId: room.deviceId,
        location: room.name,
        noiseLevel: room.currentNoise,
        duration: Math.floor(Math.random() * 180) + 10,
        createdAt: new Date().toISOString(),
        status: "NEW",
      });
      if (MOCK_ALERTS.length > 50) MOCK_ALERTS.pop();
    }
  }
}

export async function fetchRooms(): Promise<Room[]> {
  if (useMock) {
    simulateNoise();
    return [...MOCK_ROOMS];
  }
  const res = await fetch(`${API_BASE}/api/rooms`);
  return res.json();
}

export async function fetchAlerts(): Promise<Alert[]> {
  if (useMock) {
    return [...MOCK_ALERTS];
  }
  const res = await fetch(`${API_BASE}/api/alerts/latest`);
  return res.json();
}

export async function acknowledgeAlert(id: number): Promise<Alert> {
  if (useMock) {
    const alert = MOCK_ALERTS.find((a) => a.id === id);
    if (alert) alert.status = "ACKNOWLEDGED";
    return alert!;
  }
  const res = await fetch(`${API_BASE}/api/alerts/${id}/ack`, { method: "POST" });
  return res.json();
}
