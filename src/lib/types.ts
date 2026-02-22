export type AlertStatus = "NEW" | "ACK";

export interface Alert {
  id: string;
  deviceId: string;
  location: string;
  noiseLevel: number;
  duration?: number | null;
  createdAt: string;
  status: AlertStatus;
}

export interface Room {
  id: string;
  name: string;
  floor?: number | null;
  deviceId: string;
  currentNoise?: number | null;
  lastUpdate?: string | null;
}

export function getNoiseCategory(level: number): "low" | "medium" | "high" | "critical" {
  if (level < 50) return "low";
  if (level < 70) return "medium";
  if (level < 85) return "high";
  return "critical";
}

export function formatDuration(seconds?: number | null): string {
  const s = seconds ?? 0;
  if (s < 60) return `${s}s`;
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return "—";

  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
