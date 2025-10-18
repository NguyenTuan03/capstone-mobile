import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CoachCalendarScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch dạy</Text>
      <TouchableOpacity
        style={styles.primary}
        activeOpacity={0.9}
        onPress={() => router.push("/(coach)/calendar/create-session" as any)}
      >
        <Text style={styles.primaryText}>Tạo buổi học</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 12 },
  title: { fontWeight: "700", color: "#111827" },
  primary: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
});
