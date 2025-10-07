import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

type Course = {
  id: string;
  title: string;
  level: CourseLevel;
  lessons: number;
  drills: number;
  duration: string;
  progress: number; // 0-100
};

const courses = [
  {
    id: 1,
    title: "Beginner Basics",
    progress: 45,
    lessons: 12,
    duration: "2h 30m",
    level: "Beginner",
    drills: 8,
    description:
      "Master the fundamental skills of pickleball. Perfect for complete beginners.",
    instructor: "Coach John Smith",
    instructorAvatar: "J",
    enrolled: 1245,
    rating: 4.8,
    reviews: 342,
    price: "Free",
    thumbnail: "beginner",
  },
  {
    id: 2,
    title: "Forehand Mastery",
    progress: 20,
    lessons: 8,
    duration: "1h 45m",
    level: "Intermediate",
    drills: 6,
    description: "Develop a powerful and consistent forehand shot.",
    instructor: "Coach Sarah Lee",
    instructorAvatar: "S",
    enrolled: 856,
    rating: 4.9,
    reviews: 203,
    price: "$29.99",
    thumbnail: "forehand",
  },
  {
    id: 3,
    title: "Serving Techniques",
    progress: 0,
    lessons: 10,
    duration: "2h 00m",
    level: "Beginner",
    drills: 10,
    description:
      "Learn various serving techniques to start every point strong.",
    instructor: "Coach Mike Chen",
    instructorAvatar: "M",
    enrolled: 723,
    rating: 4.7,
    reviews: 156,
    price: "$24.99",
    thumbnail: "serve",
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

type LevelFilter = (typeof LEVELS)[number];

export default function Roadmap() {
  const router = useRouter();
  const [activeLevel, setActiveLevel] = useState<LevelFilter>("All");

  const filteredCourses = useMemo(() => {
    if (activeLevel === "All") return courses;
    return courses.filter((c) => c.level === activeLevel);
  }, [activeLevel]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Lộ trình học</Text>
        <Text style={styles.subtitle}>Khoá học cho mọi trình độ</Text>
      </View>

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
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
              ]}
            >
              <Text
                style={
                  isActive ? styles.pillTextActive : styles.pillTextInactive
                }
              >
                {level}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {filteredCourses.map((course) => (
          <View key={course.id} style={styles.card}>
            <View style={styles.thumb}>
              <Ionicons name="book" size={48} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{course.title}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{course.level}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="play" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{course.lessons} bài học</Text>
                </View>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="golf" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{course.drills} bài tập</Text>
                </View>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{course.duration}</Text>
                </View>
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

              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  router.push({
                    pathname: "/(learner)/course/[id]",
                    params: { id: String(course.id) },
                  })
                }
              >
                <Text style={styles.primaryButtonText}>
                  {course.progress === 0 ? "Bắt đầu khoá học" : "Tiếp tục"}
                </Text>
              </Pressable>
            </View>
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
  filters: { gap: 8, paddingBottom: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  pillActive: { backgroundColor: "#10B981" },
  pillInactive: { backgroundColor: "#F3F4F6" },
  pillTextActive: { color: "#fff", fontWeight: "600" },
  pillTextInactive: { color: "#374151", fontWeight: "500" },
  list: { gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  thumb: {
    height: 140,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { padding: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: { fontWeight: "600", color: "#111827", flex: 1 },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
  },
  levelBadgeText: { color: "#1D4ED8", fontSize: 12, fontWeight: "600" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: "#6B7280", fontSize: 12 },
  metaDivider: { color: "#9CA3AF" },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: 8, backgroundColor: "#10B981", borderRadius: 999 },
  progressText: { fontSize: 12, color: "#4B5563", fontWeight: "600" },
  primaryButton: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700" },
});
