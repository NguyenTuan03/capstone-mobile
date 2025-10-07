import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Chào mừng trở lại, Hưng!</Text>
        <Text style={styles.welcomeSubtitle}>
          Sẵn sàng cải thiện kỹ năng hôm nay?
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Bài học đã hoàn thành</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Bài tập đã hoàn thành</Text>
          </View>
        </View>
      </View>

      {/* Continue Learning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tiếp tục học</Text>
        <View style={styles.card}>
          <View style={styles.lessonRow}>
            <View style={styles.lessonThumb}>
              <Ionicons name="play" size={32} color="#fff" />
            </View>
            <View style={styles.lessonContent}>
              <Text style={styles.lessonMeta}>Bài 5</Text>
              <Text style={styles.lessonTitle}>Kỹ thuật đánh trái</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>45%</Text>
              </View>
              <Pressable>
                <Text style={styles.linkButton}>Tiếp tục</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Practice Drills */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Luyện tập</Text>
          <Pressable>
            <Text style={styles.linkButton}>Xem tất cả</Text>
          </Pressable>
        </View>
        <View style={styles.grid}>
          {[1, 2].map((idx) => (
            <View key={idx} style={styles.drillCard}>
              <View style={styles.drillThumb}>
                <Ionicons name="golf" size={32} color="#fff" />
              </View>
              <Text style={styles.drillTitle}>Bài tập mẫu {idx}</Text>
              <View style={styles.drillMetaRow}>
                <Text style={styles.drillMeta}>10 min</Text>
                <Text style={styles.drillScore}>80/100</Text>
              </View>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Bắt đầu</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lịch buổi học sắp tới</Text>
        {[1, 2].map((idx) => (
          <View key={idx} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View>
                <Text style={styles.sessionTitle}>Huấn luyện đánh trái</Text>
                <Text style={styles.sessionCoach}>HLV Taylor</Text>
              </View>
              <View style={[styles.sessionBadge, styles.sessionBadgeOnline]}>
                <Text style={styles.sessionBadgeText}>Trực tuyến</Text>
              </View>
            </View>
            <View style={styles.sessionMetaRow}>
              <View style={styles.sessionMetaItem}>
                <Ionicons name="calendar" size={16} color="#4B5563" />
                <Text style={styles.sessionMetaText}>Oct 5</Text>
              </View>
              <View style={styles.sessionMetaItem}>
                <Ionicons name="time" size={16} color="#4B5563" />
                <Text style={styles.sessionMetaText}>10:00</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
    gap: 24,
  },
  welcomeCard: {
    backgroundColor: "#10B981", // emerald-500
    borderRadius: 16,
    padding: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: "#F0FDFA",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
  },
  statNumber: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    color: "#E5E7EB",
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  lessonRow: {
    flexDirection: "row",
    gap: 12,
  },
  lessonThumb: {
    width: 96,
    height: 96,
    backgroundColor: "#34D399",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  lessonContent: {
    flex: 1,
  },
  lessonMeta: {
    color: "#6B7280",
    marginBottom: 4,
  },
  lessonTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    width: "45%",
    backgroundColor: "#10B981",
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    color: "#4B5563",
  },
  linkButton: {
    color: "#059669",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  drillCard: {
    flexBasis: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  drillThumb: {
    width: "100%",
    height: 96,
    backgroundColor: "#A78BFA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  drillTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    color: "#111827",
  },
  drillMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  drillMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  drillScore: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sessionTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  sessionCoach: {
    color: "#6B7280",
    fontSize: 12,
  },
  sessionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sessionBadgeOnline: {
    backgroundColor: "#DBEAFE",
  },
  sessionBadgeText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "600",
  },
  sessionMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  sessionMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionMetaText: {
    color: "#4B5563",
    fontSize: 12,
  },
});
