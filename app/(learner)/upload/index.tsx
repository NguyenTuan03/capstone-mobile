import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type AnalysisResult = {
  overallScore: number;
  techniques: {
    name: string;
    score: number;
    feedback: string;
  }[];
  posture: {
    score: number;
    issues: string[];
  };
  improvements: string[];
  strengths: string[];
};

type HistoryItem = {
  id: string;
  date: string;
  score: number;
  feedback: string;
  videoUri?: string;
};

export default function UploadScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<
    "camera" | "upload" | "history"
  >("camera");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Mock analysis data
  const mockAnalysisResults: AnalysisResult = {
    overallScore: 78,
    techniques: [
      {
        name: "Forehand",
        score: 85,
        feedback: "Good form, slight adjustment needed on follow-through",
      },
      {
        name: "Backhand",
        score: 72,
        feedback: "Work on paddle angle and body rotation",
      },
      {
        name: "Serve",
        score: 80,
        feedback: "Consistent motion, focus on ball placement",
      },
    ],
    posture: {
      score: 75,
      issues: [
        "Bend knees more",
        "Keep paddle ready position",
        "Maintain balance",
      ],
    },
    improvements: [
      "Practice shadow swings for muscle memory",
      "Focus on weight transfer during shots",
      "Work on court positioning",
    ],
    strengths: [
      "Consistent paddle grip",
      "Good eye on ball",
      "Smooth swing motion",
    ],
  };

  // Mock history data
  useEffect(() => {
    setHistory([
      {
        id: "1",
        date: "2 days ago",
        score: 85,
        feedback: "Excellent forehand technique",
      },
      {
        id: "2",
        date: "5 days ago",
        score: 78,
        feedback: "Focus on backhand improvement",
      },
      {
        id: "3",
        date: "1 week ago",
        score: 72,
        feedback: "Good progress on serves",
      },
    ]);
  }, []);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to record videos",
      );
      return false;
    }
    return true;
  };

  const handleStartRecording = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedVideo(result.assets[0].uri);
        setIsAnalyzing(true);

        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisResult(mockAnalysisResults);
        }, 3000);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to record video");
    }
  };

  const handleVideoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedVideo(result.assets[0].uri);
        setIsAnalyzing(true);

        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisResult(mockAnalysisResults);
        }, 2000);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select video");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f97316";
    return "#ef4444";
  };

  const ScoreCircle = ({
    score,
    size = "lg",
  }: {
    score: number;
    size?: "sm" | "lg";
  }) => (
    <View
      style={[
        styles.scoreCircle,
        size === "sm" ? styles.scoreCircleSmall : styles.scoreCircleLarge,
      ]}
    >
      <Text
        style={[
          styles.scoreText,
          { color: getScoreColor(score) },
          size === "sm" && styles.scoreTextSmall,
        ]}
      >
        {score}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={["#16a34a", "#2563eb"]}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerIcon}>
          <Ionicons name="flash" size={24} color="#ffffff" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>AI Technique Analyst</Text>
          <Text style={styles.headerSubtitle}>
            Improve your pickleball skills
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === "camera" && styles.tabActive]}
        onPress={() => setSelectedTab("camera")}
      >
        <Ionicons
          name="videocam"
          size={20}
          color={selectedTab === "camera" ? "#16a34a" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === "camera" && styles.tabTextActive,
          ]}
        >
          Record
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selectedTab === "upload" && styles.tabActive]}
        onPress={() => setSelectedTab("upload")}
      >
        <Ionicons
          name="cloud-upload"
          size={20}
          color={selectedTab === "upload" ? "#16a34a" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === "upload" && styles.tabTextActive,
          ]}
        >
          Upload
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selectedTab === "history" && styles.tabActive]}
        onPress={() => setSelectedTab("history")}
      >
        <Ionicons
          name="bar-chart"
          size={20}
          color={selectedTab === "history" ? "#16a34a" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === "history" && styles.tabTextActive,
          ]}
        >
          History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCameraTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.cameraContainer}>
        {uploadedVideo ? (
          <Video
            source={{ uri: uploadedVideo }}
            style={styles.videoPreview}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay={false}
          />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Ionicons
              name="videocam"
              size={64}
              color="rgba(255, 255, 255, 0.7)"
            />
            <Text style={styles.cameraPlaceholderText}>
              Position yourself in frame
            </Text>
            <Text style={styles.cameraPlaceholderSubtext}>
              Make sure your full body is visible
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.recordButton}
        onPress={handleStartRecording}
      >
        <LinearGradient
          colors={["#16a34a", "#2563eb"]}
          style={styles.recordButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="play" size={20} color="#ffffff" />
          <Text style={styles.recordButtonText}>Start Recording</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.tipsContainer}>
        <View style={styles.tipsHeader}>
          <Ionicons name="eye" size={16} color="#2563eb" />
          <Text style={styles.tipsTitle}>Recording Tips</Text>
        </View>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Stand 6-8 feet from camera</Text>
          <Text style={styles.tipItem}>• Ensure good lighting</Text>
          <Text style={styles.tipItem}>• Record 3-5 practice swings</Text>
          <Text style={styles.tipItem}>• Include your full body in frame</Text>
        </View>
      </View>
    </View>
  );

  const renderUploadTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.uploadContainer}
        onPress={handleVideoUpload}
      >
        <Ionicons name="videocam" size={64} color="#9ca3af" />
        <Text style={styles.uploadTitle}>Upload Practice Video</Text>
        <Text style={styles.uploadSubtitle}>MP4, MOV, AVI up to 100MB</Text>
        <View style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Choose Video</Text>
        </View>
      </TouchableOpacity>

      {uploadedVideo && (
        <View style={styles.uploadSuccess}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.uploadSuccessText}>
            Video uploaded successfully
          </Text>
        </View>
      )}
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.historyTitle}>Analysis History</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.historySessionText}>Session {item.id}</Text>
              <Text style={styles.historyDateText}>{item.date}</Text>
            </View>
            <View style={styles.historyContent}>
              <ScoreCircle score={item.score} size="sm" />
              <View style={styles.historyDetails}>
                <Text style={styles.historyFeedback}>{item.feedback}</Text>
                <Text style={styles.historyProgress}>Overall improvement</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <ScrollView
        style={styles.analysisContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Score */}
        <LinearGradient
          colors={["#16a34a", "#2563eb"]}
          style={styles.analysisHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.analysisHeaderContent}>
            <Text style={styles.analysisTitle}>Analysis Complete</Text>
            <ScoreCircle score={analysisResult.overallScore} />
          </View>
          <Text style={styles.analysisSubtitle}>
            Great progress! Here&apos;s your detailed breakdown.
          </Text>
        </LinearGradient>

        {/* Technique Analysis */}
        <View style={styles.analysisSection}>
          <View style={styles.analysisSectionHeader}>
            <Ionicons name="analytics" size={20} color="#16a34a" />
            <Text style={styles.analysisSectionTitle}>Technique Analysis</Text>
          </View>

          {analysisResult.techniques.map((technique, index) => (
            <View key={index} style={styles.techniqueCard}>
              <View style={styles.techniqueHeader}>
                <Text style={styles.techniqueName}>{technique.name}</Text>
                <ScoreCircle score={technique.score} size="sm" />
              </View>
              <Text style={styles.techniqueFeedback}>{technique.feedback}</Text>
            </View>
          ))}
        </View>

        {/* Posture Analysis */}
        <View style={styles.postureSection}>
          <View style={styles.analysisSectionHeader}>
            <Ionicons name="body" size={20} color="#f97316" />
            <Text style={styles.analysisSectionTitle}>Posture & Form</Text>
          </View>
          <View style={styles.postureContent}>
            <ScoreCircle score={analysisResult.posture.score} size="sm" />
            <Text style={styles.postureText}>Areas for improvement:</Text>
          </View>
          {analysisResult.posture.issues.map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Ionicons name="alert-circle" size={12} color="#f97316" />
              <Text style={styles.issueText}>{issue}</Text>
            </View>
          ))}
        </View>

        {/* Strengths */}
        <View style={styles.strengthsSection}>
          <View style={styles.analysisSectionHeader}>
            <Ionicons name="trophy" size={20} color="#16a34a" />
            <Text style={styles.analysisSectionTitle}>Your Strengths</Text>
          </View>
          {analysisResult.strengths.map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
              <Text style={styles.strengthText}>{strength}</Text>
            </View>
          ))}
        </View>

        {/* Improvements */}
        <View style={styles.improvementsSection}>
          <View style={styles.analysisSectionHeader}>
            <Ionicons name="trending-up" size={20} color="#2563eb" />
            <Text style={styles.analysisSectionTitle}>Improvement Plan</Text>
          </View>
          {analysisResult.improvements.map((improvement, index) => (
            <View key={index} style={styles.improvementItem}>
              <View style={styles.improvementNumber}>
                <Text style={styles.improvementNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.improvementText}>{improvement}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.analyzeAgainButton}
          onPress={() => setAnalysisResult(null)}
        >
          <LinearGradient
            colors={["#16a34a", "#2563eb"]}
            style={styles.analyzeAgainGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="refresh" size={16} color="#ffffff" />
            <Text style={styles.analyzeAgainText}>Analyze Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderAnalyzingModal = () => (
    <Modal visible={isAnalyzing} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.analyzingModal}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.analyzingTitle}>Analyzing Your Technique</Text>
          <Text style={styles.analyzingSubtitle}>
            AI is processing your movements...
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabNavigation()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === "camera" && renderCameraTab()}
        {selectedTab === "upload" && renderUploadTab()}
        {selectedTab === "history" && renderHistoryTab()}

        {analysisResult && renderAnalysisResults()}
      </ScrollView>

      {renderAnalyzingModal()}
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
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#16a34a",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 4,
  },
  tabTextActive: {
    color: "#16a34a",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 24,
  },
  cameraContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    aspectRatio: 16 / 9,
    marginBottom: 24,
    overflow: "hidden",
  },
  videoPreview: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraPlaceholderText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 16,
  },
  cameraPlaceholderSubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginTop: 8,
  },
  recordButton: {
    marginBottom: 24,
  },
  recordButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  recordButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    marginLeft: 8,
  },
  tipsList: {
    gap: 4,
  },
  tipItem: {
    fontSize: 14,
    color: "#1e40af",
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  uploadSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
  },
  uploadSuccessText: {
    fontSize: 14,
    color: "#15803d",
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historySessionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  historyDateText: {
    fontSize: 12,
    color: "#6b7280",
  },
  historyContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyDetails: {
    flex: 1,
    marginLeft: 16,
  },
  historyFeedback: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  historyProgress: {
    fontSize: 12,
    color: "#6b7280",
  },
  scoreCircle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#e5e7eb",
    borderRadius: 50,
  },
  scoreCircleLarge: {
    width: 80,
    height: 80,
  },
  scoreCircleSmall: {
    width: 56,
    height: 56,
  },
  scoreText: {
    fontWeight: "700",
  },
  scoreTextSmall: {
    fontSize: 14,
  },
  analysisContainer: {
    flex: 1,
    padding: 24,
  },
  analysisHeader: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  analysisHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  analysisSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  analysisSection: {
    marginBottom: 24,
  },
  analysisSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  analysisSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  techniqueCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  techniqueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  techniqueName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  techniqueFeedback: {
    fontSize: 14,
    color: "#6b7280",
  },
  postureSection: {
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  postureContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postureText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ea580c",
    marginLeft: 16,
  },
  issueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  issueText: {
    fontSize: 14,
    color: "#ea580c",
    marginLeft: 8,
  },
  strengthsSection: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  strengthText: {
    fontSize: 14,
    color: "#15803d",
    marginLeft: 8,
  },
  improvementsSection: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  improvementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  improvementNumber: {
    width: 20,
    height: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  improvementNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  improvementText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  analyzeAgainButton: {
    marginBottom: 32,
  },
  analyzeAgainGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  analyzeAgainText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  analyzingModal: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 32,
    alignItems: "center",
  },
  analyzingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 16,
    marginBottom: 8,
  },
  analyzingSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
