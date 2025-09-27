import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
type CoachingStyle =
  | "beginner_friendly"
  | "competitive"
  | "technical"
  | "game_based";

type FocusArea = {
  id: string;
  name: string;
  standout: boolean;
};

type TeachingMethodology = {
  approach: string;
  philosophy: string;
  techniques: string;
  communicationStyle: string;
};

type TeachingData = {
  styles: CoachingStyle[];
  focusAreas: FocusArea[];
  methodology: TeachingMethodology;
  experience: {
    years: string;
    studentsCoached: string;
    ageGroups: string[];
  };
};

const COACHING_STYLES = [
  {
    id: "beginner_friendly" as const,
    name: "Beginner Friendly",
    description: "Patient, encouraging, focuses on fundamentals",
  },
  {
    id: "competitive" as const,
    name: "Competitive",
    description: "Intense, strategic, performance-focused",
  },
  {
    id: "technical" as const,
    name: "Technical",
    description: "Detailed, mechanics-focused, analytical",
  },
  {
    id: "game_based" as const,
    name: "Game-Based",
    description: "Learn through play, situational training",
  },
];

const DEFAULT_FOCUS_AREAS: FocusArea[] = [
  { id: "serving", name: "Power Serve", standout: true },
  { id: "dinking", name: "Soft Dink", standout: true },
  { id: "thirdshot", name: "Third Shot Drop", standout: true },
  { id: "groundstrokes", name: "Groundstroke Accuracy", standout: false },
  { id: "volleys", name: "Volley Placement", standout: false },
  { id: "lob", name: "Lob Defense", standout: false },
  { id: "strategy", name: "Stack Strategy", standout: true },
  { id: "footwork", name: "Quick Footwork", standout: false },
];

const AGE_GROUPS = [
  "Kids (5-12)",
  "Teens (13-17)",
  "Adults (18+)",
  "Seniors (65+)",
];

export default function TeachingSpecialtyScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [teachingData, setTeachingData] = useState<TeachingData>({
    styles: ["beginner_friendly", "game_based"],
    focusAreas: DEFAULT_FOCUS_AREAS,
    methodology: {
      approach:
        "I believe in creating a positive learning environment where players feel comfortable making mistakes and trying new techniques.",
      philosophy:
        "Pickleball should be fun first! I focus on building confidence while teaching proper fundamentals and strategy.",
      techniques:
        "Progressive drilling, game-based learning, and situational practice",
      communicationStyle:
        "Encouraging and constructive, with clear demonstrations and immediate feedback",
    },
    experience: {
      years: "3",
      studentsCoached: "150+",
      ageGroups: ["Adults (18+)", "Teens (13-17)"],
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleCoachingStyle = (style: CoachingStyle) => {
    if (!isEditing) return;
    setTeachingData((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const toggleFocusAreaStandout = (areaId: string) => {
    if (!isEditing) return;
    setTeachingData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.map((area) =>
        area.id === areaId ? { ...area, standout: !area.standout } : area,
      ),
    }));
  };

  const toggleAgeGroup = (ageGroup: string) => {
    if (!isEditing) return;
    setTeachingData((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        ageGroups: prev.experience.ageGroups.includes(ageGroup)
          ? prev.experience.ageGroups.filter((ag) => ag !== ageGroup)
          : [...prev.experience.ageGroups, ageGroup],
      },
    }));
  };

  const updateMethodology = (field: keyof TeachingMethodology, value: any) => {
    if (!isEditing) return;
    setTeachingData((prev) => ({
      ...prev,
      methodology: {
        ...prev.methodology,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    Alert.alert("Success", "Teaching specialty updated successfully!", [
      { text: "OK", onPress: () => setIsEditing(false) },
    ]);
  };

  return (
    <View
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
        <Text style={styles.headerTitle}>Teaching Specialty</Text>
        <TouchableOpacity
          style={[styles.editButton, isEditing && styles.saveButton]}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text
            style={[styles.editButtonText, isEditing && styles.saveButtonText]}
          >
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coaching Styles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coaching Style</Text>
          <Text style={styles.sectionSubtitle}>
            Select the styles that best describe your coaching approach
          </Text>

          <View style={styles.stylesGrid}>
            {COACHING_STYLES.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleCard,
                  teachingData.styles.includes(style.id) &&
                    styles.styleCardSelected,
                  !isEditing && styles.styleCardDisabled,
                ]}
                onPress={() => toggleCoachingStyle(style.id)}
                disabled={!isEditing}
              >
                <View
                  style={[
                    styles.styleIcon,
                    teachingData.styles.includes(style.id) &&
                      styles.styleIconSelected,
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={
                      teachingData.styles.includes(style.id)
                        ? "#fff"
                        : "#64748b"
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.styleName,
                    teachingData.styles.includes(style.id) &&
                      styles.styleNameSelected,
                  ]}
                >
                  {style.name}
                </Text>
                <Text
                  style={[
                    styles.styleDescription,
                    teachingData.styles.includes(style.id) &&
                      styles.styleDescriptionSelected,
                  ]}
                >
                  {style.description}
                </Text>
                {teachingData.styles.includes(style.id) && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Areas of Focus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standout Techniques</Text>
          <Text style={styles.sectionSubtitle}>
            Select your standout techniques
          </Text>

          <View style={styles.focusAreasGrid}>
            {teachingData.focusAreas.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={[
                  styles.techniqueChip,
                  area.standout && styles.techniqueChipSelected,
                  !isEditing && styles.techniqueChipDisabled,
                ]}
                onPress={() => toggleFocusAreaStandout(area.id)}
                disabled={!isEditing}
              >
                <Text
                  style={[
                    styles.techniqueText,
                    area.standout && styles.techniqueTextSelected,
                  ]}
                >
                  {area.name}
                </Text>
                {area.standout && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Teaching Methodology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Methodology</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Teaching Approach</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !isEditing && styles.inputDisabled,
              ]}
              value={teachingData.methodology.approach}
              onChangeText={(text) => updateMethodology("approach", text)}
              multiline
              numberOfLines={3}
              editable={isEditing}
              placeholder="Describe your teaching approach..."
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Coaching Philosophy</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !isEditing && styles.inputDisabled,
              ]}
              value={teachingData.methodology.philosophy}
              onChangeText={(text) => updateMethodology("philosophy", text)}
              multiline
              numberOfLines={3}
              editable={isEditing}
              placeholder="What's your coaching philosophy?"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Techniques & Methods</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !isEditing && styles.inputDisabled,
              ]}
              value={teachingData.methodology.techniques}
              onChangeText={(text) => updateMethodology("techniques", text)}
              multiline
              numberOfLines={2}
              editable={isEditing}
              placeholder="List your teaching techniques..."
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Communication Style</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={teachingData.methodology.communicationStyle}
              onChangeText={(text) =>
                updateMethodology("communicationStyle", text)
              }
              editable={isEditing}
              placeholder="How do you communicate with students?"
            />
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Experience</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={teachingData.experience.years}
              onChangeText={(text) =>
                setTeachingData((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, years: text },
                }))
              }
              editable={isEditing}
              placeholder="3"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Students Coached</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={teachingData.experience.studentsCoached}
              onChangeText={(text) =>
                setTeachingData((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, studentsCoached: text },
                }))
              }
              editable={isEditing}
              placeholder="150+"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Age Groups You Teach</Text>
            <View style={styles.ageGroupsContainer}>
              {AGE_GROUPS.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.ageGroupChip,
                    teachingData.experience.ageGroups.includes(group) &&
                      styles.ageGroupChipSelected,
                    !isEditing && styles.ageGroupChipDisabled,
                  ]}
                  onPress={() => toggleAgeGroup(group)}
                  disabled={!isEditing}
                >
                  <Text
                    style={[
                      styles.ageGroupText,
                      teachingData.experience.ageGroups.includes(group) &&
                        styles.ageGroupTextSelected,
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  editButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  editButtonText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButtonText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  stylesGrid: {
    flexDirection: "column",
    gap: 12,
  },
  styleCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },
  styleCardSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  styleCardDisabled: {
    opacity: 0.7,
  },
  styleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  styleIconSelected: {
    backgroundColor: "#3b82f6",
  },
  styleName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  styleNameSelected: {
    color: "#1e40af",
  },
  styleDescription: {
    fontSize: 12,
    color: "#64748b",
    flex: 2,
  },
  styleDescriptionSelected: {
    color: "#3730a3",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  focusAreasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  techniqueChip: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  techniqueChipSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  techniqueChipDisabled: {
    opacity: 0.7,
  },
  techniqueText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  techniqueTextSelected: {
    color: "#fff",
  },
  formGroup: {
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
  inputDisabled: {
    backgroundColor: "#f9fafb",
    color: "#6b7280",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  ageGroupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ageGroupChip: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  ageGroupChipSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  ageGroupChipDisabled: {
    opacity: 0.7,
  },
  ageGroupText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  ageGroupTextSelected: {
    color: "#3b82f6",
  },
});
