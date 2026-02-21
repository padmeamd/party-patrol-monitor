import { getNoiseCategory, timeAgo, type Room } from "@/lib/types";

interface RoomTableProps {
  rooms: Room[];
}

export function RoomTable({ rooms }: RoomTableProps) {
  const sorted = [...rooms].sort((a, b) => b.currentNoise - a.currentNoise);

  return (
    <div className="rounded-lg border bg-card animate-fade-in">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-foreground">Room Monitor</h2>
        <p className="text-sm text-muted-foreground">Live noise levels across all floors</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left p-3 font-medium">Room</th>
              <th className="text-left p-3 font-medium">Floor</th>
              <th className="text-left p-3 font-medium">Device</th>
              <th className="text-left p-3 font-medium">Noise Level</th>
              <th className="text-left p-3 font-medium">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((room) => {
              const cat = getNoiseCategory(room.currentNoise);
              return (
                <tr key={room.id} className="border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">{room.name}</td>
                  <td className="p-3 text-muted-foreground">{room.floor}</td>
                  <td className="p-3 font-mono-data text-xs text-muted-foreground">{room.deviceId}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 noise-bar-${cat}`}
                          style={{ width: `${room.currentNoise}%` }}
                        />
                      </div>
                      <span className={`font-mono-data text-xs font-semibold text-noise-${cat}`}>
                        {room.currentNoise} dB
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{timeAgo(room.lastUpdate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
