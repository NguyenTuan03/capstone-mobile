import {
  MOCK_SESSION_BLOCKS,
  getSessionBlockById,
} from "@/mocks/sessionBlocks";
import { SessionBlock, SessionTemplate } from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock availability slots - in real app, this would come from coach's calendar
const MOCK_AVAILABILITY = [
  {
    id: "slot1",
    weekday: 1,
    start: "09:00",
    end: "10:00",
    mode: "offline" as const,
    place: "Crescent Court",
  },
  {
    id: "slot2",
    weekday: 1,
    start: "18:00",
    end: "19:00",
    mode: "online" as const,
  },
  {
    id: "slot3",
    weekday: 2,
    start: "09:00",
    end: "10:00",
    mode: "offline" as const,
    place: "Sports Center",
  },
  {
    id: "slot4",
    weekday: 2,
    start: "19:00",
    end: "20:00",
    mode: "online" as const,
  },
  {
    id: "slot5",
    weekday: 3,
    start: "09:00",
    end: "10:00",
    mode: "offline" as const,
    place: "Pickleball Club",
  },
  {
    id: "slot6",
    weekday: 3,
    start: "18:00",
    end: "19:00",
    mode: "online" as const,
  },
  {
    id: "slot7",
    weekday: 4,
    start: "09:00",
    end: "10:00",
    mode: "offline" as const,
    place: "Community Center",
  },
  {
    id: "slot8",
    weekday: 4,
    start: "19:00",
    end: "20:00",
    mode: "online" as const,
  },
  {
    id: "slot9",
    weekday: 5,
    start: "09:00",
    end: "10:00",
    mode: "offline" as const,
    place: "Crescent Court",
  },
  {
    id: "slot10",
    weekday: 5,
    start: "18:00",
    end: "19:00",
    mode: "online" as const,
  },
  {
    id: "slot11",
    weekday: 6,
    start: "09:00",
    end: "10:00",
    mode: "offline" as const,
    place: "Sports Center",
  },
  {
    id: "slot12",
    weekday: 6,
    start: "10:00",
    end: "11:00",
    mode: "offline" as const,
    place: "Pickleball Club",
  },
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type ScheduledSession = {
  sessionNumber: number;
  sessionTemplate: SessionTemplate;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  mode: "online" | "offline";
};

export default function ScheduleSessionBlock() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [sessionTimes, setSessionTimes] = useState<
    Record<string, { startTime: string; endTime: string }>
  >({});
  const [editingSession, setEditingSession] = useState<number | null>(null);
  const [tempStartTime, setTempStartTime] = useState("");
  const [tempEndTime, setTempEndTime] = useState("");
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Start next week by default
    return date.toISOString().split("T")[0];
  });

  const sessionBlock = useMemo(() => {
    if (!id) return null;
    return (
      getSessionBlockById(id) ||
      MOCK_SESSION_BLOCKS.find((block) => block.id === id)
    );
  }, [id]);

  const generateSchedule = useMemo(() => {
    if (!sessionBlock) return [];

    const sessions: ScheduledSession[] = [];

    // Generate session dates
    for (let i = 0; i < sessionBlock.totalSessions; i++) {
      const sessionDate = new Date(startDate);
      let daysAdded = 0;

      // Find the i-th date after start date
      while (daysAdded <= i) {
        if (daysAdded === i) {
          const sessionTemplate =
            sessionBlock.sessions[i] || sessionBlock.sessions[0];
          const sessionKey = (i + 1).toString();

          // Get custom time or use default
          const customTime = sessionTimes[sessionKey];
          const startTime = customTime?.startTime || "09:00";
          const endTime = customTime?.endTime || "10:00";

          sessions.push({
            sessionNumber: i + 1,
            sessionTemplate,
            date: sessionDate.toISOString().split("T")[0],
            startTime,
            endTime,
            location: sessionBlock.courtAddress || "Online",
            mode: sessionBlock.deliveryMode,
          });
          break;
        }
        daysAdded++;
        sessionDate.setDate(sessionDate.getDate() + 1);
      }
    }

    return sessions;
  }, [sessionBlock, startDate, sessionTimes]);

  const handleTimeUpdate = (
    sessionNumber: number,
    startTime: string,
    endTime: string,
  ) => {
    setSessionTimes((prev) => ({
      ...prev,
      [sessionNumber.toString()]: { startTime, endTime },
    }));
    setEditingSession(null);
  };

  const handleEditSession = (sessionNumber: number) => {
    const currentTime = sessionTimes[sessionNumber.toString()] || {
      startTime: "09:00",
      endTime: "10:00",
    };
    setTempStartTime(currentTime.startTime);
    setTempEndTime(currentTime.endTime);
    setEditingSession(sessionNumber);
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setTempStartTime("");
    setTempEndTime("");
  };

  const handleSaveTimeEdit = (sessionNumber: number) => {
    if (tempStartTime && tempEndTime) {
      handleTimeUpdate(sessionNumber, tempStartTime, tempEndTime);
    }
  };

  const handleRescheduleSession = (
    sessionNumber: number,
    newStartTime: string,
    newEndTime: string,
  ) => {
    Alert.alert(
      "Reschedule Session",
      `Are you sure you want to reschedule session ${sessionNumber} to ${newStartTime} - ${newEndTime}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reschedule",
          onPress: () => {
            handleTimeUpdate(sessionNumber, newStartTime, newEndTime);
            Alert.alert(
              "Success",
              `Session ${sessionNumber} has been rescheduled.`,
            );
          },
        },
      ],
    );
  };

  const handleSaveSchedule = () => {
    if (!sessionBlock) return;

    // In a real app, this would save to a backend
    console.log("Saving schedule:", {
      sessionBlockId: sessionBlock.id,
      startDate,
      sessions: generateSchedule,
    });

    Alert.alert(
      "Schedule Saved",
      `Successfully saved schedule for "${sessionBlock.title}" with ${generateSchedule.length} sessions.`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const getWeekdayName = (weekday: number) => WEEKDAYS[weekday];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getAvailableSlotsForDate = (date: Date) => {
    const weekday = date.getDay();
    return MOCK_AVAILABILITY.filter((slot) => slot.weekday === weekday);
  };

  if (!sessionBlock) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#64748b" }}>
            Session block not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#475569" />
          </TouchableOpacity>
          <Text style={styles.title}>Schedule Sessions</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.subtitle}>{sessionBlock.title}</Text>
      </View>

      {/* Start Date Selection */}
      <View style={styles.startDateSection}>
        <Text style={styles.sectionTitle}>Start Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            // In a real app, show date picker
            Alert.alert("Date Picker", "Date picker would open here");
          }}
        >
          <Ionicons name="calendar-outline" size={20} color="#64748b" />
          <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          <Ionicons name="chevron-down" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Generated Schedule */}
      <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Session Schedule</Text>
        <Text style={styles.scheduleInfo}>
          Based on your availability, {sessionBlock.totalSessions} sessions will
          be scheduled:
        </Text>

        <FlatList
          data={generateSchedule}
          keyExtractor={(item) => item.sessionNumber.toString()}
          contentContainerStyle={styles.scheduleList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const isEditing = editingSession === item.sessionNumber;
            const currentTime = sessionTimes[item.sessionNumber.toString()] || {
              startTime: "09:00",
              endTime: "10:00",
            };

            return (
              <View style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionNumber}>
                    <Text style={styles.sessionNumberText}>
                      {item.sessionNumber}
                    </Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>
                      {item.sessionTemplate.title}
                    </Text>
                    <Text style={styles.sessionDate}>
                      {formatDate(item.date)}
                    </Text>
                    <Text style={styles.sessionDuration}>
                      {item.sessionTemplate.duration} minutes
                    </Text>
                  </View>
                </View>

                <View style={styles.timeSection}>
                  {isEditing ? (
                    <View style={styles.timeEditor}>
                      <Text style={styles.timeEditorLabel}>
                        Edit Time Range:
                      </Text>
                      <View style={styles.timeInputsContainer}>
                        <View style={styles.timeInputWrapper}>
                          <Text style={styles.timeInputLabel}>Start:</Text>
                          <TextInput
                            style={styles.timeInput}
                            value={tempStartTime}
                            onChangeText={setTempStartTime}
                            placeholder="09:00"
                            placeholderTextColor="#94a3b8"
                          />
                        </View>
                        <Text style={styles.timeToText}>to</Text>
                        <View style={styles.timeInputWrapper}>
                          <Text style={styles.timeInputLabel}>End:</Text>
                          <TextInput
                            style={styles.timeInput}
                            value={tempEndTime}
                            onChangeText={setTempEndTime}
                            placeholder="10:00"
                            placeholderTextColor="#94a3b8"
                          />
                        </View>
                      </View>
                      <View style={styles.timeEditorActions}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={handleCancelEdit}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.saveTimeButton}
                          onPress={() => handleSaveTimeEdit(item.sessionNumber)}
                        >
                          <Text style={styles.saveTimeButtonText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.timeDisplay}>
                      <TouchableOpacity
                        style={styles.timeDisplayCard}
                        onPress={() => handleEditSession(item.sessionNumber)}
                      >
                        <View style={styles.timeDisplayContent}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color="#64748b"
                          />
                          <View style={styles.timeDisplayText}>
                            <Text style={styles.timeDisplayRange}>
                              {item.startTime} - {item.endTime}
                            </Text>
                            <Text style={styles.timeDisplayHint}>
                              Tap to edit
                            </Text>
                          </View>
                          <Ionicons
                            name="create-outline"
                            size={16}
                            color="#94a3b8"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Show fixed location from session block */}
                  <View style={styles.fixedLocation}>
                    <Ionicons
                      name={
                        sessionBlock?.deliveryMode === "online"
                          ? "videocam"
                          : "location"
                      }
                      size={14}
                      color="#64748b"
                    />
                    <Text style={styles.fixedLocationText}>
                      {sessionBlock?.deliveryMode === "online"
                        ? "Online Session"
                        : sessionBlock?.courtAddress || "Location TBD"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSchedule}
        >
          <Text style={styles.saveButtonText}>Save Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  startDateSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginHorizontal: 12,
  },
  scheduleSection: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scheduleInfo: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    lineHeight: 20,
  },
  scheduleList: {
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
  sessionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sessionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sessionNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  sessionDuration: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
  slotSelection: {
    marginTop: 8,
  },
  slotLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  timeChip: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minWidth: 60,
  },
  timeChipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  timeChipTextSelected: {
    color: "#fff",
  },
  fixedLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  fixedLocationText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  timeSection: {
    marginTop: 12,
  },
  timeEditor: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  timeEditorLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 12,
  },
  timeInputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  timeInputWrapper: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  timeInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "600",
  },
  timeToText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  timeEditorActions: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  saveTimeButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveTimeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  timeDisplay: {
    marginTop: 8,
  },
  timeDisplayCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  timeDisplayContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeDisplayText: {
    flex: 1,
  },
  timeDisplayRange: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  timeDisplayHint: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
  slotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  slotChip: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  slotChipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  slotTime: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  slotTimeSelected: {
    color: "#fff",
  },
  slotLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  slotLocationText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  slotLocationTextSelected: {
    color: "#e0f2fe",
  },
  saveButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
