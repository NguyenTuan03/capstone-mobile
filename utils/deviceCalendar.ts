import * as ExpoCal from "expo-calendar";
import { Platform } from "react-native";

let _calendarId: string | null = null;

export async function ensureCalendar(): Promise<string> {
  const { status } = await ExpoCal.requestCalendarPermissionsAsync();
  if (status !== "granted") throw new Error("Calendar permission denied");

  if (_calendarId) return _calendarId;

  // Tìm calendar có sẵn tên "Coach App"
  const cals = await ExpoCal.getCalendarsAsync(ExpoCal.EntityTypes.EVENT);
  const found = cals.find((c: any) => c.title === "Coach App");
  if (found) {
    _calendarId = found.id;
    return found.id;
  }

  // iOS cần "source" để tạo calendar
  let source = undefined as any;
  if (Platform.OS === "ios") {
    const defaultCal = await ExpoCal.getDefaultCalendarAsync();
    source = defaultCal?.source;
  }

  const id = await ExpoCal.createCalendarAsync({
    title: "Coach App",
    color: "#111827",
    entityType: ExpoCal.EntityTypes.EVENT,
    sourceId: Platform.OS === "ios" ? source?.id : undefined,
    source: Platform.OS === "ios" ? source : undefined,
    name: "Coach App",
    ownerAccount: "personal",
    accessLevel: ExpoCal.CalendarAccessLevel.OWNER,
  });

  _calendarId = id;
  return id;
}

export type SessionLike = {
  id: string;
  date: string; // "YYYY-MM-DD"
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  student: string;
  mode: "online" | "offline";
  place?: string;
  meetingUrl?: string;
};

// Tạo / cập nhật event cho 1 session
export async function upsertSessionEvent(
  calendarId: string,
  s: SessionLike,
  existingEventId?: string,
): Promise<string> {
  const startDate = toDate(s.date, s.start);
  const endDate = toDate(s.date, s.end);

  const details: ExpoCal.Event = {
    title: `Coaching: ${s.student}`,
    startDate,
    endDate,
    location: s.mode === "offline" ? s.place : undefined,
    notes:
      s.mode === "online"
        ? `Online session. Join link: ${s.meetingUrl ?? ""}`
        : "Offline session",
    timeZone: undefined, // để mặc định theo máy
    url: s.meetingUrl,
  };

  if (existingEventId) {
    await ExpoCal.updateEventAsync(existingEventId, details);
    return existingEventId;
  } else {
    return await ExpoCal.createEventAsync(calendarId, details);
  }
}

export async function deleteEvent(eventId?: string) {
  if (!eventId) return;
  try {
    await ExpoCal.deleteEventAsync(eventId);
  } catch {}
}

// Publish slot tuần lặp cho 8 tuần tới (tạo 8 event riêng, tránh rắc rối RRULE)
export async function publishWeeklyAvailability(
  calendarId: string,
  weekday: number, // 0=Sun..6=Sat
  startHHmm: string,
  endHHmm: string,
  label = "Availability",
) {
  const dates = nextNWeekdays(weekday, 8); // 8 occurrences
  for (const d of dates) {
    const dateStr = d.toISOString().slice(0, 10);
    const start = toDate(dateStr, startHHmm);
    const end = toDate(dateStr, endHHmm);
    await ExpoCal.createEventAsync(calendarId, {
      title: label,
      startDate: start,
      endDate: end,
      notes: "Published from Coach App",
    });
  }
}

/* ---------- utils ---------- */
function toDate(yyyy_mm_dd: string, hh_mm: string) {
  const [Y, M, D] = yyyy_mm_dd.split("-").map(Number);
  const [h, m] = hh_mm.split(":").map(Number);
  const dt = new Date();
  dt.setFullYear(Y, M - 1, D);
  dt.setHours(h, m, 0, 0);
  return dt;
}

function nextNWeekdays(weekday: number, n: number) {
  const res: Date[] = [];
  const now = new Date();
  // Bắt đầu từ tuần tới cho an toàn
  const start = new Date(now);
  const delta = (weekday - start.getDay() + 7) % 7 || 7;
  start.setDate(start.getDate() + delta);

  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    res.push(d);
  }
  return res;
}
