import { Ionicons } from "@expo/vector-icons";
import * as ExpoCal from "expo-calendar";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** ================== TYPES ================== */
type Mode = "online" | "offline";
type Status = "pending" | "upcoming" | "completed" | "canceled";

type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  student: string;
  mode: Mode;
  place?: string;
  status: Status;
  meetingUrl?: string;
};

/** ================== MOCK (có thể thay API/Context) ================== */
const INITIAL_SESSIONS: Session[] = [
  {
    id: "s1",
    date: todayOffset(0),
    start: "19:00",
    end: "20:00",
    student: "Tuấn",
    mode: "online",
    status: "upcoming",
    meetingUrl: "https://meet.example.com/s1",
  },
  {
    id: "s2",
    date: todayOffset(1),
    start: "07:00",
    end: "08:00",
    student: "Lan",
    mode: "offline",
    place: "Crescent Court",
    status: "upcoming",
  },
  {
    id: "s3",
    date: todayOffset(3),
    start: "18:30",
    end: "19:30",
    student: "Huy",
    mode: "online",
    status: "pending",
    meetingUrl: "https://meet.example.com/s3",
  },
  {
    id: "s4",
    date: todayOffset(-1),
    start: "06:30",
    end: "07:30",
    student: "Minh",
    mode: "offline",
    place: "Bình Thạnh",
    status: "completed",
  },
];

type Slot = {
  id: string;
  weekday: number;
  start: string;
  end: string;
  mode: Mode;
  place?: string;
};
const BASE_SLOTS: Slot[] = [
  {
    id: "a1",
    weekday: 1,
    start: "06:30",
    end: "07:30",
    mode: "offline",
    place: "Q.7 Court",
  },
  { id: "a2", weekday: 3, start: "19:00", end: "20:00", mode: "online" },
  {
    id: "a3",
    weekday: 6,
    start: "07:00",
    end: "08:00",
    mode: "offline",
    place: "Thủ Đức",
  },
];

/** ================== SCREEN ================== */
export default function CoachCalendar() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"sessions" | "availability">("sessions");
  const [selected, setSelected] = useState<string>(todayOffset(0));
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [slots, setSlots] = useState<Slot[]>(BASE_SLOTS);

  // ======= expo-calendar
  const [deviceCalId, setDeviceCalId] = useState<string | null>(null);
  // mapping sessionId -> device eventId
  const [eventIds, setEventIds] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const id = await ensureCalendar();
        setDeviceCalId(id);
      } catch (e: any) {
        console.warn("Calendar not ready:", e?.message);
      }
    })();
  }, []);

  // ======= Add Slot modal state
  const [showAdd, setShowAdd] = useState(false);
  const [slotWeekday, setSlotWeekday] = useState<number>(new Date().getDay());
  const [slotStart, setSlotStart] = useState<Date>(roundToQuarter(new Date()));
  const [slotEnd, setSlotEnd] = useState<Date>(
    roundToQuarter(new Date(Date.now() + 60 * 60 * 1000)),
  );
  const [picking, setPicking] = useState<"start" | "end" | null>(null);

  const marked = useMemo(
    () => buildMarked(sessions, selected),
    [sessions, selected],
  );
  const daySessions = useMemo(
    () =>
      sessions
        .filter((s) => s.date === selected)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [sessions, selected],
  );

  // ==== handlers: Approve / Decline / Join
  const approveSession = async (s: Session) => {
    if (!deviceCalId) {
      Alert.alert(
        "Permission",
        "Thiếu quyền Calendar. Mở Settings để cấp quyền.",
      );
      return;
    }
    try {
      const evId = await upsertSessionEvent(deviceCalId, s, eventIds[s.id]);
      setEventIds((prev) => ({ ...prev, [s.id]: evId }));
      setSessions((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, status: "upcoming" } : x)),
      );
      Alert.alert("Approved", "Đã sync lên lịch trên máy.");
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể tạo event");
    }
  };

  const declineSession = async (s: Session) => {
    try {
      const evId = eventIds[s.id];
      if (evId) await ExpoCal.deleteEventAsync(evId);
      setEventIds((prev) => {
        const { [s.id]: _, ...rest } = prev;
        return rest;
      });
      setSessions((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, status: "canceled" } : x)),
      );
      Alert.alert("Declined", "Đã xoá khỏi lịch trên máy (nếu có).");
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể xoá event");
    }
  };

  const joinSession = (s: Session) => {
    router.push({
      // pathname: "/(coach)/call/temp/index",
      // params: { sessionId: s.id },
      pathname: "/(coach)/calendar",
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={st.header}>
        <Text style={st.h1}>Calendar</Text>
        <View style={st.tabs}>
          <Pressable
            onPress={() => setTab("sessions")}
            style={[st.tab, tab === "sessions" && st.tabActive]}
          >
            <Text style={[st.tabText, tab === "sessions" && st.tabTextActive]}>
              Sessions
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("availability")}
            style={[st.tab, tab === "availability" && st.tabActive]}
          >
            <Text
              style={[st.tabText, tab === "availability" && st.tabTextActive]}
            >
              Availability
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Calendar */}
      <Calendar
        current={selected}
        onDayPress={(d: any) => setSelected(d.dateString)}
        markedDates={marked}
        theme={{
          todayTextColor: "#111827",
          arrowColor: "#111827",
          monthTextColor: "#111827",
          textMonthFontWeight: "800",
          textDayFontWeight: "700",
          textSectionTitleColor: "#9ca3af",
          selectedDayBackgroundColor: "#111827",
          selectedDayTextColor: "#fff",
        }}
        style={st.calendar}
      />

      {/* Body */}
      {tab === "sessions" ? (
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
          <View style={st.legend}>
            <LegendDot color="#22c55e" label="Upcoming" />
            <LegendDot color="#f59e0b" label="Pending" />
            <LegendDot color="#a3a3a3" label="Completed" />
            <LegendDot color="#ef4444" label="Canceled" />
          </View>

          {daySessions.length === 0 ? (
            <Empty
              title="No sessions on this date"
              subtitle="Open Requests ở Home hoặc sang Availability để thêm slot."
            />
          ) : (
            <FlatList
              data={daySessions}
              keyExtractor={(x) => x.id}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => (
                <SessionCard
                  s={item}
                  onApprove={() => approveSession(item)}
                  onDecline={() => declineSession(item)}
                  onJoin={() => joinSession(item)}
                />
              )}
            />
          )}
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 6 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={st.secTitle}>Your weekly availability</Text>
            <Pressable style={st.addBtn} onPress={() => setShowAdd(true)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={st.addBtnText}>Add Slot</Text>
            </Pressable>
          </View>

          <FlatList
            data={groupSlots(slots)}
            keyExtractor={(g) => String(g.weekday)}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <View style={st.slotGroup}>
                <Text style={st.slotDay}>{WEEK[item.weekday]}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {item.items.map((sl) => (
                    <View key={sl.id} style={st.slotPill}>
                      <Ionicons
                        name={
                          sl.mode === "online" ? "globe-outline" : "pin-outline"
                        }
                        size={14}
                        color="#111827"
                      />
                      <Text style={st.slotText}>
                        {" "}
                        {sl.start}-{sl.end}
                        {sl.place ? ` · ${sl.place}` : ""}
                      </Text>
                      <Pressable
                        onPress={() =>
                          setSlots((prev) => prev.filter((x) => x.id !== sl.id))
                        }
                      >
                        <Ionicons name="close" size={14} color="#9ca3af" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Empty
                title="No availability yet"
                subtitle="Tap Add Slot to publish your times."
              />
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          {/* Add Slot Modal */}
          <Modal visible={showAdd} animationType="slide" transparent>
            <Pressable style={st.modalBack} onPress={() => setShowAdd(false)} />
            <View style={st.modal}>
              <Text style={st.modalTitle}>Add availability</Text>

              {/* Weekday selector */}
              <View style={st.weekRow}>
                {WEEK.map((d, i) => (
                  <Pressable
                    key={d}
                    style={[st.weekBtn, i === slotWeekday && st.weekBtnActive]}
                    onPress={() => setSlotWeekday(i)}
                  >
                    <Text
                      style={[
                        st.weekTxt,
                        i === slotWeekday && st.weekTxtActive,
                      ]}
                    >
                      {d.slice(0, 3)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Time pickers */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Pressable
                  style={st.timeBtn}
                  onPress={() => setPicking("start")}
                >
                  <Ionicons name="time-outline" size={16} color="#111827" />
                  <Text style={st.timeTxt}> {fmtTime(slotStart)}</Text>
                </Pressable>
                <Text style={{ marginHorizontal: 8, color: "#6b7280" }}>–</Text>
                <Pressable style={st.timeBtn} onPress={() => setPicking("end")}>
                  <Ionicons name="time-outline" size={16} color="#111827" />
                  <Text style={st.timeTxt}> {fmtTime(slotEnd)}</Text>
                </Pressable>
              </View>

              {/* Mode quick (demo: mặc định Online) */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Chip label="Online" active />
                <Chip label="Offline" />
              </View>

              <View style={{ flexDirection: "row", marginTop: 14 }}>
                <Pressable
                  style={[st.saveBtn]}
                  onPress={async () => {
                    const id = `slot_${Date.now()}`;
                    const startHHmm = fmtTime(slotStart);
                    const endHHmm = fmtTime(slotEnd);

                    setSlots((prev) => [
                      ...prev,
                      {
                        id,
                        weekday: slotWeekday,
                        start: startHHmm,
                        end: endHHmm,
                        mode: "online",
                      },
                    ]);

                    // ✅ Publish 8 tuần tới lên device calendar
                    if (deviceCalId) {
                      await publishWeeklyAvailability(
                        deviceCalId,
                        slotWeekday,
                        startHHmm,
                        endHHmm,
                        "Availability (Coach App)",
                      );
                    }
                    setShowAdd(false);
                  }}
                >
                  <Text style={st.saveTxt}>Save</Text>
                </Pressable>
                <Pressable
                  style={[st.cancelBtn]}
                  onPress={() => setShowAdd(false)}
                >
                  <Text style={st.cancelTxt}>Cancel</Text>
                </Pressable>
              </View>

              {/* picker */}
              <DateTimePickerModal
                isVisible={picking !== null}
                mode="time"
                date={picking === "start" ? slotStart : slotEnd}
                onConfirm={(d: any) => {
                  if (picking === "start") setSlotStart(roundToQuarter(d));
                  else setSlotEnd(roundToQuarter(d));
                  setPicking(null);
                }}
                onCancel={() => setPicking(null)}
                minuteInterval={5}
                is24Hour
              />
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

/** ================== Subcomponents ================== */

function SessionCard({
  s,
  onApprove,
  onDecline,
  onJoin,
}: {
  s: Session;
  onApprove?: () => void;
  onDecline?: () => void;
  onJoin?: () => void;
}) {
  const color = statusColor[s.status];
  return (
    <Pressable style={st.card} onPress={onJoin}>
      <View style={[st.statusDot, { backgroundColor: color }]} />
      <View style={{ marginLeft: 8, flex: 1 }}>
        <Text style={st.cardTitle}>{s.student}</Text>
        <Text style={st.cardSub}>
          {s.start}-{s.end} · {s.mode === "online" ? "Online" : s.place}
        </Text>
      </View>
      {s.status === "pending" ? (
        <View style={{ flexDirection: "row" }}>
          <RoundBtn label="Approve" solid onPress={onApprove ?? (() => {})} />
          <RoundBtn label="Decline" onPress={onDecline ?? (() => {})} />
        </View>
      ) : s.status === "upcoming" ? (
        <RoundBtn label="Join" solid onPress={onJoin ?? (() => {})} />
      ) : null}
    </Pressable>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 12 }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#6b7280", fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

function RoundBtn({
  label,
  onPress,
  solid,
}: {
  label: string;
  onPress: () => void;
  solid?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[st.rBtn, solid && st.rBtnSolid]}>
      <Text style={[st.rBtnTxt, solid && st.rBtnTxtSolid]}>{label}</Text>
    </Pressable>
  );
}

function Chip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[st.chip, active && st.chipActive]}>
      <Text style={[st.chipTxt, active && st.chipTxtActive]}>{label}</Text>
    </View>
  );
}

function Empty({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={st.empty}>
      <Ionicons name="calendar-outline" size={22} color="#9ca3af" />
      <Text style={st.emptyTitle}>{title}</Text>
      {!!subtitle && <Text style={st.emptySub}>{subtitle}</Text>}
    </View>
  );
}

/** ================== expo-calendar helpers ================== */

async function ensureCalendar(): Promise<string> {
  const { status } = await ExpoCal.requestCalendarPermissionsAsync();
  if (status !== "granted") throw new Error("Calendar permission denied");
  // tìm calendar “Coach App”
  const cals = await ExpoCal.getCalendarsAsync(ExpoCal.EntityTypes.EVENT);
  const found = cals.find((c: any) => c.title === "Coach App");
  if (found) return found.id;

  // iOS cần source khi tạo mới
  let source: any = undefined;
  if (Platform.OS === "ios") {
    const def = await ExpoCal.getDefaultCalendarAsync();
    source = def?.source;
  }
  const id = await ExpoCal.createCalendarAsync({
    title: "Coach App",
    color: "#111827",
    sourceId: Platform.OS === "ios" ? source?.id : undefined,
    source: Platform.OS === "ios" ? source : undefined,
    name: "Coach App",
    ownerAccount: "personal",
    accessLevel: ExpoCal.CalendarAccessLevel.OWNER,
    entityType: ExpoCal.EntityTypes.EVENT,
  });
  return id;
}

async function upsertSessionEvent(
  calendarId: string,
  s: Session,
  existingEventId?: string,
): Promise<string> {
  const startDate = toDate(s.date, s.start);
  const endDate = toDate(s.date, s.end);
  const details: any = {
    title: `Coaching: ${s.student}`,
    startDate,
    endDate,
    location: s.mode === "offline" ? (s.place ?? null) : null,
    notes:
      s.mode === "online"
        ? `Online session. Join: ${s.meetingUrl ?? ""}`
        : "Offline session",
    url: s.meetingUrl ?? undefined,
  };
  if (existingEventId) {
    await ExpoCal.updateEventAsync(existingEventId, details);
    return existingEventId;
  }
  return await ExpoCal.createEventAsync(calendarId, details);
}

async function publishWeeklyAvailability(
  calendarId: string,
  weekday: number,
  startHHmm: string,
  endHHmm: string,
  label = "Availability",
) {
  const dates = nextNWeekdays(weekday, 8);
  for (const d of dates) {
    const iso = d.toISOString().slice(0, 10);
    await ExpoCal.createEventAsync(calendarId, {
      title: label,
      startDate: toDate(iso, startHHmm),
      endDate: toDate(iso, endHHmm),
      notes: "Published from Coach App",
    });
  }
}

/** ================== Utils & Styles ================== */
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function todayOffset(d: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
}

const statusColor: Record<Status, string> = {
  upcoming: "#22c55e",
  pending: "#f59e0b",
  completed: "#a3a3a3",
  canceled: "#ef4444",
};

function buildMarked(sessions: Session[], selected: string) {
  const marked: any = {};
  for (const s of sessions) {
    const color = statusColor[s.status];
    marked[s.date] ??= { dots: [] };
    if (!marked[s.date].dots.some((d: any) => d.color === color)) {
      marked[s.date].dots.push({ color });
    }
  }
  marked[selected] = {
    ...(marked[selected] ?? {}),
    selected: true,
    selectedColor: "#111827",
  };
  return marked;
}

function groupSlots(items: Slot[]) {
  const map: Record<number, Slot[]> = {};
  items.forEach((i) => {
    map[i.weekday] ??= [];
    map[i.weekday].push(i);
  });
  return Object.keys(map)
    .map((k) => ({
      weekday: Number(k),
      items: map[Number(k)].sort((a, b) => a.start.localeCompare(b.start)),
    }))
    .sort((a, b) => a.weekday - b.weekday);
}

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
  const start = new Date(now);
  const delta = (weekday - start.getDay() + 7) % 7 || 7; // tuần tới
  start.setDate(start.getDate() + delta);
  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    res.push(d);
  }
  return res;
}

function fmtTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function roundToQuarter(d: Date) {
  const x = new Date(d);
  const q = Math.round(x.getMinutes() / 15) * 15;
  x.setMinutes(q, 0, 0);
  return x;
}

const st: any = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 10 },
  h1: { fontSize: 22, fontWeight: "900", color: "#111827" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginTop: 10,
    marginBottom: 6,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: { backgroundColor: "#111827" },
  tabText: { fontWeight: "800", color: "#111827" },
  tabTextActive: { color: "#fff" },

  calendar: {
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },

  legend: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  cardTitle: { fontWeight: "900", color: "#111827" },
  cardSub: { color: "#6b7280", marginTop: 2 },

  secTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },

  slotGroup: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 6,
  },
  slotDay: { fontWeight: "900", color: "#111827", marginBottom: 8 },
  slotPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  slotText: { fontWeight: "700", color: "#111827", marginRight: 6 },

  addBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "800", marginLeft: 6 },

  rBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  rBtnSolid: { backgroundColor: "#111827", borderColor: "#111827" },
  rBtnTxt: { fontWeight: "800", color: "#111827" },
  rBtnTxtSolid: { color: "#fff" },

  empty: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  emptyTitle: { fontWeight: "900", color: "#111827", marginTop: 4 },
  emptySub: { color: "#6b7280", marginTop: 4, textAlign: "center" },

  modalBack: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  weekBtn: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  weekBtnActive: { backgroundColor: "#111827" },
  weekTxt: { fontWeight: "800", color: "#111827" },
  weekTxtActive: { color: "#fff" },

  timeBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  timeTxt: { fontWeight: "800", color: "#111827" },

  saveBtn: {
    flex: 1,
    backgroundColor: "#111827",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  saveTxt: { color: "#fff", fontWeight: "900" },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelTxt: { fontWeight: "900", color: "#111827" },
});
