import { Moon } from "lucide-react";

export function QuietHoursBanner() {
  const now = new Date();
  const hour = now.getHours();
  const isQuietHours = hour >= 22 || hour < 7;

  return (
    <div
      className={`rounded-lg border p-4 animate-fade-in ${
        isQuietHours
          ? "border-warning/30 bg-warning/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center ${
            isQuietHours ? "bg-warning/15" : "bg-secondary"
          }`}
        >
          <Moon className={`h-4.5 w-4.5 ${isQuietHours ? "text-warning" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {isQuietHours ? "Quiet Hours Active" : "Regular Hours"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isQuietHours
              ? "Quiet hours: 10 PM – 7 AM. Please keep noise below 50 dB."
              : "Quiet hours begin at 10 PM. Be considerate of your neighbors."}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <LegendDot className="noise-bar-low" label="Quiet" />
          <LegendDot className="noise-bar-medium" label="Moderate" />
          <LegendDot className="noise-bar-high" label="Loud" />
          <LegendDot className="noise-bar-critical" label="Critical" />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}
