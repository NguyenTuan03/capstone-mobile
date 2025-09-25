// app/(learner)/coach/my-sessions/[id]/feedback.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBookings } from "@/modules/learner/context/bookingContext";

const TAGS = [
  "Đúng giờ",
  "Giải thích dễ hiểu",
  "Drill chất lượng",
  "Thân thiện",
  "Tốc độ phù hợp",
  "Khuyến nghị cho bạn bè",
];

export default function SessionFeedback() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions /* add: saveFeedback? */ } = useBookings() as any;

  const session = useMemo(
    () => sessions?.find((s: any) => s.id === id),
    [sessions, id],
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (t: string) =>
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const canSubmit = rating > 0 && comment.trim().length >= 8;

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        "Thiếu thông tin",
        "Chọn số sao và viết ít nhất 8 ký tự nhé.",
      );
      return;
    }
    setSubmitting(true);

    // TODO: gọi API hoặc context.saveFeedback(...)
    // ví dụ:
    // await saveFeedback({ sessionId: id, rating, comment, tags: selected, anonymous });

    setTimeout(() => {
      setSubmitting(false);
      Alert.alert("Cảm ơn bạn!", "Feedback của bạn đã được ghi nhận.");
      router.back();
    }, 800);
  };

  const disabledByStatus = session && session.status !== "completed";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <LinearGradient
        colors={["#18181b", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#9ca3af" />
          </Pressable>
          <Text style={styles.heroTitle}>Session Feedback</Text>
          <View style={{ width: 36 }} />
        </View>
        {session ? (
          <Text style={styles.heroSub}>
            {session.coachName} •{" "}
            {new Date(session.startAt).toLocaleDateString()}{" "}
            {new Date(session.startAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        ) : (
          <Text style={styles.heroSub}>Session</Text>
        )}
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {disabledByStatus && (
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#b45309"
            />
            <Text style={styles.noticeText}>
              Chỉ gửi feedback sau khi buổi học hoàn tất.
            </Text>
          </View>
        )}

        {/* Rating */}
        <Text style={styles.sectionTitle}>
          Bạn chấm buổi học này bao nhiêu sao?
        </Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable
              key={i}
              onPress={() => setRating(i)}
              style={styles.starBtn}
            >
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={28}
                color={i <= rating ? "#f59e0b" : "#d1d5db"}
              />
            </Pressable>
          ))}
        </View>

        {/* Tags */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Điểm bạn thấy nổi bật (chọn vài cái)
        </Text>
        <View style={styles.tagsWrap}>
          {TAGS.map((t) => {
            const active = selected.includes(t);
            return (
              <Pressable
                key={t}
                onPress={() => toggleTag(t)}
                style={[styles.tag, active && styles.tagActive]}
              >
                <Text style={[styles.tagText, active && styles.tagTextActive]}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Comment */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Nhận xét chi tiết
        </Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Ví dụ: Coach giải thích dễ hiểu, drill hợp lý, muốn tập thêm phần footwork..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          style={styles.textarea}
        />
        <Text style={styles.hint}>
          Tối thiểu 8 ký tự. Hãy chia sẻ điều hữu ích cho học viên khác 🙌
        </Text>

        {/* Anonymous */}
        <Pressable
          onPress={() => setAnonymous((v) => !v)}
          style={styles.anonRow}
        >
          <View style={[styles.checkbox, anonymous && styles.checkboxOn]}>
            {anonymous && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.anonText}>Gửi ẩn danh</Text>
        </Pressable>

        {/* Submit */}
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit || submitting || disabledByStatus}
          style={[
            styles.submitBtn,
            (!canSubmit || submitting || disabledByStatus) && { opacity: 0.6 },
          ]}
        >
          {submitting ? (
            <Text style={styles.submitText}>Đang gửi...</Text>
          ) : (
            <Text style={styles.submitText}>Gửi feedback</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
    flex: 1,
    textAlign: "center",
  },
  heroSub: { color: "#d1d5db", marginTop: 8, textAlign: "center" },

  notice: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  noticeText: { color: "#92400e", fontWeight: "700" },

  sectionTitle: { fontWeight: "800", color: "#111827" },
  starsRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  starBtn: { padding: 4 },

  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tagActive: { backgroundColor: "#111827", borderColor: "#111827" },
  tagText: { color: "#374151", fontWeight: "600" },
  tagTextActive: { color: "#fff" },

  textarea: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    color: "#111827",
    lineHeight: 20,
  },
  hint: { color: "#6b7280", marginTop: 6 },

  anonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxOn: { backgroundColor: "#111827", borderColor: "#111827" },
  anonText: { color: "#111827", fontWeight: "700" },

  submitBtn: {
    marginTop: 18,
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#fff", fontWeight: "900" },
});
