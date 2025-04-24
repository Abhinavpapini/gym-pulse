
import { useState, useEffect } from "react";
import { gymDataService } from "@/services/gymDataService";
import AppLayout from "@/components/AppLayout";
import ChartCard from "@/components/ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [workoutTypes, setWorkoutTypes] = useState<any[]>([]);
  const [ageGroups, setAgeGroups] = useState<any[]>([]);
  const [bmiByAge, setBmiByAge] = useState<any[]>([]);
  const [caloriesByWorkout, setCaloriesByWorkout] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // COLORS for charts
  const COLORS = ['#1e40af', '#3b82f6', '#10b981', '#0f172a', '#64748b', '#cbd5e1'];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get data from service
      const workoutData = gymDataService.getWorkoutTypeDistribution();
      const ageData = gymDataService.getAgeGroupDistribution();
      const bmiData = gymDataService.getBmiByAgeGroup();
      const caloriesData = gymDataService.getCaloriesByWorkoutType();
      
      setWorkoutTypes(workoutData);
      setAgeGroups(ageData);
      setBmiByAge(bmiData);
      setCaloriesByWorkout(caloriesData);
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
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

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed analysis of member performance and trends.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
          
            <div className="flex justify-end mt-4">
              <Select 
                value={selectedGender} 
                onValueChange={setSelectedGender}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard 
                  title="Workout Type Distribution" 
                  description="Member distribution by workout preferences"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={workoutTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {workoutTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Age Group Distribution" 
                  description="Member distribution by age groups"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageGroups}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Members" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="BMI by Age Group" 
                  description="Average BMI across different age groups"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bmiByAge}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Avg. BMI" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Calories Burned by Workout Type" 
                  description="Average calories burned per workout session"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={caloriesByWorkout}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Avg. Calories" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </TabsContent>
            
            <TabsContent value="demographics" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard 
                  title="Gender Distribution" 
                  description="Member distribution by gender"
                >
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="60%" height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Male', value: 27 },
                            { name: 'Female', value: 23 }
                          ]}
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
                  title="Member Age Distribution" 
                  description="Age distribution of members"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageGroups}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Members" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Membership Type Distribution" 
                  description="Member distribution by membership type"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Basic', value: 25 },
                          { name: 'Premium', value: 15 },
                          { name: 'VIP', value: 10 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#1e40af" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Visit Frequency Distribution" 
                  description="Member distribution by weekly visit frequency"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={[
                        { visits: '1 day', count: 5 },
                        { visits: '2 days', count: 8 },
                        { visits: '3 days', count: 15 },
                        { visits: '4 days', count: 10 },
                        { visits: '5 days', count: 7 },
                        { visits: '6-7 days', count: 5 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="visits" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Members" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard 
                  title="Calories Burned by Workout Type" 
                  description="Average calories burned per workout session"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={caloriesByWorkout}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Avg. Calories" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Heart Rate Metrics by Age Group" 
                  description="Average BPM across different age groups"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                      data={[
                        { age: '18-25', resting: 65, average: 105, max: 175 },
                        { age: '26-35', resting: 68, average: 110, max: 172 },
                        { age: '36-45', resting: 70, average: 115, max: 165 },
                        { age: '46-55', resting: 72, average: 118, max: 160 },
                        { age: '56+', resting: 75, average: 120, max: 155 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="resting" 
                        name="Resting BPM"
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="average"
                        name="Average BPM" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="max"
                        name="Max BPM" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Water Intake by Workout Type" 
                  description="Average water intake per workout type"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={[
                        { name: 'Cardio', intake: 2.5 },
                        { name: 'Strength', intake: 1.8 },
                        { name: 'HIIT', intake: 2.3 },
                        { name: 'Yoga', intake: 1.5 },
                        { name: 'CrossFit', intake: 2.7 },
                        { name: 'Pilates', intake: 1.6 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="intake" name="Avg. Liters/day" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard 
                  title="Weight Loss Progress" 
                  description="Average weight change over 6 months"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                      data={[
                        { month: 'Jan', weight: 75.5 },
                        { month: 'Feb', weight: 74.2 },
                        { month: 'Mar', weight: 73.1 },
                        { month: 'Apr', weight: 72.3 },
                        { month: 'May', weight: 71.8 },
                        { month: 'Jun', weight: 71.2 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        name="Avg. Weight (kg)" 
                        stroke="#1e40af" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
