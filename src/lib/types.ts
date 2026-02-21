export type AlertStatus = "NEW" | "ACKNOWLEDGED" | "RESOLVED";

export interface Alert {
  id: number;
  deviceId: string;
  location: string;
  noiseLevel: number;
  duration: number; // seconds
  createdAt: string;
  status: AlertStatus;
}

export interface Room {
  id: number;
  name: string;
  floor: number;
  deviceId: string;
  currentNoise: number;
  lastUpdate: string;
}

export function getNoiseCategory(level: number): "low" | "medium" | "high" | "critical" {
  if (level < 50) return "low";
  if (level < 70) return "medium";
  if (level < 85) return "high";
  return "critical";
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
