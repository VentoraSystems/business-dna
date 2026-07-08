import { TodaysMissionCard } from "@/features/dashboard/components/todays-mission-card";
import { JourneyProgressCard } from "@/features/dashboard/components/journey-progress-card";
import { BusinessHealthCard } from "@/features/dashboard/components/business-health-card";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { QuickActionsCard } from "@/features/dashboard/components/quick-actions-card";
import { CoFounderCard } from "@/features/dashboard/components/co-founder-card";
import { BusinessTimelineCard } from "@/features/dashboard/components/business-timeline-card";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <JourneyProgressCard />
        <BusinessHealthCard />
        <CoFounderCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TodaysMissionCard />
          <BusinessTimelineCard />
        </div>
        <div className="space-y-6">
          <QuickActionsCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
