import { useSkillTracking } from "@/modules/learner/context/skillTrackingContext";
import { GradientItem, Segmented } from "@/modules/learner/roadmap";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getSkillColor(progress: number) {
  if (progress >= 100) return "#10b981"; // Green
  if (progress >= 75) return "#3b82f6"; // Blue
  if (progress >= 50) return "#f59e0b"; // Amber
  if (progress >= 25) return "#8b5cf6"; // Purple
  return "#ef4444"; // Red
}

export default function RoadmapScreen() {
  const [tab, setTab] = useState<"on" | "off">("on");
  const insets = useSafeAreaInsets();
  const { skillsByCategory, skillSummary } = useSkillTracking();

  // Create dynamic items based on actual skill progress

  const getItemsForTab = (tabType: "on" | "off") => {
    const category = tabType === "on" ? "on_paddle" : "off_paddle";
    const skillsInCategory = skillsByCategory?.[category] || [];

    return skillsInCategory.map((skill) => ({
      id: skill.id,
      label: skill.skillName,
      progress: skill.progress || 0,
      color: getSkillColor(skill.progress || 0),
    }));
  };

  const ITEMS = getItemsForTab(tab);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      {/* Top title */}
      <View style={s.headerWrap}>
        <Text style={s.header}>LỘ TRÌNH</Text>
        {/* Avatar pill góc phải nếu cần: fake */}
        <View style={s.avatar}>
          <Text style={s.avatarText}>TN</Text>
        </View>
      </View>

      {/* Progress Overview */}
      <View style={s.progressCard}>
        <Text style={s.progressTitle}>Tiến trình lên Level 2.0</Text>
        <View style={s.progressStats}>
          <View style={s.progressStat}>
            <Text style={s.progressValue}>
              {skillSummary?.overallProgress || 0}%
            </Text>
            <Text style={s.progressLabel}>Tổng tiến độ</Text>
          </View>
          <View style={s.progressStat}>
            <Text style={s.progressValue}>
              {skillSummary?.averageLevel || 1.0}
            </Text>
            <Text style={s.progressLabel}>Level hiện tại</Text>
          </View>
          <View style={s.progressStat}>
            <Text style={s.progressValue}>2.0</Text>
            <Text style={s.progressLabel}>Level mục tiêu</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={s.progressBarContainer}>
          <Text style={s.progressBarLabel}>Tiến trình lên Level 2.0</Text>
          <View style={s.progressBar}>
            <View
              style={[
                s.progressFill,
                { width: `${skillSummary?.overallProgress || 0}%` },
              ]}
            />
          </View>
          <Text style={s.progressText}>
            {skillSummary?.overallProgress || 0}% Hoàn thành
          </Text>
        </View>
      </View>

      {/* Section title + Library CTA */}
      <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
        <View style={s.titleRow}>
          <Text style={s.sectionTitle}>PHÂN TÍCH YẾU TỐ TRÒNG CHƠI</Text>
          <Pressable
            style={s.linkBtn}
            onPress={() => router.push("/(learner)/roadmap/library")}
          >
            <Ionicons name="videocam-outline" size={14} color="#111827" />
            <Text style={s.linkBtnTxt}>Thư viện</Text>
          </Pressable>
        </View>
        <Text style={s.sub}>
          Điểm mạnh và điểm cần cải thiện của bạn được liệt kê dưới đây.{"\n"}
          Level hiện tại: {skillSummary?.averageLevel || 1.0} • Tổng tiến độ:{" "}
          {skillSummary?.overallProgress || 0}%
        </Text>
      </View>

      {/* Segmented */}
      <View style={s.segmentWrap}>
        <Segmented
          left="Trên vợt"
          right="Ngoài vợt"
          value={tab}
          onChange={(v) => setTab(v)}
        />
      </View>

      {/* Tip pill */}
      <LinearGradient
        colors={["#f3d4ff", "#f2e4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.tip}
      >
        <Text style={s.tipText}>ⓘ Nhấn vào yếu tố để xem phản hồi.</Text>
      </LinearGradient>

      {/* List */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
        }}
        data={ITEMS}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <GradientItem
            title={item.label}
            value={`${item.progress}%`}
            color={item.color}
            onPress={() => {
              router.push(`/(learner)/roadmap/${item.id}` as Href);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Progress Styles
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressStat: {
    alignItems: "center",
    flex: 1,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3b82f6",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
    marginTop: 8,
    textAlign: "right",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  linkBtnTxt: { marginLeft: 6, fontWeight: "800", color: "#111827" },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { fontSize: 20, fontWeight: "700", letterSpacing: 1, color: "#111" },
  avatar: {
    position: "absolute",
    right: 16,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#c982ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  segmentWrap: { paddingHorizontal: 16, marginTop: 16 },
  segment: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tip: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: "center",
  },
  tipText: { color: "#7c3aed", fontWeight: "600" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    color: "#111",
  },
  sub: { color: "#6b7280", marginTop: 6, lineHeight: 18 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});
