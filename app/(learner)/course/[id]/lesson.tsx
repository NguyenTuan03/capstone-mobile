import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MEET_LINKS: Record<string, string> = {
  "1": "https://meet.google.com/abc-defg-hij",
  "2": "https://meet.google.com/xyz-abcd-efg",
  "3": "https://meet.google.com/qwe-rtyu-iop",
};

export default function LessonScreen() {
  const router = useRouter();
  const { id, lessonId } = useLocalSearchParams<{
    id: string;
    lessonId: string;
  }>();
  const [feedback, setFeedback] = useState("");

  const meetUrl = useMemo(
    () => MEET_LINKS[String(id)] ?? MEET_LINKS["1"],
    [id],
  );

  const openMeet = async () => {
    try {
      await Linking.openURL(meetUrl);
    } catch (e) {
      console.warn("Failed to open link", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backRow}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={styles.backText}>Quay lại khoá học</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Bài học {lessonId}</Text>
        <Text style={styles.subtitle}>Tham gia buổi học trực tuyến</Text>

        <TouchableOpacity
          onPress={openMeet}
          style={styles.meetBtn}
          activeOpacity={0.9}
        >
          <Feather name="video" size={18} color="#fff" />
          <Text style={styles.meetBtnText}>Vào lớp Google Meet</Text>
        </TouchableOpacity>

        <Text style={styles.linkText} numberOfLines={1}>
          {meetUrl}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Phản hồi của bạn</Text>
        <TextInput
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Hãy viết những gì bạn học được, câu hỏi hoặc ghi chú..."
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() => console.log("submit feedback", feedback)}
          style={styles.primaryBtn}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryBtnText}>Gửi phản hồi</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(learner)/drill" as any)}
        style={styles.ghostBtn}
        activeOpacity={0.85}
      >
        <Text style={styles.ghostBtnText}>Xem bài tập của tôi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  headerRow: { paddingBottom: 4 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  subtitle: { color: "#6B7280", marginBottom: 12, marginTop: 2 },

  meetBtn: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  meetBtnText: { color: "#fff", fontWeight: "700" },
  linkText: { color: "#065F46", marginTop: 8 },

  sectionTitle: { fontWeight: "700", color: "#111827", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    color: "#111827",
  },

  primaryBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  ghostBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  ghostBtnText: { color: "#111827", fontWeight: "600" },
});
