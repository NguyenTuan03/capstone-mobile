import { MOCK_DRILLS, MOCK_SESSION_PROGRESS } from "@/mocks/sessionBlocks";
import {
  SessionBlock,
  SessionProgress,
  StudentEnrollment,
} from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface StudentProgressTrackerProps {
  visible: boolean;
  onClose: () => void;
  enrollment: StudentEnrollment;
  sessionBlock: SessionBlock;
  onUpdateProgress: (progress: SessionProgress[]) => void;
}

export default function StudentProgressTracker({
  visible,
  onClose,
  enrollment,
  sessionBlock,
  onUpdateProgress,
}: StudentProgressTrackerProps) {
  const [selectedSession, setSelectedSession] = useState<number>(
    enrollment.currentSession,
  );
  const [coachNotes, setCoachNotes] = useState("");
  const [sessionRating, setSessionRating] = useState<number>(5);
  const [completedDrills, setCompletedDrills] = useState<string[]>([]);

  // Get progress data for this enrollment
  const progressData = useMemo(() => {
    return MOCK_SESSION_PROGRESS.filter(
      (p) => p.enrollmentId === enrollment.id,
    );
  }, [enrollment.id]);

  // Get current session progress
  const currentSessionProgress = useMemo(() => {
    return progressData.find((p) => p.sessionNumber === selectedSession);
  }, [progressData, selectedSession]);

  // Get current session template
  const currentSessionTemplate = useMemo(() => {
    return sessionBlock.sessions.find(
      (s) => s.sessionNumber === selectedSession,
    );
  }, [sessionBlock.sessions, selectedSession]);

  // Get next session
  const nextSession = useMemo(() => {
    return sessionBlock.sessions.find(
      (s) => s.sessionNumber === selectedSession + 1,
    );
  }, [sessionBlock.sessions, selectedSession]);

  // Get previous session
  const previousSession = useMemo(() => {
    return sessionBlock.sessions.find(
      (s) => s.sessionNumber === selectedSession - 1,
    );
  }, [sessionBlock.sessions, selectedSession]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completedSessions = progressData.length;
    return completedSessions / sessionBlock.totalSessions;
  }, [progressData.length, sessionBlock.totalSessions]);

  const getDrillById = (drillId: string) => {
    return MOCK_DRILLS.find((d) => d.id === drillId);
  };

  const handleMarkDrillComplete = (drillAssignmentId: string) => {
    if (completedDrills.includes(drillAssignmentId)) {
      setCompletedDrills(
        completedDrills.filter((id) => id !== drillAssignmentId),
      );
    } else {
      setCompletedDrills([...completedDrills, drillAssignmentId]);
    }
  };

  const handleSaveProgress = () => {
    const newProgress: SessionProgress = {
      id: `progress-${Date.now()}`,
      enrollmentId: enrollment.id,
      sessionNumber: selectedSession,
      completedDrills,
      coachFeedback: coachNotes.trim() || undefined,
      completedAt: new Date().toISOString(),
      rating: sessionRating,
    };

    // TODO: Update progress data
    Alert.alert("Success", "Progress saved successfully!");
    onUpdateProgress([...progressData, newProgress]);
    onClose();
  };

  const handleMarkSessionComplete = () => {
    if (completedDrills.length === 0) {
      Alert.alert(
        "Incomplete Session",
        "Please mark at least one drill as complete",
      );
      return;
    }

    Alert.alert(
      "Complete Session",
      "Mark this session as complete? This will update the student's progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: handleSaveProgress,
        },
      ],
    );
  };

  const renderSessionSelector = () => (
    <View style={styles.sessionSelector}>
      <TouchableOpacity
        style={[styles.navButton, !previousSession && styles.navButtonDisabled]}
        onPress={() =>
          previousSession && setSelectedSession(selectedSession - 1)
        }
        disabled={!previousSession}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={previousSession ? "#64748b" : "#cbd5e1"}
        />
      </TouchableOpacity>

      <View style={styles.sessionInfo}>
        <Text style={styles.sessionNumber}>Session {selectedSession}</Text>
        <Text style={styles.sessionTitle}>
          {currentSessionTemplate?.title || `Session ${selectedSession}`}
        </Text>
        <View style={styles.sessionProgress}>
          <Text style={styles.sessionProgressText}>
            {
              progressData.filter((p) => p.sessionNumber < selectedSession)
                .length
            }{" "}
            of {selectedSession - 1} sessions completed
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.navButton, !nextSession && styles.navButtonDisabled]}
        onPress={() => nextSession && setSelectedSession(selectedSession + 1)}
        disabled={!nextSession}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={nextSession ? "#64748b" : "#cbd5e1"}
        />
      </TouchableOpacity>
    </View>
  );

  const renderDrillList = () => {
    if (!currentSessionTemplate) return null;

    return (
      <View style={styles.drillsSection}>
        <Text style={styles.sectionTitle}>Session Drills</Text>
        <FlatList
          data={currentSessionTemplate.drills}
          renderItem={({ item }) => {
            const drill = getDrillById(item.drillId);
            if (!drill) return null;

            const isCompleted = completedDrills.includes(item.id);

            return (
              <TouchableOpacity
                style={[
                  styles.drillCard,
                  isCompleted && styles.drillCardCompleted,
                ]}
                onPress={() => handleMarkDrillComplete(item.id)}
              >
                <View style={styles.drillInfo}>
                  <View style={styles.drillHeader}>
                    <Text
                      style={[
                        styles.drillTitle,
                        isCompleted && styles.drillTitleCompleted,
                      ]}
                    >
                      {drill.title}
                    </Text>
                    <Ionicons
                      name={
                        isCompleted ? "checkmark-circle" : "ellipse-outline"
                      }
                      size={20}
                      color={isCompleted ? "#10b981" : "#cbd5e1"}
                    />
                  </View>
                  <Text style={styles.drillSubtitle}>
                    {drill.skill} • {drill.level} • {item.duration} min
                    {item.isOptional && " • Optional"}
                  </Text>
                  {drill.description && (
                    <Text style={styles.drillDescription} numberOfLines={2}>
                      {drill.description}
                    </Text>
                  )}
                  {item.instructions && (
                    <View style={styles.customInstructions}>
                      <Text style={styles.instructionsTitle}>
                        Coach Instructions:
                      </Text>
                      <Text style={styles.instructionsText}>
                        {item.instructions}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.drillsList}
        />
      </View>
    );
  };

  const renderSessionObjectives = () => {
    if (!currentSessionTemplate) return null;

    return (
      <View style={styles.objectivesSection}>
        <Text style={styles.sectionTitle}>Session Objectives</Text>
        {currentSessionTemplate.objectives.map((objective, index) => (
          <View key={index} style={styles.objectiveItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#64748b"
            />
            <Text style={styles.objectiveText}>{objective}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderProgressOverview = () => (
    <View style={styles.progressOverview}>
      <Text style={styles.sectionTitle}>Overall Progress</Text>
      <View style={styles.overallProgress}>
        <View style={styles.progressStats}>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>
              {Math.round(overallProgress * 100)}%
            </Text>
            <Text style={styles.progressStatLabel}>Complete</Text>
          </View>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>{progressData.length}</Text>
            <Text style={styles.progressStatLabel}>Sessions Done</Text>
          </View>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>
              {sessionBlock.totalSessions - progressData.length}
            </Text>
            <Text style={styles.progressStatLabel}>Remaining</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${overallProgress * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Previous Progress */}
      {currentSessionProgress && (
        <View style={styles.previousProgress}>
          <Text style={styles.previousProgressTitle}>Previous Feedback</Text>
          <View style={styles.previousProgressCard}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Rating: </Text>
              <Text style={styles.ratingValue}>
                {"★".repeat(currentSessionProgress.rating || 5)}
              </Text>
            </View>
            {currentSessionProgress.coachFeedback && (
              <Text style={styles.feedbackText}>
                {currentSessionProgress.coachFeedback}
              </Text>
            )}
            <Text style={styles.completedDate}>
              Completed on{" "}
              {new Date(
                currentSessionProgress.completedAt!,
              ).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderCoachFeedback = () => (
    <View style={styles.feedbackSection}>
      <Text style={styles.sectionTitle}>Coach Feedback</Text>

      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Session Rating:</Text>
        <View style={styles.ratingButtons}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                sessionRating === rating && styles.ratingButtonActive,
              ]}
              onPress={() => setSessionRating(rating)}
            >
              <Text
                style={[
                  styles.ratingButtonText,
                  sessionRating === rating && styles.ratingButtonTextActive,
                ]}
              >
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesLabel}>Coach Notes:</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add feedback about the student's performance..."
          multiline
          numberOfLines={4}
          value={coachNotes}
          onChangeText={setCoachNotes}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.title}>Student Progress</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {renderProgressOverview()}
          {renderSessionSelector()}
          {renderSessionObjectives()}
          {renderDrillList()}
          {renderCoachFeedback()}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onClose}
          >
            <Text style={styles.buttonTextSecondary}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              completedDrills.length === 0 && styles.buttonDisabled,
            ]}
            onPress={handleMarkSessionComplete}
            disabled={completedDrills.length === 0}
          >
            <Text style={styles.buttonTextPrimary}>
              {selectedSession === sessionBlock.totalSessions
                ? "Complete Program"
                : "Complete Session"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },

  // Progress Overview
  progressOverview: {
    marginBottom: 24,
  },
  overallProgress: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  progressStat: {
    alignItems: "center",
  },
  progressStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  previousProgress: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  previousProgressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  previousProgressCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#64748b",
  },
  ratingValue: {
    fontSize: 14,
    color: "#f59e0b",
  },
  feedbackText: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
    marginBottom: 8,
  },
  completedDate: {
    fontSize: 11,
    color: "#9ca3af",
  },

  // Session Selector
  sessionSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  sessionInfo: {
    flex: 1,
    alignItems: "center",
  },
  sessionNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "center",
  },
  sessionProgress: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
  },
  sessionProgressText: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "600",
  },

  // Objectives
  objectivesSection: {
    marginBottom: 16,
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },

  // Drills
  drillsSection: {
    marginBottom: 16,
  },
  drillsList: {
    maxHeight: 300,
  },
  drillCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  drillCardCompleted: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  drillInfo: {
    flex: 1,
  },
  drillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  drillTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  drillTitleCompleted: {
    color: "#10b981",
  },
  drillSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  drillDescription: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
  },
  customInstructions: {
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
  },
  instructionsTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 11,
    color: "#64748b",
    fontStyle: "italic",
  },

  // Coach Feedback
  feedbackSection: {
    marginBottom: 16,
  },
  ratingSection: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  ratingButtons: {
    flexDirection: "row",
    gap: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  ratingButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
  },
  ratingButtonTextActive: {
    color: "#fff",
  },
  notesSection: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1e293b",
    height: 80,
  },

  // Footer
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#3b82f6",
  },
  buttonSecondary: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonTextPrimary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
});
