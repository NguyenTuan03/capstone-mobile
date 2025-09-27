import { MOCK_SKILL_PROGRESS } from "@/mocks/skillTracking";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
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

type Section = {
  type: "video" | "quiz";
  title: string;
  description?: string;
  duration?: string;
  questions?: number;
  completed: boolean;
};

type SkillData = {
  id: string;
  title: string;
  level: string;
  progress: number;
  sections: Section[];
};

// Sample quiz questions
const SAMPLE_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the most important aspect of a good dink shot?",
    options: ["Power", "Placement", "Speed", "Height"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Where should you aim when hitting a dink shot?",
    options: [
      "Deep in the court",
      "At your opponent's feet",
      "High over the net",
      "At the sidelines",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What grip is typically used for dinking?",
    options: [
      "Continental grip",
      "Eastern grip",
      "Western grip",
      "Semi-western grip",
    ],
    correctAnswer: 0,
  },
];

export default function RoadmapDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [demoMode, setDemoMode] = useState(false);
  const [completedSections, setCompletedSections] = useState([
    true,
    false,
    false,
    false,
  ]);
  const [currentVideoProgress, setCurrentVideoProgress] = useState(65);

  // Modal states
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(-1);

  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Get skill data from mock or create default data
  const skillData = useMemo(() => {
    const skill = MOCK_SKILL_PROGRESS.find((s) => s.id === id);
    if (skill) {
      return {
        id: skill.id,
        title: skill.skillName,
        level: skill.currentLevel >= 2.0 ? "Intermediate" : "Beginner",
        progress: skill.progress || 0,
        sections: [
          {
            type: "video" as const,
            title: `${skill.skillName} Technique Demo`,
            description: `Learn proper ${skill.skillName.toLowerCase()} technique fundamentals`,
            duration: "8:30",
            completed: true,
          },
          {
            type: "quiz" as const,
            title: `${skill.skillName} Knowledge Check`,
            questions: 3,
            completed: false,
          },
          {
            type: "video" as const,
            title: `Advanced ${skill.skillName} Strategies`,
            description: `Learn advanced ${skill.skillName.toLowerCase()} placement and strategies`,
            duration: "12:15",
            completed: false,
          },
          {
            type: "quiz" as const,
            title: `Advanced ${skill.skillName} Quiz`,
            questions: 5,
            completed: false,
          },
        ],
      };
    }

    // Default data if skill not found
    return {
      id: "1",
      title: "Dink Fundamentals",
      level: "Intermediate",
      progress: 85,
      sections: [
        {
          type: "video" as const,
          title: "Dink Technique Demo",
          description: "Learn proper dink technique fundamentals",
          duration: "8:30",
          completed: true,
        },
        {
          type: "quiz" as const,
          title: "Dink Knowledge Check",
          questions: 3,
          completed: false,
        },
        {
          type: "video" as const,
          title: "Advanced Dink Strategies",
          description: "Learn advanced dink placement and strategies",
          duration: "12:15",
          completed: false,
        },
        {
          type: "quiz" as const,
          title: "Advanced Dink Quiz",
          questions: 5,
          completed: false,
        },
      ],
    };
  }, [id]);

  const handleSectionPress = (section: Section, index: number) => {
    setSelectedSection(section);
    setSelectedSectionIndex(index);

    if (section.type === "video") {
      setVideoModalVisible(true);
    } else if (section.type === "quiz") {
      setQuizModalVisible(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setQuizCompleted(false);
      setQuizScore(0);
    }
  };

  const handleVideoComplete = () => {
    const newCompletedSections = [...completedSections];
    newCompletedSections[selectedSectionIndex] = true;
    setCompletedSections(newCompletedSections);
    setVideoModalVisible(false);
  };

  const handleQuizAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SAMPLE_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      selectedAnswers.forEach((answer, index) => {
        if (answer === SAMPLE_QUIZ_QUESTIONS[index].correctAnswer) {
          score++;
        }
      });
      setQuizScore(score);
      setQuizCompleted(true);
    }
  };

  const handleQuizComplete = () => {
    const newCompletedSections = [...completedSections];
    newCompletedSections[selectedSectionIndex] = true;
    setCompletedSections(newCompletedSections);
    setQuizModalVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#6b7280" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{skillData.title}</Text>
      <TouchableOpacity
        style={[styles.demoButton, demoMode && styles.demoButtonActive]}
        onPress={() => setDemoMode(!demoMode)}
      >
        <Text
          style={[
            styles.demoButtonText,
            demoMode && styles.demoButtonTextActive,
          ]}
        >
          {demoMode ? "Demo ON" : "Demo"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressOverview = () => (
    <View style={styles.progressCard}>
      <LinearGradient
        colors={["#2563eb", "#7c3aed"]}
        style={styles.progressHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.progressHeaderContent}>
          <View style={styles.progressHeaderLeft}>
            <Text style={styles.progressTitle}>{skillData.title}</Text>
            <Text style={styles.progressSubtitle}>{skillData.level} Level</Text>
          </View>
          <View style={styles.progressHeaderRight}>
            <Text style={styles.progressPercentage}>{skillData.progress}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${skillData.progress}%` },
            ]}
          />
        </View>
      </LinearGradient>

      <View style={styles.progressStats}>
        <View style={styles.progressStatsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {completedSections.filter(Boolean).length}/
              {completedSections.length}
            </Text>
            <Text style={styles.statLabel}>Sections Done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValuePurple]}>
              {skillData.sections.filter((s) => s.type === "quiz").length}
            </Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSection = (section: Section, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.sectionCard,
        completedSections[index] && styles.sectionCardCompleted,
      ]}
      onPress={() => handleSectionPress(section, index)}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons
            name={section.type === "video" ? "play-circle" : "help-circle"}
            size={24}
            color={completedSections[index] ? "#10b981" : "#6b7280"}
          />
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.description && (
            <Text style={styles.sectionDescription}>{section.description}</Text>
          )}
          {section.duration && (
            <Text style={styles.sectionMeta}>Duration: {section.duration}</Text>
          )}
          {section.questions && (
            <Text style={styles.sectionMeta}>
              {section.questions} questions
            </Text>
          )}
        </View>
        <View style={styles.sectionStatus}>
          {completedSections[index] ? (
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVideoModal = () => (
    <Modal
      visible={videoModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setVideoModalVisible(false)}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{selectedSection?.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={80} color="#ffffff" />
            <Text style={styles.videoPlaceholderText}>Video Player</Text>
            <Text style={styles.videoDescription}>
              {selectedSection?.description}
            </Text>
          </View>

          <View style={styles.videoControls}>
            <View style={styles.progressContainer}>
              <Text style={styles.progressTime}>
                0:00 / {selectedSection?.duration}
              </Text>
              <View style={styles.videoProgressBar}>
                <View
                  style={[
                    styles.videoProgressFill,
                    { width: `${currentVideoProgress}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="play-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={32} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="play-forward" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleVideoComplete}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderQuizModal = () => {
    const currentQuestion = SAMPLE_QUIZ_QUESTIONS[currentQuestionIndex];

    return (
      <Modal
        visible={quizModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setQuizModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedSection?.title}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {!quizCompleted ? (
            <View style={styles.quizContainer}>
              <View style={styles.quizProgress}>
                <Text style={styles.quizProgressText}>
                  Question {currentQuestionIndex + 1} of{" "}
                  {SAMPLE_QUIZ_QUESTIONS.length}
                </Text>
                <View style={styles.quizProgressBar}>
                  <View
                    style={[
                      styles.quizProgressFill,
                      {
                        width: `${((currentQuestionIndex + 1) / SAMPLE_QUIZ_QUESTIONS.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {currentQuestion.question}
                </Text>

                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        selectedAnswers[currentQuestionIndex] === index &&
                          styles.optionButtonSelected,
                      ]}
                      onPress={() => handleQuizAnswerSelect(index)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedAnswers[currentQuestionIndex] === index &&
                            styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.quizFooter}>
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    selectedAnswers[currentQuestionIndex] === undefined &&
                      styles.nextButtonDisabled,
                  ]}
                  onPress={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex === SAMPLE_QUIZ_QUESTIONS.length - 1
                      ? "Finish"
                      : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.quizResultContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
              <Text style={styles.quizResultTitle}>Quiz Complete!</Text>
              <Text style={styles.quizResultScore}>
                You scored {quizScore} out of {SAMPLE_QUIZ_QUESTIONS.length}
              </Text>
              <Text style={styles.quizResultPercentage}>
                {Math.round((quizScore / SAMPLE_QUIZ_QUESTIONS.length) * 100)}%
              </Text>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleQuizComplete}
              >
                <Text style={styles.completeButtonText}>Continue Learning</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderProgressOverview()}

        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Learning Sections</Text>
          {skillData.sections.map(renderSection)}
        </View>
      </ScrollView>

      {renderVideoModal()}
      {renderQuizModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  demoButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  demoButtonActive: {
    backgroundColor: "#7c3aed",
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  demoButtonTextActive: {
    color: "#ffffff",
  },
  progressCard: {
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    padding: 16,
  },
  progressHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressHeaderLeft: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressHeaderRight: {
    alignItems: "flex-end",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  progressLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ffffff",
  },
  progressStats: {
    padding: 16,
  },
  progressStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statValuePurple: {
    color: "#7c3aed",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionCardCompleted: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  sectionMeta: {
    fontSize: 12,
    color: "#9ca3af",
  },
  sectionStatus: {
    marginLeft: 12,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 24,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  completeButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Video modal styles
  videoContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  videoPlaceholderText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  videoControls: {
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTime: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
  },
  videoProgressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  videoProgressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    padding: 15,
  },

  // Quiz modal styles
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  quizProgress: {
    marginBottom: 30,
  },
  quizProgressText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  quizProgressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  quizProgressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 30,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
  },
  optionButtonSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  optionTextSelected: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  quizFooter: {
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  quizResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  quizResultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 10,
  },
  quizResultScore: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 8,
  },
  quizResultPercentage: {
    fontSize: 32,
    fontWeight: "700",
    color: "#10b981",
    marginBottom: 40,
  },
});
