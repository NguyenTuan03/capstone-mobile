/* eslint-disable react-hooks/rules-of-hooks */
import DrillAssignmentModal from "@/components/DrillAssignmentModal";
import {
  MOCK_DRILLS,
  MOCK_ENROLLMENTS,
  MOCK_SESSION_BLOCKS,
} from "@/mocks/sessionBlocks";
import { DrillAssignment, SessionTemplate } from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionBlockDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, enrollmentId, sessionId, sessionNumber, fromCalendar } =
    useLocalSearchParams<{
      id: string;
      enrollmentId?: string;
      sessionId?: string;
      sessionNumber?: string;
      fromCalendar?: string;
    }>();

  const [activeTab, setActiveTab] = useState<
    "overview" | "sessions" | "students" | "schedule"
  >("overview");
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [selectedSessionTemplateId, setSelectedSessionTemplateId] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  // Find the session block
  const sessionBlock = useMemo(() => {
    return MOCK_SESSION_BLOCKS.find((block) => block.id === id);
  }, [id]);

  if (!sessionBlock) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Session block not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get enrollments for this session block
  const enrollments = MOCK_ENROLLMENTS.filter((e) => e.sessionBlockId === id);
  const revenue = enrollments.length * sessionBlock.price;

  // Find specific enrollment if enrollmentId is provided
  const specificEnrollment = useMemo(() => {
    return enrollmentId ? enrollments.find((e) => e.id === enrollmentId) : null;
  }, [enrollmentId, enrollments]);

  // Auto-switch to sessions tab if specific session is requested
  useEffect(() => {
    if (sessionId || sessionNumber || enrollmentId) {
      setActiveTab("sessions");
    }
  }, [sessionId, sessionNumber, enrollmentId]);

  // Generate scheduled sessions for this session block

  const scheduledSessions = useMemo(() => {
    const sessions: any[] = [];

    enrollments.forEach((enrollment) => {
      for (
        let sessionNum = 1;
        sessionNum <= enrollment.currentSession;
        sessionNum++
      ) {
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

        sessions.push({
          id: sessionId,
          sessionNumber: sessionNum,
          sessionTemplate,
          date: dateStr,
          startTime,
          endTime,
          location:
            sessionBlock.deliveryMode === "online"
              ? sessionBlock.meetingLink || "Online"
              : sessionBlock.courtAddress || "Court",
          mode: sessionBlock.deliveryMode,
          enrollmentId: enrollment.id,
          studentId: enrollment.studentId,
          status: enrollment.completedSessions.includes(sessionNum)
            ? "completed"
            : "upcoming",
        });
      }
    });

    return sessions;
  }, [enrollments, sessionBlock]);

  // Build marked dates for calendar

  const markedDates = useMemo(() => {
    const marked: any = {};

    scheduledSessions.forEach((session) => {
      const color = session.status === "upcoming" ? "#3b82f6" : "#10b981";
      marked[session.date] ??= { dots: [] };
      if (!marked[session.date].dots.some((d: any) => d.color === color)) {
        marked[session.date].dots.push({ color });
      }
    });

    marked[selectedDate] = {
      ...(marked[selectedDate] ?? {}),
      selected: true,
      selectedColor: "#3b82f6",
    };

    return marked;
  }, [scheduledSessions, selectedDate]);

  // Get sessions for selected date

  const daySessions = useMemo(() => {
    return scheduledSessions
      .filter((s) => s.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [scheduledSessions, selectedDate]);

  const getSkillLevelColor = (level: string) => {
    const numericLevel = parseFloat(level);
    if (numericLevel <= 2.0) return "#10b981"; // Beginner - Green
    if (numericLevel <= 3.0) return "#3b82f6"; // Intermediate - Blue
    if (numericLevel <= 4.0) return "#f59e0b"; // Advanced - Orange
    return "#ef4444"; // Expert - Red
  };

  const getSkillLevelRangeColor = (fromLevel: string, toLevel: string) => {
    const from = parseFloat(fromLevel);
    const to = parseFloat(toLevel);
    // Use the higher level for coloring
    const level = Math.max(from, to);
    return getSkillLevelColor(level.toString());
  };

  const handleToggleStatus = () => {
    Alert.alert(
      sessionBlock.isActive
        ? "Archive Session Block"
        : "Activate Session Block",
      `Are you sure you want to ${sessionBlock.isActive ? "archive" : "activate"} this session block?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: sessionBlock.isActive ? "Archive" : "Activate",
          onPress: () => {
            // TODO: Implement toggle logic
            Alert.alert(
              "Success",
              `Session block ${sessionBlock.isActive ? "archived" : "activated"}!`,
            );
          },
        },
      ],
    );
  };

  const handleEditProgram = () => {
    router.push({
      pathname: "/(coach)/menu/session-blocks/[id]/edit",
      params: { id: sessionBlock.id },
    });
  };

  const handleEditSession = (session: SessionTemplate) => {
    setSelectedSessionTemplateId(session.id);
    setShowDrillModal(true);
  };

  const handleSaveDrillAssignments = (assignments: DrillAssignment[]) => {
    if (!selectedSessionTemplateId) return;

    // TODO: Update session template with new drill assignments
    Alert.alert("Success", "Drill assignments saved successfully!");
    setShowDrillModal(false);
    setSelectedSessionTemplateId(null);
  };

  const handleCreateNewDrill = () => {
    router.push("/(coach)/menu/drills/new");
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sessionBlock.totalSessions}</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sessionBlock.duration}</Text>
          <Text style={styles.statLabel}>Weeks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{enrollments.length}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${revenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{sessionBlock.description}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, styles.editAction]}
            onPress={handleEditProgram}
          >
            <Ionicons name="create-outline" size={24} color="#3b82f6" />
            <Text style={styles.actionCardText}>Edit Program</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.drillsAction]}
            onPress={() => setActiveTab("sessions")}
          >
            <Ionicons name="fitness-outline" size={24} color="#10b981" />
            <Text style={styles.actionCardText}>Manage Drills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.scheduleAction]}
            onPress={() => setActiveTab("schedule")}
          >
            <Ionicons name="calendar-outline" size={24} color="#f59e0b" />
            <Text style={styles.actionCardText}>View Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              sessionBlock.isActive
                ? styles.archiveAction
                : styles.activateAction,
            ]}
            onPress={handleToggleStatus}
          >
            <Ionicons
              name={
                sessionBlock.isActive
                  ? "archive-outline"
                  : "checkmark-circle-outline"
              }
              size={24}
              color={sessionBlock.isActive ? "#f59e0b" : "#10b981"}
            />
            <Text style={styles.actionCardText}>
              {sessionBlock.isActive ? "Archive" : "Activate"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSessions = () => (
    <View style={styles.tabContent}>
      {/* Show learner-specific sessions if enrollment is provided */}
      {specificEnrollment ? (
        <>
          <View style={styles.enrollmentHeader}>
            <Text style={styles.enrollmentTitle}>
              Student {specificEnrollment.studentId}&apos;s Sessions
            </Text>
            <Text style={styles.enrollmentSubtitle}>
              Progress: {Math.round(specificEnrollment.progress * 100)}% •
              Session {specificEnrollment.currentSession}/
              {sessionBlock.totalSessions}
            </Text>
          </View>

          <FlatList
            data={scheduledSessions.filter(
              (s) => s.enrollmentId === specificEnrollment.id,
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item: session }) => (
              <View
                style={[
                  styles.sessionCard,
                  sessionNumber &&
                    session.sessionNumber === parseInt(sessionNumber) &&
                    styles.highlightedSession,
                ]}
              >
                {/* Session Header */}
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionNumberContainer}>
                      <Text style={styles.sessionNumber}>
                        {session.sessionNumber}
                      </Text>
                    </View>
                    <View style={styles.sessionTitleContainer}>
                      <Text style={styles.sessionTitle}>
                        {session.sessionTemplate.title}
                      </Text>
                      <View style={styles.sessionMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#64748b"
                          />
                          <Text style={styles.metaText}>
                            {session.start}-{session.end}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#64748b"
                          />
                          <Text style={styles.metaText}>{session.date}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="fitness-outline"
                            size={14}
                            color="#64748b"
                          />
                          <Text style={styles.metaText}>
                            {session.sessionTemplate.drills.length} drills
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.metaItem,
                            session.status === "completed" &&
                              styles.completedStatus,
                          ]}
                        >
                          <Ionicons
                            name={
                              session.status === "completed"
                                ? "checkmark-circle"
                                : "time"
                            }
                            size={14}
                            color={
                              session.status === "completed"
                                ? "#10b981"
                                : "#64748b"
                            }
                          />
                          <Text
                            style={[
                              styles.metaText,
                              session.status === "completed" &&
                                styles.completedText,
                            ]}
                          >
                            {session.status === "completed"
                              ? "Completed"
                              : "Upcoming"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    style={styles.sessionActionButton}
                    onPress={() => {
                      // Navigate to session template for drill management
                      router.push({
                        pathname: "/(coach)/menu/session-blocks/[id]",
                        params: {
                          id: sessionBlock.id,
                          sessionId: session.sessionTemplate.id,
                        },
                      });
                    }}
                  >
                    <Ionicons
                      name="fitness-outline"
                      size={14}
                      color="#3b82f6"
                    />
                    <Text style={styles.sessionActionText}>Manage Drills</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sessionActionButton}
                    onPress={() => {
                      Alert.alert(
                        "Session Reschedule",
                        "Reschedule functionality coming soon!",
                      );
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#f59e0b"
                    />
                    <Text style={styles.sessionActionText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      ) : (
        <>
          <Text style={styles.tabTitle}>Session Templates</Text>
          <FlatList
            data={sessionBlock.sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item: session }) => (
              <View style={styles.sessionCard}>
                {/* Session Header */}
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionNumberContainer}>
                      <Text style={styles.sessionNumber}>
                        {session.sessionNumber}
                      </Text>
                    </View>
                    <View style={styles.sessionTitleContainer}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <View style={styles.sessionMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#64748b"
                          />
                          <Text style={styles.metaText}>
                            {session.duration} min
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="fitness-outline"
                            size={14}
                            color="#64748b"
                          />
                          <Text style={styles.metaText}>
                            {session.drills.length} drills
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.manageDrillsButton}
                    onPress={() => handleEditSession(session)}
                  >
                    <Ionicons name="fitness-outline" size={16} color="#fff" />
                    <Text style={styles.manageDrillsButtonText}>
                      Manage Drills
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Drills Preview */}
                {session.drills.length > 0 && (
                  <View style={styles.drillsPreview}>
                    <Text style={styles.drillsPreviewTitle}>
                      Assigned Drills:
                    </Text>
                    <View style={styles.drillsList}>
                      {session.drills.slice(0, 3).map((drill, index) => {
                        const drillInfo = MOCK_DRILLS.find(
                          (d) => d.id === drill.drillId,
                        );
                        return (
                          <View key={drill.id} style={styles.drillChip}>
                            <Ionicons
                              name="fitness-outline"
                              size={12}
                              color="#64748b"
                            />
                            <Text
                              style={styles.drillChipText}
                              numberOfLines={1}
                            >
                              {drillInfo?.title || `Drill ${index + 1}`}
                            </Text>
                            <Text style={styles.drillDurationText}>
                              {drill.duration}min
                            </Text>
                          </View>
                        );
                      })}
                      {session.drills.length > 3 && (
                        <View style={styles.moreDrillsChip}>
                          <Text style={styles.moreDrillsText}>
                            +{session.drills.length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Objectives */}
                {session.objectives.length > 0 && (
                  <View style={styles.objectivesSection}>
                    <Text style={styles.objectivesTitle}>
                      Learning Objectives:
                    </Text>
                    <View style={styles.objectivesList}>
                      {session.objectives.map((objective, index) => (
                        <View key={index} style={styles.objectiveItem}>
                          <View style={styles.objectiveBullet} />
                          <Text style={styles.objectiveText}>{objective}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Coach Notes */}
                {session.notes && (
                  <View style={styles.notesSection}>
                    <View style={styles.notesHeader}>
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color="#64748b"
                      />
                      <Text style={styles.notesTitle}>Coach Notes</Text>
                    </View>
                    <Text style={styles.notesText}>{session.notes}</Text>
                  </View>
                )}

                {/* Quick Actions */}
                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    style={styles.sessionActionButton}
                    onPress={() => handleEditSession(session)}
                  >
                    <Ionicons
                      name="fitness-outline"
                      size={14}
                      color="#3b82f6"
                    />
                    <Text style={styles.sessionActionText}>Edit Drills</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sessionActionButton}
                    onPress={() => {
                      // TODO: Add session preview functionality
                      Alert.alert(
                        "Session Preview",
                        "Preview functionality coming soon!",
                      );
                    }}
                  >
                    <Ionicons name="eye-outline" size={14} color="#10b981" />
                    <Text style={styles.sessionActionText}>Preview</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      )}
    </View>
  );

  const renderStudents = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={enrollments}
        keyExtractor={(item) => item.id}
        renderItem={({ item: enrollment }) => (
          <View style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <View style={styles.studentAvatar}>
                <Ionicons name="person-outline" size={24} color="#64748b" />
              </View>
              <View style={styles.studentDetails}>
                <Text style={styles.studentName}>
                  Student {enrollment.studentId}
                </Text>
                <Text style={styles.studentProgress}>
                  Progress: {Math.round(enrollment.progress * 100)}% • Session{" "}
                  {enrollment.currentSession}/{sessionBlock.totalSessions}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${enrollment.progress * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.studentStatus}>
              <View
                style={[styles.statusBadge, { backgroundColor: "#10b981" }]}
              >
                <Text style={styles.statusText}>{enrollment.status}</Text>
              </View>
              <Text style={styles.paymentStatus}>
                {enrollment.paymentStatus}
              </Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No students enrolled</Text>
            <Text style={styles.emptyDescription}>
              Share this program with your students to get started
            </Text>
          </View>
        }
      />
    </View>
  );

  const renderSchedule = () => (
    <View style={styles.tabContent}>
      <Calendar
        current={selectedDate}
        onDayPress={(d: any) => setSelectedDate(d.dateString)}
        markedDates={markedDates}
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

      <View style={styles.legend}>
        <LegendDot color="#3b82f6" label="Upcoming" />
        <LegendDot color="#10b981" label="Completed" />
      </View>

      {daySessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No sessions on this date</Text>
          <Text style={styles.emptyDescription}>
            Sessions from your session blocks will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={daySessions}
          keyExtractor={(x) => x.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <View style={styles.sessionCard}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      item.status === "upcoming" ? "#3b82f6" : "#10b981",
                  },
                ]}
              />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.sessionTitle}>
                  {item.sessionTemplate.title}
                </Text>
                <Text style={styles.sessionBlock}>
                  Session {item.sessionNumber}
                </Text>
                <Text style={styles.sessionSub}>
                  {item.startTime}-{item.endTime} · {item.location}
                </Text>
                <Text style={styles.studentName}>Student {item.studentId}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );

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

  function getTodayDate(): string {
    const dt = new Date();
    return dt.toISOString().slice(0, 10);
  }

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
            // If we came from calendar, navigate back to calendar
            if (fromCalendar === "true") {
              router.push("/(coach)/calendar/index");
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{sessionBlock.title}</Text>
          <View style={styles.headerMeta}>
            <View
              style={[
                styles.skillBadge,
                {
                  backgroundColor: getSkillLevelRangeColor(
                    sessionBlock.skillLevelFrom,
                    sessionBlock.skillLevelTo,
                  ),
                },
              ]}
            >
              <Text style={styles.skillBadgeText}>
                {sessionBlock.skillLevelFrom} - {sessionBlock.skillLevelTo}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: sessionBlock.isActive
                      ? "#10b981"
                      : "#64748b",
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {sessionBlock.isActive ? "Active" : "Archived"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: "overview", title: "Overview", icon: "grid-outline" },
          { id: "sessions", title: "Sessions", icon: "fitness-outline" },
          { id: "students", title: "Students", icon: "people-outline" },
          { id: "schedule", title: "Schedule", icon: "calendar-outline" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.id ? "#3b82f6" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "sessions" && renderSessions()}
        {activeTab === "students" && renderStudents()}
        {activeTab === "schedule" && renderSchedule()}
      </ScrollView>

      {/* Drill Assignment Modal */}
      {selectedSessionTemplateId && (
        <DrillAssignmentModal
          visible={showDrillModal}
          onClose={() => {
            setShowDrillModal(false);
            setSelectedSessionTemplateId(null);
          }}
          sessionTemplateId={selectedSessionTemplateId}
          currentAssignments={
            sessionBlock.sessions.find(
              (s) => s.id === selectedSessionTemplateId,
            )?.drills || []
          }
          onSave={handleSaveDrillAssignments}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Tab Title
  tabTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
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
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
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

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#3b82f6",
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
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
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    gap: 8,
  },
  editAction: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  duplicateAction: {
    borderColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
  },
  archiveAction: {
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
  },
  activateAction: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  drillsAction: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  scheduleAction: {
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
  },
  actionCardText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  // Sessions
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
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sessionInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sessionNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: "#3b82f6",
  },
  sessionTitleContainer: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  sessionMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metaText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  manageDrillsButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  manageDrillsButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Drills Preview
  drillsPreview: {
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  drillsPreviewTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  drillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  drillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
  },
  drillChipText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
    maxWidth: 100,
  },
  drillDurationText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moreDrillsChip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  moreDrillsText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },

  // Objectives
  objectivesSection: {
    marginBottom: 16,
  },
  objectivesTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  objectivesList: {
    gap: 6,
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
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    flex: 1,
  },

  // Notes
  notesSection: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  notesText: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    fontStyle: "italic",
  },

  // Session Actions
  sessionActions: {
    flexDirection: "row",
    gap: 8,
  },
  sessionActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  separator: {
    height: 12,
  },

  // Students
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  studentInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  studentProgress: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  studentStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  paymentStatus: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ef4444",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // Schedule Tab
  calendar: {
    marginHorizontal: 0,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  scheduleStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionBlock: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  sessionSub: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  studentNameBlue: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },

  // Enrollment specific styles
  enrollmentHeader: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  enrollmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  enrollmentSubtitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  highlightedSession: {
    borderWidth: 2,
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  completedStatus: {
    backgroundColor: "#f0fdf4",
  },
  completedText: {
    color: "#10b981",
    fontWeight: "700",
  },
});
