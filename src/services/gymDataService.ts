
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

// Generate mock members data
const generateMembers = (count: number): Member[] => {
  const members: Member[] = [];

  const maleFirstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"];
  const femaleFirstNames = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];

  for (let i = 1; i <= count; i++) {
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const firstName = gender === 'Male' 
      ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
      : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const age = random(18, 65);
    const weight = random(50, 120);
    const height = random(150, 200);
    const bmi = calculateBMI(weight, height);
    const workoutFrequency = random(1, 7);
    
    members.push({
      id: i,
      name: `${firstName} ${lastName}`,
      age,
      gender,
      weight,
      height,
      bmi,
      membershipType: randomMembershipType(),
      visitFrequency: random(1, 7),
      caloriesBurned: random(100, 1000),
      workoutType: randomWorkoutType(),
      waterIntake: random(1, 5),
      restingBPM: random(50, 90),
      maxBPM: random(120, 180),
      avgBPM: random(70, 110),
      fatPercentage: random(10, 35),
      workoutFrequency,
      joinDate: randomDate()
    });
  }

  return members;
};

// Mock data service
const mockMembers = generateMembers(50);

export const gymDataService = {
  getMembers: () => mockMembers,
  
  getMemberById: (id: number) => 
    mockMembers.find(member => member.id === id),
  
  getAggregatedStats: () => {
    const totalMembers = mockMembers.length;
    const avgWeight = Number((mockMembers.reduce((sum, member) => sum + member.weight, 0) / totalMembers).toFixed(1));
    const avgBmi = Number((mockMembers.reduce((sum, member) => sum + member.bmi, 0) / totalMembers).toFixed(1));
    const avgCaloriesBurned = Number((mockMembers.reduce((sum, member) => sum + member.caloriesBurned, 0) / totalMembers).toFixed(0));
    const avgVisitFrequency = Number((mockMembers.reduce((sum, member) => sum + member.visitFrequency, 0) / totalMembers).toFixed(1));
    
    // Count workout types
    const workoutTypeCounts: { [key: string]: number } = {};
    mockMembers.forEach(member => {
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
    
    mockMembers.forEach(member => {
      distribution[member.workoutType] = (distribution[member.workoutType] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  },
  
  getGenderDistribution: () => {
    const maleCount = mockMembers.filter(member => member.gender === 'Male').length;
    const femaleCount = mockMembers.filter(member => member.gender === 'Female').length;
    
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
    
    mockMembers.forEach(member => {
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
    
    mockMembers.forEach(member => {
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
    
    mockMembers.forEach(member => {
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
    const member = mockMembers.find(m => m.id === memberId);
    
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
    const member = mockMembers.find(m => m.id === memberId);
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
