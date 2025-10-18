import { StyleSheet, Text, View } from "react-native";

export default function CoachNotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <Text style={styles.meta}>Quản lý thông báo và cài đặt.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff", gap: 8 },
  title: { fontWeight: "700", color: "#111827" },
  meta: { color: "#6B7280" },
});
