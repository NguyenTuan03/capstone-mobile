import { MOCK_ENROLLMENTS, MOCK_SESSION_BLOCKS } from "@/mocks/sessionBlocks";
import { SessionBlock } from "@/types/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** -------- Types -------- */
type SkillLevel = string | "All";

export default function SessionBlocksScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("All");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Filter and search session blocks
  const filteredBlocks = useMemo(() => {
    return MOCK_SESSION_BLOCKS.filter((block) => {
      const matchesSearch =
        !searchQuery ||
        block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill =
        skillLevel === "All" ||
        (block.skillLevelFrom &&
          parseFloat(block.skillLevelFrom) <= parseFloat(skillLevel) &&
          block.skillLevelTo &&
          parseFloat(block.skillLevelTo) >= parseFloat(skillLevel));
      const matchesStatus = !showActiveOnly || block.isActive;

      return matchesSearch && matchesSkill && matchesStatus;
    });
  }, [searchQuery, skillLevel, showActiveOnly]);

  // Get enrollment count for each block
  const getEnrollmentCount = (blockId: string) => {
    return MOCK_ENROLLMENTS.filter((e) => e.sessionBlockId === blockId).length;
  };

  const getSkillLevelColor = (level: string) => {
    const numericLevel = parseFloat(level);
    if (numericLevel <= 2.0) return "#10b981"; // Beginner - Green
    if (numericLevel <= 3.0) return "#3b82f6"; // Intermediate - Blue
    if (numericLevel <= 4.0) return "#f59e0b"; // Advanced - Orange
    return "#ef4444"; // Expert - Red
  };

  const getSkillLevelRangeColor = (fromLevel: string, toLevel: string) => {
    const from = parseFloat(fromLevel);
    const to = parseFloat(toLevel);
    // Use the higher level for coloring
    const level = Math.max(from, to);
    return getSkillLevelColor(level.toString());
  };

  const getDeliveryModeColor = (mode: string) => {
    switch (mode) {
      case "online":
        return "#8b5cf6"; // Purple
      case "offline":
        return "#10b981"; // Green
      default:
        return "#64748b";
    }
  };

  const handleCreateBlock = () => {
    router.push("/(coach)/menu/session-blocks/create");
  };

  const handleEditBlock = (block: SessionBlock) => {
    router.push({
      pathname: "/(coach)/menu/session-blocks/[id]",
      params: { id: block.id },
    });
  };

  const handleDuplicateBlock = (block: SessionBlock) => {
    Alert.alert(
      "Duplicate Session Block",
      `Create a copy of "${block.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Duplicate",
          onPress: () => {
            // TODO: Implement duplication logic
            Alert.alert("Success", "Session block duplicated successfully!");
          },
        },
      ],
    );
  };

  const handleToggleArchive = (block: SessionBlock) => {
    Alert.alert(
      block.isActive ? "Archive Session Block" : "Activate Session Block",
      `Are you sure you want to ${block.isActive ? "archive" : "activate"} "${block.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: block.isActive ? "Archive" : "Activate",
          onPress: () => {
            // TODO: Implement archive/unarchive logic
            Alert.alert(
              "Success",
              `Session block ${block.isActive ? "archived" : "activated"} successfully!`,
            );
          },
        },
      ],
    );
  };

  const handleScheduleBlock = (block: SessionBlock) => {
    router.push({
      pathname: "/(coach)/menu/session-blocks/schedule",
      params: { id: block.id },
    });
  };

  const renderBlockCard = ({ item: block }: { item: SessionBlock }) => {
    const enrollmentCount = getEnrollmentCount(block.id);

    return (
      <TouchableOpacity
        style={styles.blockCard}
        onPress={() => handleEditBlock(block)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.blockInfo}>
            <Text style={styles.blockTitle}>{block.title}</Text>
            <Text style={styles.blockDescription} numberOfLines={2}>
              {block.description}
            </Text>

            <View style={styles.blockMeta}>
              <View
                style={[
                  styles.skillBadge,
                  {
                    backgroundColor: getSkillLevelRangeColor(
                      block.skillLevelFrom,
                      block.skillLevelTo,
                    ),
                  },
                ]}
              >
                <Text style={styles.skillBadgeText}>
                  {block.skillLevelFrom} - {block.skillLevelTo}
                </Text>
              </View>
              <View
                style={[
                  styles.deliveryModeBadge,
                  { backgroundColor: getDeliveryModeColor(block.deliveryMode) },
                ]}
              >
                <Ionicons
                  name={
                    block.deliveryMode === "online" ? "videocam" : "location"
                  }
                  size={12}
                  color="#fff"
                />
                <Text style={styles.deliveryModeBadgeText}>
                  {block.deliveryMode}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={styles.metaText}>{block.duration} weeks</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="fitness-outline" size={14} color="#64748b" />
                <Text style={styles.metaText}>
                  {block.totalSessions} sessions
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.blockStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{enrollmentCount}</Text>
              <Text style={styles.statLabel}>Học viên</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{block.totalSessions}</Text>
              <Text style={styles.statLabel}>Buổi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{block.price}</Text>
              <Text style={styles.statLabel}>Giá</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: block.isActive ? "#10b981" : "#64748b" },
              ]}
            />
            <Text style={styles.statusText}>
              {block.isActive ? "Đang hoạt động" : "Đã lưu trữ"}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleScheduleBlock(block);
              }}
            >
              <Ionicons name="calendar-outline" size={16} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDuplicateBlock(block);
              }}
            >
              <Ionicons name="copy-outline" size={16} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleArchive(block);
              }}
            >
              <Ionicons
                name={
                  block.isActive
                    ? "archive-outline"
                    : "checkmark-circle-outline"
                }
                size={16}
                color="#64748b"
              />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khóa học</Text>
        <Text style={styles.headerSubtitle}>
          Tạo và quản lý chương trình đào tạo của bạn
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Tìm kiếm Khóa học..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {(
              [
                "All",
                "1.0",
                "1.5",
                "2.0",
                "2.5",
                "3.0",
                "3.5",
                "4.0",
                "4.5+",
              ] as SkillLevel[]
            ).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterChip,
                  skillLevel === level && styles.filterChipActive,
                ]}
                onPress={() => setSkillLevel(level)}
              >
                <Text
                  style={[
                    styles.filterText,
                    skillLevel === level && styles.filterTextActive,
                  ]}
                >
                  {level === "All" ? "Tất cả cấp độ" : `Cấp độ ${level}`}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.filterChip,
                showActiveOnly && styles.filterChipActive,
              ]}
              onPress={() => setShowActiveOnly(!showActiveOnly)}
            >
              <Text
                style={[
                  styles.filterText,
                  showActiveOnly && styles.filterTextActive,
                ]}
              >
                {showActiveOnly ? "Chỉ hoạt động" : "Tất cả trạng thái"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateBlock}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Tạo Khóa học</Text>
        </TouchableOpacity>
      </View>

      {/* Session Blocks List */}
      <FlatList
        data={filteredBlocks}
        keyExtractor={(item) => item.id}
        renderItem={renderBlockCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="library-outline" size={48} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>Không tìm thấy Khóa học nào</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || skillLevel !== "All" || showActiveOnly
                ? "Hãy thử điều chỉnh bộ lọc của bạn"
                : "Tạo chương trình đào tạo đầu tiên của bạn để bắt đầu"}
            </Text>
            {!searchQuery && skillLevel === "All" && !showActiveOnly && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleCreateBlock}
              >
                <Text style={styles.emptyButtonText}>Tạo Khóa học</Text>
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
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  // Search
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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

  // Filters
  filtersContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filtersRow: {
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
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  filterTextActive: {
    color: "#fff",
  },

  // Create Button
  createButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  createButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
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

  // Block Card
  blockCard: {
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
  cardHeader: {
    marginBottom: 12,
  },
  blockInfo: {
    marginBottom: 12,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 8,
  },
  blockMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  deliveryModeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryModeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  blockStats: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
});
