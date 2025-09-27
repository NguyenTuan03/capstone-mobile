import {
  Drill,
  SessionBlock,
  SessionProgress,
  StudentEnrollment,
} from "@/types/sessionBlocks";

// Mock Drills
export const MOCK_DRILLS: Drill[] = [
  {
    id: "d1",
    title: "Kiểm soát & Tính nhất quán Dink",
    skill: "Dink",
    level: "2.5-3.0",
    duration: 10,
    intensity: 2,
    description: "Tập trung vào chạm nhẹ và kiểm soát ở khu vực bếp",
    instructions: [
      "Bắt đầu ở vạch bếp",
      "Cầm vợt nhẹ nhàng",
      "Giữ bóng dưới lưới",
      "Nhắm chéo sân một cách nhất quán",
    ],
    equipment: ["Paddle", "Balls"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d2",
    title: "Kỹ thuật Cú đánh thứ ba",
    skill: "3rd Shot",
    level: "3.5-4.0",
    duration: 15,
    intensity: 3,
    description: "Làm chủ cú đánh thứ ba từ vạch cuối sân",
    instructions: [
      "Bắt đầu ở vạch cuối sân",
      "Sử dụng cầm vợt continental",
      "Quỹ đạo cao",
      "Đóng vào khu vực bếp",
    ],
    equipment: ["Paddle", "Balls", "Cones"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d3",
    title: "Độ chính xác khi Giao bóng",
    skill: "Serve",
    level: "2.5-3.0",
    duration: 12,
    intensity: 3,
    description: "Cải thiện vị trí và tính nhất quán khi giao bóng",
    instructions: [
      "Độ cao ném bóng nhất quán",
      "Nhắm vào các khu vực cụ thể",
      "Quét vợt hoàn toàn",
      "Tập trung vào giao bóng sâu",
    ],
    equipment: ["Paddle", "Balls", "Target cones"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d4",
    title: "Luyện tập Volley ở lưới",
    skill: "Volley",
    level: "3.5-4.0",
    duration: 8,
    intensity: 4,
    description: "Phản xạ volley nhanh ở lưới",
    instructions: [
      "Ở gần lưới",
      "Vung vợt ngắn",
      "Vợt ở vị trí sẵn sàng",
      "Phản xạ tay nhanh",
    ],
    equipment: ["Paddle", "Balls"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d5",
    title: "Đón Giao bóng",
    skill: "Return",
    level: "2.5-3.0",
    duration: 10,
    intensity: 2,
    description: "Những cú đón giao bóng nhất quán và sâu",
    instructions: [
      "Vào tư thế sẵn sàng sớm",
      "Vung vợt ngắn",
      "Nhắm vào vị trí sâu",
      "Tấn công những giao bóng yếu",
    ],
    equipment: ["Paddle", "Balls"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d6",
    title: "Phòng thủ Lob",
    skill: "Lob",
    level: "3.5-4.0",
    duration: 8,
    intensity: 3,
    description: "Kỹ thuật lob phòng thủ và tấn công",
    instructions: [
      "Nhận biết cơ hội lob",
      "Quỹ đạo cao",
      "Đóng gần vạch cuối sân",
      "Phục hồi vị trí nhanh",
    ],
    equipment: ["Paddle", "Balls"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d7",
    title: "Chuyển giao Chiến thuật",
    skill: "Strategy",
    level: "4.5+",
    duration: 15,
    intensity: 4,
    description: "Di chuyển từ vạch cuối sân đến lưới một cách hiệu quả",
    instructions: [
      "Tiếp cận bằng cú đánh thứ ba",
      "Bước chân tại vạch bếp",
      "Vị trí ở lưới",
      "Giao tiếp với đồng đội",
    ],
    equipment: ["Paddle", "Balls"],
    isPublic: true,
    coachId: "c1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Session Blocks
export const MOCK_SESSION_BLOCKS: SessionBlock[] = [
  {
    id: "block1",
    coachId: "c1",
    title: "Cơ bản (1.0-2.0)",
    description:
      "Giới thiệu đầy đủ về pickleball, bao gồm tất cả các cú đánh và chiến lược cơ bản cho người chơi mới.",
    totalSessions: 8,
    skillLevelFrom: "1.0",
    skillLevelTo: "2.0",
    price: 4000000, // in VND
    duration: 4, // 4 weeks
    deliveryMode: "offline",
    courtAddress: "Sân thể thao ABC, 123 Main St",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      {
        id: "session1-1",
        blockId: "block1",
        sessionNumber: 1,
        title: "Giới thiệu & Kỹ thuật cơ bản",
        objectives: [
          "Học các cú đánh cơ bản",
          "Thành thạo các cú đánh dink cơ bản",
          "Hiểu rõ vị trí trên sân",
        ],
        duration: 60,
        order: 1,
        drills: [
          {
            id: "da1-1",
            drillId: "d1",
            sessionTemplateId: "session1-1",
            order: 1,
            duration: 10,
            isOptional: false,
          },
          {
            id: "da1-2",
            drillId: "d3",
            sessionTemplateId: "session1-1",
            order: 2,
            duration: 12,
            isOptional: false,
          },
        ],
        notes:
          "Tập trung vào việc giúp học viên thoải mái với việc cầm vợt cơ bản và di chuyển trên sân.",
      },
      {
        id: "session1-2",
        blockId: "block1",
        sessionNumber: 2,
        title: "Giao bóng cơ bản",
        objectives: [
          "Hiểu rõ kỹ thuật giao bóng",
          "Phát triển khả năng giao bóng chính xác",
          "Thực hành các tình huống giao bóng",
        ],
        duration: 60,
        order: 2,
        drills: [
          {
            id: "da2-1",
            drillId: "d3",
            sessionTemplateId: "session1-2",
            order: 1,
            duration: 12,
            isOptional: false,
          },
          {
            id: "da2-2",
            drillId: "d5",
            sessionTemplateId: "session1-2",
            order: 2,
            duration: 10,
            isOptional: false,
          },
        ],
        notes: "Emphasize consistency over power. Focus on proper technique.",
      },
    ],
  },
  {
    id: "block2",
    coachId: "c1",
    title: "Chiến thuật & Chiến lược (2.5-3.0)",
    description:
      "Nâng tầm trò chơi của bạn lên cấp độ tiếp theo với các chiến lược nâng cao, lựa chọn cú đánh và định vị trên sân.",
    totalSessions: 10,
    skillLevelFrom: "2.5",
    skillLevelTo: "3.0",
    price: 600,
    duration: 6, // 6 weeks
    deliveryMode: "offline",
    courtAddress: "Sports Center, 456 Oak Ave",
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      {
        id: "session2-1",
        blockId: "block2",
        sessionNumber: 1,
        title: "Làm chủ Cú đánh thứ ba",
        objectives: [
          "Hoàn thiện cú đánh thứ ba",
          "Học khi nào nên sử dụng drop",
          "Phát triển kỹ năng cảm giác bóng",
        ],
        duration: 75,
        order: 1,
        drills: [
          {
            id: "da3-1",
            drillId: "d2",
            sessionTemplateId: "session2-1",
            order: 1,
            duration: 15,
            isOptional: false,
          },
          {
            id: "da3-2",
            drillId: "d7",
            sessionTemplateId: "session2-1",
            order: 2,
            duration: 15,
            isOptional: false,
          },
        ],
        notes:
          "Đây là cú đánh quan trọng nhất trong pickleball hiện đại. Hãy làm chủ nó!",
      },
      {
        id: "session2-2",
        blockId: "block2",
        sessionNumber: 2,
        title: "Net Play & Volleys",
        objectives: [
          "Improve net positioning",
          "Develop soft hands",
          "Master the dink volley",
        ],
        duration: 75,
        order: 2,
        drills: [
          {
            id: "da4-1",
            drillId: "d4",
            sessionTemplateId: "session2-2",
            order: 1,
            duration: 8,
            isOptional: false,
          },
          {
            id: "da4-2",
            drillId: "d1",
            sessionTemplateId: "session2-2",
            order: 2,
            duration: 10,
            isOptional: false,
          },
        ],
        notes: "Control the kitchen and you control the point.",
      },
    ],
  },
  {
    id: "block3",
    coachId: "c1",
    title: "Strategy & Tactics (2.5-3.0)",
    description:
      "Take your game to the next level with advanced strategies, shot selection, and court positioning.",
    totalSessions: 10,
    skillLevelFrom: "2.5",
    skillLevelTo: "3.0",
    price: 6000000,
    duration: 6, // 6 weeks
    deliveryMode: "offline",
    courtAddress: "Sports Center, 456 Oak Ave",
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      {
        id: "session3-1",
        blockId: "block3",
        sessionNumber: 1,
        title: "Third Shot Drop Mastery",
        objectives: [
          "Perfect the third shot drop",
          "Learn when to use drops",
          "Develop touch and feel",
        ],
        duration: 75,
        order: 1,
        drills: [
          {
            id: "da6-1",
            drillId: "d2",
            sessionTemplateId: "session3-1",
            order: 1,
            duration: 15,
            isOptional: false,
          },
          {
            id: "da6-2",
            drillId: "d7",
            sessionTemplateId: "session3-1",
            order: 2,
            duration: 15,
            isOptional: false,
          },
        ],
        notes:
          "Đây là cú đánh quan trọng nhất trong pickleball hiện đại. Hãy làm chủ nó!",
      },
      {
        id: "session3-2",
        blockId: "block3",
        sessionNumber: 2,
        title: "Net Play & Volleys",
        objectives: [
          "Improve net positioning",
          "Develop soft hands",
          "Master the dink volley",
        ],
        duration: 75,
        order: 2,
        drills: [
          {
            id: "da7-1",
            drillId: "d4",
            sessionTemplateId: "session3-2",
            order: 1,
            duration: 8,
            isOptional: false,
          },
          {
            id: "da7-2",
            drillId: "d1",
            sessionTemplateId: "session3-2",
            order: 2,
            duration: 10,
            isOptional: false,
          },
        ],
        notes: "Control the kitchen and you control the point.",
      },
    ],
  },
  {
    id: "block4",
    coachId: "c1",
    title: "Tournament Preparation (4.0+)",
    description:
      "Elite-level training for competitive players preparing for tournaments. Advanced strategies and mental preparation.",
    totalSessions: 12,
    skillLevelFrom: "4.0",
    skillLevelTo: "4.5+",
    price: 9000000,
    duration: 8, // 8 weeks
    deliveryMode: "online",
    meetingLink: "https://zoom.us/j/example-meeting",
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      {
        id: "session3-1",
        blockId: "block3",
        sessionNumber: 1,
        title: "Advanced Shot Selection",
        objectives: [
          "Master shot selection under pressure",
          "Develop deceptive shots",
          "Learn advanced strategy patterns",
        ],
        duration: 90,
        order: 1,
        drills: [
          {
            id: "da5-1",
            drillId: "d7",
            sessionTemplateId: "session3-1",
            order: 1,
            duration: 15,
            isOptional: false,
          },
          {
            id: "da5-2",
            drillId: "d6",
            sessionTemplateId: "session3-1",
            order: 2,
            duration: 8,
            isOptional: false,
          },
        ],
        notes:
          "Tournament play requires shot selection beyond textbook answers.",
      },
    ],
  },
  // Coach 2 (Sophia Nguyen) Session Blocks
  {
    id: "block5",
    coachId: "c2",
    title: "Giao bóng & Đón giao bóng (2.5-3.5)",
    description: "Luyện tập toàn diện kỹ thuật giao bóng và đón giao bóng.",
    totalSessions: 6,
    skillLevelFrom: "2.5",
    skillLevelTo: "3.5",
    price: 300,
    duration: 3,
    deliveryMode: "offline",
    courtAddress: "Thu Duc City Sports Center",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      {
        id: "session5-1",
        blockId: "block5",
        sessionNumber: 1,
        title: "Giao bóng cơ bản",
        objectives: [
          "Hoàn thiện kỹ thuật giao bóng",
          "Phát triển độ nhất quán trong việc phát bóng",
          "Làm chủ các loại giao bóng khác nhau",
        ],
        duration: 60,
        order: 1,
        drills: [
          {
            id: "da8-1",
            drillId: "d3",
            sessionTemplateId: "session5-1",
            order: 1,
            duration: 15,
            isOptional: false,
          },
        ],
        notes: "Một cú giao bóng tuyệt vời bắt đầu mỗi điểm thành công.",
      },
    ],
  },
  // Coach 3 (Liam Tran) Session Blocks
  {
    id: "block6",
    coachId: "c3",
    title: "Chiến thuật đôi (3.0-4.0)",
    description: " Chiến thuật và giao tiếp nâng cao cho các đội đôi.",
    totalSessions: 8,
    skillLevelFrom: "3.0",
    skillLevelTo: "4.0",
    price: 450,
    duration: 4,
    deliveryMode: "offline",
    courtAddress: "Quan 7 Sports Complex",
    isActive: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      {
        id: "session6-1",
        blockId: "block6",
        sessionNumber: 1,
        title: "Vị trí & Giao tiếp đôi",
        objectives: [
          "Làm chủ vị trí trên sân",
          "Phát triển giao tiếp với đối tác",
          "Học các chiến lược chuyển đổi",
        ],
        duration: 75,
        order: 1,
        drills: [
          {
            id: "da9-1",
            drillId: "d1",
            sessionTemplateId: "session6-1",
            order: 1,
            duration: 15,
            isOptional: false,
          },
          {
            id: "da9-2",
            drillId: "d4",
            sessionTemplateId: "session6-1",
            order: 2,
            duration: 12,
            isOptional: false,
          },
        ],
        notes: "Các đội đôi xuất sắc giao tiếp mà không cần lời.",
      },
    ],
  },
];

// Mock Student Enrollments
export const MOCK_ENROLLMENTS: StudentEnrollment[] = [
  {
    id: "enroll1",
    studentId: "student1",
    sessionBlockId: "block1",
    coachId: "c1",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    currentSession: 3,
    completedSessions: [1, 2],
    progress: 0.25,
    status: "active",
    paymentStatus: "paid",
    totalPaid: 400,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "enroll2",
    studentId: "student2",
    sessionBlockId: "block3",
    coachId: "c1",
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    currentSession: 5,
    completedSessions: [1, 2, 3, 4],
    progress: 0.4,
    status: "active",
    paymentStatus: "paid",
    totalPaid: 600,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "enroll3",
    studentId: "student3",
    sessionBlockId: "block4",
    coachId: "c1",
    startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    currentSession: 8,
    completedSessions: [1, 2, 3, 4, 5, 6, 7],
    progress: 0.58,
    status: "active",
    paymentStatus: "paid",
    totalPaid: 900,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "enroll4",
    studentId: "student4",
    sessionBlockId: "block2",
    coachId: "c1",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    currentSession: 10,
    completedSessions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    progress: 1.0,
    status: "completed",
    paymentStatus: "paid",
    totalPaid: 600,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Session Progress
export const MOCK_SESSION_PROGRESS: SessionProgress[] = [
  {
    id: "progress1",
    enrollmentId: "enroll1",
    sessionNumber: 1,
    completedDrills: ["da1-1", "da1-2"],
    coachFeedback:
      "Tiến bộ vượt bậc trong các cú đánh cơ bản! Học viên thể hiện kỹ thuật tốt và nhiệt huyết.",
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
  },
  {
    id: "progress2",
    enrollmentId: "enroll1",
    sessionNumber: 2,
    completedDrills: ["da2-1", "da2-2"],
    coachFeedback:
      "Kỹ thuật giao bóng đang cải thiện tốt. Cần sự nhất quán hơn trong việc đón giao bóng.",
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
  },
];

// Utility functions
export const getSessionBlockById = (id: string): SessionBlock | undefined => {
  return MOCK_SESSION_BLOCKS.find((block) => block.id === id);
};

export const getDrillById = (id: string): Drill | undefined => {
  return MOCK_DRILLS.find((drill) => drill.id === id);
};

export const getEnrollmentsByStudent = (
  studentId: string,
): StudentEnrollment[] => {
  return MOCK_ENROLLMENTS.filter(
    (enrollment) => enrollment.studentId === studentId,
  );
};

export const getEnrollmentsByBlock = (blockId: string): StudentEnrollment[] => {
  return MOCK_ENROLLMENTS.filter(
    (enrollment) => enrollment.sessionBlockId === blockId,
  );
};

export const getProgressByEnrollment = (
  enrollmentId: string,
): SessionProgress[] => {
  return MOCK_SESSION_PROGRESS.filter(
    (progress) => progress.enrollmentId === enrollmentId,
  );
};

export const getStudentProgressInBlock = (
  studentId: string,
  blockId: string,
): SessionProgress[] => {
  const enrollment = MOCK_ENROLLMENTS.find(
    (e) => e.studentId === studentId && e.sessionBlockId === blockId,
  );
  if (!enrollment) return [];
  return MOCK_SESSION_PROGRESS.filter((p) => p.enrollmentId === enrollment.id);
};
