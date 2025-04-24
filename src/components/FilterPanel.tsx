
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { WorkoutType } from "@/services/gymDataService";

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  search: string;
  gender: string;
  membershipType: string;
  ageRange: [number, number];
  workoutType: string;
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    gender: "",
    membershipType: "",
    ageRange: [18, 65],
    workoutType: "",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Update active filters for visualization
    updateActiveFilters(key, value);
  };

  const updateActiveFilters = (key: string, value: any) => {
    setActiveFilters(prev => {
      // Remove previous filter of the same key if exists
      const filtered = prev.filter(f => !f.startsWith(`${key}:`));
      
      // Only add non-empty values
      if (value === "" || (Array.isArray(value) && value[0] === 18 && value[1] === 65)) {
        return filtered;
      }

      // Format the filter display value
      let displayValue = value;
      if (key === "ageRange") {
        displayValue = `${value[0]}-${value[1]}`;
      }
      
      return [...filtered, `${key}:${displayValue}`];
    });
  };

  const clearFilter = (filter: string) => {
    const [key, _] = filter.split(':');
    
    // Reset the specific filter
    const newFilters = { ...filters };
    if (key === "ageRange") {
      newFilters.ageRange = [18, 65];
    } else {
      // @ts-ignore: Dynamic key assignment
      newFilters[key as keyof FilterOptions] = "";
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Update active filters
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    const resetFilters: FilterOptions = {
      search: "",
      gender: "",
      membershipType: "",
      ageRange: [18, 65],
      workoutType: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    setActiveFilters([]);
  };

  const workoutTypes: WorkoutType[] = [
    "Cardio",
    "Strength",
    "HIIT",
    "Yoga",
    "CrossFit",
    "Pilates",
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search" className="text-xs">Search</Label>
          <Input
            id="search"
            placeholder="Search by name..."
            className="h-9"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="gender" className="text-xs">Gender</Label>
          <Select 
            value={filters.gender} 
            onValueChange={(value) => handleFilterChange("gender", value)}
          >
            <SelectTrigger id="gender" className="h-9">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="membership" className="text-xs">Membership</Label>
          <Select 
            value={filters.membershipType} 
            onValueChange={(value) => handleFilterChange("membershipType", value)}
          >
            <SelectTrigger id="membership" className="h-9">
              <SelectValue placeholder="All memberships" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All memberships</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="workout" className="text-xs">Workout Type</Label>
          <Select 
            value={filters.workoutType} 
            onValueChange={(value) => handleFilterChange("workoutType", value)}
          >
            <SelectTrigger id="workout" className="h-9">
              <SelectValue placeholder="All workouts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All workouts</SelectItem>
              {workoutTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="age-range" className="text-xs">Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
        </div>
        <Slider
          id="age-range"
          min={18}
          max={65}
          step={1}
          value={filters.ageRange}
          onValueChange={(value) => handleFilterChange("ageRange", value)}
          className="py-4"
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Active filters:</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge 
                key={filter} 
                variant="outline"
                className="text-xs bg-blue-50"
              >
                {filter}
                <button 
                  className="ml-1 text-muted-foreground hover:text-foreground" 
                  onClick={() => clearFilter(filter)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
