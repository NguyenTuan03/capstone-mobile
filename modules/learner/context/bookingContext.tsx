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
  const [sessions, setSessions] = useState<Session[]>([]);

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
