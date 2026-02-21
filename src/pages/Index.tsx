import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRooms, fetchAlerts, acknowledgeAlert } from "@/lib/api";
import { StatsHeader } from "@/components/StatsHeader";
import { RoomTable } from "@/components/RoomTable";
import { AlertTable } from "@/components/AlertTable";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const queryClient = useQueryClient();

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    refetchInterval: 3000,
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    refetchInterval: 3000,
  });

  const ackMutation = useMutation({
    mutationFn: acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const activeAlerts = alerts.filter((a) => a.status === "NEW").length;
  const avgNoise = rooms.length
    ? Math.round(rooms.reduce((sum, r) => sum + r.currentNoise, 0) / rooms.length)
    : 0;
  const acknowledged = alerts.filter((a) => a.status === "ACKNOWLEDGED").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Party Patrol</h1>
              <p className="text-xs text-muted-foreground">Dormitory Noise Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["rooms"] });
                queryClient.invalidateQueries({ queryKey: ["alerts"] });
              }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <StatsHeader
          totalRooms={rooms.length}
          activeAlerts={activeAlerts}
          avgNoise={avgNoise}
          acknowledgedToday={acknowledged}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <RoomTable rooms={rooms} />
          <AlertTable alerts={alerts} onAcknowledge={(id) => ackMutation.mutate(id)} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Party Patrol v1.0 — Set <code className="font-mono-data bg-secondary px-1 rounded">VITE_API_BASE_URL</code> to connect to your Spring Boot backend
        </div>
      </footer>
    </div>
  );
};

export default Index;
