// app/context/booking.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MOCK_SESSION_BLOCKS, MOCK_ENROLLMENTS } from "@/mocks/sessionBlocks";
import { MOCK_COACHES } from "@/mocks/coaches";

export type SessionMode = "online" | "offline";
export type SessionStatus = "upcoming" | "completed" | "canceled";
export type EnrollmentStatus = "active" | "completed" | "paused" | "cancelled";

export type Session = {
  id: string;
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  mode: SessionMode;
  location?: string; // nếu offline
  meetingUrl?: string; // nếu online
  price: number; // ₫/h
  startAt: string; // ISO
  endAt: string; // ISO
  status: SessionStatus;
};

export type SessionBlockEnrollment = {
  id: string;
  sessionBlockId: string;
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  blockTitle: string;
  blockDescription: string;
  totalSessions: number;
  currentSession: number;
  completedSessions: number[];
  progress: number;
  status: EnrollmentStatus;
  paymentStatus: string;
  totalAmount: number;
  startDate: string;
  endDate?: string;
  mode: SessionMode;
  location?: string;
  meetingUrl?: string;
  nextSessionDate?: string;
};

type Ctx = {
  sessions: Session[];
  sessionBlockEnrollments: SessionBlockEnrollment[];
  addSession: (
    s: Omit<Session, "id" | "status"> & { status?: SessionStatus },
  ) => string;
  cancelSession: (id: string) => void;
  completeSession: (id: string) => void;
  getById: (id: string) => Session | undefined;
  getUpcoming: () => Session[];
  addSessionBlockEnrollment: (
    enrollment: Omit<SessionBlockEnrollment, "id">,
  ) => string;
  updateSessionProgress: (
    enrollmentId: string,
    sessionNumber: number,
    completed: boolean,
  ) => void;
  getEnrollmentById: (id: string) => SessionBlockEnrollment | undefined;
  getCurrentCoach: () => string | null;
  canEnrollWithCoach: (coachId: string) => boolean;
};

const BookingContext = createContext<Ctx | null>(null);

export const BookingProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // Map mock enrollments to session block enrollments with coach info
  const mapEnrollmentToSessionBlock = (
    enrollment: any,
  ): SessionBlockEnrollment => {
    const sessionBlock = MOCK_SESSION_BLOCKS.find(
      (block) => block.id === enrollment.sessionBlockId,
    );

    // Map coach ID from enrollment format to coach format
    const coachIdMap: Record<string, string> = {
      c1: "coach1",
      c2: "coach2",
      c3: "coach3",
    };

    const mappedCoachId = coachIdMap[enrollment.coachId] || enrollment.coachId;
    const coach = MOCK_COACHES.find((c) => c.id === mappedCoachId);

    if (!sessionBlock || !coach) {
      console.log("Missing data:", {
        enrollment,
        sessionBlock,
        coach,
        mappedCoachId,
      });
      throw new Error("Session block or coach not found");
    }

    return {
      id: enrollment.id,
      sessionBlockId: enrollment.sessionBlockId,
      coachId: enrollment.coachId,
      coachName: coach.name,
      coachAvatar: coach.avatar,
      blockTitle: sessionBlock.title,
      blockDescription: sessionBlock.description,
      totalSessions: sessionBlock.totalSessions,
      currentSession: enrollment.currentSession,
      completedSessions: enrollment.completedSessions,
      progress: enrollment.progress,
      status: enrollment.status,
      paymentStatus: enrollment.paymentStatus,
      totalAmount: enrollment.totalPaid,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      mode: sessionBlock.deliveryMode,
      location: sessionBlock.courtAddress,
      meetingUrl: sessionBlock.meetingLink,
      nextSessionDate: calculateNextSessionDate(
        enrollment.startDate,
        enrollment.currentSession,
      ),
    };
  };

  const calculateNextSessionDate = (
    startDate: string,
    currentSession: number,
  ): string => {
    const start = new Date(startDate);
    // Assume one session per week for simplicity
    const nextDate = new Date(
      start.getTime() + currentSession * 7 * 24 * 60 * 60 * 1000,
    );
    return nextDate.toISOString();
  };

  // Fake data for development - Remove in production
  const fakeSessions: Session[] = [
    {
      id: "ss_1704067200000",
      coachId: "coach1",
      coachName: "David Nguyen",
      coachAvatar: "https://i.pravatar.cc/150?img=23",
      mode: "online",
      meetingUrl: "https://meet.google.com/abc-def-ghi",
      price: 625000,
      startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      endAt: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(), // +1 hour
      status: "upcoming",
    },
    {
      id: "ss_1703980800000",
      coachId: "coach1",
      coachName: "David Nguyen",
      coachAvatar: "https://i.pravatar.cc/150?img=23",
      mode: "online",
      meetingUrl: "https://meet.google.com/abc-def-ghi",
      price: 625000,
      startAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      endAt: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(), // +1 hour
      status: "completed",
    },
    {
      id: "ss_1704153600000",
      coachId: "coach1",
      coachName: "David Nguyen",
      coachAvatar: "https://i.pravatar.cc/150?img=23",
      mode: "offline",
      location: "Crescent Court, 123 Main St",
      price: 30,
      startAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      endAt: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(), // +1 hour
      status: "upcoming",
    },
    {
      id: "ss_1703721600000",
      coachId: "coach1",
      coachName: "David Nguyen",
      coachAvatar: "https://i.pravatar.cc/150?img=23",
      mode: "offline",
      location: "Sports Center, 456 Oak Ave",
      price: 30,
      startAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      endAt: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(), // +1 hour
      status: "completed",
    },
  ];

  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  const [sessionBlockEnrollments, setSessionBlockEnrollments] = useState<
    SessionBlockEnrollment[]
  >(MOCK_ENROLLMENTS.map(mapEnrollmentToSessionBlock));
  // For production, use: useState<Session[]>([]); and useState<SessionBlockEnrollment[]>([]);

  const addSession: Ctx["addSession"] = useCallback((s) => {
    const id = `ss_${Date.now()}`;
    const session: Session = { id, status: s.status ?? "upcoming", ...s };
    setSessions((prev) =>
      [...prev, session].sort(
        (a, b) => +new Date(a.startAt) - +new Date(b.startAt),
      ),
    );
    return id;
  }, []);

  const cancelSession = useCallback((id: string) => {
    setSessions((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "canceled" } : x)),
    );
  }, []);

  const completeSession = useCallback((id: string) => {
    setSessions((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "completed" } : x)),
    );
  }, []);

  const getById = useCallback(
    (id: string) => sessions.find((x) => x.id === id),
    [sessions],
  );

  const getUpcoming = useCallback(
    () =>
      sessions.filter(
        (x) => x.status === "upcoming" && +new Date(x.endAt) >= Date.now(),
      ),
    [sessions],
  );

  const addSessionBlockEnrollment = useCallback(
    (enrollment: Omit<SessionBlockEnrollment, "id">) => {
      const id = `enroll_${Date.now()}`;
      const newEnrollment: SessionBlockEnrollment = { id, ...enrollment };
      setSessionBlockEnrollments((prev) => [...prev, newEnrollment]);
      return id;
    },
    [],
  );

  const updateSessionProgress = useCallback(
    (enrollmentId: string, sessionNumber: number, completed: boolean) => {
      setSessionBlockEnrollments((prev) =>
        prev.map((enrollment) => {
          if (enrollment.id === enrollmentId) {
            const completedSessions = completed
              ? [...new Set([...enrollment.completedSessions, sessionNumber])]
              : enrollment.completedSessions.filter((s) => s !== sessionNumber);

            const currentSession = Math.max(...completedSessions, 0) + 1;
            const progress =
              completedSessions.length / enrollment.totalSessions;

            return {
              ...enrollment,
              completedSessions,
              currentSession,
              progress,
              status:
                completedSessions.length === enrollment.totalSessions
                  ? "completed"
                  : enrollment.status,
            };
          }
          return enrollment;
        }),
      );
    },
    [],
  );

  const getEnrollmentById = useCallback(
    (id: string) => {
      return sessionBlockEnrollments.find((enrollment) => enrollment.id === id);
    },
    [sessionBlockEnrollments],
  );

  const getCurrentCoach = useCallback(() => {
    // Find active enrollment to get current coach
    const activeEnrollment = sessionBlockEnrollments.find(
      (enrollment) => enrollment.status === "active",
    );
    return activeEnrollment ? activeEnrollment.coachId : null;
  }, [sessionBlockEnrollments]);

  const canEnrollWithCoach = useCallback(
    (coachId: string) => {
      const currentCoach = getCurrentCoach();
      // Can enroll if no current coach or enrolling with the same coach
      return !currentCoach || currentCoach === coachId;
    },
    [getCurrentCoach],
  );

  const value = useMemo(
    () => ({
      sessions,
      sessionBlockEnrollments,
      addSession,
      cancelSession,
      completeSession,
      getById,
      getUpcoming,
      addSessionBlockEnrollment,
      updateSessionProgress,
      getEnrollmentById,
      getCurrentCoach,
      canEnrollWithCoach,
    }),
    [
      sessions,
      sessionBlockEnrollments,
      addSession,
      cancelSession,
      completeSession,
      getById,
      getUpcoming,
      addSessionBlockEnrollment,
      updateSessionProgress,
      getEnrollmentById,
      getCurrentCoach,
      canEnrollWithCoach,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
};
