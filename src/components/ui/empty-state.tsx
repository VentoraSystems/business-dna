import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-xl">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
