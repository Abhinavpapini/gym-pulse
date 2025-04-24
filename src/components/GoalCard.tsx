
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
  type: string;
}

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  // Function to determine color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Function to determine badge color based on goal type
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "weight":
        return "bg-blue-100 text-blue-800";
      case "fat":
        return "bg-purple-100 text-purple-800";
      case "frequency":
        return "bg-green-100 text-green-800";
      case "water":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get goal icon based on type
  const getGoalIcon = (type: string) => {
    switch (type) {
      case "weight":
        return "⚖️";
      case "fat":
        return "📉";
      case "frequency":
        return "🏋️";
      case "water":
        return "💧";
      default:
        return "🎯";
    }
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center gap-2">
            <span>{getGoalIcon(goal.type)}</span>
            <span>{goal.title}</span>
          </CardTitle>
          <Badge className={getBadgeClass(goal.type)}>{goal.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current: {goal.current} {goal.unit}</span>
          <span className="font-medium">Target: {goal.target} {goal.unit}</span>
        </div>
        <div className="space-y-1">
          <Progress value={goal.progress} className={`h-2 ${getProgressColor(goal.progress)}`} />
          <div className="flex justify-between text-xs">
            <span>{goal.progress}% complete</span>
            {goal.progress < 100 && (
              <span className="text-muted-foreground">
                {Math.abs(goal.current - goal.target).toFixed(1)} {goal.unit} to go
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
