import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = Record<string, never>;
type Achievement = {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
};
const achievements: Achievement[] = [
  { id: "a1", title: "First Drill", icon: "🎯", unlocked: true },
  { id: "a2", title: "Week Streak", icon: "🔥", unlocked: true },
  { id: "a3", title: "Perfect Form", icon: "✨", unlocked: false },
  { id: "a4", title: "AI Master", icon: "🤖", unlocked: false },
];

const Profile: React.FC<Props> = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header card */}
      <View style={styles.headerCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>LH</Text>
        </View>
        <Text style={styles.name}>Lâm Tiến Hưng</Text>
        <Text style={styles.role}>Người chơi trung cấp</Text>
      </View>

      {/* Progress stats */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="stats-chart" size={20} color="#059669" />
          <Text style={styles.cardTitle}>Thống kê tiến độ</Text>
        </View>
        <View style={styles.gridTwo}>
          <View style={[styles.statCell, { backgroundColor: "#EFF6FF" }]}>
            <Text style={[styles.statNumber, { color: "#2563EB" }]}>24</Text>
            <Text style={styles.statLabel}>Bài học đã hoàn thành</Text>
          </View>
          <View style={[styles.statCell, { backgroundColor: "#F5F3FF" }]}>
            <Text style={[styles.statNumber, { color: "#7C3AED" }]}>15</Text>
            <Text style={styles.statLabel}>Bài tập đã hoàn thành</Text>
          </View>
          <View style={[styles.statCell, { backgroundColor: "#FFF7ED" }]}>
            <Text style={[styles.statNumber, { color: "#EA580C" }]}>6</Text>
            <Text style={styles.statLabel}>Buổi huấn luyện</Text>
          </View>
          <View style={[styles.statCell, { backgroundColor: "#ECFDF5" }]}>
            <Text style={[styles.statNumber, { color: "#059669" }]}>7</Text>
            <Text style={styles.statLabel}>Chuỗi ngày học</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
          <Text style={styles.cardTitle}>Thành tựu</Text>
        </View>
        <View style={styles.gridFour}>
          {achievements.map((a) => (
            <View
              key={a.id}
              style={[
                styles.achvCell,
                a.unlocked ? styles.achvUnlocked : styles.achvLocked,
              ]}
            >
              <Text style={styles.achvIcon}>{a.icon}</Text>
              <Text style={styles.achvTitle}>{a.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionList}>
        <View style={styles.actionItem}>
          <Ionicons name="person" size={20} color="#374151" />
          <Text style={styles.actionText}>Chỉnh sửa hồ sơ</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="calendar" size={20} color="#374151" />
          <Text style={styles.actionText}>Lịch đã đặt</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="videocam" size={20} color="#374151" />
          <Text style={styles.actionText}>Lịch sử buổi học</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="settings" size={20} color="#374151" />
          <Text style={styles.actionText}>Cài đặt</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
    gap: 16,
  },
  headerCard: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#059669",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  role: {
    color: "#ECFDF5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  gridTwo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCell: {
    flexBasis: "48%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  gridFour: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achvCell: {
    flexBasis: "23%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  achvUnlocked: {
    backgroundColor: "#FEF3C7",
  },
  achvLocked: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
  achvIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  achvTitle: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: "#111827",
  },
  actionList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  actionText: {
    flex: 1,
    fontWeight: "600",
    color: "#111827",
  },
});
