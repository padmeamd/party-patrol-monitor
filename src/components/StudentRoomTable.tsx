import { getNoiseCategory, timeAgo, type Room } from "@/lib/types";

interface StudentRoomTableProps {
  rooms: Room[];
}

export function StudentRoomTable({ rooms }: StudentRoomTableProps) {
  const sorted = [...rooms].sort((a, b) => b.currentNoise - a.currentNoise);

  return (
    <div className="rounded-lg border bg-card animate-fade-in">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-foreground">Noise Levels</h2>
        <p className="text-sm text-muted-foreground">Current readings across your dorm</p>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((room) => {
          const cat = getNoiseCategory(room.currentNoise);
          const labels = { low: "Quiet", medium: "Moderate", high: "Loud", critical: "Critical" } as const;
          return (
            <div key={room.id} className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{room.name}</p>
                <p className="text-xs text-muted-foreground">Floor {room.floor} · {timeAgo(room.lastUpdate)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 noise-bar-${cat}`}
                    style={{ width: `${room.currentNoise}%` }}
                  />
                </div>
                <span className={`font-mono-data text-xs font-semibold text-noise-${cat} w-14 text-right`}>
                  {room.currentNoise} dB
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-noise-${cat}/15 text-noise-${cat} w-[72px] text-center`}>
                  {labels[cat]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
