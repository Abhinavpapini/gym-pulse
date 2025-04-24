
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Member } from "@/services/gymDataService";
import { Link } from "react-router-dom";

interface MemberCardProps {
  member: Member;
}

const MemberCard = ({ member }: MemberCardProps) => {
  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  // Function to determine membership badge color
  const getMembershipBadgeClass = (type: string) => {
    switch (type) {
      case "Basic":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "VIP":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to determine BMI category and color
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi >= 18.5 && bmi < 25) return { category: "Normal", color: "text-green-500" };
    if (bmi >= 25 && bmi < 30) return { category: "Overweight", color: "text-orange-500" };
    return { category: "Obese", color: "text-red-500" };
  };

  const bmiInfo = getBmiCategory(member.bmi);
  const visitProgress = (member.visitFrequency / 7) * 100;

  return (
    <Link to={`/members/${member.id}`} className="block">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://source.boringavatars.com/beam/120/${member.id}?colors=1e40af,3b82f6,10b981,0f172a,64748b`} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-base line-clamp-1">{member.name}</CardTitle>
                <div className="flex text-xs text-muted-foreground">
                  <span>{member.age} yrs</span>
                  <span className="mx-1">•</span>
                  <span>{member.gender}</span>
                </div>
              </div>
            </div>
            <Badge className={getMembershipBadgeClass(member.membershipType)}>
              {member.membershipType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-medium">{member.weight} kg</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Height</p>
              <p className="font-medium">{member.height} cm</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">BMI</p>
              <p className={`font-medium ${bmiInfo.color}`}>
                {member.bmi} <span className="text-xs">({bmiInfo.category})</span>
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Workout</p>
              <p className="font-medium text-sm truncate">{member.workoutType}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Visit Frequency</span>
              <span className="font-medium">{member.visitFrequency}/7 days</span>
            </div>
            <Progress value={visitProgress} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MemberCard;
