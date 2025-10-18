import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CoachDrillScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập (Drills)</Text>
      <View style={{ gap: 8 }}>
        <TouchableOpacity
          style={styles.primary}
          activeOpacity={0.9}
          onPress={() => router.push("/(coach)/drill/new" as any)}
        >
          <Text style={styles.primaryText}>Tạo bài tập mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ghost}
          activeOpacity={0.9}
          onPress={() => router.push("/(coach)/drill/assign" as any)}
        >
          <Text style={styles.ghostText}>Giao bài tập</Text>
        </TouchableOpacity>
      </View>
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
  ghost: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  ghostText: { color: "#111827", fontWeight: "600" },
});
