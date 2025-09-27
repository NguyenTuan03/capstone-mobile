import { MOCK_SESSION_BLOCKS } from "@/mocks/sessionBlocks";
import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Lesson = {
  id: string;
  title: string;
  summary?: string;
  startAt?: string;
  durationMin?: number;
  mode: "online" | "offline";
  meetingUrl?: string; // online
  location?: string; // offline
  status: "upcoming" | "completed" | "canceled";
  drills?: Drill[];
  notes?: string;
  sessionNumber?: number;
};

type Drill = {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  completed: boolean;
  instructions?: string[];
};

export default function ListSession() {
  const insets = useSafeAreaInsets();
  const { id, blockId } = useLocalSearchParams<{
    id?: string;
    blockId?: string;
  }>();
  const [checkInAt, setCheckInAt] = React.useState<Date | null>(null);
  const [checkOutAt, setCheckOutAt] = React.useState<Date | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { sessions, sessionBlockEnrollments, getEnrollmentById } =
    useBookings();
  const handleCheckIn = () => {
    if (session?.mode !== "offline") return;
    if (checkInAt) {
      Alert.alert(
        "Already checked in",
        `Checked in at ${checkInAt.toLocaleTimeString()}`,
      );
      return;
    }
    const now = new Date();
    setCheckInAt(now);
    Alert.alert("Checked in", `Time: ${now.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    if (session?.mode !== "offline") return;
    if (!checkInAt) {
      Alert.alert(
        "Check in first",
        "You need to check in before checking out.",
      );
      return;
    }
    if (checkOutAt) {
      Alert.alert(
        "Already checked out",
        `Checked out at ${checkOutAt.toLocaleTimeString()}`,
      );
      return;
    }
    const now = new Date();
    setCheckOutAt(now);
    const mins = Math.max(
      0,
      Math.round((now.getTime() - checkInAt.getTime()) / 60000),
    );
    Alert.alert("Checked out", `Duration: ${mins} min`);
  };
  // lấy session hoặc session block
  const session = useMemo(
    () => sessions.find((s: any) => s.id === id),
    [sessions, id],
  );

  const sessionBlockEnrollment = useMemo(
    () => (blockId ? getEnrollmentById(blockId) : null),
    [blockId, getEnrollmentById],
  );

  const sessionBlock = useMemo(
    () =>
      sessionBlockEnrollment
        ? MOCK_SESSION_BLOCKS.find(
            (block) => block.id === sessionBlockEnrollment.sessionBlockId,
          )
        : null,
    [sessionBlockEnrollment],
  );

  const isSessionBlock = !!blockId && !!sessionBlockEnrollment;

  // lessons data - use real session block data if available
  const lessons: Lesson[] = useMemo(() => {
    if (isSessionBlock && sessionBlock) {
      return sessionBlock.sessions.map((session, index) => ({
        id: session.id,
        title: session.title,
        summary: session.objectives.join(" • "),
        durationMin: session.duration,
        mode: sessionBlockEnrollment.mode,
        meetingUrl:
          sessionBlockEnrollment.mode === "online"
            ? sessionBlockEnrollment.meetingUrl
            : undefined,
        location:
          sessionBlockEnrollment.mode === "offline"
            ? sessionBlockEnrollment.location
            : undefined,
        status: sessionBlockEnrollment.completedSessions.includes(index + 1)
          ? "completed"
          : "upcoming",
        drills: session.drills.map((drill) => ({
          id: drill.id,
          title: `Drill ${drill.order}`,
          description: `Session ${index + 1} drill`,
          difficulty:
            index % 3 === 0
              ? "beginner"
              : index % 3 === 1
                ? "intermediate"
                : "advanced",
          duration: drill.duration,
          completed: sessionBlockEnrollment.completedSessions.includes(
            index + 1,
          ),
          instructions: [
            "Follow coach instructions",
            "Focus on proper technique",
          ],
        })),
        notes: session.notes,
        sessionNumber: index + 1,
      }));
    }

    // Fallback to mock data for single sessions
    const isOnline = session?.mode === "online";
    return [
      {
        id: "l1",
        title: "Warm-up & Footwork",
        summary: "5' ladder + split-step timing",
        startAt: session?.startAt,
        durationMin: 10,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
        drills: [
          {
            id: "d1",
            title: "Ladder Drills",
            description: "Quick feet movement patterns",
            difficulty: "beginner",
            duration: 5,
            completed: false,
            instructions: [
              "Start with both feet at the bottom of the ladder",
              "Quick step pattern: in-in-out-out",
              "Focus on light, quick movements",
              "Complete 2 full ladder lengths",
            ],
          },
          {
            id: "d2",
            title: "Split Step Practice",
            description: "Timing and positioning work",
            difficulty: "intermediate",
            duration: 5,
            completed: false,
            instructions: [
              "Start in ready position",
              "Practice split step timing",
              "Focus on explosive movement",
              "Return to ready position after each movement",
            ],
          },
        ],
        notes:
          "Focus on quick foot movements and proper timing. Keep weight on balls of feet.",
      },
      {
        id: "l2",
        title: "Dink Consistency",
        summary: "Cross-court soft dinks, low net clearance",
        durationMin: 20,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
        drills: [
          {
            id: "d3",
            title: "Cross-court Dinks",
            description: "Soft, controlled dinking practice",
            difficulty: "intermediate",
            duration: 10,
            completed: false,
            instructions: [
              "Start at kitchen line",
              "Focus on soft touch",
              "Keep ball low over net",
              "Target cross-court consistently",
            ],
          },
          {
            id: "d4",
            title: "Dink Rally",
            description: "Extended dink rally practice",
            difficulty: "advanced",
            duration: 10,
            completed: false,
            instructions: [
              "Maintain extended dink rally",
              "Focus on consistency",
              "Keep ball in kitchen area",
              "Practice patience and control",
            ],
          },
        ],
        notes:
          "Key points: soft hands, bend knees, keep paddle face open. Work on consistency over power.",
      },
      {
        id: "l3",
        title: "3rd Shot Drop",
        summary: "Arc control to kitchen; target zones",
        durationMin: 20,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
        drills: [
          {
            id: "d5",
            title: "Drop Shot Mechanics",
            description: "Proper form and technique",
            difficulty: "beginner",
            duration: 8,
            completed: false,
            instructions: [
              "Practice pendulum swing",
              "Focus on soft touch",
              "Aim for kitchen line",
              "Use continental grip",
            ],
          },
          {
            id: "d6",
            title: "Target Practice",
            description: "Accuracy and placement work",
            difficulty: "intermediate",
            duration: 12,
            completed: false,
            instructions: [
              "Target specific zones",
              "Focus on consistency",
              "Vary depth and placement",
              "Work on different angles",
            ],
          },
        ],
        notes:
          "Remember: high arc, soft landing, aim for kitchen line. Practice both forehand and backhand drops.",
      },
      {
        id: "l4",
        title: "Situational Play",
        summary: "2v2 kitchen control & transitions",
        durationMin: 15,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
        drills: [
          {
            id: "d7",
            title: "Kitchen Line Control",
            description: "Net play and positioning",
            difficulty: "intermediate",
            duration: 8,
            completed: false,
            instructions: [
              "Practice kitchen line positioning",
              "Work on volleys and dinks",
              "Focus on communication",
              "Maintain proper court position",
            ],
          },
          {
            id: "d8",
            title: "Transition Drills",
            description: "Baseline to kitchen movement",
            difficulty: "advanced",
            duration: 7,
            completed: false,
            instructions: [
              "Start at baseline",
              "Work on third shot drops",
              "Move to kitchen line",
              "Practice net play",
            ],
          },
        ],
        notes:
          "Focus on team communication and court positioning. Practice smooth transitions and net play.",
      },
      {
        id: "l5",
        title: "Cool-down & Review",
        summary: isOnline
          ? "Strategy recap + Q&A session"
          : "Stretching, form review & match analysis",
        durationMin: 10,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
        drills: [
          {
            id: "d9",
            title: "Cool-down Stretching",
            description: "Post-session recovery",
            difficulty: "beginner",
            duration: 5,
            completed: false,
            instructions: [
              "Gentle stretching routine",
              "Focus on major muscle groups",
              "Hold each stretch 30 seconds",
              "Deep breathing exercises",
            ],
          },
        ],
        notes: isOnline
          ? "Review key points covered in session. Answer any questions and provide homework."
          : "Complete stretching routine and review key technical points. Discuss areas for improvement.",
      },
    ];
  }, [session]);

  const joinMeet = async (url?: string) => {
    if (!url) return;
    await Linking.openURL(url);
  };

  const openMap = async (address?: string) => {
    if (!address) return;
    const q = encodeURIComponent(address);
    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${q}`,
    );
  };

  const handleViewDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setModalVisible(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const toggleDrillCompletion = (drillId: string) => {
    if (!selectedLesson) return;

    const updatedLesson = {
      ...selectedLesson,
      drills: selectedLesson.drills?.map((drill) =>
        drill.id === drillId
          ? { ...drill, completed: !drill.completed }
          : drill,
      ),
    };

    setSelectedLesson(updatedLesson);
  };

  const renderItem = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={st.card}
      onPress={() => handleViewDetails(item)}
      activeOpacity={0.8}
    >
      <View style={{ flex: 1 }}>
        <View style={st.cardHeader}>
          <View style={st.titleContainer}>
            {item.sessionNumber && (
              <View style={st.sessionNumberBadge}>
                <Text style={st.sessionNumberText}>{item.sessionNumber}</Text>
              </View>
            )}
            <Text style={st.title}>{item.title}</Text>
          </View>
          <View style={st.drillCount}>
            <Ionicons name="fitness-outline" size={14} color="#6b7280" />
            <Text style={st.drillCountText}>
              {item.drills?.length || 0} drills
            </Text>
          </View>
        </View>
        {!!item.summary && <Text style={st.summary}>{item.summary}</Text>}

        <View style={st.metaRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={st.metaText}>
            {item.durationMin ? `${item.durationMin} min` : "—"}
          </Text>
          <Text style={st.dot}>•</Text>
          <Ionicons
            name={
              item.mode === "online" ? "videocam-outline" : "location-outline"
            }
            size={16}
            color="#6b7280"
          />
          <Text style={st.metaText}>
            {item.mode === "online" ? "Online" : (item.location ?? "Offline")}
          </Text>
        </View>
      </View>

      <View style={st.cardActions}>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={st.header}>
        <View style={st.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={st.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#475569" />
          </TouchableOpacity>
          <Text style={st.headerTitle}>Session Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Session Info */}
        {(session || sessionBlockEnrollment) && (
          <View style={st.sessionInfo}>
            <Text style={st.coachName}>
              {session?.coachName || sessionBlockEnrollment?.coachName}
            </Text>
            {isSessionBlock && sessionBlockEnrollment && (
              <>
                <Text style={st.blockTitle}>
                  {sessionBlockEnrollment.blockTitle}
                </Text>
                <Text style={st.sessionTime}>
                  Progress: {sessionBlockEnrollment.completedSessions.length}/
                  {sessionBlockEnrollment.totalSessions} sessions (
                  {Math.round(sessionBlockEnrollment.progress * 100)}% complete)
                </Text>
              </>
            )}
            {session && !isSessionBlock && (
              <Text style={st.sessionTime}>
                {new Date(session.startAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                •{" "}
                {new Date(session.startAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(session.endAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
          </View>
        )}

        {/* Attendance (offline only) - Not applicable for session blocks */}
        {session?.mode === "offline" && !isSessionBlock && (
          <View style={att.card}>
            <View style={{ flex: 1 }}>
              <Text style={att.title}>Attendance</Text>
              <View style={att.row}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={att.text}>
                  {session?.location ?? "Training court"}
                </Text>
              </View>
              <View style={att.row}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text style={att.text}>
                  {new Date(session.startAt).toLocaleDateString()} •{" "}
                  {new Date(session.startAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(session.endAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View
                style={[
                  att.statusBox,
                  !checkInAt
                    ? { backgroundColor: "#fef3c7", borderColor: "#fde68a" }
                    : !checkOutAt
                      ? { backgroundColor: "#d1fae5", borderColor: "#a7f3d0" }
                      : {
                          backgroundColor: "#e5e7eb",
                          borderColor: "#d1d5db",
                        },
                ]}
              >
                <Text style={att.statusText}>
                  {!checkInAt
                    ? "Not checked in"
                    : !checkOutAt
                      ? `Checked in at ${checkInAt.toLocaleTimeString()}`
                      : `Checked out at ${checkOutAt.toLocaleTimeString()}`}
                </Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <TouchableOpacity
                disabled={!!checkInAt}
                onPress={handleCheckIn}
                style={[
                  att.btn,
                  {
                    backgroundColor: "#1e293b",
                    opacity: checkInAt ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={att.btnText}>Check in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!checkInAt || !!checkOutAt}
                onPress={handleCheckOut}
                style={[
                  att.btn,
                  {
                    backgroundColor: "#f1f5f9",
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    opacity: !checkInAt || checkOutAt ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={[att.btnText, { color: "#1e293b" }]}>
                  Check out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Lessons */}
      <FlatList
        data={lessons}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 0,
          paddingBottom: session?.status === "completed" ? 120 : 80,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={st.empty}>
            <View style={st.emptyIcon}>
              <Ionicons name="book-outline" size={48} color="#cbd5e1" />
            </View>
            <Text style={st.emptyTitle}>No lessons</Text>
            <Text style={st.emptyText}>This session has no lessons yet.</Text>
          </View>
        }
      />

      {/* Lesson Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={st.modalContainer}>
          <View style={st.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={st.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={st.modalTitle}>{selectedLesson?.title}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={st.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedLesson && (
              <>
                {/* Lesson Summary */}
                <View style={st.section}>
                  <Text style={st.sectionTitle}>Summary</Text>
                  <Text style={st.summaryText}>{selectedLesson.summary}</Text>

                  {selectedLesson.notes && (
                    <View style={st.notesCard}>
                      <Text style={st.notesTitle}>Coach Notes</Text>
                      <Text style={st.notesText}>{selectedLesson.notes}</Text>
                    </View>
                  )}
                </View>

                {/* Drills Section */}
                <View style={st.section}>
                  <View style={st.sectionHeader}>
                    <Text style={st.sectionTitle}>
                      Drills ({selectedLesson.drills?.length || 0})
                    </Text>
                    <View style={st.completedCount}>
                      <Text style={st.completedCountText}>
                        {selectedLesson.drills?.filter((d) => d.completed)
                          .length || 0}{" "}
                        completed
                      </Text>
                    </View>
                  </View>

                  {selectedLesson.drills?.map((drill) => (
                    <View key={drill.id} style={st.drillCard}>
                      <View style={st.drillHeader}>
                        <View style={st.drillInfo}>
                          <Text style={st.drillTitle}>{drill.title}</Text>
                          <Text style={st.drillDescription}>
                            {drill.description}
                          </Text>
                          <View style={st.drillMeta}>
                            <View
                              style={[
                                st.difficultyBadge,
                                {
                                  backgroundColor: getDifficultyColor(
                                    drill.difficulty,
                                  ),
                                },
                              ]}
                            >
                              <Text style={st.difficultyText}>
                                {drill.difficulty}
                              </Text>
                            </View>
                            <View style={st.durationBadge}>
                              <Ionicons
                                name="time-outline"
                                size={12}
                                color="#64748b"
                              />
                              <Text style={st.durationText}>
                                {drill.duration} min
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => toggleDrillCompletion(drill.id)}
                          style={[
                            st.completionBtn,
                            drill.completed && st.completionBtnCompleted,
                          ]}
                        >
                          <Ionicons
                            name={
                              drill.completed
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={24}
                            color={drill.completed ? "#fff" : "#94a3b8"}
                          />
                        </TouchableOpacity>
                      </View>

                      {drill.instructions && drill.instructions.length > 0 && (
                        <View style={st.instructionsSection}>
                          <Text style={st.instructionsTitle}>
                            Instructions:
                          </Text>
                          {drill.instructions.map((instruction, index) => (
                            <View key={index} style={st.instructionItem}>
                              <View style={st.instructionBullet}>
                                <Text style={st.instructionBulletText}>
                                  {index + 1}
                                </Text>
                              </View>
                              <Text style={st.instructionText}>
                                {instruction}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Feedback Button - Show only for completed sessions */}
      {session?.status === "completed" && (
        <View style={st.feedbackContainer}>
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/(learner)/coach/my-sessions/feedback?id=${session.id}` as any,
              )
            }
            style={st.feedbackButton}
          >
            <Ionicons name="star-outline" size={20} color="#fff" />
            <Text style={st.feedbackButtonText}>Write Feedback</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Completion Action - Show for offline sessions that are checked out */}
      {session?.mode === "offline" &&
        checkInAt &&
        checkOutAt &&
        session?.status !== "completed" && (
          <View style={st.feedbackContainer}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Session Completed!",
                  "Great job! Would you like to leave feedback for your coach?",
                  [
                    {
                      text: "Later",
                      style: "cancel",
                    },
                    {
                      text: "Write Feedback",
                      onPress: () =>
                        router.push(
                          `/(learner)/coach/my-sessions/feedback?id=${session.id}` as any,
                        ),
                    },
                  ],
                );
              }}
              style={[st.feedbackButton, { backgroundColor: "#059669" }]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={st.feedbackButtonText}>Complete Session</Text>
            </TouchableOpacity>
          </View>
        )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  // Header
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
  },
  sessionInfo: {
    marginTop: 8,
  },
  coachName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
    marginTop: 4,
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },

  // Card
  card: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sessionNumberBadge: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  sessionNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  drillCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  drillCountText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  summary: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 6,
  },
  dot: {
    color: "#cbd5e1",
    marginHorizontal: 8,
  },
  cardActions: {
    marginLeft: 12,
  },

  // Empty State
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  // Feedback Button
  feedbackContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  feedbackButton: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  feedbackButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
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
    fontWeight: "700",
    color: "#1e293b",
  },
  completedCount: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedCountText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  summaryText: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 16,
  },
  notesCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  drillCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  drillHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  drillInfo: {
    flex: 1,
  },
  drillTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  drillDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  drillMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  completionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  completionBtnCompleted: {
    backgroundColor: "#10b981",
  },
  instructionsSection: {
    marginTop: 12,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  instructionBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  instructionBulletText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});
const att = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: "#1e293b",
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  text: {
    color: "#64748b",
    marginLeft: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  statusBox: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusText: {
    color: "#1e293b",
    fontWeight: "600",
    fontSize: 13,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 110,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
