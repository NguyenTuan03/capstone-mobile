import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
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

  const meetUrl = useMemo(
    () => MEET_LINKS[String(id)] ?? MEET_LINKS["1"],
    [id]
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

  ghostBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  ghostBtnText: { color: "#111827", fontWeight: "600" },
});
