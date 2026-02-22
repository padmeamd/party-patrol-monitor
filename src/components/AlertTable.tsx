import { Button } from "@/components/ui/button";
import { getNoiseCategory, formatDuration, timeAgo, type Alert } from "@/lib/types";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AlertTableProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertTable({ alerts, onAcknowledge }: AlertTableProps) {
  return (
    <div className="rounded-lg border bg-card animate-fade-in">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-foreground">Recent Alerts</h2>
        <p className="text-sm text-muted-foreground">Noise violations detected by sensors</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Location</th>
              <th className="text-left p-3 font-medium">Noise</th>
              <th className="text-left p-3 font-medium">Duration</th>
              <th className="text-left p-3 font-medium">Time</th>
              <th className="text-left p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => {
              const isNew = alert.status === "NEW";
              const cat = getNoiseCategory(alert.noiseLevel);
              return (
                <tr
                  key={alert.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isNew ? "bg-destructive/5" : "hover:bg-secondary/50"
                  }`}
                >
                  <td className="p-3">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="p-3 font-medium text-foreground">{alert.location}</td>
                  <td className="p-3">
                    <span className={`font-mono-data text-xs font-semibold text-noise-${cat}`}>
                      {alert.noiseLevel} dB
                    </span>
                  </td>
                  <td className="p-3 font-mono-data text-xs text-muted-foreground">
                    {formatDuration(alert.duration)}
                  </td>
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
            {alerts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No alerts recorded
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
  if (status === "ACKNOWLEDGED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">
        <CheckCircle className="h-3 w-3" />
        ACK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
      <CheckCircle className="h-3 w-3" />
      RESOLVED
    </span>
  );
}
