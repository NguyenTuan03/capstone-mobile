import { MOCK_DRILLS } from "@/mocks/sessionBlocks";
import { Drill, DrillAssignment } from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface DrillAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  sessionTemplateId: string;
  currentAssignments: DrillAssignment[];
  onSave: (assignments: DrillAssignment[]) => void;
}

export default function DrillAssignmentModal({
  visible,
  onClose,
  sessionTemplateId,
  currentAssignments,
  onSave,
}: DrillAssignmentModalProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<DrillAssignment[]>([]);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [drillDuration, setDrillDuration] = useState(10);
  const [isOptional, setIsOptional] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tất cả");

  useEffect(() => {
    if (visible) {
      setAssignments(currentAssignments);
      setSearchQuery("");
      setSelectedSkill("Tất cả");
      setSelectedLevel("Tất cả");
    }
  }, [visible, currentAssignments]);

  const skills = [
    "Tất cả",
    ...Array.from(new Set(MOCK_DRILLS.map((d) => d.skill))),
  ];
  const levels = [
    "Tất cả",
    ...Array.from(new Set(MOCK_DRILLS.map((d) => d.level))),
  ];

  const filteredDrills = MOCK_DRILLS.filter((drill) => {
    const matchesSearch =
      !searchQuery ||
      drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill =
      selectedSkill === "Tất cả" || drill.skill === selectedSkill;
    const matchesLevel =
      selectedLevel === "Tất cả" || drill.level === selectedLevel;
    const isAlreadyAssigned = assignments.some((a) => a.drillId === drill.id);

    return matchesSearch && matchesSkill && matchesLevel && !isAlreadyAssigned;
  });

  const handleAddDrill = () => {
    if (!selectedDrill) {
      Alert.alert("Lỗi", "Vui lòng chọn một bài tập");
      return;
    }

    const newAssignment: DrillAssignment = {
      id: `assignment-${Date.now()}`,
      drillId: selectedDrill.id,
      sessionTemplateId,
      order: assignments.length + 1,
      duration: drillDuration,
      instructions: customInstructions.trim() || undefined,
      isOptional,
    };

    setAssignments([...assignments, newAssignment]);
    resetDrillForm();
  };

  const handleRemoveDrill = (assignmentId: string) => {
    Alert.alert("Xóa bài tập", "Bạn có chắc chắn muốn xóa bài tập này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => {
          const updated = assignments.filter((a) => a.id !== assignmentId);
          setAssignments(updated);
          // Update order
          const reordered = updated.map((a, index) => ({
            ...a,
            order: index + 1,
          }));
          setAssignments(reordered);
        },
      },
    ]);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newAssignments = [...assignments];
    const [moved] = newAssignments.splice(fromIndex, 1);
    newAssignments.splice(toIndex, 0, moved);

    // Update order
    const reordered = newAssignments.map((a, index) => ({
      ...a,
      order: index + 1,
    }));
    setAssignments(reordered);
  };

  const resetDrillForm = () => {
    setSelectedDrill(null);
    setDrillDuration(10);
    setIsOptional(false);
    setCustomInstructions("");
  };

  const handleCreateNewDrill = () => {
    router.push("/(coach)/menu/drills/new");
  };

  const getTotalDuration = () => {
    return assignments.reduce(
      (total, assignment) => total + assignment.duration,
      0,
    );
  };

  const getDrillById = (drillId: string) => {
    return MOCK_DRILLS.find((d) => d.id === drillId);
  };

  const renderDrillCard = ({
    item,
    index,
  }: {
    item: DrillAssignment;
    index: number;
  }) => {
    const drill = getDrillById(item.drillId);
    if (!drill) return null;

    return (
      <View style={styles.assignmentCard}>
        <View style={styles.assignmentHeader}>
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-three-outline" size={20} color="#64748b" />
          </View>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>{drill.title}</Text>
            <Text style={styles.assignmentSubtitle}>
              {drill.skill} • {drill.level} • {item.duration} min
              {item.isOptional && " • Optional"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveDrill(item.id)}
          >
            <Ionicons name="close-circle" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {item.instructions && (
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>Custom Instructions:</Text>
            <Text style={styles.instructionsText}>{item.instructions}</Text>
          </View>
        )}

        <View style={styles.assignmentActions}>
          <TouchableOpacity
            style={styles.moveButton}
            onPress={() => handleReorder(index, Math.max(0, index - 1))}
            disabled={index === 0}
          >
            <Ionicons
              name="chevron-up"
              size={16}
              color={index === 0 ? "#cbd5e1" : "#64748b"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moveButton}
            onPress={() =>
              handleReorder(index, Math.min(assignments.length - 1, index + 1))
            }
            disabled={index === assignments.length - 1}
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color={index === assignments.length - 1 ? "#cbd5e1" : "#64748b"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          <Text style={styles.title}>Assign Drills</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(assignments);
              onClose();
            }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Current Assignments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Assigned Drills ({assignments.length})
              </Text>
              <Text style={styles.totalDuration}>
                Total: {getTotalDuration()} min
              </Text>
            </View>

            {assignments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="fitness-outline" size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>No drills assigned yet</Text>
              </View>
            ) : (
              <FlatList
                data={assignments}
                renderItem={renderDrillCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.assignmentsList}
              />
            )}
          </View>

          {/* Add New Drill */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Add New Drill</Text>
              <TouchableOpacity
                style={styles.createDrillButton}
                onPress={handleCreateNewDrill}
              >
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.createDrillButtonText}>Create Drill</Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#64748b" />
                <TextInput
                  placeholder="Search drills..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Skill:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterChips}>
                    {skills.map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={[
                          styles.filterChip,
                          selectedSkill === skill && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedSkill(skill)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedSkill === skill &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Level:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterChips}>
                    {levels.map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.filterChip,
                          selectedLevel === level && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedLevel(level)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedLevel === level &&
                              styles.filterChipTextActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* Drill List */}
            <FlatList
              data={filteredDrills}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.drillCard,
                    selectedDrill?.id === item.id && styles.drillCardSelected,
                  ]}
                  onPress={() => setSelectedDrill(item)}
                >
                  <View style={styles.drillInfo}>
                    <Text style={styles.drillTitle}>{item.title}</Text>
                    <Text style={styles.drillSubtitle}>
                      {item.skill} • {item.level} • {item.duration} min
                    </Text>
                    {item.description && (
                      <Text style={styles.drillDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                  <View style={styles.drillIntensity}>
                    <Text style={styles.intensityText}>
                      {"★".repeat(item.intensity)}
                      {"☆".repeat(5 - item.intensity)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.drillsList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="fitness-outline" size={48} color="#cbd5e1" />
                  <Text style={styles.emptyText}>No drills found</Text>
                  <Text style={styles.emptySubText}>
                    Try adjusting your search or create a new drill
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyCreateButton}
                    onPress={handleCreateNewDrill}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.emptyCreateButtonText}>
                      Create New Drill
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />

            {/* Drill Configuration */}
            {selectedDrill && (
              <View style={styles.drillConfig}>
                <Text style={styles.configTitle}>Configure Drill</Text>

                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>Duration (minutes):</Text>
                  <TextInput
                    style={styles.configInput}
                    keyboardType="numeric"
                    value={drillDuration.toString()}
                    onChangeText={(text) =>
                      setDrillDuration(parseInt(text) || 10)
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.optionalToggle,
                    isOptional && styles.optionalToggleActive,
                  ]}
                  onPress={() => setIsOptional(!isOptional)}
                >
                  <Ionicons
                    name={isOptional ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={isOptional ? "#3b82f6" : "#64748b"}
                  />
                  <Text
                    style={[
                      styles.optionalText,
                      isOptional && styles.optionalTextActive,
                    ]}
                  >
                    Optional drill
                  </Text>
                </TouchableOpacity>

                <View style={styles.configGroup}>
                  <Text style={styles.configLabel}>Custom Instructions:</Text>
                  <TextInput
                    style={styles.configTextArea}
                    placeholder="Add specific instructions for this session..."
                    multiline
                    numberOfLines={3}
                    value={customInstructions}
                    onChangeText={setCustomInstructions}
                  />
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddDrill}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add to Session</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  totalDuration: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 16,
  },
  emptyCreateButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emptyCreateButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  assignmentsList: {
    maxHeight: 300,
  },
  assignmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  assignmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dragHandle: {
    padding: 4,
  },
  assignmentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  assignmentSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  removeButton: {
    padding: 4,
  },
  instructionsSection: {
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  assignmentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  moveButton: {
    padding: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1e293b",
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  filterChips: {
    flexDirection: "row",
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterChipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  drillsList: {
    maxHeight: 250,
    marginBottom: 16,
  },
  drillCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  drillCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  drillInfo: {
    flex: 1,
  },
  drillTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  drillSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  drillDescription: {
    fontSize: 11,
    color: "#64748b",
  },
  drillIntensity: {
    marginLeft: 8,
  },
  intensityText: {
    fontSize: 12,
    color: "#f59e0b",
  },
  drillConfig: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  configTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  configInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    color: "#1e293b",
    width: 60,
    textAlign: "center",
  },
  optionalToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  optionalToggleActive: {
    backgroundColor: "#eff6ff",
    padding: 8,
    borderRadius: 6,
  },
  optionalText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  optionalTextActive: {
    color: "#3b82f6",
  },
  configGroup: {
    marginBottom: 12,
  },
  configTextArea: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1e293b",
    height: 60,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  createDrillButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createDrillButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});
