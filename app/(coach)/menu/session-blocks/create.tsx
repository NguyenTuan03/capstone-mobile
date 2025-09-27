import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SessionBlockFormData,
  SessionTemplateFormData,
} from "@/types/sessionBlocks";
import { MOCK_DRILLS } from "@/mocks/sessionBlocks";

// Mock courts data
const MOCK_COURTS = [
  {
    id: "court1",
    name: "Crescent Court",
    address: "123 Crescent Street, District 1",
    type: "indoor",
  },
  {
    id: "court2",
    name: "Sports Center",
    address: "456 Sports Avenue, District 2",
    type: "outdoor",
  },
  {
    id: "court3",
    name: "Pickleball Club",
    address: "789 Club Road, District 3",
    type: "indoor",
  },
  {
    id: "court4",
    name: "Community Center",
    address: "101 Community Lane, District 4",
    type: "outdoor",
  },
];

type WizardStep = "basic" | "structure" | "sessions" | "review";

export default function CreateSessionBlockScreen() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic");
  const [loading, setLoading] = useState(false);

  // Helper function to get skill level position percentage
  const getSkillLevelPosition = (level: string) => {
    const levels = ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5+"];
    const index = levels.indexOf(level);
    return (index / (levels.length - 1)) * 100;
  };

  // Helper function to get delivery mode color
  const getDeliveryModeColor = (mode: string) => {
    switch (mode) {
      case "online":
        return "#8b5cf6"; // Purple
      case "offline":
        return "#10b981"; // Green
      default:
        return "#64748b";
    }
  };

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState<SessionBlockFormData>({
    title: "",
    description: "",
    totalSessions: 8,
    skillLevelFrom: "1.0",
    skillLevelTo: "2.0",
    price: 400,
    duration: 4,
    deliveryMode: "offline",
    courtAddress: "",
    meetingLink: "",
  });

  // Court selection state
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const courtDropdownRef = useRef<View>(null);

  // Court selection state
  const [showCourtModal, setShowCourtModal] = useState(false);

  // Structure State
  const [structure, setStructure] = useState({
    sessionDuration: 60,
    weeksBetweenSessions: 1,
    includesVideoAnalysis: false,
    includesProgressReports: true,
  });

  // Sessions State
  const [sessions, setSessions] = useState<SessionTemplateFormData[]>([]);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(
    null,
  );
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [selectedSessionDrills, setSelectedSessionDrills] = useState<any[]>([]);

  const steps = [
    { id: "basic", title: "Basic Info", icon: "information-circle-outline" },
    { id: "structure", title: "Structure", icon: "grid-outline" },
    { id: "sessions", title: "Sessions", icon: "fitness-outline" },
    { id: "review", title: "Review", icon: "checkmark-circle-outline" },
  ];

  const handleNext = () => {
    if (currentStep === "basic") {
      if (!basicInfo.title.trim()) {
        Alert.alert("Validation Error", "Please enter a session block title");
        return;
      }
      setCurrentStep("structure");
    } else if (currentStep === "structure") {
      setCurrentStep("sessions");
      // Generate default sessions based on totalSessions
      generateDefaultSessions();
    } else if (currentStep === "sessions") {
      setCurrentStep("review");
    }
  };

  const handlePrevious = () => {
    const stepOrder: WizardStep[] = [
      "basic",
      "structure",
      "sessions",
      "review",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const generateDefaultSessions = () => {
    const newSessions: SessionTemplateFormData[] = [];
    for (let i = 1; i <= basicInfo.totalSessions; i++) {
      newSessions.push({
        title: `Session ${i}`,
        objectives: [],
        duration: structure.sessionDuration,
        notes: "",
        drills: [],
        expanded: i === 1, // Expand first session by default
      });
    }
    setSessions(newSessions);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "Session block created successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create session block");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted =
          steps.findIndex((s) => s.id === currentStep) > index;

        return (
          <View key={step.id} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
              <Ionicons
                name={isCompleted ? "checkmark" : (step.icon as any)}
                size={16}
                color={isActive || isCompleted ? "#fff" : "#64748b"}
              />
            </View>
            <Text
              style={[
                styles.stepText,
                isActive && styles.stepTextActive,
                isCompleted && styles.stepTextCompleted,
              ]}
            >
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Program Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Beginner Pickleball Fundamentals"
          value={basicInfo.title}
          onChangeText={(text) =>
            setBasicInfo((prev) => ({ ...prev, title: text }))
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe what students will learn in this program..."
          multiline
          numberOfLines={4}
          value={basicInfo.description}
          onChangeText={(text) =>
            setBasicInfo((prev) => ({ ...prev, description: text }))
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Skill Level Range</Text>

        {/* Selected Range Display */}
        <View style={styles.selectedRangeContainer}>
          <View style={styles.rangeDisplay}>
            <Ionicons name="fitness-outline" size={20} color="#3b82f6" />
            <Text style={styles.rangeText}>
              Level {basicInfo.skillLevelFrom} to {basicInfo.skillLevelTo}
            </Text>
          </View>
          <View style={styles.rangeBar}>
            <View style={styles.rangeBarBackground} />
            <View
              style={[
                styles.rangeBarFill,
                {
                  left: `${getSkillLevelPosition(basicInfo.skillLevelFrom)}%`,
                  width: `${getSkillLevelPosition(basicInfo.skillLevelTo) - getSkillLevelPosition(basicInfo.skillLevelFrom)}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Skill Level Selection */}
        <View style={styles.skillLevelRangeContainer}>
          <View style={styles.skillLevelColumn}>
            <Text style={styles.skillLevelLabel}>From Level</Text>
            <View style={styles.skillLevelContainer}>
              {["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5+"].map(
                (level) => {
                  const isSelected = basicInfo.skillLevelFrom === level;
                  const isDisabled =
                    parseFloat(level) > parseFloat(basicInfo.skillLevelTo);
                  return (
                    <TouchableOpacity
                      key={`from-${level}`}
                      style={[
                        styles.skillLevelButton,
                        isSelected && styles.skillLevelButtonActive,
                        isDisabled && styles.skillLevelButtonDisabled,
                      ]}
                      onPress={() => {
                        if (!isDisabled) {
                          setBasicInfo((prev) => ({
                            ...prev,
                            skillLevelFrom: level as any,
                            // Auto-adjust to level if needed
                            skillLevelTo:
                              parseFloat(level) > parseFloat(prev.skillLevelTo)
                                ? (level as any)
                                : prev.skillLevelTo,
                          }));
                        }
                      }}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.skillLevelText,
                          isSelected && styles.skillLevelTextActive,
                          isDisabled && styles.skillLevelTextDisabled,
                        ]}
                      >
                        {level}
                      </Text>
                      {isSelected && <View style={styles.selectedDot} />}
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </View>

          <View style={styles.skillLevelColumn}>
            <Text style={styles.skillLevelLabel}>To Level</Text>
            <View style={styles.skillLevelContainer}>
              {["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5+"].map(
                (level) => {
                  const isSelected = basicInfo.skillLevelTo === level;
                  const isDisabled =
                    parseFloat(level) < parseFloat(basicInfo.skillLevelFrom);
                  return (
                    <TouchableOpacity
                      key={`to-${level}`}
                      style={[
                        styles.skillLevelButton,
                        isSelected && styles.skillLevelButtonActive,
                        isDisabled && styles.skillLevelButtonDisabled,
                      ]}
                      onPress={() => {
                        if (!isDisabled) {
                          setBasicInfo((prev) => ({
                            ...prev,
                            skillLevelTo: level as any,
                          }));
                        }
                      }}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.skillLevelText,
                          isSelected && styles.skillLevelTextActive,
                          isDisabled && styles.skillLevelTextDisabled,
                        ]}
                      >
                        {level}
                      </Text>
                      {isSelected && <View style={styles.selectedDot} />}
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </View>
        </View>

        {/* Level Description */}
        <View style={styles.levelDescriptionContainer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#64748b"
          />
          <Text style={styles.levelDescriptionText}>
            Select the skill level range for this training program
          </Text>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, styles.formGroupHalf]}>
          <Text style={styles.label}>Total Sessions</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={basicInfo.totalSessions.toString()}
            onChangeText={(text) =>
              setBasicInfo((prev) => ({
                ...prev,
                totalSessions: parseInt(text) || 0,
              }))
            }
          />
        </View>

        <View style={[styles.formGroup, styles.formGroupHalf]}>
          <Text style={styles.label}>Duration (weeks)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={basicInfo.duration.toString()}
            onChangeText={(text) =>
              setBasicInfo((prev) => ({
                ...prev,
                duration: parseInt(text) || 0,
              }))
            }
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g., 400"
          value={basicInfo.price.toString()}
          onChangeText={(text) =>
            setBasicInfo((prev) => ({ ...prev, price: parseInt(text) || 0 }))
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Delivery Mode</Text>
        <View style={styles.deliveryModeContainer}>
          <TouchableOpacity
            style={[
              styles.deliveryModeButton,
              basicInfo.deliveryMode === "offline" &&
                styles.deliveryModeButtonActive,
            ]}
            onPress={() =>
              setBasicInfo((prev) => ({ ...prev, deliveryMode: "offline" }))
            }
          >
            <Ionicons
              name={
                basicInfo.deliveryMode === "offline"
                  ? "location"
                  : "location-outline"
              }
              size={20}
              color={basicInfo.deliveryMode === "offline" ? "#fff" : "#64748b"}
            />
            <Text
              style={[
                styles.deliveryModeText,
                basicInfo.deliveryMode === "offline" &&
                  styles.deliveryModeTextActive,
              ]}
            >
              Offline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deliveryModeButton,
              basicInfo.deliveryMode === "online" &&
                styles.deliveryModeButtonActive,
            ]}
            onPress={() =>
              setBasicInfo((prev) => ({ ...prev, deliveryMode: "online" }))
            }
          >
            <Ionicons
              name={
                basicInfo.deliveryMode === "online"
                  ? "videocam"
                  : "videocam-outline"
              }
              size={20}
              color={basicInfo.deliveryMode === "online" ? "#fff" : "#64748b"}
            />
            <Text
              style={[
                styles.deliveryModeText,
                basicInfo.deliveryMode === "online" &&
                  styles.deliveryModeTextActive,
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Mode Details */}
        {basicInfo.deliveryMode === "offline" && (
          <View style={styles.deliveryDetailsContainer}>
            <Text style={styles.deliveryDetailsLabel}>
              Select Court or Enter Address
            </Text>

            {/* Court Selection Button */}
            <TouchableOpacity
              style={styles.courtSelectionButton}
              onPress={() => setShowCourtModal(true)}
            >
              <View style={styles.courtSelectionContent}>
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text style={styles.courtSelectionText}>
                  {selectedCourt
                    ? MOCK_COURTS.find((c) => c.id === selectedCourt)?.name ||
                      "Select a court"
                    : "Select available court"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#64748b" />
            </TouchableOpacity>

            {/* Custom Address Input */}
            <Text style={styles.orSeparator}>OR</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter custom address"
              value={customAddress}
              onChangeText={(text) => {
                setCustomAddress(text);
                if (text.trim()) {
                  setSelectedCourt(null);
                  setBasicInfo((prev) => ({ ...prev, courtAddress: text }));
                }
              }}
            />
          </View>
        )}

        {basicInfo.deliveryMode === "online" && (
          <View style={styles.deliveryDetailsContainer}>
            <Text style={styles.deliveryDetailsLabel}>Meeting Link</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Google Meet, Zoom, or other video call link"
              value={basicInfo.meetingLink || ""}
              onChangeText={(text) =>
                setBasicInfo((prev) => ({ ...prev, meetingLink: text }))
              }
            />
            <View style={styles.meetingLinkHint}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#64748b"
              />
              <Text style={styles.meetingLinkHintText}>
                Students will receive this link when they enroll in your program
              </Text>
            </View>
          </View>
        )}

        <View style={styles.deliveryModeDescriptionContainer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#64748b"
          />
          <Text style={styles.deliveryModeDescriptionText}>
            {basicInfo.deliveryMode === "offline" &&
              "In-person coaching at your preferred location"}
            {basicInfo.deliveryMode === "online" &&
              "Remote coaching via video calls and online resources"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStructure = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Program Structure</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Session Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={structure.sessionDuration.toString()}
          onChangeText={(text) =>
            setStructure((prev) => ({
              ...prev,
              sessionDuration: parseInt(text) || 60,
            }))
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Weeks Between Sessions</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={structure.weeksBetweenSessions.toString()}
          onChangeText={(text) =>
            setStructure((prev) => ({
              ...prev,
              weeksBetweenSessions: parseInt(text) || 1,
            }))
          }
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Program Features</Text>
        <View style={styles.featureContainer}>
          <TouchableOpacity
            style={[
              styles.featureButton,
              structure.includesVideoAnalysis && styles.featureButtonActive,
            ]}
            onPress={() =>
              setStructure((prev) => ({
                ...prev,
                includesVideoAnalysis: !prev.includesVideoAnalysis,
              }))
            }
          >
            <Ionicons
              name="videocam-outline"
              size={20}
              color={structure.includesVideoAnalysis ? "#3b82f6" : "#64748b"}
            />
            <Text
              style={[
                styles.featureText,
                structure.includesVideoAnalysis && styles.featureTextActive,
              ]}
            >
              Video Analysis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.featureButton,
              structure.includesProgressReports && styles.featureButtonActive,
            ]}
            onPress={() =>
              setStructure((prev) => ({
                ...prev,
                includesProgressReports: !prev.includesProgressReports,
              }))
            }
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={structure.includesProgressReports ? "#3b82f6" : "#64748b"}
            />
            <Text
              style={[
                styles.featureText,
                structure.includesProgressReports && styles.featureTextActive,
              ]}
            >
              Progress Reports
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleEditSessionDrills = (index: number) => {
    setEditingSessionIndex(index);
    setSelectedSessionDrills(sessions[index].drills || []);
    setShowDrillModal(true);
  };

  const handleSaveDrills = () => {
    if (editingSessionIndex !== null) {
      const newSessions = [...sessions];
      newSessions[editingSessionIndex] = {
        ...newSessions[editingSessionIndex],
        drills: selectedSessionDrills,
      };
      setSessions(newSessions);
      setShowDrillModal(false);
      setEditingSessionIndex(null);
    }
  };

  const renderSessions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Session Templates</Text>
      <Text style={styles.sectionSubtitle}>
        Configure each session in your training program
      </Text>

      <ScrollView style={styles.sessionsList}>
        {sessions.map((session, index) => (
          <View key={index} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionNumber}>Session {index + 1}</Text>
              <View style={styles.sessionActions}>
                <TouchableOpacity
                  style={styles.drillButton}
                  onPress={() => handleEditSessionDrills(index)}
                >
                  <Ionicons name="fitness-outline" size={16} color="#3b82f6" />
                  <Text style={styles.drillButtonText}>
                    {session.drills?.length || 0} drills
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editSessionButton}
                  onPress={() => {
                    // Expand/collapse session details
                    const newSessions = [...sessions];
                    newSessions[index] = {
                      ...newSessions[index],
                      expanded: !newSessions[index].expanded,
                    };
                    setSessions(newSessions);
                  }}
                >
                  <Ionicons
                    name={session.expanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.sessionTitle}
              placeholder="Session title"
              value={session.title}
              onChangeText={(text) => {
                const newSessions = [...sessions];
                newSessions[index].title = text;
                setSessions(newSessions);
              }}
            />

            {session.expanded && (
              <>
                <TextInput
                  style={[styles.sessionObjectives, styles.textArea]}
                  placeholder="Session objectives (one per line)"
                  multiline
                  numberOfLines={3}
                  value={session.objectives.join("\n")}
                  onChangeText={(text) => {
                    const newSessions = [...sessions];
                    newSessions[index].objectives = text
                      .split("\n")
                      .filter((obj) => obj.trim());
                    setSessions(newSessions);
                  }}
                />

                <View style={styles.sessionMeta}>
                  <Text style={styles.durationText}>
                    Duration: {session.duration} minutes
                  </Text>
                  <Text style={styles.drillCount}>
                    Drills: {session.drills?.length || 0} assigned
                  </Text>
                </View>

                {/* Drills List */}
                {session.drills && session.drills.length > 0 && (
                  <View style={styles.drillsList}>
                    <Text style={styles.drillsListTitle}>Assigned Drills:</Text>
                    {session.drills.map((drill, drillIndex) => (
                      <View key={drillIndex} style={styles.drillItem}>
                        <View style={styles.drillInfo}>
                          <Ionicons
                            name="fitness-outline"
                            size={14}
                            color="#64748b"
                          />
                          <Text style={styles.drillName}>
                            {drill.name || `Drill ${drillIndex + 1}`}
                          </Text>
                        </View>
                        <Text style={styles.drillDuration}>
                          {drill.duration} min
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Drill Assignment Modal */}
      {showDrillModal && editingSessionIndex !== null && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Drills for Session {editingSessionIndex + 1}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDrillModal(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.drillCreationSection}>
                <Text style={styles.drillSectionTitle}>Create New Drill</Text>
                <TouchableOpacity
                  style={styles.createDrillButton}
                  onPress={() => {
                    Alert.alert("Create Drill", "Drill creation coming soon!");
                  }}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.createDrillButtonText}>
                    Add New Drill
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.existingDrillsSection}>
                <Text style={styles.drillSectionTitle}>Available Drills</Text>
                {MOCK_DRILLS.map((drill) => {
                  const isAssigned = selectedSessionDrills.some(
                    (d) => d.id === drill.id,
                  );
                  return (
                    <TouchableOpacity
                      key={drill.id}
                      style={[
                        styles.drillCard,
                        isAssigned && styles.drillCardSelected,
                      ]}
                      onPress={() => {
                        if (isAssigned) {
                          setSelectedSessionDrills((prev) =>
                            prev.filter((d) => d.id !== drill.id),
                          );
                        } else {
                          setSelectedSessionDrills((prev) => [
                            ...prev,
                            {
                              id: drill.id,
                              name: drill.title,
                              duration: drill.duration,
                              instructions: drill.description,
                            },
                          ]);
                        }
                      }}
                    >
                      <View style={styles.drillCardHeader}>
                        <Text style={styles.drillCardTitle}>{drill.title}</Text>
                        <View style={styles.drillCardMeta}>
                          <Text style={styles.drillSkill}>{drill.skill}</Text>
                          <Text style={styles.drillLevel}>{drill.level}</Text>
                        </View>
                      </View>
                      <Text
                        style={styles.drillCardDescription}
                        numberOfLines={2}
                      >
                        {drill.description}
                      </Text>
                      <View style={styles.drillCardFooter}>
                        <Text style={styles.drillCardDuration}>
                          {drill.duration} min
                        </Text>
                        <Text style={styles.drillCardIntensity}>
                          Intensity: {"⭐".repeat(drill.intensity)}
                        </Text>
                      </View>
                      {isAssigned && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#10b981"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowDrillModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveDrills}
              >
                <Text style={styles.modalButtonTextPrimary}>
                  Save {selectedSessionDrills.length} Drills
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderReview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Review Your Program</Text>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>{basicInfo.title}</Text>
          <View style={styles.reviewBadges}>
            <View style={[styles.skillBadge, { backgroundColor: "#10b981" }]}>
              <Text style={styles.skillBadgeText}>
                {basicInfo.skillLevelFrom} - {basicInfo.skillLevelTo}
              </Text>
            </View>
            <View
              style={[
                styles.skillBadge,
                {
                  backgroundColor: getDeliveryModeColor(basicInfo.deliveryMode),
                },
              ]}
            >
              <Text style={styles.skillBadgeText}>
                {basicInfo.deliveryMode.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.skillBadge, { backgroundColor: "#3b82f6" }]}>
              <Text style={styles.skillBadgeText}>${basicInfo.price}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.reviewDescription}>{basicInfo.description}</Text>

        <View style={styles.reviewDetails}>
          <View style={styles.reviewDetailItem}>
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.reviewDetailText}>
              {basicInfo.totalSessions} sessions over {basicInfo.duration} weeks
            </Text>
          </View>
          <View style={styles.reviewDetailItem}>
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text style={styles.reviewDetailText}>
              {structure.sessionDuration} minutes per session
            </Text>
          </View>
        </View>

        <View style={styles.reviewFeatures}>
          <Text style={styles.reviewFeaturesTitle}>Features:</Text>
          <Text style={styles.reviewFeature}>
            •{" "}
            {basicInfo.deliveryMode.charAt(0).toUpperCase() +
              basicInfo.deliveryMode.slice(1)}{" "}
            Coaching
          </Text>
          {basicInfo.deliveryMode === "offline" && basicInfo.courtAddress && (
            <Text style={styles.reviewFeature}>
              • Location: {basicInfo.courtAddress}
            </Text>
          )}
          {basicInfo.deliveryMode === "online" && basicInfo.meetingLink && (
            <Text style={styles.reviewFeature}>• Meeting link provided</Text>
          )}
          {structure.includesVideoAnalysis && (
            <Text style={styles.reviewFeature}>• Video Analysis</Text>
          )}
          {structure.includesProgressReports && (
            <Text style={styles.reviewFeature}>• Progress Reports</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "basic":
        return renderBasicInfo();
      case "structure":
        return renderStructure();
      case "sessions":
        return renderSessions();
      case "review":
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 40,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Session Block</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView style={styles.content}>{renderStepContent()}</ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {currentStep !== "basic" && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handlePrevious}
          >
            <Text style={styles.buttonTextSecondary}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            loading && styles.buttonDisabled,
          ]}
          onPress={currentStep === "review" ? handleCreate : handleNext}
          disabled={loading}
        >
          <Text style={styles.buttonTextPrimary}>
            {loading
              ? "Creating..."
              : currentStep === "review"
                ? "Create Program"
                : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Court Selection Modal */}
      {showCourtModal && (
        <View style={styles.courtModalOverlay}>
          <View style={styles.courtModalContainer}>
            <View style={styles.courtModalHeader}>
              <Text style={styles.courtModalTitle}>Select Court</Text>
              <TouchableOpacity
                style={styles.courtModalClose}
                onPress={() => setShowCourtModal(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.courtModalContent}>
              {MOCK_COURTS.map((court) => (
                <TouchableOpacity
                  key={court.id}
                  style={[
                    styles.courtModalItem,
                    selectedCourt === court.id && styles.courtModalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCourt(court.id);
                    setBasicInfo((prev) => ({
                      ...prev,
                      courtAddress: court.address,
                    }));
                    setShowCourtModal(false);
                    setCustomAddress("");
                  }}
                >
                  <View style={styles.courtModalItemContent}>
                    <Ionicons
                      name={
                        court.type === "indoor"
                          ? "home-outline"
                          : "sunny-outline"
                      }
                      size={20}
                      color={selectedCourt === court.id ? "#3b82f6" : "#64748b"}
                    />
                    <View style={styles.courtModalItemInfo}>
                      <Text style={styles.courtModalItemName}>
                        {court.name}
                      </Text>
                      <Text style={styles.courtModalItemAddress}>
                        {court.address}
                      </Text>
                      <View style={styles.courtModalItemType}>
                        <Text style={styles.courtModalItemTypeName}>
                          {court.type === "indoor" ? "Indoor" : "Outdoor"}
                        </Text>
                      </View>
                    </View>
                    {selectedCourt === court.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10b981"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 32,
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  stepContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: "#3b82f6",
  },
  stepCircleCompleted: {
    backgroundColor: "#10b981",
  },
  stepText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  stepTextActive: {
    color: "#3b82f6",
  },
  stepTextCompleted: {
    color: "#10b981",
  },
  stepLine: {
    position: "absolute",
    top: 16,
    right: "-50%",
    width: "100%",
    height: 2,
    backgroundColor: "#e2e8f0",
  },
  stepLineCompleted: {
    backgroundColor: "#10b981",
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },

  // Form
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1e293b",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  // Skill Level
  selectedRangeContainer: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  rangeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  rangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
  rangeBar: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
  },
  rangeBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e2e8f0",
  },
  rangeBarFill: {
    position: "absolute",
    top: 0,
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    minWidth: 8,
  },
  skillLevelRangeContainer: {
    gap: 16,
  },
  skillLevelColumn: {
    flex: 1,
  },
  skillLevelLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  skillLevelContainer: {
    flexDirection: "row",
    gap: 6,
  },
  skillLevelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  skillLevelButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  skillLevelButtonDisabled: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    opacity: 0.4,
  },
  skillLevelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  skillLevelTextActive: {
    color: "#fff",
  },
  skillLevelTextDisabled: {
    color: "#cbd5e1",
  },
  selectedDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  levelDescriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
  },
  levelDescriptionText: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
  },

  // Delivery Mode
  deliveryModeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  deliveryModeButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minHeight: 80,
  },
  deliveryModeButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryModeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 6,
    textAlign: "center",
  },
  deliveryModeTextActive: {
    color: "#fff",
  },
  deliveryModeDescriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  deliveryModeDescriptionText: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
    lineHeight: 16,
  },

  // Enhanced Delivery Mode Details
  deliveryDetailsContainer: {
    marginTop: 16,
    gap: 12,
  },
  deliveryDetailsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  // Court Selection
  courtSelectionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },
  courtSelectionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  courtSelectionText: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  // Court Modal Styles
  courtModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  courtModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    flex: 1,
  },
  courtModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  courtModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  courtModalClose: {
    padding: 4,
  },
  courtModalContent: {
    flex: 1,
    padding: 20,
  },
  courtModalItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },
  courtModalItemSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  courtModalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  courtModalItemInfo: {
    flex: 1,
  },
  courtModalItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  courtModalItemAddress: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    lineHeight: 18,
  },
  courtModalItemType: {
    alignSelf: "flex-start",
  },
  courtModalItemTypeName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#64748b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
  },
  orSeparator: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginVertical: 8,
  },

  // Meeting Link
  meetingLinkHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
  },
  meetingLinkHintText: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
    lineHeight: 16,
  },

  // Enhanced Session Cards
  sessionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  drillButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
  drillsList: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  drillsListTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  drillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 4,
  },
  drillInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  drillName: {
    fontSize: 12,
    color: "#1e293b",
    fontWeight: "500",
  },
  drillDuration: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },

  // Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  drillCreationSection: {
    marginBottom: 24,
  },
  drillSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  createDrillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  createDrillButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
  },
  existingDrillsSection: {
    flex: 1,
  },
  drillCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  drillCardSelected: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  drillCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  drillCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  drillCardMeta: {
    flexDirection: "row",
    gap: 6,
  },
  drillSkill: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  drillLevel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#10b981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  drillCardDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
    marginBottom: 12,
  },
  drillCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drillCardDuration: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  drillCardIntensity: {
    fontSize: 11,
    color: "#f59e0b",
  },
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#3b82f6",
  },
  modalButtonSecondary: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  modalButtonTextPrimary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  modalButtonTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },

  // Features
  featureContainer: {
    flexDirection: "row",
    gap: 12,
  },
  featureButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  featureButtonActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  featureText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  featureTextActive: {
    color: "#3b82f6",
  },

  // Sessions
  sessionsList: {
    maxHeight: 400,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  editSessionButton: {
    padding: 4,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  sessionObjectives: {
    fontSize: 14,
    color: "#64748b",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    height: 60,
  },
  sessionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationText: {
    fontSize: 12,
    color: "#64748b",
  },
  drillCount: {
    fontSize: 12,
    color: "#64748b",
  },

  // Review
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  reviewBadges: {
    flexDirection: "row",
    gap: 8,
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
  reviewDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  reviewDetails: {
    marginBottom: 16,
  },
  reviewDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  reviewDetailText: {
    fontSize: 14,
    color: "#64748b",
  },
  reviewFeatures: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  reviewFeaturesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  reviewFeature: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
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
