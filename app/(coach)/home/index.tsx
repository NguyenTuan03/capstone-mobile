import { StyleSheet, Text, View } from "react-native";

export default function CoachHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang chủ HLV</Text>
      <Text style={styles.meta}>Tổng quan lịch, học viên, thu nhập...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontWeight: "700", color: "#111827", marginBottom: 8 },
  meta: { color: "#6B7280" },
});
