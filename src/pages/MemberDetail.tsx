
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  CircleUser, 
  Droplets, 
  Heart, 
  PlusCircle, 
  TrendingUp, 
  User
} from "lucide-react";
import { gymDataService, Member } from "@/services/gymDataService";
import AppLayout from "@/components/AppLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ChartCard from "@/components/ChartCard";
import GoalCard from "@/components/GoalCard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id) {
        const memberData = gymDataService.getMemberById(parseInt(id));
        if (memberData) {
          setMember(memberData);
          
          // Get progress data
          const progress = gymDataService.getMemberProgress(memberData.id);
          setProgressData(progress);
          
          // Get goals
          const memberGoals = gymDataService.getMemberGoals(memberData.id);
          setGoals(memberGoals);
        }
      }
      
      setIsLoading(false);
    };

    fetchMemberData();
  }, [id]);

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

  if (isLoading || !member) {
    return (
      <AppLayout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const bmiInfo = getBmiCategory(member.bmi);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Link to="/members">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Member Profile</h1>
        </div>

        {/* Member Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={`https://source.boringavatars.com/beam/120/${member.id}?colors=1e40af,3b82f6,10b981,0f172a,64748b`} />
              <AvatarFallback className="text-xl">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {member.name}
                  <Badge className={getMembershipBadgeClass(member.membershipType)}>
                    {member.membershipType}
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Member since: {member.joinDate}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CircleUser className="h-5 w-5 text-muted-foreground" />
                  <span>{member.age} years old • {member.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{member.visitFrequency} visits/week</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span>Preferred: {member.workoutType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Health Stats */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold">Health Stats</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="text-2xl font-semibold">{member.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="text-2xl font-semibold">{member.height} cm</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className={`text-2xl font-semibold ${bmiInfo.color}`}>
                        {member.bmi}
                      </p>
                      <p className={`text-sm ${bmiInfo.color}`}>
                        {bmiInfo.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Body Fat</p>
                      <p className="text-2xl font-semibold">{member.fatPercentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workout Stats */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold">Workout Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Workout Type</p>
                      <p className="text-lg font-semibold">{member.workoutType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Frequency</p>
                      <p className="text-lg font-semibold">{member.workoutFrequency} days/week</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Calories/Session</p>
                      <p className="text-lg font-semibold">{member.caloriesBurned} kcal</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Water Intake</p>
                      <p className="text-lg font-semibold">{member.waterIntake} L/day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Heart Rate */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Heart Rate Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Resting BPM</p>
                        <p className="text-2xl font-semibold">{member.restingBPM}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maximum BPM</p>
                        <p className="text-2xl font-semibold">{member.maxBPM}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average BPM</p>
                      <p className="text-2xl font-semibold">{member.avgBPM}</p>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart
                      data={[
                        { time: "Rest", bpm: member.restingBPM },
                        { time: "Avg", bpm: member.avgBPM },
                        { time: "Max", bpm: member.maxBPM }
                      ]}
                    >
                      <Line 
                        type="monotone" 
                        dataKey="bpm" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Weight Progress" description="Last 6 months">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#1e40af" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="BMI Progress" description="Last 6 months">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="bmi" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="Body Fat Progress" description="Last 6 months">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="fatPercentage" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="Overall Progress" description="Progress percentage over time">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" name="Progress %" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>
          
          <TabsContent value="goals">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Member Goals</h3>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {goals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
              
              {goals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No goals set yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MemberDetail;
