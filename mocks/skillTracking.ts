import {
  LearningGoal,
  PerformanceMetric,
  SkillProgress,
} from "@/mocks/coaches";

// Pickleball Roadmap Skills (matching the roadmap structure)
export const PICKLEBALL_SKILLS = {
  on_paddle: ["Phát bóng", "Đón bóng", "Bóng dink", "Cú thứ ba"],
  off_paddle: ["Vị trí sân", "Chuyển động chân", "Chiến thuật", "Giao tiếp"],
};

// Skill Level Descriptions (1.0 to 5.0 scale)
export const SKILL_LEVELS = {
  "1.0": {
    name: "Người mới bắt đầu",
    description: "Bắt đầu học những kỹ năng cơ bản",
  },
  "1.5": {
    name: "Người mới có kinh nghiệm",
    description: "Học kỹ năng cơ bản với hướng dẫn",
  },
  "2.0": {
    name: "Người mới tập",
    description: "Có thể thực hiện kỹ năng cơ bản với độ ổn định nhất định",
  },
  "2.5": {
    name: "Trung cấp cơ bản",
    description: "Phát triển độ ổn định trong kỹ năng cơ bản",
  },
  "3.0": {
    name: "Trung cấp",
    description: "Nền tảng vững chắc, phát triển kỹ năng nâng cao",
  },
  "3.5": {
    name: "Trung cấp cao",
    description: "Kỹ thuật tốt, cải thiện chiến thuật",
  },
  "4.0": {
    name: "Nâng cao",
    description: "Kỹ thuật xuất sắc, chơi chiến thuật",
  },
  "4.5": {
    name: "Chuyên gia",
    description: "Gần như hoàn thiện, trình độ thi đấu",
  },
  "5.0": {
    name: "Bậc thầy",
    description: "Hoàn toàn thành thạo tất cả kỹ năng",
  },
};

// Progression milestones from 1.0 to 2.0 (matching roadmap skills)
export const PROGRESSION_MILESTONES = {
  "1.0": {
    title: "Bắt đầu",
    description:
      "Chào mừng đến với hành trình pickleball của bạn! Bạn đang học các kỹ năng nền tảng.",
    skills: [
      "Phát bóng cơ bản",
      "Đón bóng đơn giản",
      "Giới thiệu bóng dink",
      "Cú thứ ba cơ bản",
    ],
    nextMilestone: "1.5",
  },
  "1.5": {
    title: "Xây dựng nền tảng",
    description:
      "Bạn đang phát triển độ ổn định trong các kỹ năng cốt lõi và hiểu chiến thuật cơ bản.",
    skills: [
      "Phát bóng ổn định",
      "Đón bóng đáng tin cậy",
      "Bóng dink có kiểm soát",
      "Cú thứ ba rơi",
    ],
    nextMilestone: "2.0",
  },
  "2.0": {
    title: "Tích hợp kỹ năng",
    description:
      "Tuyệt vời! Bây giờ bạn có thể tích hợp bốn kỹ năng cốt lõi và chơi với chiến thuật cơ bản.",
    skills: [
      "Phát bóng chiến thuật",
      "Đón bóng nâng cao",
      "Biến thể bóng dink",
      "Thành thạo cú thứ ba",
    ],
    nextMilestone: "2.5",
  },
};

// Mock Skill Progress Data (matching roadmap skills)
export const MOCK_SKILL_PROGRESS: SkillProgress[] = [
  // On-Paddle Skills
  {
    id: "skill_1",
    skillName: "Phát bóng",
    category: "on_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 30, // 30% complete
    lastAssessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Học kỹ thuật phát bóng cơ bản",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 15,
        notes: "Cải thiện dáng phát bóng, tập trung vào độ ổn định",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 30,
        notes: "Độ ổn định phát bóng đang tốt lên",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  {
    id: "skill_2",
    skillName: "Đón bóng",
    category: "on_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 20, // 20% complete
    lastAssessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Học kỹ thuật đón bóng cơ bản",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 10,
        notes: "Luyện tập kỹ thuật đón bóng",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 20,
        notes: "Đón bóng tốt hơn về vị trí và độ sâu",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  {
    id: "skill_3",
    skillName: "Bóng dink",
    category: "on_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 40, // 40% complete
    lastAssessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Giới thiệu khái niệm bóng dink",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 20,
        notes: "Luyện tập kỹ thuật bóng dink",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 40,
        notes: "Kiểm soát và độ ổn định bóng dink tốt",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  {
    id: "skill_4",
    skillName: "Cú thứ ba",
    category: "on_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 10, // 10% complete
    lastAssessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Learning third shot concept",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 10,
        notes: "Practicing third shot drop",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  // Off-Paddle Skills
  {
    id: "skill_5",
    skillName: "Vị trí sân",
    category: "off_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 35, // 35% complete
    lastAssessed: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Học vị trí sân cơ bản",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 15,
        notes: "Hiểu cơ bản về vị trí",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 35,
        notes: "Nhận thức sân tốt hơn",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  {
    id: "skill_6",
    skillName: "Chuyển động chân",
    category: "off_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 25, // 25% complete
    lastAssessed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Học chuyển động chân cơ bản",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 10,
        notes: "Cải thiện mẫu chuyển động",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 25,
        notes: "Cân bằng và phối hợp tốt hơn",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  {
    id: "skill_7",
    skillName: "Chiến thuật",
    category: "off_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 15, // 15% complete
    lastAssessed: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Giới thiệu về chiến thuật trò chơi",
        coachId: "coach1",
        level: 0,
      },
      {
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 15,
        notes: "Học chiến thuật cơ bản",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
  {
    id: "skill_8",
    skillName: "Giao tiếp",
    category: "off_paddle",
    currentLevel: 1.0,
    targetLevel: 2.0,
    progress: 5, // 5% complete
    lastAssessed: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: "1.5 - Building Foundation",
    progressHistory: [
      {
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        notes: "Học giao tiếp cơ bản",
        coachId: "coach1",
        level: 0,
      },
    ],
  },
];

// Mock Learning Goals (1.0 to 2.0 progression)
export const MOCK_LEARNING_GOALS: LearningGoal[] = [
  {
    id: "goal_1",
    title: "Reach 2.0 Skill Level",
    description:
      "Progress from beginner (1.0) to novice (2.0) level within 3 months",
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    relatedSkills: ["Serve", "Dink", "Third Shot Drop", "Volley"],
    progress: 25,
  },
  {
    id: "goal_2",
    title: "Master Basic Serve",
    description: "Achieve 60% serve consistency with proper technique",
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    relatedSkills: ["Serve"],
    progress: 40,
  },
  {
    id: "goal_3",
    title: "Develop Consistent Dink",
    description:
      "Maintain dink rallies at the kitchen line with proper control",
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    relatedSkills: ["Dink"],
    progress: 30,
  },
  {
    id: "goal_4",
    title: "Learn Court Positioning",
    description: "Understand and apply basic court positioning strategies",
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    relatedSkills: ["Court Positioning"],
    progress: 100,
  },
];

// Mock Performance Metrics (1.0 to 2.0 level)
export const MOCK_PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: "metric_1",
    metricName: "Serve Accuracy",
    category: "technical",
    value: 42,
    unit: "%",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    improvement: 8,
  },
  {
    id: "metric_2",
    metricName: "Basic Dink Success",
    category: "technical",
    value: 35,
    unit: "%",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    improvement: 12,
  },
  {
    id: "metric_3",
    metricName: "Court Position Score",
    category: "tactical",
    value: 6.5,
    unit: "/10",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    improvement: 15,
  },
  {
    id: "metric_4",
    metricName: "Practice Consistency",
    category: "physical",
    value: 3,
    unit: "sessions/week",
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    improvement: 50,
  },
  {
    id: "metric_5",
    metricName: "Skill Retention",
    category: "mental",
    value: 72,
    unit: "%",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    improvement: 20,
  },
];

// Utility Functions
export const getSkillProgressSummary = (skills: SkillProgress[]) => {
  const totalSkills = skills.length;
  const skillsAtTarget = skills.filter(
    (skill) => (skill.progress || 0) >= 100,
  ).length;

  // Calculate overall progress as average of all skill progress percentages
  const overallProgress = Math.round(
    skills.reduce((sum, skill) => sum + (skill.progress || 0), 0) / totalSkills,
  );

  // Determine current milestone based on overall progress
  let currentMilestone = "1.0";
  let currentLevel = 1.0;
  let nextMilestone = "1.5";

  if (overallProgress >= 100) {
    currentMilestone = "2.0";
    currentLevel = 2.0;
    nextMilestone = "Completed";
  } else if (overallProgress >= 50) {
    currentMilestone = "1.5";
    currentLevel = 1.5;
    nextMilestone = "2.0";
  }

  return {
    totalSkills,
    skillsAtTarget,
    skillsInProgress: totalSkills - skillsAtTarget,
    averageLevel: currentLevel,
    overallProgress: Math.max(0, Math.min(100, overallProgress)),
    currentMilestone,
    nextMilestone,
  };
};

export const getRecentProgress = (
  skills: SkillProgress[],
  days: number = 30,
) => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentProgress: any[] = [];

  skills.forEach((skill) => {
    const recentHistory = skill.progressHistory.filter(
      (entry) => new Date(entry.date) >= cutoffDate,
    );

    if (recentHistory.length > 0) {
      const latestEntry = recentHistory[recentHistory.length - 1];
      const previousEntry = recentHistory[0];

      if ((latestEntry.progress || 0) > (previousEntry.progress || 0)) {
        recentProgress.push({
          skillName: skill.skillName,
          improvement:
            (latestEntry.progress || 0) - (previousEntry.progress || 0),
          date: latestEntry.date,
          notes: latestEntry.notes,
        });
      }
    }
  });

  return recentProgress.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

export const getGoalProgressSummary = (goals: LearningGoal[]) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(
    (goal) => goal.status === "completed",
  ).length;
  const activeGoals = goals.filter((goal) => goal.status === "active").length;
  const averageProgress =
    goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals;

  return {
    totalGoals,
    completedGoals,
    activeGoals,
    averageProgress: Math.round(averageProgress),
  };
};

export const getCurrentProgressionMilestone = (averageProgress: number) => {
  if (averageProgress >= 100) return "2.0";
  if (averageProgress >= 50) return "1.5";
  return "1.0";
};
