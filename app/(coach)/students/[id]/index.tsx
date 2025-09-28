import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SessionNotes from "../sessionNotes";

// TypeScript interfaces
interface Student {
  id: string;
  name: string;
  avatar: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  progress: number;
  sessions: number;
  nextSession?: {
    date: string;
    time: string;
    type: "Online" | "Offline";
    location?: string;
  };
  strengths: string[];
  improvements: string[];
  goals: string[];
  notes: string;
}

interface Session {
  id: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: "completed" | "upcoming" | "cancelled";
  notes?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: "pending" | "completed";
  category: "technique" | "strategy" | "fitness" | "homework";
}

// Mock data
const STUDENTS_DB: Record<string, Student> = {
  "1": {
    id: "1",
    name: "John Smith",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: "Beginner",
    rating: 4.8,
    progress: 75,
    sessions: 8,
    nextSession: {
      date: "2024-01-20",
      time: "2:00 PM",
      type: "Online",
    },
    strengths: ["Consistency", "Footwork"],
    improvements: ["Backhand", "Serve"],
    goals: ["Master Forehand", "Improve Net Play"],
    notes: "Focused student, responds well to technical corrections.",
  },
  "2": {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: "Intermediate",
    rating: 4.9,
    progress: 60,
    sessions: 12,
    nextSession: {
      date: "2024-01-18",
      time: "4:30 PM",
      type: "Offline",
      location: "Court 1",
    },
    strengths: ["Power", "Strategy"],
    improvements: ["Net Play", "Consistency"],
    goals: ["Tournament Ready", "Mental Game"],
    notes:
      "Strong player with good court awareness. Needs work on consistency.",
  },
  "3": {
    id: "3",
    name: "Mike Wilson",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: "Advanced",
    rating: 5.0,
    progress: 90,
    sessions: 20,
    strengths: ["All-around", "Mental Game"],
    improvements: ["Fine-tuning"],
    goals: ["Competition Level", "Teaching Others"],
    notes: "Excellent student, ready for competitive play.",
  },
};

const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "60 min",
    type: "Individual Training",
    status: "completed",
    notes: "Great progress on forehand technique",
  },
  {
    id: "2",
    date: "2024-01-10",
    time: "2:00 PM",
    duration: "60 min",
    type: "Match Play",
    status: "completed",
    notes: "Good court coverage, need to work on volleys",
  },
  {
    id: "3",
    date: "2024-01-20",
    time: "2:00 PM",
    duration: "60 min",
    type: "Individual Training",
    status: "upcoming",
  },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    title: "Forehand Practice",
    description: "Practice forehand strokes for 30 minutes daily",
    dueDate: "2024-01-25",
    status: "pending",
    category: "technique",
  },
  {
    id: "2",
    title: "Footwork Drills",
    description: "Complete ladder drills and cone exercises",
    status: "completed",
    category: "fitness",
  },
];

export default function StudentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<
    "overview" | "sessions" | "assignments" | "notes"
  >("overview");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    category: "technique" as Assignment["category"],
    dueDate: "",
  });

  const student = id ? STUDENTS_DB[id] : null;
  const sessions = MOCK_SESSIONS.filter(
    (session) => session.status === "completed",
  );
  const [assignments, setAssignments] =
    useState<Assignment[]>(MOCK_ASSIGNMENTS);

  if (!student) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="user-x" size={48} color="#6b7280" />
          <Text style={styles.errorText}>Student not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backToListButton}
          >
            <Text style={styles.backToListText}>Back to Students</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const addAssignment = () => {
    if (!newAssignment.title.trim()) return;

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      status: "pending",
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({
      title: "",
      description: "",
      category: "technique",
      dueDate: "",
    });
    setShowAssignmentModal(false);
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              status:
                assignment.status === "completed"
                  ? "pending"
                  : ("completed" as const),
            }
          : assignment,
      ),
    );
  };

  const deleteAssignment = (assignmentId: string) => {
    Alert.alert(
      "Delete Assignment",
      "Are you sure you want to delete this assignment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setAssignments(assignments.filter((a) => a.id !== assignmentId)),
        },
      ],
    );
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Next Session Card */}
      {student.nextSession && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="calendar" size={20} color="#4f46e5" />
            <Text style={styles.cardTitle}>Next Session</Text>
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionDate}>
              {student.nextSession.date} at {student.nextSession.time}
            </Text>
            <View style={styles.sessionMeta}>
              <View
                style={[
                  styles.sessionTypeBadge,
                  student.nextSession.type === "Online"
                    ? styles.onlineBadge
                    : styles.offlineBadge,
                ]}
              >
                <Text style={styles.sessionTypeText}>
                  {student.nextSession.type}
                </Text>
              </View>
              {student.nextSession.location && (
                <Text style={styles.sessionLocation}>
                  {student.nextSession.location}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push(`/(coach)/calendar/session/${student.id}`)
            }
          >
            <Feather name="video" size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Join Session</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Progress Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Feather name="trending-up" size={20} color="#10b981" />
          <Text style={styles.cardTitle}>Progress Overview</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Overall Progress</Text>
          <Text style={styles.progressValue}>{student.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${student.progress}%` }]}
          />
        </View>
        <Text style={styles.progressSummary}>
          {student.sessions} sessions completed •{" "}
          {student.progress >= 70
            ? "Excellent"
            : student.progress >= 50
              ? "Good"
              : "Needs improvement"}{" "}
          progress
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() =>
              router.push(
                `/(coach)/calendar/session/new?studentId=${student.id}`,
              )
            }
          >
            <Feather name="calendar" size={20} color="#4f46e5" />
            <Text style={styles.quickActionText}>Schedule Session</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setShowAssignmentModal(true)}
          >
            <Feather name="plus-circle" size={20} color="#10b981" />
            <Text style={styles.quickActionText}>Add Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setActiveTab("notes")}
          >
            <Feather name="message-square" size={20} color="#f59e0b" />
            <Text style={styles.quickActionText}>View Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderSessions = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Session History ({sessions.length})
        </Text>
        {sessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{session.type}</Text>
              <View style={[styles.statusBadge, styles.completedBadge]}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
            <Text style={styles.sessionDetails}>
              {session.date} • {session.time} • {session.duration}
            </Text>
            {session.notes && (
              <Text style={styles.sessionNotes}>{session.notes}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAssignments = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Assignments</Text>
          <TouchableOpacity
            onPress={() => setShowAssignmentModal(true)}
            style={styles.addButton}
          >
            <Feather name="plus" size={20} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        {assignments.map((assignment) => (
          <View key={assignment.id} style={styles.assignmentCard}>
            <TouchableOpacity
              onPress={() => toggleAssignmentStatus(assignment.id)}
              style={styles.assignmentHeader}
            >
              <View style={styles.assignmentLeft}>
                <View
                  style={[
                    styles.checkbox,
                    assignment.status === "completed" &&
                      styles.checkboxCompleted,
                  ]}
                >
                  {assignment.status === "completed" && (
                    <Feather name="check" size={14} color="#ffffff" />
                  )}
                </View>
                <View>
                  <Text
                    style={[
                      styles.assignmentTitle,
                      assignment.status === "completed" &&
                        styles.assignmentTitleCompleted,
                    ]}
                  >
                    {assignment.title}
                  </Text>
                  <Text style={styles.assignmentDescription}>
                    {assignment.description}
                  </Text>
                  {assignment.dueDate && (
                    <Text style={styles.assignmentDue}>
                      Due: {assignment.dueDate}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deleteAssignment(assignment.id)}
                style={styles.deleteButton}
              >
                <Feather name="trash-2" size={16} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderNotes = () => (
    <View style={{ flex: 1 }}>
      <SessionNotes
        sessionId={`student_${student.id}`}
        title="Student Notes"
        studentName={student.name}
        readonly={false}
        embedded={true}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Feather name="more-horizontal" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Student Info */}
        <View style={styles.studentHeader}>
          <Image source={{ uri: student.avatar }} style={styles.avatar} />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentLevel}>{student.level}</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>{student.rating} rating</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{student.sessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{student.progress}%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {[
          { key: "overview", label: "Overview", icon: "home" },
          { key: "sessions", label: "Sessions", icon: "calendar" },
          { key: "assignments", label: "Tasks", icon: "check-circle" },
          { key: "notes", label: "Notes", icon: "file-text" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as any)}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          >
            <Feather
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? "#4f46e5" : "#6b7280"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "sessions" && renderSessions()}
        {activeTab === "assignments" && renderAssignments()}
        {activeTab === "notes" && renderNotes()}
      </View>

      {/* Assignment Modal */}
      <Modal visible={showAssignmentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Assignment</Text>
              <TouchableOpacity
                onPress={() => setShowAssignmentModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={newAssignment.title}
              onChangeText={(text) =>
                setNewAssignment({ ...newAssignment, title: text })
              }
              placeholder="Assignment title"
              style={styles.modalInput}
            />

            <TextInput
              value={newAssignment.description}
              onChangeText={(text) =>
                setNewAssignment({ ...newAssignment, description: text })
              }
              placeholder="Description"
              multiline
              style={[styles.modalInput, styles.textArea]}
            />

            <View style={styles.categorySelector}>
              {(["technique", "strategy", "fitness", "homework"] as const).map(
                (category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() =>
                      setNewAssignment({ ...newAssignment, category })
                    }
                    style={[
                      styles.categoryButton,
                      newAssignment.category === category &&
                        styles.activeCategoryButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        newAssignment.category === category &&
                          styles.activeCategoryButtonText,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowAssignmentModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addAssignment}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>Add Assignment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  studentLevel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  statsContainer: {
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f0f9ff",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 4,
  },
  activeTabText: {
    color: "#4f46e5",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
    flex: 1,
  },
  sessionInfo: {
    marginBottom: 16,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  onlineBadge: {
    backgroundColor: "#dcfce7",
  },
  offlineBadge: {
    backgroundColor: "#dbeafe",
  },
  sessionTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
  },
  sessionLocation: {
    fontSize: 14,
    color: "#6b7280",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: "#6b7280",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  progressSummary: {
    fontSize: 14,
    color: "#6b7280",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 4,
  },
  sessionCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadge: {
    backgroundColor: "#10b981",
  },
  upcomingBadge: {
    backgroundColor: "#f59e0b",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  sessionDetails: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  sessionNotes: {
    fontSize: 14,
    color: "#1f2937",
    fontStyle: "italic",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  assignmentCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  assignmentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  assignmentLeft: {
    flexDirection: "row",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  assignmentTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  assignmentDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  assignmentDue: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 16,
  },
  backToListButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#4f46e5",
    borderRadius: 8,
  },
  backToListText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  closeButton: {
    padding: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeCategoryButton: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  activeCategoryButtonText: {
    color: "#ffffff",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#4f46e5",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
