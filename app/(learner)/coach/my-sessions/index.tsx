import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EnrollmentStatus = "active" | "completed" | "paused" | "cancelled";

export default function MySessions() {
  const { sessionBlockEnrollments } = useBookings();
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "all">(
    "all",
  );
  const insets = useSafeAreaInsets();

  const filteredBlocks = useMemo(() => {
    // First, find the active enrollment (if any)
    const activeBlock = sessionBlockEnrollments.find(
      (b) => b.status === "active",
    );

    if (activeBlock) {
      // If there's an active block, only show that one
      if (statusFilter === "all" || statusFilter === "active") {
        return [activeBlock];
      } else {
        return []; // Don't show other statuses if there's an active enrollment
      }
    } else {
      // If no active block, show only the most recent one (based on start date)
      const sortedBlocks = [...sessionBlockEnrollments].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

      const mostRecentBlock = sortedBlocks[0];
      if (!mostRecentBlock) return [];

      // Apply status filter to the most recent block
      if (statusFilter === "all" || statusFilter === mostRecentBlock.status) {
        return [mostRecentBlock];
      } else {
        return [];
      }
    }
  }, [sessionBlockEnrollments, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      case "paused":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "paused":
        return "Tạm dừng";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 60,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#475569" />
          </TouchableOpacity>
          <Text style={styles.title}>Buổi Học Của Tôi</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.sessionCount}>
            {filteredBlocks.length} khóa học
          </Text>
          <View style={styles.statusIndicators}>
            {filteredBlocks.length > 0 && (
              <>
                <View style={styles.statusDot}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: getStatusColor(
                          filteredBlocks[0].status,
                        ),
                      },
                    ]}
                  />
                  <Text style={styles.statusTextSmall}>
                    {getStatusText(filteredBlocks[0].status)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {(["all", "active", "completed", "paused", "cancelled"] as const).map(
          (status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status)}
              style={[
                styles.filterChip,
                statusFilter === status && styles.filterChipActive,
              ]}
            >
              <View
                style={[
                  styles.filterChipInner,
                  statusFilter === status && styles.filterChipInnerActive,
                ]}
              >
                {statusFilter === status && (
                  <View style={styles.filterIndicator} />
                )}
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === status && styles.filterTextActive,
                  ]}
                >
                  {status === "all"
                    ? "Tất cả trạng thái"
                    : getStatusText(status)}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>

      {/* Session Blocks List */}
      {filteredBlocks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>khóa học Đào Tạo</Text>
          <FlatList
            data={filteredBlocks}
            keyExtractor={(item) => `block-${item.id}`}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/(learner)/coach/my-sessions/ListSession?blockId=${item.id}` as any,
                  )
                }
                style={styles.sessionBlockCard}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.coachInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.coachName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.coachDetails}>
                      <Text style={styles.coachName}>{item.coachName}</Text>
                      <Text style={styles.sessionType}>
                        khóa học đào tạo •{" "}
                        {item.mode === "online" ? "Trực tuyến" : "Trực tiếp"}
                      </Text>
                      <Text style={styles.blockTitle}>{item.blockTitle}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.sessionDetails}>
                  <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="fitness-outline"
                          size={16}
                          color="#64748b"
                        />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Tiến độ</Text>
                        <Text style={styles.detailValue}>
                          {item.completedSessions.length}/{item.totalSessions}{" "}
                          buổi học
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#64748b"
                        />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Bắt đầu</Text>
                        <Text style={styles.detailValue}>
                          {new Date(item.startDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#64748b"
                        />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Buổi hiện tại</Text>
                        <Text style={styles.detailValue}>
                          Buổi {item.currentSession}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name="cash-outline"
                          size={16}
                          color="#64748b"
                        />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Tổng chi phí</Text>
                        <Text style={styles.detailValue}>
                          ₫{(item.totalAmount * 25000).toLocaleString("vi-VN")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${item.progress * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(item.progress * 100)}% Hoàn thành
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetailsText}>
                    Xem chi tiết khóa học
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Empty State */}
      {filteredBlocks.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
          </View>
          <Text style={styles.emptyTitle}>Không tìm thấy khóa học nào</Text>
          <Text style={styles.emptySubtitle}>
            Đăng ký khóa học đào tạo đầu tiên với huấn luyện viên
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push("/(learner)/coach")}
          >
            <Text style={styles.bookButtonText}>Xem huấn luyện viên</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionCount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#334155",
  },
  statusIndicators: {
    flexDirection: "row",
    gap: 16,
  },
  statusDot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusTextSmall: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    borderRadius: 24,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 48,
  },
  filterChipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterChipInner: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 20,
  },
  filterChipInnerActive: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 20,
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  separator: {
    height: 16,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  coachInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#f0f9ff",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  coachDetails: {
    gap: 4,
  },
  coachName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  sessionType: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  sessionDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  viewDetailsText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0ea5e9",
  },
  feedbackButton: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#f0f9ff",
    borderWidth: 2,
    borderColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  sessionBlockCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0ea5e9",
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0ea5e9",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "700",
    marginTop: 6,
    textAlign: "right",
  },
});
