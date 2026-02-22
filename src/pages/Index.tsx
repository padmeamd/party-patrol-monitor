import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRooms, fetchAlerts, acknowledgeAlert } from "@/lib/api";
import { StatsHeader } from "@/components/StatsHeader";
import { RoomTable } from "@/components/RoomTable";
import { StudentRoomTable } from "@/components/StudentRoomTable";
import { SecurityAlerts } from "@/components/SecurityAlerts";
import { QuietHoursBanner } from "@/components/QuietHoursBanner";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { useViewMode, ViewModeProvider } from "@/hooks/use-view-mode";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const queryClient = useQueryClient();
  const { mode } = useViewMode();

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
  ? Math.round(
      rooms.reduce((sum, r) => sum + (r.currentNoise ?? 0), 0) / rooms.length
    )
  : 0;
  const acknowledged = alerts.filter((a) => a.status === "ACK").length;
  const floors = [...new Set(rooms.map((r) => r.floor).filter((f): f is number => typeof f === "number"))].sort((a,b)=>a-b);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
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
            <ModeSwitcher />
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
        {mode === "student" ? (
          <>
            <QuietHoursBanner />
            <StudentRoomTable rooms={rooms} />
          </>
        ) : (
          <>
            <StatsHeader
              totalRooms={rooms.length}
              activeAlerts={activeAlerts}
              avgNoise={avgNoise}
              acknowledgedToday={acknowledged}
            />
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <RoomTable rooms={rooms} />
              </div>
              <div className="lg:col-span-3">
                <SecurityAlerts
                  alerts={alerts}
                  floors={floors}
                  onAcknowledge={(id) => ackMutation.mutate(id)}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Party Patrol v1.0 — Set <code className="font-mono-data bg-secondary px-1 rounded">VITE_API_BASE_URL</code> to connect to your Spring Boot backend
        </div>
      </footer>
    </div>
  );
}

const Index = () => (
  <ViewModeProvider>
    <Dashboard />
  </ViewModeProvider>
);

export default Index;
