import { ResizeMode, Video } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DB = {
  "1": {
    title: "Dink Fundamentals",
    sections: [
      {
        type: "video",
        title: "Dink Technique Demo",
        description: "Learn proper dink technique fundamentals",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        type: "quiz",
        title: "Dink Knowledge Check",
        quiz: [
          {
            q: "Mục tiêu của dink là gì?",
            choices: ["Tấn công mạnh", "Giữ bóng thấp và bền"],
            correct: 1,
          },
          {
            q: "Vị trí tiếp xúc bóng lý tưởng?",
            choices: ["Trước hông", "Sau vai"],
            correct: 0,
          },
        ],
      },
      {
        type: "video",
        title: "Advanced Dink Strategies",
        description: "Learn advanced dink placement and strategies",
        video: "https://www.w3schools.com/html/movie.mp4",
      },
      {
        type: "quiz",
        title: "Advanced Dink Quiz",
        quiz: [
          {
            q: "Khi nào nên dùng dink chéo sân?",
            choices: [
              "Luôn luôn",
              "Khi đối thủ ở vị trí thuận lợi",
              "Khi muốn tạo góc khó",
            ],
            correct: 2,
          },
        ],
      },
    ],
  },
  "2": {
    title: "Giao bóng cơ bản",
    sections: [
      {
        type: "video",
        title: "Serve Fundamentals",
        description: "Master the basic serve technique",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        type: "quiz",
        title: "Serve Knowledge Check",
        quiz: [
          {
            q: "Khi trả giao bóng nên ưu tiên gì?",
            choices: ["Bóng cao, mạnh", "Sâu, bám baseline"],
            correct: 1,
          },
        ],
      },
    ],
  },
  "3": {
    title: "3rd Shot Drop",
    sections: [
      {
        type: "video",
        title: "Drop Shot Technique",
        description: "Learn the essential 3rd shot drop",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        type: "quiz",
        title: "Drop Shot Quiz",
        quiz: [
          {
            q: "3rd shot tốt sẽ giúp?",
            choices: ["Lên NVZ an toàn", "Đứng cuối sân mãi"],
            correct: 0,
          },
        ],
      },
      {
        type: "video",
        title: "Drop Shot Variations",
        description: "Explore different drop shot techniques",
        video: "https://www.w3schools.com/html/movie.mp4",
      },
      {
        type: "quiz",
        title: "Drop Shot Mastery",
        quiz: [
          {
            q: "Độ cao lý tưởng của drop shot?",
            choices: ["Cao trên lưới", "Thấp dưới lưới", "Ngang lưới"],
            correct: 1,
          },
        ],
      },
    ],
  },
};

export default function RoadmapDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const key = useMemo(
    () => (id && id in DB ? id : "1") as keyof typeof DB,
    [id],
  );
  const data = useMemo(() => DB[key], [key]);

  const [videoCompleted, setVideoCompleted] = useState(
    data.sections.map(() => false),
  );
  const [quizPassed, setQuizPassed] = useState(data.sections.map(() => false));
  const [quizStates, setQuizStates] = useState(
    data.sections.map((section) =>
      section.type === "quiz" ? { idx: 0, picked: null, score: 0 } : null,
    ),
  );
  const [demoMode, setDemoMode] = useState(false);
  const insets = useSafeAreaInsets();

  const isSectionUnlocked = (index: number) => {
    if (demoMode) return true;
    if (index === 0) return true;

    const previousSection = data.sections[index - 1];
    if (previousSection.type === "video") {
      return videoCompleted[index - 1];
    } else {
      return quizPassed[index - 1];
    }
  };

  const completeVideo = (index: number) => {
    const newVideoCompleted = [...videoCompleted];
    newVideoCompleted[index] = true;
    setVideoCompleted(newVideoCompleted);
  };

  const updateQuizState = (sectionIndex: number, newState: any) => {
    const newQuizStates = [...quizStates];
    newQuizStates[sectionIndex] = newState;
    setQuizStates(newQuizStates);
  };

  const passQuiz = (sectionIndex: number) => {
    const quizState = quizStates[sectionIndex];
    const section = data.sections[sectionIndex];
    if (!quizState || !section.quiz) return;
    const passed = quizState.score >= section.quiz.length * 0.7; // 70% to pass

    const newQuizPassed = [...quizPassed];
    newQuizPassed[sectionIndex] = passed;
    setQuizPassed(newQuizPassed);

    if (passed) {
      alert(`Quiz passed! Score: ${quizState.score}/${section.quiz.length}`);
    } else {
      alert(
        `Quiz failed. Score: ${quizState.score}/${section.quiz.length}. Try again!`,
      );
    }
  };

  const isUploadUnlocked = useMemo(() => {
    if (demoMode) return true;
    const allQuizzesPassed = quizPassed.every(
      (passed, index) => data.sections[index].type !== "quiz" || passed,
    );
    return allQuizzesPassed;
  }, [quizPassed, demoMode, data.sections]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
      }}
    >
      {/* Top bar */}
      <View style={s.top}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.back}>‹ Back</Text>
        </Pressable>
        <Text style={s.title}>{data.title}</Text>
        <Pressable
          style={[s.demoButton, demoMode && s.demoButtonActive]}
          onPress={() => setDemoMode(!demoMode)}
        >
          <Text style={[s.demoButtonText, demoMode && s.demoButtonTextActive]}>
            {demoMode ? "Demo ON" : "Demo"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {data.sections.map((section, index) => (
          <View key={index}>
            {section.type === "video" ? (
              <VideoSection
                section={section}
                isUnlocked={isSectionUnlocked(index)}
                onComplete={() => completeVideo(index)}
                isCompleted={videoCompleted[index]}
              />
            ) : (
              <QuizSection
                section={section}
                isUnlocked={isSectionUnlocked(index)}
                quizState={quizStates[index]}
                onUpdateQuizState={(newState: any) =>
                  updateQuizState(index, newState)
                }
                onPassQuiz={() => passQuiz(index)}
                isPassed={quizPassed[index]}
              />
            )}
          </View>
        ))}

        {/* AI Analysis Upload Button */}
        <View style={s.uploadSection}>
          <Pressable
            style={[
              s.aiUploadButton,
              !isUploadUnlocked && s.aiUploadButtonLocked,
            ]}
            disabled={!isUploadUnlocked}
          >
            <View style={s.aiUploadContent}>
              <Text style={s.aiUploadIcon}>
                {isUploadUnlocked ? "🤖" : "🔒"}
              </Text>
              <View>
                <Text style={s.aiUploadTitle}>
                  {isUploadUnlocked
                    ? "Upload for AI Analysis"
                    : "AI Analysis Locked"}
                </Text>
                <Text style={s.aiUploadSubtitle}>
                  {isUploadUnlocked
                    ? "Get feedback on your technique"
                    : "Complete all quizzes to unlock"}
                </Text>
              </View>
            </View>
          </Pressable>
          {!isUploadUnlocked && (
            <Text style={s.uploadLockText}>
              Complete all quiz sections above to unlock AI analysis
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function VideoSection({ section, isUnlocked, onComplete, isCompleted }: any) {
  const player = useRef<Video>(null);

  return (
    <View style={s.videoContainer}>
      <View style={s.videoHeader}>
        <Text style={s.videoTitle}>{section.title}</Text>
        {isCompleted && (
          <View style={s.completedBadge}>
            <Text style={s.completedBadgeText}>✓ Completed</Text>
          </View>
        )}
      </View>

      {isUnlocked ? (
        <>
          <View style={s.videoWrap}>
            <Video
              ref={player}
              source={{ uri: section.video }}
              useNativeControls
              style={s.video}
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={(status) => {
                if (
                  status &&
                  "didJustFinish" in status &&
                  status.didJustFinish
                ) {
                  onComplete();
                }
              }}
            />
          </View>
          <View style={s.videoFooter}>
            <Text style={s.videoDescription}>{section.description}</Text>
          </View>
        </>
      ) : (
        <View style={s.lockedVideo}>
          <View style={s.lockedVideoContent}>
            <Text style={s.lockedVideoIcon}>🔒</Text>
            <Text style={s.lockedVideoText}>
              Complete previous section to unlock
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function QuizSection({
  section,
  isUnlocked,
  quizState,
  onUpdateQuizState,
  onPassQuiz,
  isPassed,
}: any) {
  if (!quizState) return null;

  const q = section.quiz[quizState.idx];

  const submit = () => {
    if (quizState.picked == null) return;

    const newScore =
      quizState.picked === q.correct ? quizState.score + 1 : quizState.score;

    if (quizState.idx < section.quiz.length - 1) {
      onUpdateQuizState({
        idx: quizState.idx + 1,
        picked: null,
        score: newScore,
      });
    } else {
      onUpdateQuizState({
        ...quizState,
        score: newScore,
      });
      onPassQuiz();
    }
  };

  return (
    <View style={s.quizWrap}>
      <View style={s.quizHeader}>
        <Text style={s.quizTitle}>{section.title}</Text>
        {isPassed && (
          <View style={s.completedBadge}>
            <Text style={s.completedBadgeText}>✓ Passed</Text>
          </View>
        )}
        {!isUnlocked && (
          <View style={s.lockBadge}>
            <Text style={s.lockBadgeText}>🔒 Locked</Text>
          </View>
        )}
      </View>

      {isUnlocked ? (
        <>
          <Text style={s.question}>{q.q}</Text>

          {q.choices.map((c: string, i: number) => (
            <Pressable
              key={i}
              onPress={() => onUpdateQuizState({ ...quizState, picked: i })}
              style={[s.choice, quizState.picked === i && s.choiceActive]}
            >
              <Text
                style={[
                  s.choiceText,
                  quizState.picked === i && s.choiceTextActive,
                ]}
              >
                {c}
              </Text>
            </Pressable>
          ))}

          <Pressable style={s.submit} onPress={submit}>
            <Text style={s.submitText}>
              {quizState.idx < section.quiz.length - 1 ? "Next" : "Finish"}
            </Text>
          </Pressable>

          <Text style={s.progress}>
            Question {quizState.idx + 1}/{section.quiz.length} • Score{" "}
            {quizState.score}
          </Text>
        </>
      ) : (
        <View style={s.lockedQuiz}>
          <Text style={s.question}>{q.q}</Text>
          <View style={s.lockedAnswers}>
            <Text style={s.lockedAnswersText}>
              {q.choices.length} answers available
            </Text>
          </View>
          <Pressable style={s.submitLocked}>
            <Text style={s.submitTextLocked}>Locked</Text>
          </Pressable>
          <Text style={s.lockedText}>Complete previous section to unlock</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  top: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  demoButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  demoButtonActive: {
    backgroundColor: "#7c3aed",
  },
  demoButtonText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  demoButtonTextActive: {
    color: "#fff",
  },
  back: { fontSize: 16, color: "#6b7280" },
  title: { fontSize: 18, fontWeight: "700" },

  videoContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  videoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  videoWrap: { aspectRatio: 16 / 9, backgroundColor: "#000" },
  video: { width: "100%", height: "100%" },
  videoFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  videoDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  lockedVideo: {
    aspectRatio: 16 / 9,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  lockedVideoContent: {
    alignItems: "center",
  },
  lockedVideoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedVideoText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },

  quizWrap: { padding: 16 },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  quizTitle: { fontSize: 16, fontWeight: "700" },
  question: { fontSize: 15, marginBottom: 12, color: "#111" },

  choice: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  choiceActive: { backgroundColor: "#111" },
  choiceText: { color: "#111", fontWeight: "600" },
  choiceTextActive: { color: "#fff" },

  submit: {
    marginTop: 6,
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" },
  progress: { textAlign: "center", marginTop: 10, color: "#6b7280" },

  lockBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockBadgeText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "600",
  },
  lockedText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  lockedQuiz: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  lockedAnswers: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    alignItems: "center",
  },
  lockedAnswersText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  submitLocked: {
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  submitTextLocked: {
    color: "#9ca3af",
    fontWeight: "700",
  },

  completedBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 12,
    color: "#065f46",
    fontWeight: "600",
  },

  uploadSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  aiUploadButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#6d28d9",
  },
  aiUploadButtonLocked: {
    backgroundColor: "#9ca3af",
    borderColor: "#6b7280",
    shadowOpacity: 0.1,
  },
  aiUploadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  aiUploadIcon: {
    fontSize: 32,
  },
  aiUploadTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  aiUploadSubtitle: {
    fontSize: 13,
    color: "#e2e8f0",
  },
  uploadLockText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
});
