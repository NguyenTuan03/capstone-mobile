import {
  LearningGoal,
  MOCK_STUDENTS,
  PerformanceMetric,
  SkillProgress,
  StudentProfile,
} from "@/mocks/coaches";
import {
  getGoalProgressSummary,
  getRecentProgress,
  getSkillProgressSummary,
  MOCK_LEARNING_GOALS,
  MOCK_PERFORMANCE_METRICS,
  MOCK_SKILL_PROGRESS,
  PICKLEBALL_SKILLS,
  PROGRESSION_MILESTONES,
  SKILL_LEVELS,
} from "@/mocks/skillTracking";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Type definitions
export type {
  LearningGoal,
  PerformanceMetric,
  SkillProgress,
  StudentProfile,
} from "@/mocks/coaches";

interface SkillTrackingContextType {
  // Current student data
  currentStudent: StudentProfile | null;
  setCurrentStudent: (studentId: string) => void;

  // Skill progress
  skills: SkillProgress[];
  updateSkillProgress: (
    skillId: string,
    newLevel: number,
    notes?: string,
    coachId?: string,
  ) => void;
  addSkillAssessment: (
    skillId: string,
    level: number,
    notes?: string,
    coachId?: string,
  ) => void;

  // Learning goals
  goals: LearningGoal[];
  addGoal: (goal: Omit<LearningGoal, "id">) => string;
  updateGoalProgress: (goalId: string, progress: number) => void;
  completeGoal: (goalId: string) => void;

  // Performance metrics
  metrics: PerformanceMetric[];
  addMetric: (metric: Omit<PerformanceMetric, "id">) => string;

  // Analytics and summaries
  skillSummary: ReturnType<typeof getSkillProgressSummary>;
  goalSummary: ReturnType<typeof getGoalProgressSummary>;
  recentProgress: ReturnType<typeof getRecentProgress>;
  skillsByCategory: Record<string, SkillProgress[]>;
  currentMilestone: string;
  nextMilestone: string | null;
  milestoneProgress: number;

  // Skill library
  skillCategories: typeof PICKLEBALL_SKILLS;
  skillLevels: typeof SKILL_LEVELS;
  progressionMilestones: typeof PROGRESSION_MILESTONES;
}

const SkillTrackingContext = createContext<SkillTrackingContextType | null>(
  null,
);

export const SkillTrackingProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [currentStudentId, setCurrentStudentId] = useState<string>("student1");

  // Mock data for development
  const [skills, setSkills] = useState<SkillProgress[]>(MOCK_SKILL_PROGRESS);
  const [goals, setGoals] = useState<LearningGoal[]>(MOCK_LEARNING_GOALS);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(
    MOCK_PERFORMANCE_METRICS,
  );

  // Set current student
  const currentStudent = useMemo(
    () =>
      MOCK_STUDENTS.find((student) => student.id === currentStudentId) || null,
    [currentStudentId],
  );

  const setCurrentStudent = useCallback((studentId: string) => {
    setCurrentStudentId(studentId);
  }, []);

  // Update skill progress
  const updateSkillProgress = useCallback(
    (skillId: string, newLevel: number, notes?: string, coachId?: string) => {
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === skillId
            ? {
                ...skill,
                currentLevel: newLevel,
                lastAssessed: new Date().toISOString(),
                progressHistory: [
                  ...skill.progressHistory,
                  {
                    date: new Date().toISOString(),
                    level: newLevel,
                    notes,
                    coachId,
                  },
                ],
              }
            : skill,
        ),
      );
    },
    [],
  );

  // Add skill assessment
  const addSkillAssessment = useCallback(
    (skillId: string, level: number, notes?: string, coachId?: string) => {
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === skillId
            ? {
                ...skill,
                currentLevel: level,
                lastAssessed: new Date().toISOString(),
                progressHistory: [
                  ...skill.progressHistory,
                  {
                    date: new Date().toISOString(),
                    level,
                    notes,
                    coachId,
                  },
                ],
              }
            : skill,
        ),
      );
    },
    [],
  );

  // Goal management
  const addGoal = useCallback((goal: Omit<LearningGoal, "id">) => {
    const id = `goal_${Date.now()}`;
    const newGoal: LearningGoal = { id, ...goal };
    setGoals((prev) => [...prev, newGoal]);
    return id;
  }, []);

  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              progress: Math.min(100, Math.max(0, progress)),
              status: progress >= 100 ? "completed" : goal.status,
            }
          : goal,
      ),
    );
  }, []);

  const completeGoal = useCallback((goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, progress: 100, status: "completed" as const }
          : goal,
      ),
    );
  }, []);

  // Performance metrics
  const addMetric = useCallback((metric: Omit<PerformanceMetric, "id">) => {
    const id = `metric_${Date.now()}`;
    const newMetric: PerformanceMetric = { id, ...metric };
    setMetrics((prev) => [...prev, newMetric]);
    return id;
  }, []);

  // Analytics and summaries
  const skillSummary = useMemo(() => getSkillProgressSummary(skills), [skills]);

  const goalSummary = useMemo(() => getGoalProgressSummary(goals), [goals]);

  const recentProgress = useMemo(() => getRecentProgress(skills, 30), [skills]);

  const skillsByCategory = useMemo(() => {
    const categorized: Record<string, SkillProgress[]> = {};
    Object.keys(PICKLEBALL_SKILLS).forEach((category) => {
      categorized[category] = skills.filter(
        (skill) => skill.category === category,
      );
    });
    return categorized;
  }, [skills]);

  // Progression milestones - use from summary instead of calculating separately
  const currentMilestone = skillSummary.currentMilestone || "1.0";
  const nextMilestone = skillSummary.nextMilestone || "1.5";

  const milestoneProgress = useMemo(() => {
    const overallProgress = skillSummary.overallProgress || 0;
    if (currentMilestone === "1.0") return Math.min(50, overallProgress); // 0-50% for 1.0 milestone
    if (currentMilestone === "1.5")
      return Math.min(100, Math.max(0, overallProgress - 50)); // 50-100% for 1.5 milestone
    if (currentMilestone === "2.0") return 100;
    return 0;
  }, [skillSummary.overallProgress, currentMilestone]);

  const value: SkillTrackingContextType = {
    currentStudent,
    setCurrentStudent,
    skills,
    updateSkillProgress,
    addSkillAssessment,
    goals,
    addGoal,
    updateGoalProgress,
    completeGoal,
    metrics,
    addMetric,
    skillSummary,
    goalSummary,
    recentProgress,
    skillsByCategory,
    currentMilestone,
    nextMilestone,
    milestoneProgress,
    skillCategories: PICKLEBALL_SKILLS,
    skillLevels: SKILL_LEVELS,
    progressionMilestones: PROGRESSION_MILESTONES,
  };

  return (
    <SkillTrackingContext.Provider value={value}>
      {children}
    </SkillTrackingContext.Provider>
  );
};

export const useSkillTracking = () => {
  const ctx = useContext(SkillTrackingContext);
  if (!ctx) {
    throw new Error(
      "useSkillTracking must be used within SkillTrackingProvider",
    );
  }
  return ctx;
};
