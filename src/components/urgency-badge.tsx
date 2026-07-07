import { AlertOctagon, AlertTriangle, CircleCheck, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Urgency } from "@/types/assist";

const config: Record<
  Urgency,
  { label: string; variant: "success" | "warning" | "critical"; icon: typeof Info; pulse?: boolean }
> = {
  low: { label: "Low priority", variant: "success", icon: CircleCheck },
  medium: { label: "Medium priority", variant: "warning", icon: Info },
  high: { label: "High priority", variant: "critical", icon: AlertTriangle },
  critical: { label: "Critical — act now", variant: "critical", icon: AlertOctagon, pulse: true }
};

export function UrgencyBadge({ urgency, className }: { urgency: Urgency; className?: string }) {
  const entry = config[urgency];
  const Icon = entry.icon;

  return (
    <Badge variant={entry.variant} className={cn(entry.pulse ? "animate-pulse" : undefined, className)}>
      <Icon className="size-3.5" />
      {entry.label}
    </Badge>
  );
}
