
import { useEffect, useState } from "react";
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  PieChart as PieChartIcon,
  User,
  Calendar 
} from "lucide-react";
import { gymDataService } from "@/services/gymDataService";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import DashboardCard from "@/components/DashboardCard";
import ChartCard from "@/components/ChartCard";
import MemberCard from "@/components/MemberCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [workoutDistribution, setWorkoutDistribution] = useState<any[]>([]);
  const [genderDistribution, setGenderDistribution] = useState<any[]>([]);
  const [caloriesByWorkout, setCaloriesByWorkout] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // COLORS for charts
  const COLORS = ['#1e40af', '#3b82f6', '#10b981', '#0f172a', '#64748b', '#cbd5e1'];

  useEffect(() => {
    // Simulate API loading
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get data from our service
      const aggregatedStats = gymDataService.getAggregatedStats();
      const allMembers = gymDataService.getMembers();
      const workoutTypes = gymDataService.getWorkoutTypeDistribution();
      const genderData = gymDataService.getGenderDistribution();
      const caloriesData = gymDataService.getCaloriesByWorkoutType();
      
      setStats(aggregatedStats);
      setMembers(allMembers.slice(0, 4)); // Just get first 4 members for preview
      setWorkoutDistribution(workoutTypes);
      setGenderDistribution(genderData);
      setCaloriesByWorkout(caloriesData);
      
      setIsLoading(true);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading || !stats) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to GymPulse analytics overview.</p>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Members" 
            value={stats.totalMembers} 
            icon={<User className="h-5 w-5" />}
            trend="up"
            trendValue="+12% from last month"
          />
          
          <StatCard 
            title="Average Weight" 
            value={`${stats.avgWeight} kg`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="down"
            trendValue="-2.4% from last month"
          />
          
          <StatCard 
            title="Most Common Workout" 
            value={stats.mostCommonWorkoutType}
            icon={<Calendar className="h-5 w-5" />}
          />
          
          <StatCard 
            title="Avg. Calories Burned" 
            value={stats.avgCaloriesBurned}
            icon={<BarChartIcon className="h-5 w-5" />}
            trend="up"
            trendValue="+5% from last month"
          />
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Workout Type Distribution" description="Member distribution by workout preferences">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workoutDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {workoutDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          
          <ChartCard title="Calories Burned by Workout Type" description="Average calories burned per workout session">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caloriesByWorkout}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Avg. Calories" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Gender Distribution" description="Member distribution by gender">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="#1e40af" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          
          <ChartCard 
            title="Membership Growth" 
            description="New members joined over time"
            exportData={false}
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={[
                  { month: 'Jan', members: 25 },
                  { month: 'Feb', members: 32 },
                  { month: 'Mar', members: 38 },
                  { month: 'Apr', members: 42 },
                  { month: 'May', members: 48 },
                  { month: 'Jun', members: 50 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="members" 
                  stroke="#1e40af" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Featured members */}
        <DashboardCard
          title="Recently Active Members"
          description="Members with recent gym activity"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
