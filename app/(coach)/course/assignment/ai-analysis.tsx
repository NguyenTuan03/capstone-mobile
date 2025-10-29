import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");
const VIDEO_HEIGHT = height * 0.5;

export default function AIAnalysisScreen() {
  const params = useLocalSearchParams();
  const { studentName = "Nguyễn Văn A" } = params;

  const analysisData = {
    student: {
      name: studentName,
      videoUrl: "student_video.mp4",
      thumbnail: "🎾",
      label: "Video Học viên",
    },
    coach: {
      name: "Huấn Luyện Viên",
      videoUrl: "coach_video.mp4",
      thumbnail: "👨‍🏫",
      label: "Video Mẫu",
    },
    aiAnalysis: {
      score: 85,
      strengths: [
        "Tư thế cầm vợt đúng kỹ thuật",
        "Footwork khá tốt",
        "Timing ổn định",
      ],
      improvements: [
        "Cần cải thiện follow-through",
        "Tăng tốc độ swing",
        "Chú ý vị trí đứng",
      ],
    },
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Ionicons name="analytics" size={20} color="#FFFFFF" />
        <Text style={styles.headerTitle}>AI Coach Analysis</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderSplitVideoView = () => (
    <View style={styles.splitVideoContainer}>
      {/* Student Video - Left Side */}
      <View style={styles.videoHalf}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoEmoji}>🎾</Text>
          <View style={styles.playButtonSmall}>
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </View>
        </View>

        {/* Student Label */}
        <View style={[styles.videoLabel, styles.studentLabel]}>
          <Ionicons name="person" size={14} color="#FFFFFF" />
          <Text style={styles.videoLabelTextSmall}>Video Học viên</Text>
        </View>

        {/* Student Name */}
        <View style={styles.nameBadgeSmall}>
          <Text style={styles.nameTextSmall}>{analysisData.student.name}</Text>
        </View>
      </View>

      {/* Divider Line */}
      <View style={styles.videoDivider} />

      {/* Coach Video - Right Side */}
      <View style={styles.videoHalf}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoEmoji}>👨‍🏫</Text>
          <View style={styles.playButtonSmall}>
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </View>
        </View>

        {/* Coach Label */}
        <View style={[styles.videoLabel, styles.coachLabel]}>
          <Ionicons name="school" size={14} color="#FFFFFF" />
          <Text style={styles.videoLabelTextSmall}>Video Mẫu</Text>
        </View>

        {/* Coach Name */}
        <View style={styles.nameBadgeSmall}>
          <Text style={styles.nameTextSmall}>HLV</Text>
        </View>
      </View>
    </View>
  );

  const renderComparisonView = () => (
    <View style={styles.comparisonContainer}>
      <Text style={styles.comparisonTitle}>So sánh kỹ thuật</Text>

      {/* Single Container with Split View */}
      <View style={styles.videoComparisonWrapper}>
        {renderSplitVideoView()}

        {/* Video Controls at Bottom */}
        <View style={styles.videoControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.videoProgressBar}>
          <View style={[styles.progressFill, { width: "30%" }]} />
          <View style={styles.progressHandle} />
        </View>

        <Text style={styles.videoTimeText}>0:00 / 0:03</Text>
      </View>

      {/* Swap Button */}
      <TouchableOpacity style={styles.swapButton}>
        <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
        <Text style={styles.swapButtonText}>Hoán đổi video</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAIAnalysis = () => (
    <View style={styles.analysisSection}>
      <View style={styles.analysisHeader}>
        <View style={styles.aiIcon}>
          <Ionicons name="sparkles" size={24} color="#8B5CF6" />
        </View>
        <Text style={styles.analysisTitle}>Phân tích AI</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{analysisData.aiAnalysis.score}</Text>
          <Text style={styles.scoreLabel}>/100</Text>
        </View>
      </View>

      {/* Strengths */}
      <View style={styles.analysisBlock}>
        <View style={styles.blockHeader}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.blockTitle}>Điểm mạnh</Text>
        </View>
        {analysisData.aiAnalysis.strengths.map((item, index) => (
          <View key={index} style={styles.analysisItem}>
            <View style={styles.bulletGreen} />
            <Text style={styles.analysisText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Improvements */}
      <View style={styles.analysisBlock}>
        <View style={styles.blockHeader}>
          <Ionicons name="trending-up" size={20} color="#F59E0B" />
          <Text style={styles.blockTitle}>Cần cải thiện</Text>
        </View>
        {analysisData.aiAnalysis.improvements.map((item, index) => (
          <View key={index} style={styles.analysisItem}>
            <View style={styles.bulletOrange} />
            <Text style={styles.analysisText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.analyzeButton}>
        <Ionicons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.analyzeButtonText}>Phân tích với AI Coach</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="download" size={20} color="#8B5CF6" />
        <Text style={styles.downloadButtonText}>Tải báo cáo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfo}>
          <Text style={styles.subtitle}>
            Phân tích kỹ thuật cho {studentName}
          </Text>
        </View>

        {renderComparisonView()}
        {renderAIAnalysis()}
        {renderActionButtons()}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 50 : 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139, 92, 246, 0.3)",
  },
  subtitle: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
  },
  comparisonContainer: {
    padding: 16,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  videoComparisonWrapper: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  splitVideoContainer: {
    flexDirection: "row",
    height: VIDEO_HEIGHT,
  },
  videoHalf: {
    flex: 1,
    position: "relative",
  },
  videoDivider: {
    width: 2,
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  videoEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  playButtonSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(139, 92, 246, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  studentLabel: {
    backgroundColor: "rgba(59, 130, 246, 0.9)",
  },
  coachLabel: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
  },
  videoLabelTextSmall: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  nameBadgeSmall: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  nameTextSmall: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  videoControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 16,
    gap: 24,
  },
  controlButton: {
    padding: 8,
  },
  videoProgressBar: {
    position: "relative",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 16,
    marginTop: 8,
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#8B5CF6",
  },
  progressHandle: {
    position: "absolute",
    left: "30%",
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -6 }],
  },
  videoTimeText: {
    fontSize: 11,
    color: "#D1D5DB",
    textAlign: "center",
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  swapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderWidth: 1,
    borderColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  swapButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A78BFA",
  },
  analysisSection: {
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#6EE7B7",
    marginLeft: 2,
  },
  analysisBlock: {
    marginBottom: 20,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  analysisItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingLeft: 8,
  },
  bulletGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginTop: 6,
    marginRight: 10,
  },
  bulletOrange: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F59E0B",
    marginTop: 6,
    marginRight: 10,
  },
  analysisText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  actionButtons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#A78BFA",
  },
});
