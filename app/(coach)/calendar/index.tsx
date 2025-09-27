import { MOCK_ENROLLMENTS, MOCK_SESSION_BLOCKS } from "@/mocks/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** ================== TYPES ================== */
type Mode = "online" | "offline";
type Status = "upcoming" | "completed" | "in-progress";

type ScheduledSession = {
  sessionNumber: number;
  id: string;
  sessionId: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  student: string;
  studentId: string;
  sessionBlockTitle: string;
  sessionTitle: string;
  mode: Mode;
  location: string;
  status: Status;
  enrollmentId: string;
  sessionBlockId: string;
  meetingUrl?: string;
};

/** ================== MOCK DATA FROM SESSION BLOCKS ================== */
// Generate scheduled sessions from session blocks and enrollments
const generateScheduledSessions = (): ScheduledSession[] => {
  const sessions: ScheduledSession[] = [];

  MOCK_ENROLLMENTS.forEach((enrollment) => {
    const sessionBlock = MOCK_SESSION_BLOCKS.find(
      (block) => block.id === enrollment.sessionBlockId,
    );
    if (!sessionBlock) return;

    // Generate sessions based on enrollment progress
    const sessionsToGenerate = Math.min(
      enrollment.currentSession,
      sessionBlock.totalSessions,
    );

    for (let sessionNum = 1; sessionNum <= sessionsToGenerate; sessionNum++) {
      const sessionTemplate = sessionBlock.sessions.find(
        (s) => s.sessionNumber === sessionNum,
      );
      if (!sessionTemplate) continue;

      // Calculate session date (start from enrollment date + weeks)
      const sessionDate = new Date(enrollment.startDate);
      sessionDate.setDate(sessionDate.getDate() + (sessionNum - 1) * 7); // Weekly sessions

      const sessionId = `${enrollment.id}-session${sessionNum}`;
      const dateStr = sessionDate.toISOString().split("T")[0];

      // Mock times for demo
      const startTime = sessionNum % 2 === 0 ? "14:00" : "09:00";
      const endTime = sessionNum % 2 === 0 ? "15:30" : "10:30";

      const status = enrollment.completedSessions.includes(sessionNum)
        ? "completed"
        : "upcoming";

      sessions.push({
        id: sessionId,
        sessionId: sessionTemplate.id,
        date: dateStr,
        start: startTime,
        end: endTime,
        student: `Student ${enrollment.studentId}`,
        sessionBlockTitle: sessionBlock.title,
        sessionTitle: sessionTemplate.title,
        mode: sessionBlock.deliveryMode,
        location:
          sessionBlock.deliveryMode === "online"
            ? sessionBlock.meetingLink || "Online"
            : sessionBlock.courtAddress || "Court",
        status,
        enrollmentId: enrollment.id,
        sessionBlockId: sessionBlock.id,
        meetingUrl: sessionBlock.meetingLink,
        sessionNumber: sessionNum,
        studentId: "",
      });
    }
  });

  return sessions;
};

const SCHEDULED_SESSIONS = generateScheduledSessions();

/** ================== SCREEN ================== */
export default function CoachCalendar() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>(getTodayDate());
  const [sessions] = useState<ScheduledSession[]>(SCHEDULED_SESSIONS);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar");

  // Session statistics
  const sessionStats = useMemo(() => {
    const stats = {
      total: sessions.length,
      upcoming: sessions.filter((s) => s.status === "upcoming").length,
      inProgress: sessions.filter((s) => s.status === "in-progress").length,
      completed: sessions.filter((s) => s.status === "completed").length,
    };
    return stats;
  }, [sessions]);

  const marked = useMemo(
    () => buildMarkedDates(sessions, selected),
    [sessions, selected],
  );

  const daySessions = useMemo(
    () =>
      sessions
        .filter((s) => s.date === selected)
        .filter((s) => filter === "all" || s.status === filter)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [sessions, selected, filter],
  );

  const handleSessionPress = (session: ScheduledSession) => {
    // Navigate to session detail page for automatically booked session
    router.push({
      pathname: "/(coach)/calendar/session/[id]",
      params: {
        id: session.id,
        enrollmentId: session.enrollmentId,
        fromCalendar: "true",
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch trình</Text>
        <Text style={styles.headerSubtitle}>
          Các buổi huấn luyện đã lên lịch
        </Text>

        {/* Session Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Tổng cộng"
            value={sessionStats.total}
            color="#3b82f6"
          />
          <StatCard
            title="Sắp tới"
            value={sessionStats.upcoming}
            color="#f59e0b"
          />
          <StatCard
            title="Đang diễn ra"
            value={sessionStats.inProgress}
            color="#8b5cf6"
          />
          <StatCard
            title="Hoàn thành"
            value={sessionStats.completed}
            color="#10b981"
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "calendar" && styles.tabActive]}
          onPress={() => setActiveTab("calendar")}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={activeTab === "calendar" ? "#fff" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "calendar" && styles.tabTextActive,
            ]}
          >
            Lịch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.tabActive]}
          onPress={() => setActiveTab("list")}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={activeTab === "list" ? "#fff" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.tabTextActive,
            ]}
          >
            Tất cả buổi học
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar View */}
      {activeTab === "calendar" && (
        <>
          <Calendar
            current={selected}
            onDayPress={(d: any) => setSelected(d.dateString)}
            markedDates={marked}
            theme={{
              todayTextColor: "#3b82f6",
              arrowColor: "#3b82f6",
              monthTextColor: "#1e293b",
              textMonthFontWeight: "800",
              textDayFontWeight: "700",
              textSectionTitleColor: "#64748b",
              selectedDayBackgroundColor: "#3b82f6",
              selectedDayTextColor: "#fff",
            }}
            style={styles.calendar}
          />

          {/* Filter Pills - only for calendar view */}
          <View style={styles.filterContainer}>
            <FilterPill
              label="Tất cả"
              count={sessionStats.total}
              active={filter === "all"}
              onPress={() => setFilter("all")}
            />
            <FilterPill
              label="Sắp tới"
              count={sessionStats.upcoming}
              active={filter === "upcoming"}
              onPress={() => setFilter("upcoming")}
            />
            <FilterPill
              label="Đang diễn ra"
              count={sessionStats.inProgress}
              active={filter === "in-progress"}
              onPress={() => setFilter("in-progress")}
            />
            <FilterPill
              label="Hoàn thành"
              count={sessionStats.completed}
              active={filter === "completed"}
              onPress={() => setFilter("completed")}
            />
          </View>

          {/* Sessions List */}
          <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
            <View style={styles.legend}>
              <LegendDot color="#f59e0b" label="Sắp tới" />
              <LegendDot color="#8b5cf6" label="Đang diễn ra" />
              <LegendDot color="#10b981" label="Hoàn thành" />
            </View>

            {daySessions.length === 0 ? (
              <EmptyState
                title="Không có buổi học vào ngày này"
                subtitle="Các buổi học từ Khóa học của bạn sẽ hiển thị ở đây"
              />
            ) : (
              <FlatList
                data={daySessions}
                keyExtractor={(x) => x.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => (
                  <SessionCard
                    session={item}
                    onPress={() => handleSessionPress(item)}
                  />
                )}
              />
            )}
          </View>
        </>
      )}

      {/* Session List View */}
      {activeTab === "list" && (
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 10 }}>
          {/* Filter Pills for list view */}
          <View style={styles.filterContainer}>
            <FilterPill
              label="Tất cả"
              count={sessionStats.total}
              active={filter === "all"}
              onPress={() => setFilter("all")}
            />
            <FilterPill
              label="Sắp tới"
              count={sessionStats.upcoming}
              active={filter === "upcoming"}
              onPress={() => setFilter("upcoming")}
            />
            <FilterPill
              label="Đang diễn ra"
              count={sessionStats.inProgress}
              active={filter === "in-progress"}
              onPress={() => setFilter("in-progress")}
            />
            <FilterPill
              label="Hoàn thành"
              count={sessionStats.completed}
              active={filter === "completed"}
              onPress={() => setFilter("completed")}
            />
          </View>

          <View style={styles.legend}>
            <LegendDot color="#f59e0b" label="Sắp tới" />
            <LegendDot color="#8b5cf6" label="Đang diễn ra" />
            <LegendDot color="#10b981" label="Hoàn thành" />
          </View>

          <FlatList
            data={sessions.filter(
              (s) => filter === "all" || s.status === filter,
            )}
            keyExtractor={(x) => x.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <SessionCard
                session={item}
                onPress={() => handleSessionPress(item)}
              />
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

/** ================== Subcomponents ================== */

function SessionCard({
  session,
  onPress,
}: {
  session: ScheduledSession;
  onPress: () => void;
}) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "upcoming":
        return "#f59e0b";
      case "in-progress":
        return "#8b5cf6";
      case "completed":
        return "#10b981";
      default:
        return "#3b82f6";
    }
  };

  const color = getStatusColor(session.status);
  const actionText =
    session.status === "upcoming"
      ? "Bắt đầu"
      : session.status === "in-progress"
        ? "Tiếp tục"
        : "Xem";

  return (
    <Pressable style={styles.sessionCard} onPress={onPress}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <View style={{ marginLeft: 8, flex: 1 }}>
        <Text style={styles.sessionTitle}>{session.sessionTitle}</Text>
        <Text style={styles.sessionBlock}>{session.sessionBlockTitle}</Text>
        <Text style={styles.sessionSub}>
          {session.start}-{session.end} · {session.location}
        </Text>
        <Text style={styles.studentName}>{session.student}</Text>
        <View style={styles.actionContainer}>
          <Text style={[styles.actionText, { color }]}>{actionText}</Text>
          <Text style={styles.statusText}>
            {session.status === "upcoming"
              ? "Sắp tới"
              : session.status === "in-progress"
                ? "Đang diễn ra"
                : "Hoàn thành"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
    </Pressable>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}
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
      <Text style={{ color: "#64748b", fontWeight: "600", fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function FilterPill({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.filterPill, active && styles.filterPillActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

/** ================== Utils ================== */

function getTodayDate(): string {
  const dt = new Date();
  return dt.toISOString().slice(0, 10);
}

function buildMarkedDates(sessions: ScheduledSession[], selected: string) {
  const marked: any = {};

  for (const s of sessions) {
    const color =
      s.status === "upcoming"
        ? "#f59e0b"
        : s.status === "in-progress"
          ? "#8b5cf6"
          : "#10b981";
    marked[s.date] ??= { dots: [] };
    if (!marked[s.date].dots.some((d: any) => d.color === color)) {
      marked[s.date].dots.push({ color });
    }
  }

  marked[selected] = {
    ...(marked[selected] ?? {}),
    selected: true,
    selectedColor: "#3b82f6",
  };

  return marked;
}

/** ================== Styles ================== */
const styles = StyleSheet.create({
  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#fff",
  },

  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
  },

  // Filter
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  filterPill: {
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterPillActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  filterLabelActive: {
    color: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  // Calendar
  calendar: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },

  // Legend
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  // Session Card
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  sessionBlock: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 4,
  },
  sessionSub: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  studentName: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },

  // Action Container
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
