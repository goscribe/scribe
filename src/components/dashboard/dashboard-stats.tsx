"use client";

import { LucideIcon } from "lucide-react";
import { StatCard } from "./widgets/stat-card";

/**
 * Props for individual stat items
 */
interface StatItem {
  /** Label for the stat */
  label: string;
  /** Value to display */
  value: string | number;
  /** Icon component */
  icon: LucideIcon;
  /** Optional extra content (like progress bar) */
  extra?: React.ReactNode;
}

/**
 * Props for the DashboardStats component
 */
interface DashboardStatsProps {
  /** Array of stat items to display */
  stats: StatItem[];
}

/**
 * Dashboard statistics component for displaying overview metrics
 * 
 * Features:
 * - Grid layout for stats
 * - Support for icons and extra content
 * - Responsive design
 * 
 * @param props - DashboardStatsProps
 * @returns JSX element containing the dashboard stats
 */
export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          extra={stat.extra}
        />
      ))}
    </div>
  );
};
