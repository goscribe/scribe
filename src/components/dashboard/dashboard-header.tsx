"use client";

/**
 * Props for the DashboardHeader component
 */
interface DashboardHeaderProps {
  /** User's name for personalization */
  userName?: string;
}

/**
 * Dashboard header component with personalized greeting
 * 
 * Features:
 * - Personalized welcome message
 * - Clean, minimal design
 * - Responsive layout
 * 
 * @param props - DashboardHeaderProps
 * @returns JSX element containing the dashboard header
 */
export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const displayName = userName?.split(' ')[0] || 'User';
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        {displayName}'s Workspace
      </h1>
      <p className="text-muted-foreground text-sm">
        Manage your files and folders
      </p>
    </div>
  );
};
