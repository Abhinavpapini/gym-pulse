import Papa from "papaparse";

export type Member = {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  weight: number;
  height: number;
  bmi: number;
  membershipType: 'Basic' | 'Premium' | 'VIP';
  visitFrequency: number;
  caloriesBurned: number;
  workoutType: string;
  waterIntake: number;
  restingBPM: number;
  maxBPM: number;
  avgBPM: number;
  fatPercentage: number;
  workoutFrequency: number;
  joinDate: string;
};

export type WorkoutType = 'Cardio' | 'Strength' | 'HIIT' | 'Yoga' | 'CrossFit' | 'Pilates';

// Generate random number between min and max
const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate random workout type
const randomWorkoutType = (): WorkoutType => {
  const types: WorkoutType[] = ['Cardio', 'Strength', 'HIIT', 'Yoga', 'CrossFit', 'Pilates'];
  return types[Math.floor(Math.random() * types.length)];
};

// Generate random membership type
const randomMembershipType = (): 'Basic' | 'Premium' | 'VIP' => {
  const types = ['Basic', 'Premium', 'VIP'];
  return types[Math.floor(Math.random() * types.length)] as 'Basic' | 'Premium' | 'VIP';
};

// Generate random date within the last year
const randomDate = (): string => {
  const now = new Date();
  const pastDate = new Date(now.setMonth(now.getMonth() - random(0, 12)));
  return pastDate.toISOString().split('T')[0];
};

// Calculate BMI
const calculateBMI = (weight: number, height: number): number => {
  // Height is in cm, convert to meters
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

let members: Member[] = [];

// Function to load and parse the CSV file
export const validateMemberData = (row: any): Member | null => {
  try {
    const id = Number(row.id);
    const name = row.name;
    const age = Number(row.age);
    const gender = row.gender as "Male" | "Female";
    const weight = Number(row.weight);
    const height = Number(row.height);
    const bmi = Number(row.bmi);
    const membershipType = row.membershipType as "Basic" | "Premium" | "VIP";
    const visitFrequency = Number(row.visitFrequency);
    const caloriesBurned = Number(row.caloriesBurned);
    const workoutType = row.workoutType;
    const waterIntake = Number(row.waterIntake);
    const restingBPM = Number(row.restingBPM);
    const maxBPM = Number(row.maxBPM);
    const avgBPM = Number(row.avgBPM);
    const fatPercentage = Number(row.fatPercentage);
    const workoutFrequency = Number(row.workoutFrequency);
    const joinDate = row.joinDate;

    if (
      isNaN(id) || !name || isNaN(age) || !gender || isNaN(weight) || isNaN(height) ||
      isNaN(bmi) || !membershipType || isNaN(visitFrequency) || isNaN(caloriesBurned) ||
      !workoutType || isNaN(waterIntake) || isNaN(restingBPM) || isNaN(maxBPM) ||
      isNaN(avgBPM) || isNaN(fatPercentage) || isNaN(workoutFrequency) || !joinDate
    ) {
      return null;
    }

    return {
      id,
      name,
      age,
      gender,
      weight,
      height,
      bmi,
      membershipType,
      visitFrequency,
      caloriesBurned,
      workoutType,
      waterIntake,
      restingBPM,
      maxBPM,
      avgBPM,
      fatPercentage,
      workoutFrequency,
      joinDate,
    };
  } catch {
    return null;
  }
};

export const loadMembersFromCSV = (csvFilePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFilePath, {
      download: true,
      header: true, // Parse the CSV as an array of objects
      complete: (result) => {
        members = result.data
          .map((row: any) => validateMemberData(row))
          .filter((member): member is Member => member !== null);
        resolve();
      },
      error: (error) => reject(error),
    });
  });
};

// Update the existing functions to use the `members` array
export const gymDataService = {
  getMembers: () => members,

  getMemberById: (id: number) => 
    members.find(member => member.id === id),
  
  getAggregatedStats: () => {
    const totalMembers = members.length;
    const avgWeight = Number((members.reduce((sum, member) => sum + member.weight, 0) / totalMembers).toFixed(1));
    const avgBmi = Number((members.reduce((sum, member) => sum + member.bmi, 0) / totalMembers).toFixed(1));
    const avgCaloriesBurned = Number((members.reduce((sum, member) => sum + member.caloriesBurned, 0) / totalMembers).toFixed(0));
    const avgVisitFrequency = Number((members.reduce((sum, member) => sum + member.visitFrequency, 0) / totalMembers).toFixed(1));
    
    // Count workout types
    const workoutTypeCounts: { [key: string]: number } = {};
    members.forEach(member => {
      workoutTypeCounts[member.workoutType] = (workoutTypeCounts[member.workoutType] || 0) + 1;
    });
    
    // Find most common workout type
    let mostCommonWorkoutType = '';
    let maxCount = 0;
    Object.entries(workoutTypeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        mostCommonWorkoutType = type;
        maxCount = count;
      }
    });
    
    return {
      totalMembers,
      avgWeight,
      avgBmi,
      avgCaloriesBurned,
      avgVisitFrequency,
      mostCommonWorkoutType
    };
  },
  
  getWorkoutTypeDistribution: () => {
    const distribution: { [key: string]: number } = {};
    
    members.forEach(member => {
      distribution[member.workoutType] = (distribution[member.workoutType] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  },
  
  getGenderDistribution: () => {
    const maleCount = members.filter(member => member.gender === 'Male').length;
    const femaleCount = members.filter(member => member.gender === 'Female').length;
    
    return [
      { name: 'Male', value: maleCount },
      { name: 'Female', value: femaleCount }
    ];
  },
  
  getAgeGroupDistribution: () => {
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0
    };
    
    members.forEach(member => {
      if (member.age >= 18 && member.age <= 25) ageGroups['18-25']++;
      else if (member.age >= 26 && member.age <= 35) ageGroups['26-35']++;
      else if (member.age >= 36 && member.age <= 45) ageGroups['36-45']++;
      else if (member.age >= 46 && member.age <= 55) ageGroups['46-55']++;
      else if (member.age >= 56) ageGroups['56+']++;
    });
    
    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  },
  
  getCaloriesByWorkoutType: () => {
    const caloriesByType: { [key: string]: { total: number, count: number } } = {};
    
    members.forEach(member => {
      if (!caloriesByType[member.workoutType]) {
        caloriesByType[member.workoutType] = { total: 0, count: 0 };
      }
      caloriesByType[member.workoutType].total += member.caloriesBurned;
      caloriesByType[member.workoutType].count += 1;
    });
    
    return Object.entries(caloriesByType).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count)
    }));
  },
  
  getBmiByAgeGroup: () => {
    const bmiByAge: { [key: string]: { total: number, count: number } } = {
      '18-25': { total: 0, count: 0 },
      '26-35': { total: 0, count: 0 },
      '36-45': { total: 0, count: 0 },
      '46-55': { total: 0, count: 0 },
      '56+': { total: 0, count: 0 }
    };
    
    members.forEach(member => {
      if (member.age >= 18 && member.age <= 25) {
        bmiByAge['18-25'].total += member.bmi;
        bmiByAge['18-25'].count++;
      } else if (member.age >= 26 && member.age <= 35) {
        bmiByAge['26-35'].total += member.bmi;
        bmiByAge['26-35'].count++;
      } else if (member.age >= 36 && member.age <= 45) {
        bmiByAge['36-45'].total += member.bmi;
        bmiByAge['36-45'].count++;
      } else if (member.age >= 46 && member.age <= 55) {
        bmiByAge['46-55'].total += member.bmi;
        bmiByAge['46-55'].count++;
      } else if (member.age >= 56) {
        bmiByAge['56+'].total += member.bmi;
        bmiByAge['56+'].count++;
      }
    });
    
    return Object.entries(bmiByAge)
      .filter(([_, data]) => data.count > 0) // Only include groups with members
      .map(([name, data]) => ({
        name,
        value: Number((data.total / data.count).toFixed(1))
      }));
  },
  
  // Generate mock progress data for member over time (last 6 months)
  getMemberProgress: (memberId: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const member = members.find(m => m.id === memberId);
    
    if (!member) return [];
    
    const startWeight = member.weight + random(5, 15); // Start with higher weight
    const startBmi = calculateBMI(startWeight, member.height);
    const startFat = member.fatPercentage + random(3, 8);
    
    return months.map((month, index) => {
      // Progress improves over time (weight/fat goes down, progress percentage goes up)
      const progressPercentage = (index / (months.length - 1));
      const weightReduction = progressPercentage * random(5, 15);
      const fatReduction = progressPercentage * random(3, 8);
      
      const currentWeight = startWeight - weightReduction;
      const currentBmi = calculateBMI(currentWeight, member.height);
      const currentFat = startFat - fatReduction;
      
      return {
        month,
        weight: Number(currentWeight.toFixed(1)),
        bmi: Number(currentBmi.toFixed(1)),
        fatPercentage: Number(currentFat.toFixed(1)),
        progress: Math.min(100, Math.round(progressPercentage * 100))
      };
    });
  },
  
  // For goal setting feature (mock)
  getMemberGoals: (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return [];
    
    // Generate random goals based on member data
    return [
      {
        id: 1,
        title: `Lose ${random(3, 10)} kg`,
        target: member.weight - random(3, 10),
        current: member.weight,
        unit: 'kg',
        progress: random(10, 95),
        type: 'weight'
      },
      {
        id: 2,
        title: `Reduce Body Fat to ${member.fatPercentage - random(2, 8)}%`,
        target: member.fatPercentage - random(2, 8),
        current: member.fatPercentage,
        unit: '%',
        progress: random(15, 90),
        type: 'fat'
      },
      {
        id: 3,
        title: `${random(3, 6)} Workouts Per Week`,
        target: random(3, 6),
        current: member.workoutFrequency,
        unit: 'sessions',
        progress: Math.round((member.workoutFrequency / random(3, 6)) * 100),
        type: 'frequency'
      },
      {
        id: 4,
        title: `Drink ${random(2, 4)} Liters of Water Daily`,
        target: random(2, 4),
        current: member.waterIntake,
        unit: 'liters',
        progress: Math.round((member.waterIntake / random(2, 4)) * 100),
        type: 'water'
      }
    ];
  }
};
