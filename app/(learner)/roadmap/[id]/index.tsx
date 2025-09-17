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
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
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
  "2": {
    title: "Serve & Return",
    video: "https://www.w3schools.com/html/movie.mp4",
    quiz: [
      {
        q: "Khi trả giao bóng nên ưu tiên gì?",
        choices: ["Bóng cao, mạnh", "Sâu, bám baseline"],
        correct: 1,
      },
    ],
  },
  "3": {
    title: "3rd Shot Drop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    quiz: [
      {
        q: "3rd shot tốt sẽ giúp?",
        choices: ["Lên NVZ an toàn", "Đứng cuối sân mãi"],
        correct: 0,
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

  const player = useRef<Video>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = data.quiz[idx];
  const insets = useSafeAreaInsets();
  const submit = () => {
    if (picked == null) return;
    if (picked === q.correct) setScore((s) => s + 1);
    if (idx < data.quiz.length - 1) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      alert(
        `Hoàn thành! Điểm: ${score + (picked === q.correct ? 1 : 0)} / ${data.quiz.length}`,
      );
    }
  };

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
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Video */}
        <View style={s.videoWrap}>
          <Video
            ref={player}
            source={{ uri: data.video }}
            useNativeControls
            style={s.video}
            resizeMode={ResizeMode.CONTAIN}
          />
        </View>

        {/* Quiz */}
        <View style={s.quizWrap}>
          <Text style={s.quizTitle}>Quick Quiz</Text>
          <Text style={s.question}>{q.q}</Text>

          {q.choices.map((c, i) => (
            <Pressable
              key={i}
              onPress={() => setPicked(i)}
              style={[s.choice, picked === i && s.choiceActive]}
            >
              <Text style={[s.choiceText, picked === i && s.choiceTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}

          <Pressable style={s.submit} onPress={submit}>
            <Text style={s.submitText}>
              {idx < data.quiz.length - 1 ? "Next" : "Finish"}
            </Text>
          </Pressable>

          <Text style={s.progress}>
            Question {idx + 1}/{data.quiz.length} • Score {score}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  back: { fontSize: 16, color: "#6b7280" },
  title: { fontSize: 18, fontWeight: "700" },

  videoWrap: { marginTop: 8, aspectRatio: 16 / 9, backgroundColor: "#000" },
  video: { width: "100%", height: "100%" },

  quizWrap: { padding: 16 },
  quizTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
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
});
