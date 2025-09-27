// Coach Profiles and Related Mock Data

export interface CoachProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  headline: string;
  location: string;
  specialties: string[];
  teachingStyle: string[];
  certifications: Certification[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  sessionPrice: number;
  isVerified: boolean;
  availability: AvailabilitySlot[];
  awards: Award[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  status: "pending" | "approved" | "rejected";
  statusReason?: string;
  type: "certification" | "license" | "diploma";
  description?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  category: string;
  description?: string;
  imageUrl?: string;
  achievementLevel: "local" | "regional" | "national" | "international";
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location: string;
  mode: "online" | "offline";
  isActive: boolean;
}

export interface SkillProgress {
  id: string;
  skillName: string;
  category: string;
  currentLevel: number; // 1-5 scale
  targetLevel: number;
  skillMilestone?: string; // current milestone for this specific skill
  progress?: number; // percentage progress toward next milestone (0-100)
  progressHistory: {
    date: string;
    level: number;
    progress?: number; // percentage progress at this point
    notes?: string;
    coachId?: string;
    sessionId?: string;
  }[];
  lastAssessed: string;
  nextMilestone?: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: "active" | "completed" | "paused";
  relatedSkills: string[];
  progress: number; // 0-100
}

export interface PerformanceMetric {
  id: string;
  metricName: string;
  category: string;
  value: number;
  unit: string;
  date: string;
  sessionId?: string;
  improvement: number; // percentage change from previous measurement
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  duprRating: number;
  skillLevel: string;
  preferredDays: string[];
  goals: string[];
  enrolledPrograms: Enrollment[];
  skillProgress: SkillProgress[];
  learningGoals: LearningGoal[];
  performanceMetrics: PerformanceMetric[];
  overallProgress: {
    totalSessions: number;
    completedHours: number;
    skillImprovement: number; // overall improvement percentage
    currentStreak: number; // consecutive sessions
    longestStreak: number;
    lastActive: string;
  };
}

export interface Enrollment {
  id: string;
  studentId: string;
  coachId: string;
  sessionBlockId: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "paused" | "cancelled";
  progress: number; // 0-1
  completedSessions: number[];
  nextSessionDate?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  totalAmount: number;
}

// Mock Coach Profiles
export const MOCK_COACHES: CoachProfile[] = [
  {
    id: "coach1",
    name: "David Nguyen",
    email: "david.nguyen@example.com",
    phone: "+84 123 456 789",
    avatar: "https://i.pravatar.cc/150?img=23",
    bio: "Professional pickleball coach with 8+ years of experience. Specialized in developing players from beginner to advanced levels. Focus on proper technique, strategy, and mental preparation.",
    headline: "Certified Pickleball Coach | Tournament Player",
    location: "Ho Chi Minh City, Vietnam",
    specialties: [
      "Beginner Development",
      "Strategy & Tactics",
      "Tournament Preparation",
    ],
    teachingStyle: ["Technical", "Strategic", "Mental Game"],
    certifications: [
      {
        id: "cert1",
        name: "Pickleball Coaching Certification",
        issuingOrganization: "USA Pickleball",
        issueDate: "2020-03-15",
        expiryDate: "2025-03-15",
        credentialUrl: "https://example.com/cert1",
        status: "approved",
        type: "certification",
        description:
          "Advanced coaching techniques and methodologies for competitive pickleball players",
      },
      {
        id: "cert2",
        name: "First Aid & CPR",
        issuingOrganization: "Red Cross",
        issueDate: "2021-06-10",
        expiryDate: "2024-06-10",
        credentialUrl: "https://example.com/cert2",
        status: "approved",
        type: "license",
        description: "Emergency response and life-saving certification",
      },
      {
        id: "cert3",
        name: "Sports Psychology Certificate",
        issuingOrganization: "ISSA",
        issueDate: "2022-09-01",
        status: "pending",
        statusReason: "Under review",
        type: "diploma",
        description:
          "Mental preparation and performance optimization techniques",
      },
    ],
    awards: [
      {
        id: "award1",
        title: "Coach of the Year",
        organization: "Vietnam Pickleball Association",
        year: 2023,
        category: "Excellence in Coaching",
        description:
          "Recognized for outstanding contribution to pickleball development in Vietnam",
        achievementLevel: "national",
      },
      {
        id: "award2",
        title: "Gold Medal Coach",
        organization: "Southeast Asian Pickleball Championship",
        year: 2022,
        category: "Senior Division",
        description:
          "Led team to gold medal victory in senior division championship",
        achievementLevel: "international",
      },
      {
        id: "award3",
        title: "Rising Star Coach",
        organization: "Ho Chi Minh City Sports Federation",
        year: 2021,
        category: "New Coach Excellence",
        description:
          "Recognition for exceptional performance in first year of professional coaching",
        achievementLevel: "regional",
      },
    ],
    experience: 8,
    rating: 4.8,
    reviewCount: 124,
    sessionPrice: 75,
    isVerified: true,
    availability: [
      {
        id: "slot1",
        dayOfWeek: "Monday",
        startTime: "07:00",
        endTime: "09:00",
        location: "Crescent Court, 123 Main St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot2",
        dayOfWeek: "Monday",
        startTime: "17:00",
        endTime: "21:00",
        location: "Crescent Court, 123 Main St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot3",
        dayOfWeek: "Wednesday",
        startTime: "07:00",
        endTime: "09:00",
        location: "Crescent Court, 123 Main St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot4",
        dayOfWeek: "Wednesday",
        startTime: "17:00",
        endTime: "21:00",
        location: "Crescent Court, 123 Main St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot5",
        dayOfWeek: "Friday",
        startTime: "07:00",
        endTime: "09:00",
        location: "Crescent Court, 123 Main St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot6",
        dayOfWeek: "Saturday",
        startTime: "08:00",
        endTime: "12:00",
        location: "Sports Center, 456 Oak Ave",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot7",
        dayOfWeek: "Sunday",
        startTime: "14:00",
        endTime: "18:00",
        location: "https://zoom.us/j/davidnguyen",
        mode: "online",
        isActive: true,
      },
    ],
    socialMedia: {
      instagram: "@davidpickleball",
      youtube: "@davidpickleballcoaching",
    },
  },
  {
    id: "coach2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+84 987 654 321",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Former professional tennis player turned pickleball specialist. Expert in shot mechanics, footwork, and competitive strategy. Trained multiple tournament winners.",
    headline: "Elite Performance Coach | Former Pro Tennis Player",
    location: "Hanoi, Vietnam",
    specialties: [
      "Advanced Technique",
      "Competitive Training",
      "Shot Mechanics",
    ],
    teachingStyle: ["Intensive", "Technical", "Performance-focused"],
    certifications: [
      {
        id: "cert4",
        name: "Elite Pickleball Coaching",
        issuingOrganization: "International Pickleball Federation",
        issueDate: "2019-01-20",
        expiryDate: "2024-01-20",
        status: "approved",
        type: "certification",
        description:
          "Highest level of pickleball coaching certification recognized internationally",
      },
      {
        id: "cert5",
        name: "Sports Science Diploma",
        issuingOrganization: "ISSA",
        issueDate: "2018-05-15",
        status: "approved",
        type: "diploma",
        description:
          "Comprehensive sports science and athlete performance optimization",
      },
    ],
    awards: [
      {
        id: "award4",
        title: "Tennis Grand Slam Participant",
        organization: "WTA Tour",
        year: 2015,
        category: "Professional Tennis",
        description:
          "Competed in multiple Grand Slam tournaments as professional tennis player",
        achievementLevel: "international",
      },
      {
        id: "award5",
        title: "Excellence in Sports Transition",
        organization: "Asian Sports Federation",
        year: 2020,
        category: "Career Transition",
        description:
          "Successful transition from professional tennis to elite pickleball coaching",
        achievementLevel: "international",
      },
      {
        id: "award6",
        title: "Top Performance Coach",
        organization: "Vietnam Tennis Association",
        year: 2019,
        category: "Coaching Excellence",
        description:
          "Recognized for producing national-level tennis competitors",
        achievementLevel: "national",
      },
    ],
    experience: 12,
    rating: 4.9,
    reviewCount: 89,
    sessionPrice: 100,
    isVerified: true,
    availability: [
      {
        id: "slot8",
        dayOfWeek: "Tuesday",
        startTime: "06:00",
        endTime: "10:00",
        location: "Tennis Club Hanoi, 789 Sport St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot9",
        dayOfWeek: "Thursday",
        startTime: "06:00",
        endTime: "10:00",
        location: "Tennis Club Hanoi, 789 Sport St",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot10",
        dayOfWeek: "Saturday",
        startTime: "14:00",
        endTime: "18:00",
        location: "Tennis Club Hanoi, 789 Sport St",
        mode: "offline",
        isActive: true,
      },
    ],
  },
  {
    id: "coach3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+84 555 123 456",
    avatar: "https://i.pravatar.cc/150?img=67",
    bio: "Doubles specialist and tactical expert. Focus on team dynamics, communication, and strategic positioning. Perfect for players looking to improve their doubles game.",
    headline: "Doubles Strategy Specialist | Team Building Expert",
    location: "Da Nang, Vietnam",
    specialties: ["Doubles Strategy", "Team Dynamics", "Communication"],
    teachingStyle: ["Collaborative", "Strategic", "Game-based"],
    certifications: [
      {
        id: "cert6",
        name: "Doubles Coaching Certification",
        issuingOrganization: "USA Pickleball",
        issueDate: "2021-08-10",
        status: "approved",
        type: "certification",
        description:
          "Specialized certification for coaching doubles strategy and team dynamics",
      },
      {
        id: "cert7",
        name: "Team Building Coach",
        issuingOrganization: "Sports Psychology Institute",
        issueDate: "2020-11-05",
        status: "approved",
        type: "certification",
        description:
          "Advanced techniques in team building and communication optimization",
      },
    ],
    awards: [
      {
        id: "award7",
        title: "Doubles Strategy Innovation Award",
        organization: "International Pickleball Coaches Association",
        year: 2023,
        category: "Coaching Innovation",
        description:
          "Pioneered new doubles strategy techniques now adopted by coaches nationwide",
        achievementLevel: "international",
      },
      {
        id: "award8",
        title: "Community Impact Award",
        organization: "Da Nang Sports Federation",
        year: 2022,
        category: "Community Service",
        description:
          "Recognized for extensive volunteer work promoting pickleball in local communities",
        achievementLevel: "regional",
      },
      {
        id: "award9",
        title: "Rising Coaching Talent",
        organization: "Vietnam Pickleball Association",
        year: 2021,
        category: "New Coach Recognition",
        description:
          "Fastest-growing new coach with exceptional student success rates",
        achievementLevel: "national",
      },
    ],
    experience: 6,
    rating: 4.7,
    reviewCount: 67,
    sessionPrice: 85,
    isVerified: false,
    availability: [
      {
        id: "slot11",
        dayOfWeek: "Monday",
        startTime: "18:00",
        endTime: "22:00",
        location: "Da Nang Sports Center, 333 Beach Rd",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot12",
        dayOfWeek: "Wednesday",
        startTime: "18:00",
        endTime: "22:00",
        location: "Da Nang Sports Center, 333 Beach Rd",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot13",
        dayOfWeek: "Friday",
        startTime: "18:00",
        endTime: "22:00",
        location: "Da Nang Sports Center, 333 Beach Rd",
        mode: "offline",
        isActive: true,
      },
      {
        id: "slot14",
        dayOfWeek: "Sunday",
        startTime: "09:00",
        endTime: "13:00",
        location: "https://zoom.us/j/michaelchen",
        mode: "online",
        isActive: true,
      },
    ],
  },
];

// Mock Student Profiles
export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: "student1",
    name: "Alex Tran",
    email: "alex.tran@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    duprRating: 2.5,
    skillLevel: "Beginner",
    preferredDays: ["Monday", "Wednesday", "Saturday"],
    goals: [
      "Improve basic technique",
      "Learn proper serving",
      "Understand court positioning",
    ],
    enrolledPrograms: [],
    skillProgress: [
      {
        id: "skill_s1_1",
        skillName: "Serve",
        category: "technical",
        currentLevel: 2,
        targetLevel: 3,
        lastAssessed: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        nextMilestone: "Consistent serve placement",
        progressHistory: [
          {
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            level: 1,
            notes: "Learning basic serve technique",
            coachId: "coach1",
          },
          {
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            level: 1,
            notes: "Improving consistency",
            coachId: "coach1",
          },
          {
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            level: 2,
            notes: "Good progress on serve consistency",
            coachId: "coach1",
          },
        ],
      },
      {
        id: "skill_s1_2",
        skillName: "Dink",
        category: "technical",
        currentLevel: 1,
        targetLevel: 3,
        lastAssessed: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        nextMilestone: "Basic dink control",
        progressHistory: [
          {
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            level: 1,
            notes: "Introduced to dinking",
            coachId: "coach1",
          },
        ],
      },
    ],
    learningGoals: [
      {
        id: "goal_s1_1",
        title: "Reach 3.0 DUPR Rating",
        description: "Improve overall skills to achieve 3.0 DUPR rating",
        targetDate: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: "active",
        relatedSkills: ["Serve", "Dink", "Court Positioning"],
        progress: 35,
      },
      {
        id: "goal_s1_2",
        title: "Learn Basic Strategies",
        description: "Understand and implement basic pickleball strategies",
        targetDate: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: "active",
        relatedSkills: ["Court Positioning", "Shot Selection"],
        progress: 20,
      },
    ],
    performanceMetrics: [
      {
        id: "metric_s1_1",
        metricName: "Serve Consistency",
        category: "technical",
        value: 65,
        unit: "%",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        improvement: 25,
      },
      {
        id: "metric_s1_2",
        metricName: "Practice Session Attendance",
        category: "general",
        value: 85,
        unit: "%",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        improvement: 15,
      },
    ],
    overallProgress: {
      totalSessions: 24,
      completedHours: 36,
      skillImprovement: 40,
      currentStreak: 3,
      longestStreak: 8,
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "student2",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    duprRating: 3.5,
    skillLevel: "Intermediate",
    preferredDays: ["Tuesday", "Thursday", "Sunday"],
    goals: [
      "Develop third shot drop",
      "Improve volley technique",
      "Tournament preparation",
    ],
    enrolledPrograms: [],
    skillProgress: [],
    learningGoals: [],
    performanceMetrics: [],
    overallProgress: {
      totalSessions: 0,
      completedHours: 0,
      skillImprovement: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActive: "",
    },
  },
  {
    id: "student3",
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    duprRating: 4.0,
    skillLevel: "Advanced",
    preferredDays: ["Friday", "Saturday"],
    goals: [
      "Advanced strategy",
      "Tournament preparation",
      "Mental game improvement",
    ],
    enrolledPrograms: [],
    skillProgress: [],
    learningGoals: [],
    performanceMetrics: [],
    overallProgress: {
      totalSessions: 0,
      completedHours: 0,
      skillImprovement: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActive: "",
    },
  },
  {
    id: "student4",
    name: "Lisa Park",
    email: "lisa.park@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    duprRating: 1.0,
    skillLevel: "Beginner",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    goals: [
      "Learn basic rules",
      "Proper grip technique",
      "Have fun while learning",
    ],
    enrolledPrograms: [],
    skillProgress: [],
    learningGoals: [],
    performanceMetrics: [],
    overallProgress: {
      totalSessions: 0,
      completedHours: 0,
      skillImprovement: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActive: "",
    },
  },
];

// Mock Reviews
export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  coachId: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  sessionType: "single" | "block";
  helpfulCount: number;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: "review1",
    studentId: "student1",
    studentName: "Alex Tran",
    coachId: "coach1",
    rating: 5,
    comment:
      "David is an amazing coach! His patience and clear explanations helped me improve my serve dramatically. The fundamentals he taught are priceless.",
    date: "2024-01-15",
    sessionType: "block",
    helpfulCount: 12,
  },
  {
    id: "review2",
    studentId: "student2",
    studentName: "Maria Garcia",
    coachId: "coach1",
    rating: 4,
    comment:
      "Great coaching style. David focuses on proper technique and provides excellent feedback. Would recommend to anyone looking to improve their game.",
    date: "2024-01-10",
    sessionType: "single",
    helpfulCount: 8,
  },
  {
    id: "review3",
    studentId: "student3",
    studentName: "James Wilson",
    coachId: "coach2",
    rating: 5,
    comment:
      "Sarah's competitive background really shows in her coaching. She pushes you to your limits while maintaining proper form. Excellent for serious players.",
    date: "2024-01-08",
    sessionType: "block",
    helpfulCount: 15,
  },
  {
    id: "review4",
    studentId: "student4",
    studentName: "Lisa Park",
    coachId: "coach3",
    rating: 5,
    comment:
      "Michael made learning doubles strategy so much fun! His team-building exercises really improved our communication on court.",
    date: "2024-01-05",
    sessionType: "single",
    helpfulCount: 6,
  },
];

// Utility functions
export const getCoachById = (id: string): CoachProfile | undefined => {
  return MOCK_COACHES.find((coach) => coach.id === id);
};

export const getStudentById = (id: string): StudentProfile | undefined => {
  return MOCK_STUDENTS.find((student) => student.id === id);
};

export const getCoachAvailability = (coachId: string): AvailabilitySlot[] => {
  const coach = getCoachById(coachId);
  return coach ? coach.availability.filter((slot) => slot.isActive) : [];
};

export const getCoachReviews = (coachId: string): Review[] => {
  return MOCK_REVIEWS.filter((review) => review.coachId === coachId);
};

export const getCoachesByLocation = (location: string): CoachProfile[] => {
  return MOCK_COACHES.filter((coach) =>
    coach.location.toLowerCase().includes(location.toLowerCase()),
  );
};

export const getCoachesBySpecialty = (specialty: string): CoachProfile[] => {
  return MOCK_COACHES.filter((coach) =>
    coach.specialties.some((s) =>
      s.toLowerCase().includes(specialty.toLowerCase()),
    ),
  );
};

export const getCoachesByPriceRange = (
  minPrice: number,
  maxPrice: number,
): CoachProfile[] => {
  return MOCK_COACHES.filter(
    (coach) => coach.sessionPrice >= minPrice && coach.sessionPrice <= maxPrice,
  );
};

export const getAvailableTimeSlots = (
  coachId: string,
  dayOfWeek: string,
): string[] => {
  const availability = getCoachAvailability(coachId);
  const daySlots = availability.filter((slot) => slot.dayOfWeek === dayOfWeek);

  const timeSlots: string[] = [];
  daySlots.forEach((slot) => {
    const startHour = parseInt(slot.startTime.split(":")[0]);
    const endHour = parseInt(slot.endTime.split(":")[0]);

    // Generate 30-minute intervals
    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  });

  return timeSlots;
};
