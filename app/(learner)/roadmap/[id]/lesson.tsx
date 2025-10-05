import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Lesson = {
  id: number | string;
  title: string;
  type: "video" | "quiz";
  // optional quiz options:
  options?: string[];
};
type Course = {
  id: number | string;
  title: string;
};

type Props = {
  lesson?: Lesson;
  course?: Course;
  onBack?: () => void;
  onPrev?: () => void;
  onMarkCompleteAndNext?: (selectedOption?: string) => void;
  setSelectedLesson?: (l: Lesson | null) => void; // nếu bạn muốn giữ API cũ
};

export default function LessonView({
  lesson,
  course,
  onBack,
  onPrev,
  onMarkCompleteAndNext,
  setSelectedLesson,
}: Props) {
  const router = useRouter();
  const { id: courseIdFromRoute, lessonId } = useLocalSearchParams<{
    id?: string;
    lessonId?: string;
  }>();
  const fallbackCourse: Course = {
    id: courseIdFromRoute ?? "unknown",
    title: "Course",
  };
  const fallbackLesson: Lesson = {
    id: lessonId ?? "1",
    title: "Lesson",
    type: "video",
  };
  const effectiveCourse = course ?? fallbackCourse;
  const effectiveLesson = lesson ?? fallbackLesson;
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const quizOptions = useMemo(
    () =>
      effectiveLesson.options ?? [
        "Eastern grip",
        "Western grip",
        "Continental grip",
        "Semi-western grip",
      ],
    [effectiveLesson?.options],
  );

  const handleBack = () => {
    if (onBack) return onBack();
    if (setSelectedLesson) setSelectedLesson(null);
    else router.back();
  };

  const handlePrev = () => {
    if (onPrev) return onPrev();
    // fallback
    console.log("Prev lesson");
  };

  const handleMarkComplete = () => {
    if (onMarkCompleteAndNext) return onMarkCompleteAndNext(selected);
    console.log("Mark Complete & Next", { selected });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#4B5563" />
          <Text style={styles.backText}>Back to Course</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Course */}
        <View style={{ gap: 4 }}>
          <Text style={styles.title}>{effectiveLesson.title}</Text>
          <Text style={styles.courseTitle}>{effectiveCourse.title}</Text>
        </View>

        {/* Video or Quiz */}
        {effectiveLesson.type === "video" ? (
          <View style={styles.videoBox}>
            <Feather name="play" size={64} color="#fff" />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.quizHeader}>Quiz: {effectiveLesson.title}</Text>

            <View style={{ gap: 12 }}>
              <View style={styles.questionBlock}>
                <Text style={styles.questionText}>
                  Question 1: What is the correct grip for forehand?
                </Text>

                <View style={{ gap: 8 }}>
                  {quizOptions.map((option, i) => {
                    const isActive = selected === option;
                    return (
                      <TouchableOpacity
                        key={`${i}-${option}`}
                        activeOpacity={0.8}
                        onPress={() => setSelected(option)}
                        style={[
                          styles.optionBtn,
                          isActive && styles.optionBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isActive && styles.optionTextActive,
                          ]}
                          numberOfLines={2}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Lesson Content */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lesson Content</Text>

          <View style={{ gap: 8 }}>
            <Text style={styles.paragraph}>
              In this lesson, you will learn the fundamental techniques and
              proper form. Pay attention to body positioning, grip, and
              follow-through motion.
            </Text>

            <Text style={styles.subheading}>Key Points:</Text>

            <View style={{ gap: 6 }}>
              {[
                "Maintain proper ready position",
                "Use correct grip technique",
                "Focus on smooth motion",
                "Complete full follow-through",
              ].map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={handlePrev}
            activeOpacity={0.8}
            style={styles.btnGhost}
          >
            <Text style={styles.btnGhostText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMarkComplete}
            activeOpacity={0.9}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>Mark Complete & Next</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" }, // bg-gray-50

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 10,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontSize: 14 },

  scroll: { flex: 1 },
  content: { padding: 16, gap: 16 },

  title: { fontSize: 22, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  courseTitle: { fontSize: 12, color: "#6B7280" },

  videoBox: {
    backgroundColor: "#000",
    borderRadius: 12,
    aspectRatio: 16 / 9,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  quizHeader: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
    color: "#111827",
  },

  questionBlock: {
    backgroundColor: "#EFF6FF", // bg-blue-50
    borderRadius: 10,
    padding: 12,
  },
  questionText: { fontWeight: "600", marginBottom: 12, color: "#111827" },

  optionBtn: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  optionBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  optionText: { color: "#111827", fontSize: 14 },
  optionTextActive: { color: "#1D4ED8", fontWeight: "600" },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
    fontSize: 16,
  },
  paragraph: { color: "#374151", lineHeight: 20 },

  subheading: {
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
    color: "#111827",
    fontSize: 14,
  },

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#6B7280",
    marginTop: 7,
  },
  bulletText: { color: "#374151", flex: 1 },

  actionsRow: { flexDirection: "row", gap: 12 },
  btnGhost: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnGhostText: { fontWeight: "600", color: "#111827" },

  btnPrimary: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
});
