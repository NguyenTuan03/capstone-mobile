import {
  getSkillProgressSummary,
  MOCK_SKILL_PROGRESS,
} from "@/mocks/skillTracking";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Skill colors for different categories
const SKILL_COLORS = {
  "Phát bóng": "#3b82f6",
  "Đón bóng": "#10b981",
  "Bóng dink": "#8b5cf6",
  "Cú thứ ba": "#f59e0b",
  "Vị trí sân": "#ef4444",
  "Chuyển động chân": "#06b6d4",
  "Chiến thuật": "#84cc16",
  "Giao tiếp": "#f97316",
};

export default function RoadmapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [roadmapTab, setRoadmapTab] = useState<"on" | "off">("on");
  const [refreshing, setRefreshing] = useState(false);

  // Calculate skill summary
  const skillSummary = useMemo(() => {
    const summary = getSkillProgressSummary(MOCK_SKILL_PROGRESS);
    return {
      overallProgress: summary.overallProgress,
      averageLevel: summary.averageLevel,
      targetLevel: 2.0,
    };
  }, []);

  // Filter skills based on selected tab
  const currentSkills = useMemo(() => {
    const category = roadmapTab === "on" ? "on_paddle" : "off_paddle";
    return MOCK_SKILL_PROGRESS.filter(
      (skill) => skill.category === category,
    ).map((skill) => ({
      id: skill.id,
      label: skill.skillName,
      progress: skill.progress || 0,
      color:
        SKILL_COLORS[skill.skillName as keyof typeof SKILL_COLORS] || "#64748b",
    }));
  }, [roadmapTab]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>LỘ TRÌNH</Text>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>TN</Text>
      </View>
    </View>
  );

  const renderProgressCard = () => (
    <View style={styles.progressCard}>
      <Text style={styles.progressCardTitle}>Tiến trình lên Level 2.0</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{skillSummary.overallProgress}%</Text>
          <Text style={styles.statLabel}>Tổng tiến độ</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{skillSummary.averageLevel}</Text>
          <Text style={styles.statLabel}>Level hiện tại</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{skillSummary.targetLevel}</Text>
          <Text style={styles.statLabel}>Level mục tiêu</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressSectionTitle}>
          Tiến trình lên Level 2.0
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${skillSummary.overallProgress}%` },
            ]}
          />
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            {skillSummary.overallProgress}% Hoàn thành
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionTitle}>PHÂN TÍCH YẾU TỐ TRONG CHƠI</Text>
        <TouchableOpacity
          style={styles.libraryButton}
          onPress={() => router.push("/(learner)/roadmap/library")}
        >
          <Ionicons name="play-outline" size={16} color="#374151" />
          <Text style={styles.libraryButtonText}>Thư viện</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionDescription}>
        Điểm mạnh và điểm cần cải thiện của bạn được liệt kê dưới đây.{"\n"}
        Level hiện tại: {skillSummary.averageLevel} • Tổng tiến độ:{" "}
        {skillSummary.overallProgress}%
      </Text>
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, roadmapTab === "on" && styles.tabActive]}
          onPress={() => setRoadmapTab("on")}
        >
          <Text
            style={[
              styles.tabText,
              roadmapTab === "on" && styles.tabTextActive,
            ]}
          >
            Trên vợt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, roadmapTab === "off" && styles.tabActive]}
          onPress={() => setRoadmapTab("off")}
        >
          <Text
            style={[
              styles.tabText,
              roadmapTab === "off" && styles.tabTextActive,
            ]}
          >
            Ngoài vợt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInfoBanner = () => (
    <LinearGradient colors={["#f3e8ff", "#faf5ff"]} style={styles.infoBanner}>
      <Text style={styles.infoBannerText}>
        ⓘ Nhấn vào yếu tố để xem phản hồi.
      </Text>
    </LinearGradient>
  );

  const renderSkillCard = (skill: any) => (
    <TouchableOpacity
      key={skill.id}
      style={styles.skillCard}
      onPress={() => router.push(`/(learner)/roadmap/${skill.id}`)}
    >
      <View style={styles.skillCardHeader}>
        <Text style={styles.skillCardTitle}>{skill.label}</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>{skill.progress}%</Text>
        </View>
      </View>

      <View style={styles.skillProgressContainer}>
        <View
          style={[
            styles.skillProgressBar,
            { backgroundColor: skill.color, width: `${skill.progress}%` },
          ]}
        />
      </View>

      <View style={styles.skillCardFooter}>
        <View style={styles.skillStatus}>
          <View
            style={[styles.skillStatusDot, { backgroundColor: skill.color }]}
          />
          <Text style={styles.skillStatusText}>
            {skill.progress >= 75
              ? "Thành thạo"
              : skill.progress >= 50
                ? "Khá tốt"
                : skill.progress >= 25
                  ? "Cần cải thiện"
                  : "Cần tập trung"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        decelerationRate="normal"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            progressBackgroundColor="#ffffff"
            title="Đang cập nhật..."
            titleColor="#6b7280"
          />
        }
      >
        {renderHeader()}
        {renderProgressCard()}
        {renderSectionHeader()}
        {renderTabSelector()}
        {renderInfoBanner()}

        <View style={styles.skillsList}>
          {currentSkills.map(renderSkillCard)}
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.5,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#a855f7",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  progressCard: {
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2563eb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressSection: {
    marginTop: 8,
  },
  progressSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  progressTextContainer: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563eb",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  libraryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  libraryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tabSelector: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 4,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#111827",
  },
  infoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8b4fe",
    padding: 12,
  },
  infoBannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7c3aed",
    textAlign: "center",
  },
  skillsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32, // Increased bottom padding
  },
  skillCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  skillCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  skillCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  progressBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  skillProgressContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  skillProgressBar: {
    height: "100%",
  },
  skillCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skillStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  skillStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  skillStatusText: {
    fontSize: 12,
    color: "#6b7280",
  },
});
