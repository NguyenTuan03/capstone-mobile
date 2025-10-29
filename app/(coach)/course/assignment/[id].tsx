import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AssignmentDetailScreen() {
  const assignmentData = {
    id: 1,
    title: "Bài tập 1: Serve cơ bản",
    description: "Thực hiện 10 cú serve và quay video",
    deadline: "2025-11-01",
    submissions: 3,
    hasVideoTemplate: true,
  };

  const submissions = [
    {
      id: 1,
      studentName: "Nguyễn Văn A",
      studentAvatar: "NVA",
      submittedAt: "2025-10-25 14:30",
      status: "pending",
      aiNote: "Tư thế tốt nhưng cần cải thiện follow-through",
      hasVideo: true,
    },
    {
      id: 2,
      studentName: "Trần Văn B",
      studentAvatar: "TVB",
      submittedAt: "2025-10-26 09:15",
      status: "graded",
      aiNote: "Kỹ thuật cơ bản đúng, tốc độ còn chậm",
      hasVideo: true,
    },
    {
      id: 3,
      studentName: "Lê Thị C",
      studentAvatar: "LTC",
      submittedAt: "2025-10-26 16:45",
      status: "pending",
      aiNote: "Footwork cần cải thiện, tư thế cầm vợt tốt",
      hasVideo: true,
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Quay lại</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="#111827" />
      </TouchableOpacity>
    </View>
  );

  const renderAssignmentInfo = () => (
    <View style={styles.assignmentCard}>
      <View style={styles.assignmentIcon}>
        <Ionicons name="clipboard" size={32} color="#8B5CF6" />
      </View>
      <View style={styles.assignmentInfo}>
        <Text style={styles.assignmentTitle}>{assignmentData.title}</Text>
        <Text style={styles.assignmentDescription}>
          {assignmentData.description}
        </Text>

        <View style={styles.assignmentMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
            <Text style={styles.metaText}>Hạn: {assignmentData.deadline}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="document-text" size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              {assignmentData.submissions} bài nộp
            </Text>
          </View>
          {assignmentData.hasVideoTemplate && (
            <View style={[styles.metaItem, styles.videoTag]}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={[styles.metaText, { color: "#10B981" }]}>
                Có video mẫu
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderSubmissionCard = (submission: any) => (
    <View key={submission.id} style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>
              {submission.studentAvatar}
            </Text>
          </View>
          <View>
            <Text style={styles.studentName}>{submission.studentName}</Text>
            <View style={styles.submissionTime}>
              <Ionicons name="time" size={14} color="#6B7280" />
              <Text style={styles.submissionTimeText}>
                Nộp lúc: {submission.submittedAt}
              </Text>
            </View>
          </View>
        </View>

        {submission.status === "graded" ? (
          <View style={styles.gradedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.gradedText}>Đã chấm</Text>
          </View>
        ) : (
          <View style={styles.pendingBadge}>
            <Ionicons name="time" size={16} color="#F59E0B" />
            <Text style={styles.pendingText}>Chờ chấm</Text>
          </View>
        )}
      </View>

      <View style={styles.aiNoteContainer}>
        <Ionicons name="bulb" size={16} color="#3B82F6" />
        <Text style={styles.aiNoteLabel}>AI:</Text>
        <Text style={styles.aiNoteText}>{submission.aiNote}</Text>
      </View>

      <View style={styles.submissionActions}>
        {submission.status === "pending" && (
          <TouchableOpacity style={styles.markButton}>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text style={styles.markButtonText}>Chấm điểm</Text>
          </TouchableOpacity>
        )}
        {submission.status === "graded" && (
          <TouchableOpacity style={styles.viewResultButton}>
            <Ionicons name="bar-chart" size={18} color="#10B981" />
            <Text style={styles.viewResultButtonText}>Xem Kết Quả</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() =>
            router.push(
              `/(coach)/course/assignment/ai-analysis?submissionId=${submission.id}&studentName=${encodeURIComponent(
                submission.studentName,
              )}` as any,
            )
          }
        >
          <Ionicons name="chatbox-ellipses" size={18} color="#FFFFFF" />
          <Text style={styles.feedbackButtonText}>Nhận Feedback từ AI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Ionicons name="clipboard" size={24} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Quản lý Bài tập</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Quản lý và theo dõi các bài tập trong khóa học
        </Text>

        {renderAssignmentInfo()}

        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.videoButton}>
              <Ionicons name="eye" size={20} color="#10B981" />
              <Text style={styles.videoButtonText}>Xem Video Mẫu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submissionsButton}>
              <Ionicons name="folder" size={20} color="#8B5CF6" />
              <Text style={styles.submissionsButtonText}>Xem Bài Nộp (3)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.submissionsSection}>
          <Text style={styles.submissionsTitle}>Danh sách bài nộp</Text>
          {submissions.map((submission) => renderSubmissionCard(submission))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 50 : 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  assignmentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  assignmentDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  assignmentMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  videoTag: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  videoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1.5,
    borderColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  videoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  submissionsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E8FF",
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  submissionsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  submissionsSection: {
    paddingHorizontal: 16,
  },
  submissionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  submissionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  submissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentAvatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  studentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  submissionTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  submissionTimeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  gradedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  gradedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F59E0B",
  },
  aiNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  aiNoteLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },
  aiNoteText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  submissionActions: {
    flexDirection: "row",
    gap: 8,
  },
  markButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F59E0B",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  markButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  viewResultButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1.5,
    borderColor: "#10B981",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  viewResultButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10B981",
  },
  feedbackButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  feedbackButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
