import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function CoachStudentsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Học viên</Text>
      <Text style={styles.meta}>Danh sách học viên sẽ hiển thị ở đây.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 12 },
  title: { fontWeight: "700", color: "#111827" },
  meta: { color: "#6B7280" },
});
