import { useViewMode, type ViewMode } from "@/hooks/use-view-mode";
import { Eye, Shield } from "lucide-react";

export function ModeSwitcher() {
  const { mode, setMode } = useViewMode();

  return (
    <div className="flex items-center rounded-lg border bg-secondary/50 p-0.5 gap-0.5">
      <ModeButton
        active={mode === "student"}
        onClick={() => setMode("student")}
        icon={<Eye className="h-3.5 w-3.5" />}
        label="Student"
      />
      <ModeButton
        active={mode === "security"}
        onClick={() => setMode("security")}
        icon={<Shield className="h-3.5 w-3.5" />}
        label="Security"
      />
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
