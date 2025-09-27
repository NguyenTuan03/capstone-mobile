import DrillAssignmentModal from "@/components/DrillAssignmentModal";
import { MOCK_DRILLS } from "@/mocks/sessionBlocks";
import { DrillAssignment } from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{
    id: string;
    enrollmentId?: string;
    fromCalendar?: string;
  }>();

  const [showDrillModal, setShowDrillModal] = useState(false);

  // Mock session data - in real app this would come from API/Context
  // This represents an automatically booked session from a learner enrollment
  const sessionData = {
    id: id || "session-1",
    title: "Giao bóng cơ bản",
    sessionNumber: 3,
    date: "2024-01-20",
    startTime: "09:00",
    endTime: "10:30",
    mode: "offline" as "online" | "offline",
    location: "Crescent Court",
    student: "Student 1",
    status: "upcoming" as const,
    bookingType: "automatic" as const,
    drills: [
      { id: "d1", drillId: "drill-1", duration: 15 },
      { id: "d2", drillId: "drill-2", duration: 20 },
    ],
    objectives: [
      "Develop consistent power serve technique",
      "Improve serve return accuracy",
      "Build confidence in serve-return sequences",
    ],
    notes:
      "Focus on proper grip preparation and weight transfer during serve motion.",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#f59e0b";
      case "upcoming":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "upcoming":
        return "Upcoming";
      default:
        return "Unknown";
    }
  };

  const handleStartSession = () => {
    Alert.alert(
      "Start Session",
      "Are you ready to start this training session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: () => {
            Alert.alert(
              "Success",
              "Session started! Navigate to call interface.",
            );
          },
        },
      ],
    );
  };

  const handleManageDrills = () => {
    setShowDrillModal(true);
  };

  const handleSaveDrillAssignments = (assignments: DrillAssignment[]) => {
    Alert.alert("Success", "Drill assignments updated successfully!");
    setShowDrillModal(false);
  };

  const handleReschedule = () => {
    Alert.alert("Reschedule Session", "Reschedule functionality coming soon!", [
      { text: "OK" },
    ]);
  };

  const handleAddNotes = () => {
    Alert.alert("Add Notes", "Note-taking functionality coming soon!", [
      { text: "OK" },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Session Details</Text>
          <View style={styles.headerMeta}>
            <View style={styles.sessionNumberContainer}>
              <Text style={styles.sessionNumber}>
                Session {sessionData.sessionNumber}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(sessionData.status) },
                ]}
              />
              <Text style={styles.statusText}>
                {getStatusText(sessionData.status)}
              </Text>
            </View>
            <View style={styles.autoBookingContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color="#10b981"
              />
              <Text style={styles.autoBookingText}>Auto-Booked</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Session Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sessionTitle}>{sessionData.title}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>{sessionData.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>
              {sessionData.startTime} - {sessionData.endTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name={
                sessionData.mode === "online" ? "globe-outline" : "pin-outline"
              }
              size={16}
              color="#64748b"
            />
            <Text style={styles.infoText}>{sessionData.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>{sessionData.student}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          {sessionData.status === "upcoming" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              onPress={handleStartSession}
            >
              <Ionicons name="videocam-outline" size={18} color="#fff" />
              <Text style={styles.primaryActionText}>Start Session</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={handleManageDrills}
          >
            <Ionicons name="fitness-outline" size={18} color="#3b82f6" />
            <Text style={styles.secondaryActionText}>Manage Drills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={handleReschedule}
          >
            <Ionicons name="calendar-outline" size={18} color="#f59e0b" />
            <Text style={styles.secondaryActionText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={handleAddNotes}
          >
            <Ionicons name="document-text-outline" size={18} color="#10b981" />
            <Text style={styles.secondaryActionText}>Add Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Drills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Drills</Text>
          <View style={styles.drillsList}>
            {sessionData.drills.map((drill, index) => {
              const drillInfo = MOCK_DRILLS.find((d) => d.id === drill.drillId);
              return (
                <View key={drill.id} style={styles.drillCard}>
                  <View style={styles.drillInfo}>
                    <Text style={styles.drillName}>
                      {drillInfo?.title || `Drill ${index + 1}`}
                    </Text>
                    <Text style={styles.drillDuration}>
                      {drill.duration} minutes
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </View>
              );
            })}
          </View>
        </View>

        {/* Objectives Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Objectives</Text>
          <View style={styles.objectivesList}>
            {sessionData.objectives.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <View style={styles.objectiveBullet} />
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Coach Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coach Notes</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{sessionData.notes}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Drill Assignment Modal */}
      <DrillAssignmentModal
        visible={showDrillModal}
        onClose={() => setShowDrillModal(false)}
        sessionTemplateId={sessionData.id}
        currentAssignments={sessionData.drills.map((drill, idx) => ({
          ...drill,
          sessionTemplateId: sessionData.id,
          order: idx + 1,
          isOptional: false,
        }))}
        onSave={handleSaveDrillAssignments}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 4,
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessionNumberContainer: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b82f6",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  autoBookingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  autoBookingText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
  },

  // Actions
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  primaryAction: {
    backgroundColor: "#3b82f6",
  },
  primaryActionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryAction: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryActionText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },

  // Drills
  drillsList: {
    gap: 8,
  },
  drillCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drillInfo: {
    flex: 1,
  },
  drillName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  drillDuration: {
    fontSize: 12,
    color: "#64748b",
  },

  // Objectives
  objectivesList: {
    gap: 8,
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  objectiveBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginTop: 6,
  },
  objectiveText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    flex: 1,
  },

  // Notes
  notesCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  notesText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
