import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Session = {
  id: string;
  studentName: string;
  studentAvatar: string;
  type: "online" | "offline";
  date: string;
  time: string;
  skill: string;
  status: "upcoming" | "in-progress" | "completed";
  location?: string;
};

type Student = {
  id: string;
  name: string;
  avatar: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  lastSession: string;
  sessionsCompleted: number;
};

export default function CoachHome() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Mock coach data
  const coachData = {
    name: "David Nguyen",
    avatar: "https://i.pravatar.cc/200?img=12",
    rating: 4.9,
    totalStudents: 47,
    sessionsCompleted: 312,
    isVerified: true,
    specialties: ["Dinking", "3rd Shot", "Strategy"],
    nextSession: "2:00 PM Today",
  };

  // Mock dashboard stats
  const dashboardStats = {
    todayEarnings: 450,
    todaySessions: 5,
    weeklyEarnings: 2850,
    monthlyEarnings: 12400,
    activeStudents: 28,
    completionRate: 94,
  };

  // Mock upcoming sessions
  const upcomingSessions: Session[] = [
    {
      id: "1",
      studentName: "Sarah Chen",
      studentAvatar: "https://i.pravatar.cc/200?img=1",
      type: "online",
      date: "Today",
      time: "2:00 PM",
      skill: "Advanced Dinking",
      status: "upcoming",
    },
    {
      id: "2",
      studentName: "Mike Johnson",
      studentAvatar: "https://i.pravatar.cc/200?img=2",
      type: "offline",
      date: "Today",
      time: "4:00 PM",
      skill: "Backhand Fundamentals",
      status: "upcoming",
      location: "Central Sports Complex",
    },
    {
      id: "3",
      studentName: "Emma Davis",
      studentAvatar: "https://i.pravatar.cc/200?img=3",
      type: "online",
      date: "Tomorrow",
      time: "10:00 AM",
      skill: "Strategy & Positioning",
      status: "upcoming",
    },
  ];

  // Mock recent students
  const recentStudents: Student[] = [
    {
      id: "1",
      name: "Alex Rodriguez",
      avatar: "https://i.pravatar.cc/200?img=4",
      level: "Intermediate",
      progress: 75,
      lastSession: "2 days ago",
      sessionsCompleted: 12,
    },
    {
      id: "2",
      name: "Lisa Wang",
      avatar: "https://i.pravatar.cc/200?img=5",
      level: "Beginner",
      progress: 45,
      lastSession: "1 week ago",
      sessionsCompleted: 6,
    },
    {
      id: "3",
      name: "Tom Wilson",
      avatar: "https://i.pravatar.cc/200?img=6",
      level: "Advanced",
      progress: 90,
      lastSession: "3 days ago",
      sessionsCompleted: 18,
    },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderHeader = () => (
    <LinearGradient colors={["#2E7D32", "#388E3C"]} style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.headerContent}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: coachData.avatar }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.coachName}>{coachData.name}</Text>
              {coachData.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {coachData.rating} • {coachData.totalStudents} students
              </Text>
            </View>
            <View style={styles.specialtiesRow}>
              {coachData.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/(coach)/menu")}
        >
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderDashboardStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="cash" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statNumber}>${dashboardStats.todayEarnings}</Text>
          <Text style={styles.statLabel}>Today&apos;s Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="calendar" size={24} color="#2196F3" />
          </View>
          <Text style={styles.statNumber}>{dashboardStats.todaySessions}</Text>
          <Text style={styles.statLabel}>Today&apos;s Sessions</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="people" size={24} color="#FF9800" />
          </View>
          <Text style={styles.statNumber}>{dashboardStats.activeStudents}</Text>
          <Text style={styles.statLabel}>Active Students</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.actionsScroll}
      >
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(coach)/calendar")}
        >
          <LinearGradient
            colors={["#2196F3", "#1976D2"]}
            style={styles.actionGradient}
          >
            <Ionicons name="calendar-outline" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Schedule</Text>
            <Text style={styles.actionSubtitle}>Manage calendar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(coach)/students")}
        >
          <LinearGradient
            colors={["#4CAF50", "#388E3C"]}
            style={styles.actionGradient}
          >
            <Ionicons name="people-outline" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Students</Text>
            <Text style={styles.actionSubtitle}>Track progress</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(coach)/drill")}
        >
          <LinearGradient
            colors={["#FF9800", "#F57C00"]}
            style={styles.actionGradient}
          >
            <Ionicons name="fitness-outline" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Drills</Text>
            <Text style={styles.actionSubtitle}>Create & assign</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(coach)/earnings")}
        >
          <LinearGradient
            colors={["#9C27B0", "#7B1FA2"]}
            style={styles.actionGradient}
          >
            <Ionicons name="analytics-outline" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionSubtitle}>View insights</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderUpcomingSessions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today&apos;s Sessions</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/(coach)/calendar")}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {upcomingSessions
        .filter((session) => session.date === "Today")
        .map((session) => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionCard}
            onPress={() =>
              router.push(`/(coach)/calendar/session/${session.id}`)
            }
          >
            <View style={styles.sessionContent}>
              <Image
                source={{ uri: session.studentAvatar }}
                style={styles.studentAvatar}
              />
              <View style={styles.sessionDetails}>
                <Text style={styles.studentName}>{session.studentName}</Text>
                <Text style={styles.sessionSkill}>{session.skill}</Text>
                <View style={styles.sessionMeta}>
                  <Ionicons
                    name={session.type === "online" ? "videocam" : "location"}
                    size={14}
                    color="#666"
                  />
                  <Text style={styles.sessionTime}>
                    {session.time} •{" "}
                    {session.type === "online" ? "Online" : session.location}
                  </Text>
                </View>
              </View>
              <View style={styles.sessionActions}>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>
                    {session.type === "online" ? "Join" : "Start"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

      {upcomingSessions.filter((session) => session.date === "Today").length ===
        0 && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-clear-outline" size={48} color="#C0C0C0" />
          <Text style={styles.emptyStateText}>
            No sessions scheduled for today
          </Text>
          <Text style={styles.emptyStateSubtext}>Enjoy your free time!</Text>
        </View>
      )}
    </View>
  );

  const renderWeeklyOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Overview</Text>
      <View style={styles.overviewCard}>
        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>
              ${dashboardStats.weeklyEarnings}
            </Text>
            <Text style={styles.overviewLabel}>Weekly Earnings</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>
              {dashboardStats.completionRate}%
            </Text>
            <Text style={styles.overviewLabel}>Completion Rate</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressLabel}>Week Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "75%" }]} />
          </View>
          <Text style={styles.progressText}>5 of 7 days completed</Text>
        </View>
      </View>
    </View>
  );

  const renderRecentStudents = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Students</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/(coach)/students")}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentStudents.map((student) => (
        <TouchableOpacity
          key={student.id}
          style={styles.studentCard}
          onPress={() => router.push(`/(coach)/students/${student.id}`)}
        >
          <Image
            source={{ uri: student.avatar }}
            style={styles.studentCardAvatar}
          />
          <View style={styles.studentCardInfo}>
            <Text style={styles.studentCardName}>{student.name}</Text>
            <Text style={styles.studentCardLevel}>
              {student.level} • {student.sessionsCompleted} sessions
            </Text>
            <View style={styles.studentProgressContainer}>
              <View style={styles.studentProgressBar}>
                <View
                  style={[
                    styles.studentProgressFill,
                    { width: `${student.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.studentProgressText}>
                {student.progress}%
              </Text>
            </View>
          </View>
          <Text style={styles.studentLastSession}>{student.lastSession}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityContainer}>
        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: "#E8F5E8" }]}>
            <Ionicons name="person-add" size={20} color="#4CAF50" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>New Student Enrolled</Text>
            <Text style={styles.activityDescription}>
              Jessica Martinez joined Advanced Strategy
            </Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Session Completed</Text>
            <Text style={styles.activityDescription}>
              1-hour session with Tom Wilson finished
            </Text>
            <Text style={styles.activityTime}>4 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="star" size={20} color="#FF9800" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>New Review</Text>
            <Text style={styles.activityDescription}>
              Sarah Chen left a 5-star review
            </Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2E7D32"]}
            tintColor="#2E7D32"
          />
        }
      >
        {renderDashboardStats()}
        {renderQuickActions()}
        {renderUpcomingSessions()}
        {renderWeeklyOverview()}
        {renderRecentStudents()}
        {renderRecentActivity()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  coachName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  specialtiesRow: {
    flexDirection: "row",
    gap: 6,
  },
  specialtyChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
  },
  actionsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  actionCard: {
    width: width * 0.35,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  actionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  actionSubtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
    textAlign: "center",
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  sessionSkill: {
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
    fontSize: 12,
    color: "#9ca3af",
  },
  sessionActions: {
    alignItems: "flex-end",
  },
  joinButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  overviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: "center",
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#2E7D32",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
  },
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentCardAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  studentCardInfo: {
    flex: 1,
  },
  studentCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  studentCardLevel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  studentProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  studentProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
  },
  studentProgressFill: {
    height: 4,
    backgroundColor: "#2E7D32",
    borderRadius: 2,
  },
  studentProgressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
    minWidth: 35,
  },
  studentLastSession: {
    fontSize: 11,
    color: "#9ca3af",
  },
  activityContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#9ca3af",
  },
});
