// BookingFlowRN.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Coach = {
  name: string;
  avatar: string;
  price: number;
  priceOnline: number;
  availability: string[]; // e.g. ['Mon','Tue',...]
  courts: string[];
  onlineAvailable: boolean;
  offlineAvailable: boolean;
  specialty?: string;
};

type Props = {
  coach: Coach;
  bookingStep: "type" | "schedule" | "confirm";
  setBookingStep: (v: Props["bookingStep"] | null) => void;

  sessionType: "online" | "offline" | null;
  setSessionType: (v: "online" | "offline") => void;

  selectedDate: string | null; // YYYY-MM-DD
  setSelectedDate: (v: string | null) => void;
  selectedTime: string | null; // '08:00'
  setSelectedTime: (v: string | null) => void;
  selectedDuration: "30min" | "1h" | "1.5h";
  setSelectedDuration: (v: "30min" | "1h" | "1.5h") => void;

  // used in confirm screen
  onDone: () => void;

  // time options
  timeSlots: string[];
};

function BookingFlowRN({
  coach,
  bookingStep,
  setBookingStep,
  sessionType,
  setSessionType,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedDuration,
  setSelectedDuration,
  timeSlots,
  onDone,
}: Props) {
  // --- schedule helpers (always call hooks; guard inside) ---
  const days = useMemo(() => {
    if (!coach) return [];
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const isAvailable = coach.availability.includes(dayName);
      return { iso, dayName, dateNum: d.getDate(), isAvailable };
    });
  }, [coach]);

  // -------------------- STEP: TYPE --------------------
  if (bookingStep === "type") {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setBookingStep(null)}
            style={styles.backRow}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <View>
            <Text style={styles.title}>Choose Session Type</Text>
            <Text style={styles.muted}>
              Select how you want to learn with {coach.name}
            </Text>
          </View>

          {coach.onlineAvailable && (
            <TouchableOpacity
              onPress={() => {
                setSessionType("online");
                setBookingStep("schedule");
              }}
              style={[styles.optionCard, { borderColor: "#BFDBFE" }]}
              activeOpacity={0.9}
            >
              <View style={styles.optionRow}>
                <View
                  style={[styles.optionIcon, { backgroundColor: "#DBEAFE" }]}
                >
                  <Feather name="monitor" size={32} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Online Session</Text>
                  <Text style={styles.optionDesc}>
                    Connect via video call from anywhere. Perfect for technique
                    review and strategy discussions.
                  </Text>
                  <View style={styles.rowGap12}>
                    <View style={styles.rowGap6}>
                      <Feather name="video" size={16} color="#2563EB" />
                      <Text style={[styles.textSm, { color: "#2563EB" }]}>
                        Video Call
                      </Text>
                    </View>
                    <View style={styles.rowGap6}>
                      <Feather name="clock" size={16} color="#2563EB" />
                      <Text style={[styles.textSm, { color: "#2563EB" }]}>
                        Flexible timing
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: "#2563EB" }]}>
                      ${coach.priceOnline}
                    </Text>
                    <Text style={styles.metaSm}> per hour</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {coach.offlineAvailable && (
            <TouchableOpacity
              onPress={() => {
                setSessionType("offline");
                setBookingStep("schedule");
              }}
              style={[styles.optionCard, { borderColor: "#A7F3D0" }]}
              activeOpacity={0.9}
            >
              <View style={styles.optionRow}>
                <View
                  style={[styles.optionIcon, { backgroundColor: "#D1FAE5" }]}
                >
                  <Feather name="map-pin" size={32} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Offline Session</Text>
                  <Text style={styles.optionDesc}>
                    In-person training at the court. Hands-on instruction with
                    immediate feedback.
                  </Text>
                  <View style={[styles.rowGap12, { marginBottom: 6 }]}>
                    <View style={styles.rowGap6}>
                      <Feather name="map-pin" size={16} color="#059669" />
                      <Text style={[styles.textSm, { color: "#059669" }]}>
                        On-court
                      </Text>
                    </View>
                    <View style={styles.rowGap6}>
                      <Feather name="user-check" size={16} color="#059669" />
                      <Text style={[styles.textSm, { color: "#059669" }]}>
                        1-on-1 or Group
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationHint}>
                    <Text style={styles.locationHintTitle}>
                      Available locations:
                    </Text>
                    {coach.courts.map((c, i) => (
                      <Text key={i} style={styles.locationHintItem}>
                        • {c}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: "#059669" }]}>
                      ${coach.price}
                    </Text>
                    <Text style={styles.metaSm}> per hour</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  // -------------------- STEP: SCHEDULE --------------------
  if (bookingStep === "schedule") {
    const total = sessionType === "online" ? coach.priceOnline : coach.price;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setBookingStep("type")}
            style={styles.backRow}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <View>
            <Text style={styles.title}>Schedule Session</Text>
            <Text style={styles.muted}>
              {sessionType === "online" ? "Online" : "Offline"} session with{" "}
              {coach.name}
            </Text>
          </View>

          {/* Select Date */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Date</Text>
            <View style={styles.daysGrid}>
              {days.map((d) => {
                const isSelected = selectedDate === d.iso;
                const cellStyle = d.isAvailable
                  ? isSelected
                    ? styles.dayCellSelected
                    : styles.dayCell
                  : styles.dayCellDisabled;

                return (
                  <TouchableOpacity
                    key={d.iso}
                    disabled={!d.isAvailable}
                    onPress={() => d.isAvailable && setSelectedDate(d.iso)}
                    style={cellStyle}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.dayName,
                        isSelected && styles.dayNameSelected,
                        !d.isAvailable && styles.dayNameDisabled,
                      ]}
                    >
                      {d.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dayNum,
                        isSelected && styles.dayNumSelected,
                        !d.isAvailable && styles.dayNumDisabled,
                      ]}
                    >
                      {d.dateNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Select Time */}
          {selectedDate && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Select Time</Text>
              <View style={styles.grid3}>
                {timeSlots.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setSelectedTime(t)}
                      style={[
                        styles.timeCell,
                        isSelected && styles.timeCellSelected,
                      ]}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          isSelected && styles.timeTextSelected,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Duration */}
          {selectedDate && selectedTime && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Duration</Text>
              <View style={styles.grid3}>
                {(["30min", "1h", "1.5h"] as const).map((dur) => {
                  const active = selectedDuration === dur;
                  return (
                    <TouchableOpacity
                      key={dur}
                      onPress={() => setSelectedDuration(dur)}
                      style={[
                        styles.durationCell,
                        active && styles.durationCellSelected,
                      ]}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          active && styles.durationTextSelected,
                        ]}
                      >
                        {dur}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Summary */}
          {selectedDate && selectedTime && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Session Summary</Text>
              <View style={{ gap: 8 }}>
                <View style={styles.sumRow}>
                  <Text style={styles.sumLabel}>Type:</Text>
                  <Text style={styles.sumValue}>{sessionType}</Text>
                </View>
                <View style={styles.sumRow}>
                  <Text style={styles.sumLabel}>Date:</Text>
                  <Text style={styles.sumValue}>{selectedDate}</Text>
                </View>
                <View style={styles.sumRow}>
                  <Text style={styles.sumLabel}>Time:</Text>
                  <Text style={styles.sumValue}>{selectedTime}</Text>
                </View>
                <View style={styles.sumRow}>
                  <Text style={styles.sumLabel}>Duration:</Text>
                  <Text style={styles.sumValue}>{selectedDuration}</Text>
                </View>

                <View style={styles.sumTotalRow}>
                  <Text style={styles.sumTotalLabel}>Total:</Text>
                  <Text style={styles.sumTotalValue}>${total}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setBookingStep("confirm")}
                style={[styles.primaryBtn, { marginTop: 12 }]}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBtnText}>Continue to Payment</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // -------------------- STEP: CONFIRM --------------------
  if (bookingStep === "confirm") {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setBookingStep("schedule")}
            style={styles.backRow}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View style={styles.confirmIcon}>
              <Feather name="check-circle" size={40} color="#059669" />
            </View>
            <Text style={styles.title}>Booking Confirmed!</Text>
            <Text style={styles.muted}>Your session has been scheduled</Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>
              Session Details
            </Text>

            <View style={styles.coachRow}>
              <View style={styles.coachAvatar}>
                <Text style={styles.coachAvatarText}>{coach.avatar}</Text>
              </View>
              <View>
                <Text style={styles.bold}>{coach.name}</Text>
                {coach.specialty ? (
                  <Text style={styles.metaSm}>{coach.specialty}</Text>
                ) : null}
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <View style={styles.detailRow}>
                <Feather
                  name={sessionType === "online" ? "monitor" : "map-pin"}
                  size={20}
                  color={sessionType === "online" ? "#2563EB" : "#059669"}
                />
                <View>
                  <Text style={styles.bold}>{sessionType} Session</Text>
                  {sessionType === "offline" && coach.courts?.[0] ? (
                    <Text style={styles.metaXs}>{coach.courts[0]}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.detailRow}>
                <Feather name="calendar" size={20} color="#6B7280" />
                <Text style={styles.textSm}>{selectedDate}</Text>
              </View>

              <View style={styles.detailRow}>
                <Feather name="clock" size={20} color="#6B7280" />
                <Text style={styles.textSm}>
                  {selectedTime} ({selectedDuration})
                </Text>
              </View>

              <View style={styles.sumTotalRow}>
                <Text style={styles.sumTotalLabel}>Total Paid:</Text>
                <Text style={styles.sumTotalValue}>
                  ${sessionType === "online" ? coach.priceOnline : coach.price}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.nextBox}>
            <Text style={styles.nextTitle}>What&apos;s Next?</Text>
            <Text style={styles.nextItem}>
              • You will receive a confirmation email
            </Text>
            <Text style={styles.nextItem}>
              •{" "}
              {sessionType === "online"
                ? "Video call link will be sent 10 minutes before session"
                : `Meet at ${coach.courts?.[0] ?? "the court"} at the scheduled time`}
            </Text>
            <Text style={styles.nextItem}>
              • Coach will contact you if needed
            </Text>
          </View>

          <View style={styles.rowGap8}>
            <TouchableOpacity
              onPress={onDone}
              style={styles.primaryBtn}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryBtnText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} activeOpacity={0.85}>
              <Text style={styles.ghostBtnText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

// ---- Screen wrapper to provide props/state ----
const MOCK_COACHES: Coach[] = [
  {
    name: "Coach John Smith",
    avatar: "J",
    price: 40,
    priceOnline: 35,
    availability: ["Mon", "Wed", "Fri", "Sat"],
    courts: ["Saigon Sports Club", "Phu My Hung Courts"],
    onlineAvailable: true,
    offlineAvailable: true,
    specialty: "Beginner Training",
  },
  {
    name: "Coach Sarah Lee",
    avatar: "S",
    price: 50,
    priceOnline: 45,
    availability: ["Tue", "Thu", "Sat", "Sun"],
    courts: ["District 3 Sports Center"],
    onlineAvailable: true,
    offlineAvailable: true,
    specialty: "Advanced Technique",
  },
];

export default function CoachBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();

  const coach = useMemo<Coach>(() => {
    // Choose a coach deterministically if id exists, else fallback to first
    if (id) {
      const index =
        Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
        MOCK_COACHES.length;
      return MOCK_COACHES[index];
    }
    return MOCK_COACHES[0];
  }, [id]);

  const [bookingStep, setBookingStep] = useState<Props["bookingStep"] | null>(
    "type",
  );
  const [sessionType, setSessionType] = useState<Props["sessionType"]>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] =
    useState<Props["selectedDuration"]>("1h");
  const timeSlots = useMemo<string[]>(
    () => [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ],
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 50,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <BookingFlowRN
        coach={coach}
        bookingStep={bookingStep ?? "type"}
        setBookingStep={setBookingStep}
        sessionType={sessionType}
        setSessionType={(v) => setSessionType(v)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        timeSlots={timeSlots}
        onDone={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontSize: 14 },

  title: { fontSize: 22, fontWeight: "800", color: "#0F172A" },
  muted: { color: "#4B5563", marginTop: 4 },

  // TYPE step
  optionCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  optionRow: { flexDirection: "row", gap: 12 },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  optionDesc: { color: "#4B5563", fontSize: 13, marginBottom: 8 },
  rowGap12: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowGap6: { flexDirection: "row", alignItems: "center", gap: 6 },
  textSm: { color: "#111827", fontSize: 14 },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  price: { fontSize: 22, fontWeight: "800" },

  locationHint: {
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 12,
    marginTop: 8,
  },
  locationHintTitle: {
    color: "#065F46",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
  },
  locationHintItem: { color: "#065F46", fontSize: 12, marginLeft: 4 },

  // SCHEDULE step
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },

  daysGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  dayCell: {
    width: "13.6%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  dayCellSelected: {
    width: "13.6%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#10B981",
  },
  dayCellDisabled: {
    width: "13.6%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  dayName: { fontSize: 11, fontWeight: "600", color: "#111827" },
  dayNameSelected: { color: "#fff" },
  dayNameDisabled: { color: "#9CA3AF" },
  dayNum: { fontSize: 14, color: "#111827" },
  dayNumSelected: { color: "#fff", fontWeight: "700" },
  dayNumDisabled: { color: "#9CA3AF" },

  grid3: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  timeCell: {
    width: "31.5%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  timeCellSelected: { backgroundColor: "#10B981" },
  timeText: { fontWeight: "600", color: "#111827" },
  timeTextSelected: { color: "#fff" },

  durationCell: {
    width: "31.5%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  durationCellSelected: { backgroundColor: "#10B981" },
  durationText: { fontWeight: "700", color: "#111827" },
  durationTextSelected: { color: "#fff" },

  sumRow: { flexDirection: "row", justifyContent: "space-between" },
  sumLabel: { color: "#6B7280", fontSize: 14 },
  sumValue: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
    textTransform: "capitalize",
  },
  sumTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 12,
    paddingTop: 12,
  },
  sumTotalLabel: { fontWeight: "700", fontSize: 16 },
  sumTotalValue: { fontWeight: "800", fontSize: 22, color: "#059669" },

  // CONFIRM step
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },
  coachAvatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#FB923C",
    alignItems: "center",
    justifyContent: "center",
  },
  coachAvatarText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bold: { fontWeight: "700", color: "#111827" },
  metaSm: { color: "#6B7280", fontSize: 13 },
  metaXs: { color: "#6B7280", fontSize: 12 },

  nextBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 10,
    padding: 12,
  },
  nextTitle: { color: "#1D4ED8", fontWeight: "700", marginBottom: 8 },
  nextItem: { color: "#1D4ED8", fontSize: 13, marginBottom: 2 },

  primaryBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  ghostBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  ghostBtnText: { color: "#111827", fontWeight: "600" },
  rowGap8: { flexDirection: "row", alignItems: "center", gap: 8 },
});
