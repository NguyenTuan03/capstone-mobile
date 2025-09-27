// Session Block Types
export type SessionBlock = {
  id: string;
  coachId: string;
  title: string;
  description: string;
  totalSessions: number;
  skillLevelFrom: string; // Format: "1.0", "1.5", "2.0", etc.
  skillLevelTo: string; // Format: "1.0", "1.5", "2.0", etc.
  price: number;
  duration: number; // weeks
  deliveryMode: "online" | "offline";
  courtAddress?: string; // For offline sessions
  meetingLink?: string; // For online sessions
  sessions: SessionTemplate[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SessionTemplate = {
  id: string;
  blockId: string;
  sessionNumber: number;
  title: string;
  objectives: string[];
  duration: number; // minutes
  drills: DrillAssignment[];
  notes?: string;
  order: number;
};

export type DrillAssignment = {
  id: string;
  drillId: string;
  sessionTemplateId: string;
  order: number;
  duration: number;
  instructions?: string;
  isOptional: boolean;
};

export type StudentEnrollment = {
  id: string;
  studentId: string;
  sessionBlockId: string;
  coachId: string;
  startDate: string;
  endDate?: string;
  currentSession: number;
  completedSessions: number[];
  progress: number; // 0-1
  status: "active" | "completed" | "paused" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
};

export type SessionProgress = {
  id: string;
  enrollmentId: string;
  sessionNumber: number;
  completedDrills: string[];
  notes?: string;
  coachFeedback?: string;
  completedAt?: string;
  rating?: number;
};

// Existing Drill type (enhanced)
export type Drill = {
  id: string;
  title: string;
  skill:
    | "Dink"
    | "Serve"
    | "Return"
    | "3rd Shot"
    | "Volley"
    | "Lob"
    | "Strategy";
  level: "1.0-2.0" | "2.5-3.0" | "3.5-4.0" | "4.5+";
  duration: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  description?: string;
  instructions?: string[];
  equipment?: string[];
  videoUrl?: string;
  imageUrl?: string;
  isPublic: boolean;
  coachId: string;
  createdAt: string;
  updatedAt: string;
};

// Student type (enhanced)
export type Student = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  dupr: number;
  tags: string[];
  nextSession?: {
    dateISO: string;
    mode: "online" | "offline";
    place?: string;
  };
  progress: number;
  enrollments: StudentEnrollment[];
  createdAt: string;
  updatedAt: string;
};

// Filter and search types
export type SessionBlockFilter = {
  skillLevelFrom?: SessionBlock["skillLevelFrom"];
  skillLevelTo?: SessionBlock["skillLevelTo"];
  isActive?: boolean;
  priceRange?: [number, number];
  duration?: number;
};

export type StudentEnrollmentFilter = {
  status?: StudentEnrollment["status"];
  coachId?: string;
  sessionBlockId?: string;
};

// Form types
export type SessionBlockFormData = {
  title: string;
  description: string;
  totalSessions: number;
  skillLevelFrom: string;
  skillLevelTo: string;
  price: number;
  duration: number;
  deliveryMode: "online" | "offline";
  courtAddress?: string;
  meetingLink?: string;
};

export type SessionTemplateFormData = {
  title: string;
  objectives: string[];
  duration: number;
  notes?: string;
  drills?: any[];
  expanded?: boolean;
};

export type DrillAssignmentFormData = {
  drillId: string;
  duration: number;
  instructions?: string;
  isOptional: boolean;
  order: number;
};

// UI Component Props
export type SessionBlockCardProps = {
  block: SessionBlock;
  studentsEnrolled: number;
  onPress: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
};

export type SessionTemplateCardProps = {
  template: SessionTemplate;
  isCurrent?: boolean;
  isCompleted?: boolean;
  onPress: () => void;
  onEdit?: () => void;
};

export type DrillAssignmentCardProps = {
  assignment: DrillAssignment;
  drill: Drill;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
};

export type ProgressIndicatorProps = {
  progress: number;
  totalSessions: number;
  completedSessions: number;
  size?: "small" | "medium" | "large";
};

// Navigation and routing types
export type SessionBlockRouteParams = {
  id?: string;
};

export type EnrollmentRouteParams = {
  studentId: string;
  blockId?: string;
};

// API Response types
export type SessionBlockListResponse = {
  blocks: SessionBlock[];
  total: number;
  page: number;
  limit: number;
};

export type StudentEnrollmentResponse = {
  enrollment: StudentEnrollment;
  sessionBlock: SessionBlock;
  progress: SessionProgress[];
};

// Error types
export type SessionBlockError = {
  code: string;
  message: string;
  field?: string;
};

// Context types
export type SessionBlocksContextType = {
  sessionBlocks: SessionBlock[];
  loading: boolean;
  error: SessionBlockError | null;
  createSessionBlock: (data: SessionBlockFormData) => Promise<SessionBlock>;
  updateSessionBlock: (
    id: string,
    data: Partial<SessionBlockFormData>,
  ) => Promise<SessionBlock>;
  deleteSessionBlock: (id: string) => Promise<void>;
  duplicateSessionBlock: (id: string) => Promise<SessionBlock>;
  getSessionBlock: (id: string) => Promise<SessionBlock>;
  refreshSessionBlocks: () => Promise<void>;
};

export type StudentEnrollmentsContextType = {
  enrollments: StudentEnrollment[];
  loading: boolean;
  error: SessionBlockError | null;
  enrollStudent: (
    studentId: string,
    blockId: string,
    startDate: string,
  ) => Promise<StudentEnrollment>;
  updateEnrollment: (
    id: string,
    data: Partial<StudentEnrollment>,
  ) => Promise<StudentEnrollment>;
  getStudentEnrollments: (studentId: string) => Promise<StudentEnrollment[]>;
  getEnrollmentProgress: (enrollmentId: string) => Promise<SessionProgress[]>;
  markSessionComplete: (
    enrollmentId: string,
    sessionNumber: number,
    data: Partial<SessionProgress>,
  ) => Promise<SessionProgress>;
};
