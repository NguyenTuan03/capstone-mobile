import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TypeScript interfaces
interface Session {
  id: number;
  student: string;
  time: string;
  date: string;
  type: "Online" | "Offline";
  level: "Beginner" | "Intermediate" | "Advanced";
  avatar: string;
  specialty: string;
  price: number;
}

interface Student {
  id: number;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  sessions: number;
  rating: number;
  avatar: string;
  lastSession: string;
  nextGoal: string;
  strengths: string[];
  improvements: string[];
}

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface Earnings {
  today: number;
  week: number;
  month: number;
  pending: number;
}

interface SessionCardProps {
  session: Session;
  isUpcoming?: boolean;
}

interface StudentCardProps {
  student: Student;
}

const upcomingSessions: Session[] = [
  {
    id: 1,
    student: "John Smith",
    time: "2:00 PM - 3:00 PM",
    date: "Today",
    type: "Online",
    level: "Beginner",
    avatar: "🏓",
    specialty: "Basic Strokes",
    price: 45,
  },
  {
    id: 2,
    student: "Sarah Johnson",
    time: "4:30 PM - 5:30 PM",
    date: "Today",
    type: "Offline",
    level: "Intermediate",
    avatar: "🎾",
    specialty: "Advanced Techniques",
    price: 60,
  },
  {
    id: 3,
    student: "Mike Wilson",
    time: "10:00 AM - 11:00 AM",
    date: "Tomorrow",
    type: "Online",
    level: "Advanced",
    avatar: "🏆",
    specialty: "Tournament Prep",
    price: 75,
  },
];

const earnings: Earnings = {
  today: 180,
  week: 1350,
  month: 5240,
  pending: 420,
};

const notifications: Notification[] = [
  {
    id: 1,
    type: "session",
    message: "John Smith joined your session",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "payment",
    message: "Payment received: $60",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "review",
    message: "New 5-star review from Sarah",
    time: "2 hours ago",
  },
];

// Styles
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerContainer: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    marginLeft: 12,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  // Content styles
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  viewAllButton: {
    color: "#4f46e5",
    fontSize: 14,
    fontWeight: "600",
  },
  // Card styles
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  studentAvatar: {
    width: 64,
    height: 64,
    backgroundColor: "#f3f4f6",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  cardSubtitle2: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineBadge: {
    backgroundColor: "#dcfce7",
  },
  offlineBadge: {
    backgroundColor: "#dbeafe",
  },
  badgeTextGreen: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextBlue: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "600",
  },
  cardInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    color: "#6b7280",
    fontSize: 14,
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  iconOnlyButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionButton: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  quickActionIndigoButton: {
    backgroundColor: "#4f46e5",
  },
  quickActionGreenButton: {
    backgroundColor: "#059669",
  },
  quickActionOrangeButton: {
    backgroundColor: "#ea580c",
  },
  quickActionPurpleButton: {
    backgroundColor: "#7c3aed",
  },
  quickActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  // Progress bar
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4f46e5",
    borderRadius: 4,
  },
  // Goal section
  goalContainer: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  goalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  // Rating
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  sessionCount: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  // Activity cards
  activityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityIconGreen: {
    backgroundColor: "#dcfce7",
  },
  activityIconBlue: {
    backgroundColor: "#dbeafe",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  // Notifications
  notificationDropdown: {
    position: "absolute",
    top: 64,
    left: 16,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 320,
    zIndex: 50,
  },
  notificationHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  notificationText: {
    fontSize: 14,
    color: "#1f2937",
  },
  notificationTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
});

// Main component
const CoachHomeScreen: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const { top, bottom } = useSafeAreaInsets();
  const Header: React.FC = () => (
    <View
      style={{
        backgroundColor: "#4f46e5",
        paddingHorizontal: 16,
        paddingVertical: 24,
        paddingTop: top,
        paddingBottom: bottom + 50,
      }}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={{ fontSize: 24 }}>🏓</Text>
          </View>
          <View>
            <Text style={styles.headerText}>Good morning,</Text>
            <Text style={styles.headerTitle}>Coach Anderson</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setShowNotifications(!showNotifications)}
            style={[styles.iconButton, { position: "relative" }]}
          >
            <Feather name="bell" size={20} color="#ffffff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="settings" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {upcomingSessions.filter((s) => s.date === "Today").length}
          </Text>
          <Text style={styles.statLabel}>Today&apos;s Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${earnings.today}</Text>
          <Text style={styles.statLabel}>Today&apos;s Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  const NotificationDropdown: React.FC = () =>
    showNotifications ? (
      <View style={styles.notificationDropdown}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>Notifications</Text>
        </View>
        <ScrollView>
          {notifications.map((notif) => (
            <TouchableOpacity key={notif.id} style={styles.notificationItem}>
              <Text style={styles.notificationText}>{notif.message}</Text>
              <Text style={styles.notificationTime}>{notif.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ) : null;

  const SessionCard: React.FC<SessionCardProps> = ({
    session,
    isUpcoming = false,
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.cardAvatar}>
            <Text style={{ fontSize: 20 }}>{session.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{session.student}</Text>
            <Text style={styles.cardSubtitle}>
              {session.level} • {session.specialty}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.badge,
            session.type === "Online"
              ? styles.onlineBadge
              : styles.offlineBadge,
          ]}
        >
          <Text
            style={
              session.type === "Online"
                ? styles.badgeTextGreen
                : styles.badgeTextBlue
            }
          >
            {session.type}
          </Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color="#6b7280" />
          <Text style={styles.infoText}>
            {session.date} • {session.time}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="dollar-sign" size={16} color="#6b7280" />
          <Text style={styles.infoText}>${session.price}/session</Text>
        </View>
      </View>

      {isUpcoming && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Feather name="video" size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Join Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconOnlyButton}>
            <Feather name="message-circle" size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconOnlyButton}>
            <Feather name="phone" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const StudentCard: React.FC<StudentCardProps> = ({ student }) => (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { alignItems: "center" }]}>
        <View style={styles.studentAvatar}>
          <Text style={{ fontSize: 24 }}>{student.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{student.name}</Text>
          <Text style={styles.cardSubtitle}>{student.level}</Text>
          <Text style={styles.cardSubtitle2}>
            Last session: {student.lastSession}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingRow}>
            <Feather name="star" size={14} color="#facc15" />
            <Text style={styles.ratingText}>{student.rating}</Text>
          </View>
          <Text style={styles.sessionCount}>{student.sessions} sessions</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{student.progress}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBar, { width: `${student.progress}%` }]}
          />
        </View>
      </View>

      {/* Next Goal */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalLabel}>Next Goal:</Text>
        <Text style={styles.goalText}>{student.nextGoal}</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Feather name="eye" size={16} color="#374151" />
          <Text style={styles.secondaryButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Feather name="calendar" size={16} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HomeScreen: React.FC = () => (
    <ScrollView style={styles.container}>
      <Header />
      <NotificationDropdown />

      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              onPress={() => setShowSessionModal(true)}
              style={[styles.quickActionButton, styles.quickActionIndigoButton]}
            >
              <Feather name="plus" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>New Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionGreenButton]}
            >
              <Feather name="award" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>Assign Drill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionOrangeButton]}
            >
              <Feather name="message-circle" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionPurpleButton]}
            >
              <Feather name="camera" size={24} color="#ffffff" />
              <Text style={styles.quickActionText}>AI Analysis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Sessions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingSessions
            .filter((s) => s.date === "Today")
            .map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isUpcoming={true}
              />
            ))}
        </View>

        {/* Recent Students Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View>
            <View style={styles.activityCard}>
              <View style={styles.activityRow}>
                <View
                  style={[
                    styles.activityIconContainer,
                    styles.activityIconGreen,
                  ]}
                >
                  <Feather name="zap" size={16} color="#059669" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Sarah completed drill assignment
                  </Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>
            </View>
            <View style={styles.activityCard}>
              <View style={styles.activityRow}>
                <View
                  style={[
                    styles.activityIconContainer,
                    styles.activityIconBlue,
                  ]}
                >
                  <Feather name="star" size={16} color="#2563eb" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    New 5-star review from John
                  </Text>
                  <Text style={styles.activityTime}>5 hours ago</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return <HomeScreen />;
};

export default CoachHomeScreen;
