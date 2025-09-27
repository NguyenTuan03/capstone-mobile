import { MOCK_SESSION_BLOCKS } from "@/mocks/sessionBlocks";
import { SessionTemplate } from "@/types/sessionBlocks";
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

export default function EditSessionBlockScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the session block
  const sessionBlock = useMemo(() => {
    return MOCK_SESSION_BLOCKS.find((block) => block.id === id);
  }, [id]);

  const [formData, setFormData] = useState({
    title: sessionBlock?.title || "",
    description: sessionBlock?.description || "",
    skillLevelFrom: sessionBlock?.skillLevelFrom || "1.0",
    skillLevelTo: sessionBlock?.skillLevelTo || "2.0",
    price: sessionBlock?.price?.toString() || "",
    totalSessions: sessionBlock?.totalSessions?.toString() || "8",
    duration: sessionBlock?.duration?.toString() || "4",
    deliveryMode: sessionBlock?.deliveryMode || "offline",
    courtAddress: sessionBlock?.courtAddress || "",
    meetingLink: sessionBlock?.meetingLink || "",
  });

  const [sessions, setSessions] = useState<SessionTemplate[]>(
    sessionBlock?.sessions || [],
  );

  const handleSave = () => {
    // Validate form
    if (!formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Description is required");
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      Alert.alert("Error", "Valid price is required");
      return;
    }
    if (!formData.totalSessions || isNaN(parseInt(formData.totalSessions))) {
      Alert.alert("Error", "Valid number of sessions is required");
      return;
    }

    // TODO: Actually save the data
    Alert.alert("Success", "Session block updated successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const addSession = () => {
    const newSession: SessionTemplate = {
      id: `session-${Date.now()}`,
      blockId: id!,
      sessionNumber: sessions.length + 1,
      title: `Session ${sessions.length + 1}`,
      duration: 60,
      drills: [],
      objectives: [],
      notes: "",
      order: 0,
    };
    setSessions([...sessions, newSession]);
  };

  const updateSession = (
    sessionId: string,
    updates: Partial<SessionTemplate>,
  ) => {
    setSessions(
      sessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session,
      ),
    );
  };

  const deleteSession = (sessionId: string) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSessions(sessions.filter((session) => session.id !== sessionId));
            // Renumber remaining sessions
            setSessions(
              sessions
                .filter((session) => session.id !== sessionId)
                .map((session, index) => ({
                  ...session,
                  sessionNumber: index + 1,
                })),
            );
          },
        },
      ],
    );
  };

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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Session Block</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter session block title"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Describe what participants will learn"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Skill Level From</Text>
              <TextInput
                style={styles.input}
                value={formData.skillLevelFrom}
                onChangeText={(text) =>
                  setFormData({ ...formData, skillLevelFrom: text })
                }
                placeholder="1.0"
              />
            </View>
            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Skill Level To</Text>
              <TextInput
                style={styles.input}
                value={formData.skillLevelTo}
                onChangeText={(text) =>
                  setFormData({ ...formData, skillLevelTo: text })
                }
                placeholder="2.0"
              />
            </View>
          </View>
        </View>

        {/* Pricing & Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Duration</Text>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Price ($) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                placeholder="400"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Total Sessions *</Text>
              <TextInput
                style={styles.input}
                value={formData.totalSessions}
                onChangeText={(text) =>
                  setFormData({ ...formData, totalSessions: text })
                }
                placeholder="8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Duration (weeks) *</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) =>
                setFormData({ ...formData, duration: text })
              }
              placeholder="4"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Delivery Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Mode</Text>

          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                formData.deliveryMode === "offline" && styles.modeButtonActive,
              ]}
              onPress={() =>
                setFormData({ ...formData, deliveryMode: "offline" })
              }
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={formData.deliveryMode === "offline" ? "#fff" : "#64748b"}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  formData.deliveryMode === "offline" &&
                    styles.modeButtonTextActive,
                ]}
              >
                Offline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                formData.deliveryMode === "online" && styles.modeButtonActive,
              ]}
              onPress={() =>
                setFormData({ ...formData, deliveryMode: "online" })
              }
            >
              <Ionicons
                name="videocam-outline"
                size={20}
                color={formData.deliveryMode === "online" ? "#fff" : "#64748b"}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  formData.deliveryMode === "online" &&
                    styles.modeButtonTextActive,
                ]}
              >
                Online
              </Text>
            </TouchableOpacity>
          </View>

          {formData.deliveryMode === "offline" ? (
            <View style={styles.field}>
              <Text style={styles.label}>Court Address</Text>
              <TextInput
                style={styles.input}
                value={formData.courtAddress}
                onChangeText={(text) =>
                  setFormData({ ...formData, courtAddress: text })
                }
                placeholder="Enter court address"
              />
            </View>
          ) : (
            <View style={styles.field}>
              <Text style={styles.label}>Meeting Link</Text>
              <TextInput
                style={styles.input}
                value={formData.meetingLink}
                onChangeText={(text) =>
                  setFormData({ ...formData, meetingLink: text })
                }
                placeholder="Enter video meeting link"
              />
            </View>
          )}
        </View>

        {/* Session Templates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Session Templates</Text>
            <TouchableOpacity style={styles.addButton} onPress={addSession}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Session</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item: session }) => (
              <View style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionNumber}>
                    <Text style={styles.sessionNumberText}>
                      {session.sessionNumber}
                    </Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <TextInput
                      style={styles.sessionTitle}
                      value={session.title}
                      onChangeText={(text) =>
                        updateSession(session.id, { title: text })
                      }
                      placeholder="Session title"
                    />
                    <View style={styles.sessionMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color="#64748b"
                        />
                        <TextInput
                          style={styles.metaInput}
                          value={session.duration.toString()}
                          onChangeText={(text) =>
                            updateSession(session.id, {
                              duration: parseInt(text) || 60,
                            })
                          }
                          keyboardType="numeric"
                        />
                        <Text style={styles.metaText}>min</Text>
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
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteSession(session.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="fitness-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No sessions yet</Text>
                <Text style={styles.emptySubtitle}>
                  Add session templates to create your program structure
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  modeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  modeButtonTextActive: {
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  sessionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 2,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  metaInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    width: 40,
    textAlign: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  errorButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
