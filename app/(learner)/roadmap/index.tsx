import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Course = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  drills: number;
  duration: string;
  progress: number; // 0-100
};

const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Foundations of Tennis",
    level: "Beginner",
    lessons: 12,
    drills: 8,
    duration: "4h 20m",
    progress: 45,
  },
  {
    id: "c2",
    title: "Intermediate Footwork",
    level: "Intermediate",
    lessons: 10,
    drills: 12,
    duration: "5h 05m",
    progress: 0,
  },
  {
    id: "c3",
    title: "Advanced Strategy",
    level: "Advanced",
    lessons: 14,
    drills: 10,
    duration: "6h 10m",
    progress: 72,
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
type LevelFilter = (typeof LEVELS)[number];

export default function RoadmapScreen() {
  const [activeLevel, setActiveLevel] = useState<LevelFilter>("All");

  const filteredCourses = useMemo(() => {
    if (activeLevel === "All") return MOCK_COURSES;
    return MOCK_COURSES.filter((c) => c.level === activeLevel);
  }, [activeLevel]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View>
        <Text style={styles.title}>Learning Curriculum</Text>
        <Text style={styles.subtitle}>
          Structured courses for all skill levels
        </Text>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {LEVELS.map((level) => {
          const isActive = level === activeLevel;
          return (
            <Pressable
              key={level}
              onPress={() => setActiveLevel(level)}
              style={[
                styles.filterPill,
                isActive ? styles.filterPillActive : styles.filterPillInactive,
              ]}
            >
              <Text
                style={
                  isActive ? styles.filterTextActive : styles.filterTextInactive
                }
              >
                {level}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Courses */}
      <View style={styles.list}>
        {filteredCourses.map((course) => (
          <View key={course.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconThumb}>
                <Ionicons name="book" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{course.title}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{course.level}</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>{course.lessons} lessons</Text>
                  <Text style={styles.metaDivider}>-</Text>
                  <Text style={styles.metaText}>{course.drills} drills</Text>
                  <Text style={styles.metaDivider}>-</Text>
                  <Text style={styles.metaText}>{course.duration}</Text>
                </View>
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${course.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{course.progress}%</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {course.progress === 0 ? "Start Course" : "Continue"}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 8,
  },
  filters: {
    gap: 8,
    paddingBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterPillActive: {
    backgroundColor: "#10B981",
  },
  filterPillInactive: {
    backgroundColor: "#F3F4F6",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  filterTextInactive: {
    color: "#374151",
    fontWeight: "500",
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  iconThumb: {
    width: 64,
    height: 64,
    backgroundColor: "#34D399",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: "600",
    color: "#111827",
    flexShrink: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
  },
  levelBadgeText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 12,
  },
  metaDivider: {
    color: "#9CA3AF",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#10B981",
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
