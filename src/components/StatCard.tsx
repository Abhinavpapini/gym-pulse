
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = ({ title, value, icon, className = "", trend, trendValue }: StatCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") return <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
    if (trend === "down") return <svg className="h-3 w-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
    return null;
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && trendValue && (
              <div className="flex items-center mt-1 text-xs">
                {getTrendIcon()}
                <span className={`ml-1 ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
