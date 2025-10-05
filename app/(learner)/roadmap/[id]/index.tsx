import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ==== SAMPLE DATA (bạn có thể truyền từ props tuỳ ý) ====
const courseLessons: Record<number, any[]> = {
  1: [
    {
      id: 1,
      title: "Welcome to Pickleball",
      duration: "8:30",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 2,
      title: "Court Layout and Rules",
      duration: "12:15",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 3,
      title: "Grip Fundamentals",
      duration: "10:45",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 4,
      title: "Ready Position",
      duration: "9:20",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 5,
      title: "Basic Forehand",
      duration: "15:30",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 6,
      title: "Forehand Quiz",
      duration: "5 questions",
      completed: false,
      locked: false,
      type: "quiz",
    },
    {
      id: 7,
      title: "Basic Backhand",
      duration: "14:20",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 8,
      title: "Serving Basics",
      duration: "11:00",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 9,
      title: "Return of Serve",
      duration: "13:45",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 10,
      title: "Dinking Introduction",
      duration: "16:10",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 11,
      title: "Basic Strategy",
      duration: "18:00",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 12,
      title: "Final Assessment",
      duration: "10 questions",
      completed: false,
      locked: true,
      type: "quiz",
    },
  ],
  2: [
    {
      id: 1,
      title: "Forehand Fundamentals Review",
      duration: "10:00",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 2,
      title: "Power Generation",
      duration: "15:30",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 3,
      title: "Topspin Technique",
      duration: "12:45",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 4,
      title: "Footwork for Forehand",
      duration: "14:20",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 5,
      title: "Attack vs Control",
      duration: "11:15",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 6,
      title: "Drills and Practice",
      duration: "20:00",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 7,
      title: "Common Mistakes",
      duration: "13:30",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 8,
      title: "Final Assessment",
      duration: "8 questions",
      completed: false,
      locked: true,
      type: "quiz",
    },
  ],
  3: [
    {
      id: 1,
      title: "Serve Rules and Basics",
      duration: "9:00",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 2,
      title: "Underhand Serve",
      duration: "12:30",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 3,
      title: "Power Serve",
      duration: "14:00",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 4,
      title: "Spin Serves",
      duration: "16:45",
      completed: false,
      locked: true,
      type: "video",
    },
    {
      id: 5,
      title: "Placement and Strategy",
      duration: "13:20",
      completed: false,
      locked: true,
      type: "video",
    },
  ],
};

const sampleCourse = {
  id: 1,
  title: "Pickleball Fundamentals",
  level: "Beginner",
  description:
    "Master the basics of Pickleball: rules, grips, forehand/backhand, and core footwork to build a solid foundation.",
  instructorAvatar: "MP",
  instructor: "Minh Pham",
  rating: 4.8,
  reviews: 124,
  enrolled: 2310,
  progress: 30, // chỉ để hiển thị logic show/hide button; phần trăm thật sẽ tính theo lessons
  lessons: 12,
  drills: 18,
  duration: "3h 45m",
  price: "$39",
};

const courseReviews = [
  {
    id: 1,
    avatar: "AL",
    user: "Anh Le",
    date: "2025-09-30",
    rating: 5,
    comment: "Great intro—clear, concise, and practical drills.",
  },
  {
    id: 2,
    avatar: "TN",
    user: "Thu Nguyen",
    date: "2025-09-28",
    rating: 4,
    comment: "Good structure. Would love more footwork examples.",
  },
  {
    id: 3,
    avatar: "QD",
    user: "Quang Do",
    date: "2025-09-25",
    rating: 5,
    comment: "Instructor explains really well. Highly recommend!",
  },
];

// ===== ICON HELPERS =====
const LessonIcon = ({ lesson }: { lesson: any }) => {
  if (lesson.completed) {
    return <AntDesign name="checkcircle" size={18} color="#fff" />;
  }
  if (lesson.locked) {
    return <Feather name="lock" size={16} color="#fff" />;
  }
  if (lesson.type === "quiz") {
    return <Feather name="file-text" size={16} color="#fff" />;
  }
  return <Feather name="play-circle" size={16} color="#fff" />;
};

type Props = {
  course?: typeof sampleCourse;
  onBack?: () => void;
  onSelectLesson?: (lesson: any) => void;
};

export default function CourseDetailsScreen({
  course: courseProp,
  onBack,
  onSelectLesson,
}: Props) {
  const router = useRouter();
  const { id: routeCourseId } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState(courseProp ?? sampleCourse);
  const lessons = courseLessons[course.id] || [];

  const completedLessons = useMemo(
    () => lessons.filter((l) => l.completed).length,
    [lessons],
  );
  const progressPercent = useMemo(() => {
    if (!lessons.length) return 0;
    // làm tròn như web
    return Math.round((completedLessons / lessons.length) * 100);
  }, [completedLessons, lessons.length]);

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  const handleSelectLesson = (lesson: any) => {
    if (lesson.locked) return;
    if (onSelectLesson) return onSelectLesson(lesson);
    router.push({
      pathname: "/(learner)/roadmap/[id]/lesson",
      params: { id: String(routeCourseId ?? course.id) },
    });
  };

  const handleContinue = () => {
    const next = lessons.find((l) => !l.completed && !l.locked);
    if (next) handleSelectLesson(next);
  };

  const FooterEnroll = () => {
    if (course.progress === 0) {
      return (
        <View style={styles.enrollBar}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>{course.price}</Text>
          </View>
          <TouchableOpacity
            style={styles.enrollBtn}
            activeOpacity={0.9}
            onPress={() => console.log("Enroll Now")}
          >
            <Text style={styles.enrollBtnText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={styles.backText}>Back to Courses</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <LinearGradient
        colors={["#34d399", "#10b981"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Feather name="book-open" size={64} color="#fff" />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Info */}
        <View style={styles.cardBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{course.title}</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
          </View>

          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.instructorRow}>
            <View style={styles.instructorAvatar}>
              <Text style={styles.instructorAvatarText}>
                {course.instructorAvatar}
              </Text>
            </View>
            <View>
              <Text style={styles.instructorLabel}>Instructor</Text>
              <Text style={styles.instructorName}>{course.instructor}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <AntDesign name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingValue}>{course.rating}</Text>
              <Text style={styles.ratingCount}>({course.reviews} reviews)</Text>
            </View>
            <Text style={styles.enrolled}>{course.enrolled} students</Text>
          </View>
        </View>

        {/* Progress */}
        {course.progress > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
            <Text style={styles.progressSub}>
              {completedLessons} of {lessons.length} lessons completed
            </Text>
          </View>
        )}

        {/* Course Includes */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Course Includes</Text>
          <View style={styles.includesGrid}>
            <View style={styles.includeItem}>
              <Feather name="video" size={18} color="#059669" />
              <Text style={styles.includeText}>
                {course.lessons} video lessons
              </Text>
            </View>
            <View style={styles.includeItem}>
              <Feather name="target" size={18} color="#7c3aed" />
              <Text style={styles.includeText}>
                {course.drills} practice drills
              </Text>
            </View>
            <View style={styles.includeItem}>
              <Feather name="clock" size={18} color="#2563eb" />
              <Text style={styles.includeText}>{course.duration} content</Text>
            </View>
            <View style={styles.includeItem}>
              <Feather name="file-text" size={18} color="#ea580c" />
              <Text style={styles.includeText}>Quizzes included</Text>
            </View>
          </View>
        </View>

        {/* Curriculum */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Curriculum</Text>
          <View style={styles.curriculumList}>
            {lessons.map((lesson, idx) => {
              const bg = lesson.locked
                ? styles.lessonLocked
                : styles.lessonUnlocked;
              const bubble = lesson.completed
                ? styles.bubbleCompleted
                : lesson.locked
                  ? styles.bubbleLocked
                  : styles.bubbleDefault;

              return (
                <TouchableOpacity
                  key={`${lesson.id}`}
                  activeOpacity={lesson.locked ? 1 : 0.7}
                  onPress={() => handleSelectLesson(lesson)}
                  style={[styles.lessonRow, bg]}
                >
                  <View style={[styles.bubble, bubble]}>
                    <LessonIcon lesson={lesson} />
                  </View>
                  <View style={styles.lessonBody}>
                    <Text style={styles.lessonTitle}>
                      {idx + 1}. {lesson.title}
                    </Text>
                    <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                  </View>
                  {!lesson.locked && (
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.panel}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.panelTitle}>Student Reviews</Text>
            <View style={styles.reviewsSummary}>
              <AntDesign name="star" size={18} color="#fbbf24" />
              <Text style={styles.reviewsScore}>{course.rating}</Text>
              <Text style={styles.reviewsCount}>({course.reviews})</Text>
            </View>
          </View>

          <View style={styles.reviewsList}>
            {courseReviews.map((r) => (
              <View key={r.id} style={styles.reviewItem}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewUser}>{r.user}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <AntDesign
                        key={i}
                        name="star"
                        size={12}
                        color={i < r.rating ? "#fbbf24" : "#D1D5DB"}
                        style={{ marginLeft: 1 }}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Continue Button (if already enrolled) */}
        {course.progress > 0 && (
          <TouchableOpacity
            onPress={handleContinue}
            style={styles.continueBtn}
            activeOpacity={0.9}
          >
            <Text style={styles.continueBtnText}>Continue Learning</Text>
          </TouchableOpacity>
        )}

        {/* spacing for fixed footer */}
        {course.progress === 0 && <View style={{ height: 88 }} />}
      </ScrollView>

      {/* Fixed Enroll Footer */}
      <FooterEnroll />
    </SafeAreaView>
  );
}

// ====== STYLES ======
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 4, android: 8 }),
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    zIndex: 10,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontSize: 14 },

  banner: {
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },

  cardBlock: { gap: 12 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  levelPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
  },
  levelText: { fontSize: 12, color: "#1D4ED8", fontWeight: "600" },
  description: { color: "#4B5563", marginBottom: 8 },

  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  instructorAvatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  instructorLabel: { fontSize: 12, color: "#6B7280" },
  instructorName: { fontSize: 16, fontWeight: "600", color: "#111827" },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingValue: { fontWeight: "600", color: "#111827" },
  ratingCount: { color: "#6B7280" },
  enrolled: { color: "#6B7280" },

  progressCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { fontWeight: "600", color: "#111827" },
  progressPercent: { fontSize: 22, fontWeight: "700", color: "#059669" },
  progressTrack: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: 12, backgroundColor: "#10B981", borderRadius: 999 },
  progressSub: { fontSize: 12, color: "#6B7280" },

  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  panelTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
    color: "#0f172a",
  },

  includesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  includeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "48%",
  },
  includeText: { fontSize: 14, color: "#111827" },

  curriculumList: { gap: 8 },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  lessonLocked: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    opacity: 0.6,
  },
  lessonUnlocked: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
  },
  bubble: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleCompleted: { backgroundColor: "#10B981" },
  bubbleLocked: { backgroundColor: "#D1D5DB" },
  bubbleDefault: { backgroundColor: "#3B82F6" },
  lessonBody: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  lessonDuration: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reviewsSummary: { flexDirection: "row", alignItems: "center", gap: 4 },
  reviewsScore: { fontWeight: "700", color: "#111827" },
  reviewsCount: { fontSize: 12, color: "#6B7280" },

  reviewsList: { gap: 12 },
  reviewItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  reviewUser: { fontSize: 14, fontWeight: "600", color: "#111827" },
  reviewDate: { fontSize: 11, color: "#6B7280" },
  reviewStars: { flexDirection: "row", alignItems: "center" },
  reviewComment: { fontSize: 13, color: "#374151" },

  continueBtn: {
    width: "100%",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  continueBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  enrollBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  priceLabel: { fontSize: 12, color: "#6B7280" },
  priceValue: { fontSize: 22, color: "#059669", fontWeight: "700" },
  enrollBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  enrollBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
