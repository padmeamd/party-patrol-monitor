import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getNoiseCategory, formatDuration, timeAgo, type Alert } from "@/lib/types";
import { CheckCircle, AlertTriangle, Filter } from "lucide-react";

interface SecurityAlertsProps {
  alerts: Alert[];
  floors: number[];
  onAcknowledge: (id: string) => void;
}

export function SecurityAlerts({ alerts, floors, onAcknowledge }: SecurityAlertsProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [floorFilter, setFloorFilter] = useState<string>("ALL");

  const filtered = alerts.filter((a) => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (floorFilter !== "ALL") {
      const floorNum = parseInt(floorFilter);
      const roomFloor = parseInt(a.location.replace(/\D/g, "").charAt(0));
      if (roomFloor !== floorNum) return false;
    }
    return true;
  });

  return (
    <div className="rounded-lg border bg-card animate-fade-in">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Alerts Console</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} alert{filtered.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-secondary border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="ACK">Acknowledged</option>
          </select>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="text-xs bg-secondary border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="ALL">All Floors</option>
            {floors.map((f) => (
              <option key={f} value={f}>Floor {f}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Location</th>
              <th className="text-left p-3 font-medium">Device</th>
              <th className="text-left p-3 font-medium">Noise</th>
              <th className="text-left p-3 font-medium">Duration</th>
              <th className="text-left p-3 font-medium">Time</th>
              <th className="text-left p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alert) => {
              const isNew = alert.status === "NEW";
              const cat = getNoiseCategory(alert.noiseLevel);
              return (
                <tr
                  key={alert.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isNew ? "bg-destructive/5" : "hover:bg-secondary/50"
                  }`}
                >
                  <td className="p-3"><StatusBadge status={alert.status} /></td>
                  <td className="p-3 font-medium text-foreground">{alert.location}</td>
                  <td className="p-3 font-mono-data text-xs text-muted-foreground">{alert.deviceId}</td>
                  <td className="p-3">
                    <span className={`font-mono-data text-xs font-semibold text-noise-${cat}`}>
                      {alert.noiseLevel} dB
                    </span>
                  </td>
                  <td className="p-3 font-mono-data text-xs text-muted-foreground">{formatDuration(alert.duration)}</td>
                  <td className="p-3 text-xs text-muted-foreground">{timeAgo(alert.createdAt)}</td>
                  <td className="p-3">
                    {isNew && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => onAcknowledge(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Ack
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No alerts match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "NEW") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/15 text-destructive animate-pulse-alert">
        <AlertTriangle className="h-3 w-3" />
        NEW
      </span>
    );
  }
  if (status === "ACK") {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">
      <CheckCircle className="h-3 w-3" />
      ACK
    </span>
  );
}
return (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
    —
  </span>
);
}
