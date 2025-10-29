import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function Row({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>
          <Ionicons name={icon} size={18} color="#059669" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>

      <View style={styles.card}>
        <Row
          label="Hồ sơ"
          icon="person"
          onPress={() => router.push("/(coach)/menu/profile" as any)}
        />
        <Row
          label="Thông báo"
          icon="notifications"
          onPress={() => router.push("/(coach)/menu/notifications" as any)}
        />
        <Row
          label="Tích hợp"
          icon="link"
          onPress={() => router.push("/(coach)/menu/integrations" as any)}
        />
        <Row
          label="Thanh toán/Payouts"
          icon="card"
          onPress={() => router.push("/(coach)/menu/payouts" as any)}
        />
        <Row
          label="Khối buổi học"
          icon="albums"
          onPress={() => router.push("/(coach)/menu/session-blocks" as any)}
        />
        <Row
          label="Phân tích"
          icon="stats-chart"
          onPress={() => router.push("/(coach)/menu/analytics" as any)}
        />
        <Row
          label="Giảng dạy"
          icon="construct"
          onPress={() => router.push("/(coach)/menu/teaching" as any)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  title: { fontWeight: "700", color: "#111827" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rowLabel: { color: "#111827", fontWeight: "600" },
});
