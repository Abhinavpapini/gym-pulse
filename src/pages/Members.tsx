import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { gymDataService, Member } from "@/services/gymDataService";
import AppLayout from "@/components/AppLayout";
import MemberCard from "@/components/MemberCard";
import FilterPanel, { FilterOptions } from "@/components/FilterPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "table">("grid");

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get members from service
      const allMembers = gymDataService.getMembers();
      setMembers(allMembers);
      setFilteredMembers(allMembers);
      
      setIsLoading(false);
    };

    fetchMembers();
  }, []);

  const handleFilterChange = (filters: FilterOptions) => {
    const filtered = members.filter(member => {
      // Filter by search text
      if (
        filters.search &&
        !member.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      
      // Filter by gender
      if (filters.gender !== "all" && member.gender !== filters.gender) {
        return false;
      }
      
      // Filter by membership type
      if (filters.membershipType !== "all" && member.membershipType !== filters.membershipType) {
        return false;
      }
      
      // Filter by age range
      if (
        filters.ageRange &&
        (member.age < filters.ageRange[0] || member.age > filters.ageRange[1])
      ) {
        return false;
      }
      
      // Filter by workout type
      if (filters.workoutType !== "all" && member.workoutType !== filters.workoutType) {
        return false;
      }
      
      return true;
    });

    setFilteredMembers(filtered);
  };

  // Function to format membership type with a badge
  const getMembershipBadge = (type: string) => {
    let className = "";
    
    switch (type) {
      case "Basic":
        className = "bg-blue-100 text-blue-800";
        break;
      case "Premium":
        className = "bg-purple-100 text-purple-800";
        break;
      case "VIP":
        className = "bg-amber-100 text-amber-800";
        break;
      default:
        className = "bg-gray-100 text-gray-800";
    }
    
    return <Badge className={className}>{type}</Badge>;
  };

  const getBmiClassName = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-500";
    if (bmi >= 18.5 && bmi < 25) return "text-green-500";
    if (bmi >= 25 && bmi < 30) return "text-orange-500";
    return "text-red-500";
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <User className="h-8 w-8" />
              Members
            </h1>
            <p className="text-muted-foreground">
              View and manage gym member profiles.
            </p>
          </div>
          <div className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{filteredMembers.length}</span> members
          </div>
        </div>

        <FilterPanel onFilterChange={handleFilterChange} />
        
        <Tabs defaultValue="grid" onValueChange={(v) => setViewType(v as "grid" | "table")}>
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
              {filteredMembers.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No members match your filters.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Height</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Workout Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{member.gender}</TableCell>
                      <TableCell>{member.weight} kg</TableCell>
                      <TableCell>{member.height} cm</TableCell>
                      <TableCell className={getBmiClassName(member.bmi)}>{member.bmi}</TableCell>
                      <TableCell>{getMembershipBadge(member.membershipType)}</TableCell>
                      <TableCell>{member.workoutType}</TableCell>
                    </TableRow>
                  ))}
                  {filteredMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No members match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Members;
