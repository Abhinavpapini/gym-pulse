import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadIcon, FileText } from "lucide-react";
import { gymDataService, Member } from "@/services/gymDataService";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [members] = useState<Member[]>(gymDataService.getMembers());
  const [reportType, setReportType] = useState<string>("attendance");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: new Date()
  });
  
  const [selectedMetrics, setSelectedMetrics] = useState({
    weight: true,
    bmi: true,
    fatPercentage: false,
    caloriesBurned: true,
    restingBPM: false,
    avgBPM: false,
    maxBPM: false,
    workoutFrequency: true,
    waterIntake: false
  });

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric as keyof typeof prev]
    }));
  };

  const handleExportCSV = () => {
    const headers = ["Member", "Gender", "Age"];
    if (selectedMetrics.weight) headers.push("Weight");
    if (selectedMetrics.bmi) headers.push("BMI");
    if (selectedMetrics.fatPercentage) headers.push("Body Fat %");
    if (selectedMetrics.caloriesBurned) headers.push("Calories Burned");
    if (selectedMetrics.workoutFrequency) headers.push("Workout Frequency");
    
    const csvRows = [headers];
    
    members.forEach(member => {
      const row = [member.name, member.gender, member.age.toString()];
      if (selectedMetrics.weight) row.push(`${member.weight}`);
      if (selectedMetrics.bmi) row.push(`${member.bmi}`);
      if (selectedMetrics.fatPercentage) row.push(`${member.fatPercentage}`);
      if (selectedMetrics.caloriesBurned) row.push(`${member.caloriesBurned}`);
      if (selectedMetrics.workoutFrequency) row.push(`${member.workoutFrequency}`);
      
      csvRows.push(row);
    });
    
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast({
      title: "CSV Report Generated",
      description: "Your report has been downloaded as a CSV file.",
    });
  };

  const handleExportPDF = () => {
    const content = `
${reportType.toUpperCase()} REPORT
Generated on: ${new Date().toLocaleDateString()}
Date Range: ${dateRange?.from ? dateRange.from.toLocaleDateString() : 'N/A'} to ${dateRange?.to ? dateRange.to.toLocaleDateString() : 'N/A'}

Selected Metrics: ${Object.entries(selectedMetrics)
  .filter(([_, value]) => value)
  .map(([key]) => key)
  .join(', ')}

MEMBER DATA:
${members.slice(0, 5).map(member => 
  `${member.name}, ${member.gender}, ${member.age} years
   Weight: ${member.weight} kg, BMI: ${member.bmi}, Body Fat: ${member.fatPercentage}%
   Calories Burned: ${member.caloriesBurned}, Workout Frequency: ${member.workoutFrequency}/7`
).join('\n\n')}

${members.length > 5 ? `... and ${members.length - 5} more members` : ''}

Report End.
    `;
    
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast({
      title: "PDF Report Generated",
      description: "Your report has been downloaded as a PDF file.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">
              Generate and export gym analytics reports.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="generator">
              <TabsList className="mb-6">
                <TabsTrigger value="generator">Report Generator</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Report Type
                      </label>
                      <Select
                        value={reportType}
                        onValueChange={setReportType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendance">Attendance Report</SelectItem>
                          <SelectItem value="progress">Progress Report</SelectItem>
                          <SelectItem value="workout">Workout Analytics</SelectItem>
                          <SelectItem value="health">Health Metrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-1 block">
                        Date Range
                      </label>
                      <DatePickerWithRange 
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Metrics to Include
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="weight" 
                          checked={selectedMetrics.weight}
                          onCheckedChange={() => handleMetricChange('weight')}
                        />
                        <label htmlFor="weight" className="text-sm">Weight</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="bmi" 
                          checked={selectedMetrics.bmi}
                          onCheckedChange={() => handleMetricChange('bmi')}
                        />
                        <label htmlFor="bmi" className="text-sm">BMI</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="fatPercentage" 
                          checked={selectedMetrics.fatPercentage}
                          onCheckedChange={() => handleMetricChange('fatPercentage')}
                        />
                        <label htmlFor="fatPercentage" className="text-sm">Body Fat %</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="caloriesBurned" 
                          checked={selectedMetrics.caloriesBurned}
                          onCheckedChange={() => handleMetricChange('caloriesBurned')}
                        />
                        <label htmlFor="caloriesBurned" className="text-sm">Calories</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="restingBPM" 
                          checked={selectedMetrics.restingBPM}
                          onCheckedChange={() => handleMetricChange('restingBPM')}
                        />
                        <label htmlFor="restingBPM" className="text-sm">Resting BPM</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="avgBPM" 
                          checked={selectedMetrics.avgBPM}
                          onCheckedChange={() => handleMetricChange('avgBPM')}
                        />
                        <label htmlFor="avgBPM" className="text-sm">Avg BPM</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="maxBPM" 
                          checked={selectedMetrics.maxBPM}
                          onCheckedChange={() => handleMetricChange('maxBPM')}
                        />
                        <label htmlFor="maxBPM" className="text-sm">Max BPM</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="workoutFrequency" 
                          checked={selectedMetrics.workoutFrequency}
                          onCheckedChange={() => handleMetricChange('workoutFrequency')}
                        />
                        <label htmlFor="workoutFrequency" className="text-sm">Workout Freq.</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="waterIntake" 
                          checked={selectedMetrics.waterIntake}
                          onCheckedChange={() => handleMetricChange('waterIntake')}
                        />
                        <label htmlFor="waterIntake" className="text-sm">Water Intake</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Member</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Age</TableHead>
                          {selectedMetrics.weight && <TableHead>Weight</TableHead>}
                          {selectedMetrics.bmi && <TableHead>BMI</TableHead>}
                          {selectedMetrics.fatPercentage && <TableHead>Body Fat %</TableHead>}
                          {selectedMetrics.caloriesBurned && <TableHead>Cal. Burned</TableHead>}
                          {selectedMetrics.workoutFrequency && <TableHead>Workout Freq.</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.slice(0, 5).map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.gender}</TableCell>
                            <TableCell>{member.age}</TableCell>
                            {selectedMetrics.weight && <TableCell>{member.weight} kg</TableCell>}
                            {selectedMetrics.bmi && <TableCell>{member.bmi}</TableCell>}
                            {selectedMetrics.fatPercentage && <TableCell>{member.fatPercentage}%</TableCell>}
                            {selectedMetrics.caloriesBurned && <TableCell>{member.caloriesBurned}</TableCell>}
                            {selectedMetrics.workoutFrequency && <TableCell>{member.workoutFrequency}/7</TableCell>}
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-2">
                            Showing 5 of {members.length} members in report preview
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handleExportCSV}>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={handleExportPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate PDF Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="scheduled">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Set up automated reports to be generated and delivered on a schedule.
                  </p>
                  
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Last Generated</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Weekly Progress Summary</TableCell>
                          <TableCell>Weekly (Monday)</TableCell>
                          <TableCell>Jun 17, 2024</TableCell>
                          <TableCell>PDF, CSV</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Monthly Member Statistics</TableCell>
                          <TableCell>Monthly (1st)</TableCell>
                          <TableCell>Jun 1, 2024</TableCell>
                          <TableCell>PDF</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Quarterly Health Analysis</TableCell>
                          <TableCell>Quarterly</TableCell>
                          <TableCell>Apr 1, 2024</TableCell>
                          <TableCell>PDF, Excel</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      Create Scheduled Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
