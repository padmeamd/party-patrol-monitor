import { Activity, AlertTriangle, Volume2, CheckCircle } from "lucide-react";

interface StatsHeaderProps {
  totalRooms: number;
  activeAlerts: number;
  avgNoise: number;
  acknowledgedToday: number;
}

export function StatsHeader({ totalRooms, activeAlerts, avgNoise, acknowledgedToday }: StatsHeaderProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Volume2 className="h-5 w-5 text-primary" />}
        label="Monitored Rooms"
        value={totalRooms}
      />
      <StatCard
        icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
        label="Active Alerts"
        value={activeAlerts}
        highlight={activeAlerts > 0}
      />
      <StatCard
        icon={<Activity className="h-5 w-5 text-warning" />}
        label="Avg Noise (dB)"
        value={avgNoise}
      />
      <StatCard
        icon={<CheckCircle className="h-5 w-5 text-success" />}
        label="Acknowledged"
        value={acknowledgedToday}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border bg-card p-4 animate-fade-in ${highlight ? "border-destructive/50" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className={`text-3xl font-bold font-mono-data ${highlight ? "text-destructive" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
