import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TypeScript interfaces
interface Session {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  title: string;
  status: "upcoming" | "completed" | "cancelled";
  deliveryMode: "online" | "offline";
  meetingLink?: string;
  courtAddress?: string;
  sessionNumber: number;
  totalSessions: number;
}

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: string;
}

interface FilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");

  const getSessionTitle = (sessionNum: number): string => {
    const titles = [
      "Basic Grip & Stance",
      "Forehand Fundamentals",
      "Backhand Technique",
      "Serving Skills",
      "Net Play Basics",
      "Court Positioning",
      "Advanced Strategies",
      "Tournament Preparation",
    ];
    return titles[sessionNum - 1] || `Session ${sessionNum}`;
  };

  // Mock scheduled sessions data
  const scheduledSessions = useMemo<Session[]>(() => {
    const sessions: Session[] = [];

    // Mock enrollments data
    const enrollments = [
      {
        id: "enroll1",
        studentId: "student1",
        studentName: "John Smith",
        sessionBlockTitle: "Beginner Fundamentals",
        currentSession: 3,
        completedSessions: [1, 2],
        startDate: "2024-09-20",
        deliveryMode: "online" as const,
        meetingLink: "https://zoom.us/j/123456789",
      },
      {
        id: "enroll2",
        studentId: "student2",
        studentName: "Sarah Johnson",
        sessionBlockTitle: "Intermediate Techniques",
        currentSession: 5,
        completedSessions: [1, 2, 3, 4],
        startDate: "2024-09-15",
        deliveryMode: "offline" as const,
        courtAddress: "Downtown Pickleball Court",
      },
      {
        id: "enroll3",
        studentId: "student3",
        studentName: "Mike Wilson",
        sessionBlockTitle: "Advanced Training",
        currentSession: 2,
        completedSessions: [1],
        startDate: "2024-09-25",
        deliveryMode: "online" as const,
        meetingLink: "https://meet.google.com/abc-defg-hij",
      },
    ];

    // Generate sessions for the next 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      // Add 1-3 random sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < sessionsPerDay; j++) {
        const enrollment =
          enrollments[Math.floor(Math.random() * enrollments.length)];
        const sessionNumber = Math.floor(Math.random() * 8) + 1;
        const hour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
        const minute = Math.random() < 0.5 ? "00" : "30";

        let status: Session["status"] = "upcoming";
        if (date < today) {
          status = Math.random() < 0.1 ? "cancelled" : "completed";
        }

        sessions.push({
          id: `session_${i}_${j}`,
          studentName: enrollment.studentName,
          studentId: enrollment.studentId,
          date: dateStr,
          time: `${hour}:${minute}`,
          duration: 60,
          title: getSessionTitle(sessionNumber),
          status,
          deliveryMode: enrollment.deliveryMode,
          meetingLink: enrollment.meetingLink,
          courtAddress: enrollment.courtAddress,
          sessionNumber,
          totalSessions: 8,
        });
      }
    }

    return sessions.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.time.localeCompare(b.time);
    });
  }, []);

  const filteredSessions = useMemo(() => {
    let filtered = scheduledSessions;

    if (viewMode === "calendar") {
      filtered = filtered.filter((s) => s.date === selectedDate);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    return filtered;
  }, [scheduledSessions, selectedDate, viewMode, filterStatus]);

  const sessionStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const upcoming = scheduledSessions.filter(
      (s) => s.status === "upcoming",
    ).length;
    const todaySessions = scheduledSessions.filter(
      (s) => s.date === today,
    ).length;
    const completed = scheduledSessions.filter(
      (s) => s.status === "completed",
    ).length;

    return { upcoming, todaySessions, completed };
  }, [scheduledSessions]);

  const getStatusColor = (status: Session["status"]): string => {
    switch (status) {
      case "upcoming":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusBgColor = (status: Session["status"]): string => {
    switch (status) {
      case "upcoming":
        return "#dbeafe";
      case "completed":
        return "#d1fae5";
      case "cancelled":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  };

  const handleJoinSession = (session: Session) => {
    if (session.deliveryMode === "online" && session.meetingLink) {
      Alert.alert(
        "Join Session",
        `Opening meeting link for ${session.studentName}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Join",
            onPress: () => console.log("Opening:", session.meetingLink),
          },
        ],
      );
    } else {
      Alert.alert(
        "Session Info",
        `Offline session with ${session.studentName}\nLocation: ${session.courtAddress || "TBD"}`,
      );
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Feather name={icon as any} size={20} color="#ffffff" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const FilterButton: React.FC<FilterButtonProps> = ({
    label,
    count,
    active,
    onPress,
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.activeFilterButton]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          active && styles.activeFilterButtonText,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const SessionCard: React.FC<{ session: Session }> = ({ session }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionStudent}>{session.studentName}</Text>
          <View style={styles.sessionMeta}>
            <Feather name="clock" size={14} color="#6b7280" />
            <Text style={styles.sessionTime}>{session.time}</Text>
            <Text style={styles.sessionDuration}>• {session.duration} min</Text>
          </View>
        </View>

        <View style={styles.sessionActions}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBgColor(session.status) },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(session.status) },
              ]}
            >
              {session.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sessionFooter}>
        <View style={styles.sessionDetails}>
          {session.deliveryMode === "online" ? (
            <View style={styles.sessionMode}>
              <Feather name="video" size={16} color="#3b82f6" />
              <Text style={styles.sessionModeText}>Online</Text>
            </View>
          ) : (
            <View style={styles.sessionMode}>
              <Feather name="map-pin" size={16} color="#10b981" />
              <Text style={styles.sessionModeText}>In-person</Text>
            </View>
          )}
        </View>

        {session.status === "upcoming" && (
          <View style={styles.sessionButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                router.push(`/(coach)/students/${session.studentId}`)
              }
            >
              <Feather name="user" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleJoinSession(session)}
            >
              <Feather
                name={session.deliveryMode === "online" ? "video" : "map-pin"}
                size={16}
                color="#ffffff"
              />
              <Text style={styles.primaryButtonText}>
                {session.deliveryMode === "online" ? "Join" : "View"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateStr = date.toISOString().split("T")[0];
      const hasSession = scheduledSessions.some((s) => s.date === dateStr);
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === today.toISOString().split("T")[0];

      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            isToday && styles.todayDay,
            hasSession && styles.hasSessionDay,
          ]}
          onPress={() => setSelectedDate(dateStr)}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.selectedDayText,
              isToday && styles.todayDayText,
            ]}
          >
            {i}
          </Text>
          {hasSession && <View style={styles.sessionDot} />}
        </TouchableOpacity>,
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Schedule</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/(coach)/calendar/create-session")}
            >
              <Feather name="plus" size={18} color="#ffffff" />
              <Text style={styles.createButtonText}>Tạo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === "calendar" && styles.activeViewMode,
              ]}
              onPress={() => setViewMode("calendar")}
            >
              <Feather
                name="calendar"
                size={18}
                color={viewMode === "calendar" ? "#4f46e5" : "#ffffff"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === "list" && styles.activeViewMode,
              ]}
              onPress={() => setViewMode("list")}
            >
              <Feather
                name="list"
                size={18}
                color={viewMode === "list" ? "#4f46e5" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Today"
            value={sessionStats.todaySessions.toString()}
            color="#3b82f6"
            icon="calendar"
          />
          <StatCard
            title="Upcoming"
            value={sessionStats.upcoming.toString()}
            color="#f59e0b"
            icon="clock"
          />
          <StatCard
            title="Completed"
            value={sessionStats.completed.toString()}
            color="#10b981"
            icon="check-circle"
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar View */}
        {viewMode === "calendar" && (
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.calendar}>{generateCalendarDays()}</View>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterButton
              label="All"
              count={filteredSessions.length}
              active={filterStatus === "all"}
              onPress={() => setFilterStatus("all")}
            />
            <FilterButton
              label="Upcoming"
              count={
                filteredSessions.filter((s) => s.status === "upcoming").length
              }
              active={filterStatus === "upcoming"}
              onPress={() => setFilterStatus("upcoming")}
            />
            <FilterButton
              label="Completed"
              count={
                filteredSessions.filter((s) => s.status === "completed").length
              }
              active={filterStatus === "completed"}
              onPress={() => setFilterStatus("completed")}
            />
            <FilterButton
              label="Cancelled"
              count={
                filteredSessions.filter((s) => s.status === "cancelled").length
              }
              active={filterStatus === "cancelled"}
              onPress={() => setFilterStatus("cancelled")}
            />
          </ScrollView>
        </View>

        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          <Text style={styles.sectionTitle}>
            {viewMode === "calendar"
              ? `Sessions on ${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`
              : "All Sessions"}
          </Text>

          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="calendar" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No sessions found</Text>
              <Text style={styles.emptySubtitle}>
                {viewMode === "calendar"
                  ? "No sessions scheduled for this date"
                  : "No sessions match your current filters"}
              </Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(coach)/calendar/create-session")}
      >
        <LinearGradient
          colors={["#3b82f6", "#1d4ed8"]}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={24} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  viewModeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeViewMode: {
    backgroundColor: "#ffffff",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statTitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 8,
    position: "relative",
  },
  selectedDay: {
    backgroundColor: "#4f46e5",
  },
  todayDay: {
    borderWidth: 2,
    borderColor: "#10b981",
  },
  hasSessionDay: {
    backgroundColor: "#f3f4f6",
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  selectedDayText: {
    color: "#ffffff",
  },
  todayDayText: {
    color: "#10b981",
    fontWeight: "bold",
  },
  sessionDot: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4f46e5",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeFilterButton: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeFilterButtonText: {
    color: "#ffffff",
  },
  sessionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  sessionStudent: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  sessionDuration: {
    fontSize: 14,
    color: "#6b7280",
  },
  sessionActions: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  sessionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionDetails: {
    flex: 1,
  },
  sessionMode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionModeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  sessionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
