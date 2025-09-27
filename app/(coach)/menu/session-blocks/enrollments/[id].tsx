import { MOCK_ENROLLMENTS, MOCK_SESSION_BLOCKS } from "@/mocks/sessionBlocks";
import { StudentEnrollment } from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionBlockEnrollmentsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed" | "paused" | "cancelled"
  >("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Find the session block
  const sessionBlock = useMemo(() => {
    return MOCK_SESSION_BLOCKS.find((block) => block.id === id);
  }, [id]);

  if (!sessionBlock) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Session block not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get enrollments for this session block
  const enrollments = MOCK_ENROLLMENTS.filter((e) => e.sessionBlockId === id);

  // Filter enrollments
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const matchesSearch =
        !searchQuery ||
        enrollment.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || enrollment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrollments, searchQuery, statusFilter]);

  const totalRevenue = enrollments.reduce((sum, e) => sum + e.totalPaid, 0);
  const activeStudents = enrollments.filter(
    (e) => e.status === "active",
  ).length;

  const getStatusColor = (status: StudentEnrollment["status"]) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "completed":
        return "#3b82f6";
      case "paused":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const getPaymentStatusColor = (
    status: StudentEnrollment["paymentStatus"],
  ) => {
    switch (status) {
      case "paid":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "refunded":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const handleAddStudent = () => {
    // TODO: Implement student addition logic
    Alert.alert("Add Student", "Student addition functionality coming soon!");
  };

  const handleUpdateStatus = (
    enrollmentId: string,
    newStatus: StudentEnrollment["status"],
  ) => {
    Alert.alert("Update Status", `Change enrollment status to ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: () => {
          // TODO: Implement status update logic
          Alert.alert("Success", "Enrollment status updated!");
        },
      },
    ]);
  };

  const renderEnrollmentCard = ({
    item: enrollment,
  }: {
    item: StudentEnrollment;
  }) => (
    <View style={styles.enrollmentCard}>
      <View style={styles.enrollmentHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.studentAvatar}>
            <Ionicons name="person-outline" size={24} color="#64748b" />
          </View>
          <View>
            <Text style={styles.studentName}>
              Student {enrollment.studentId}
            </Text>
            <Text style={styles.enrollmentDate}>
              Started {new Date(enrollment.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.enrollmentStatus}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(enrollment.status) },
            ]}
          >
            <Text style={styles.statusText}>{enrollment.status}</Text>
          </View>
          <View
            style={[
              styles.paymentBadge,
              {
                backgroundColor: getPaymentStatusColor(
                  enrollment.paymentStatus,
                ),
              },
            ]}
          >
            <Text style={styles.statusText}>{enrollment.paymentStatus}</Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressText}>
            {enrollment.currentSession}/{sessionBlock.totalSessions} sessions (
            {Math.round(enrollment.progress * 100)}%)
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${enrollment.progress * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Revenue */}
      <View style={styles.revenueSection}>
        <View style={styles.revenueItem}>
          <Text style={styles.revenueLabel}>Amount Paid</Text>
          <Text style={styles.revenueValue}>${enrollment.totalPaid}</Text>
        </View>
        <View style={styles.revenueItem}>
          <Text style={styles.revenueLabel}>Program Price</Text>
          <Text style={styles.revenueValue}>${sessionBlock.price}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // TODO: Navigate to student progress detail
            Alert.alert(
              "Student Progress",
              "Detailed progress view coming soon!",
            );
          }}
        >
          <Ionicons name="analytics-outline" size={16} color="#64748b" />
          <Text style={styles.actionButtonText}>View Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            const statusOptions: StudentEnrollment["status"][] = [
              "active",
              "paused",
              "completed",
              "cancelled",
            ];
            const currentStatusIndex = statusOptions.indexOf(enrollment.status);
            const nextStatus =
              statusOptions[(currentStatusIndex + 1) % statusOptions.length];
            handleUpdateStatus(enrollment.id, nextStatus);
          }}
        >
          <Ionicons name="sync-outline" size={16} color="#64748b" />
          <Text style={styles.actionButtonText}>Update Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // TODO: Send message to student
            Alert.alert(
              "Message Student",
              "Messaging functionality coming soon!",
            );
          }}
        >
          <Ionicons name="mail-outline" size={16} color="#64748b" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Enrollments</Text>
          <Text style={styles.headerSubtitle}>{sessionBlock.title}</Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{enrollments.length}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeStudents}</Text>
          <Text style={styles.statLabel}>Active Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${totalRevenue}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#64748b" />
            <TextInput
              placeholder="Search students..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChips}>
            {[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
              { id: "paused", label: "Paused" },
              { id: "cancelled", label: "Cancelled" },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  statusFilter === filter.id && styles.filterChipActive,
                ]}
                onPress={() => setStatusFilter(filter.id as any)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    statusFilter === filter.id && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Add Student Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Student</Text>
        </TouchableOpacity>
      </View>

      {/* Enrollments List */}
      <FlatList
        data={filteredEnrollments}
        renderItem={renderEnrollmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No enrollments found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Start by adding students to this program"}
            </Text>
            {!searchQuery && statusFilter === "all" && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleAddStudent}
              >
                <Text style={styles.emptyButtonText}>Add Student</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 4,
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  // Filters
  filtersContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1e293b",
  },
  filterChips: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterChipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  filterChipTextActive: {
    color: "#fff",
  },

  // Add Button
  addButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // List
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  separator: {
    height: 16,
  },

  // Enrollment Card
  enrollmentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  enrollmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  enrollmentDate: {
    fontSize: 12,
    color: "#64748b",
  },
  enrollmentStatus: {
    flexDirection: "column",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },

  // Progress
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },

  // Revenue
  revenueSection: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
  },
  revenueItem: {
    flex: 1,
    alignItems: "center",
  },
  revenueLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },

  // Actions
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ef4444",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
