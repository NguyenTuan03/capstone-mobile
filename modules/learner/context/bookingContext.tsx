// app/context/booking.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SessionMode = "online" | "offline";
export type SessionStatus = "upcoming" | "completed" | "canceled";

export type Session = {
  id: string;
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  mode: SessionMode;
  location?: string; // nếu offline
  meetingUrl?: string; // nếu online
  price: number; // $/h
  startAt: string; // ISO
  endAt: string; // ISO
  status: SessionStatus;
};

type Ctx = {
  sessions: Session[];
  addSession: (
    s: Omit<Session, "id" | "status"> & { status?: SessionStatus },
  ) => string;
  cancelSession: (id: string) => void;
  completeSession: (id: string) => void;
  getById: (id: string) => Session | undefined;
  getUpcoming: () => Session[];
};

const BookingContext = createContext<Ctx | null>(null);

export const BookingProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // Fake data for development - Remove in production
  const fakeSessions: Session[] = [
    {
      id: "ss_1704067200000",
      coachId: "coach_1",
      coachName: "Sarah Johnson",
      coachAvatar: "https://i.pravatar.cc/150?img=1",
      mode: "online",
      meetingUrl: "https://meet.google.com/abc-def-ghi",
      price: 25,
      startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      endAt: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(), // +1 hour
      status: "upcoming",
    },
    {
      id: "ss_1704063600000",
      coachId: "coach_2",
      coachName: "Michael Chen",
      coachAvatar: "https://i.pravatar.cc/150?img=2",
      mode: "offline",
      location: "Downtown Studio, 123 Main St",
      price: 30,
      startAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      endAt: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      status: "upcoming",
    },
    {
      id: "ss_1704060000000",
      coachId: "coach_3",
      coachName: "Emily Rodriguez",
      coachAvatar: "https://i.pravatar.cc/150?img=3",
      mode: "online",
      meetingUrl: "https://zoom.us/j/123456789",
      price: 35,
      startAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      endAt: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      status: "completed",
    },
    {
      id: "ss_1704056400000",
      coachId: "coach_4",
      coachName: "David Thompson",
      coachAvatar: "https://i.pravatar.cc/150?img=4",
      mode: "online",
      meetingUrl: "https://teams.microsoft.com/l/meetup",
      price: 28,
      startAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      endAt: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      status: "completed",
    },
    {
      id: "ss_1704052800000",
      coachId: "coach_5",
      coachName: "Lisa Park",
      coachAvatar: "https://i.pravatar.cc/150?img=5",
      mode: "offline",
      location: "Eastside Gym, 456 Oak Ave",
      price: 40,
      startAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      endAt: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000,
      ).toISOString(), // +1.5 hours
      status: "canceled",
    },
    {
      id: "ss_1704049200000",
      coachId: "coach_6",
      coachName: "James Wilson",
      coachAvatar: "https://i.pravatar.cc/150?img=6",
      mode: "online",
      meetingUrl: "https://meet.jit.si/coaching-session",
      price: 32,
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      endAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      status: "upcoming",
    },
    {
      id: "ss_1704045600000",
      coachId: "coach_7",
      coachName: "Anna Martinez",
      coachAvatar: "https://i.pravatar.cc/150?img=7",
      mode: "online",
      meetingUrl: "https://whereby.com/coaching-room",
      price: 26,
      startAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
      endAt: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      status: "completed",
    },
    {
      id: "ss_1704042000000",
      coachId: "coach_8",
      coachName: "Robert Kim",
      coachAvatar: "https://i.pravatar.cc/150?img=8",
      mode: "offline",
      location: "Westside Center, 789 Pine St",
      price: 45,
      startAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      endAt: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000,
      ).toISOString(), // +2 hours
      status: "upcoming",
    },
  ];

  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  // For production, use: useState<Session[]>([]);

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

  const value = useMemo(
    () => ({
      sessions,
      addSession,
      cancelSession,
      completeSession,
      getById,
      getUpcoming,
    }),
    [
      sessions,
      addSession,
      cancelSession,
      completeSession,
      getById,
      getUpcoming,
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
