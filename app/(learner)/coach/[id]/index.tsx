import { MOCK_COACHES } from "@/mocks/coaches";
import { MOCK_SESSION_BLOCKS } from "@/mocks/sessionBlocks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Map the coach IDs from the listing page to match mock coaches
const COACH_ID_MAP = {
  c1: "coach1",
  c2: "coach2",
  c3: "coach3",
};

export default function Book() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Get coach info and filter session blocks for this coach
  const mappedCoachId = COACH_ID_MAP[id as keyof typeof COACH_ID_MAP] || id;
  const coach = MOCK_COACHES.find((c) => c.id === mappedCoachId);
  const coachSessionBlocks = MOCK_SESSION_BLOCKS.filter(
    (block) => block.coachId === id && block.isActive,
  );

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlock(blockId);
    setSelectedSession(null); // Reset session selection when block changes
  };

  const handleEnroll = (blockId: string) => {
    const block = coachSessionBlocks.find((b) => b.id === blockId);
    if (!block) return;

    // Calculate price per session for better understanding
    const pricePerSession = Math.round(block.price / block.totalSessions);
    const sessionDuration = 60; // Default session duration in minutes

    Alert.alert(
      "Đăng Ký khóa học Đào Tạo",
      `📋 ${block.title}\n\n🎯 Trình độ: ${block.skillLevelFrom} - ${block.skillLevelTo}\n📅 ${block.totalSessions} buổi học trong ${block.duration} tuần\n⏱️ ${sessionDuration} phút mỗi buổi\n\n💰 Tổng cộng: ₫${(block.price * 25000).toLocaleString("vi-VN")} (₫${(pricePerSession * 25000).toLocaleString("vi-VN")}/buổi)\n\nSẵn sàng bắt đầu hành trình pickleball của bạn?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng Ký Ngay",
          onPress: () => {
            // Navigate to payment with enrollment details
            router.push({
              pathname: "/(learner)/payment",
              params: {
                blockId: blockId,
                coachId: id,
                price: block.price,
                title: block.title,
                totalSessions: block.totalSessions,
                duration: block.duration,
              },
            } as any);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 52,
      }}
    >
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: "rgba(107, 114, 128, 0.1)",
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Text style={{ fontWeight: "900", color: "#111827", fontSize: 18 }}>
            Đăng Ký khóa học
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Coach Info */}
        {coach && (
          <View style={st.coachInfo}>
            <View style={st.coachHeader}>
              <Image source={{ uri: coach.avatar }} style={st.coachAvatar} />
              <View style={st.coachDetails}>
                <Text style={st.coachName}>{coach.name}</Text>
                <Text style={st.coachHeadline}>{coach.headline}</Text>
                <View style={st.coachStats}>
                  <View style={st.coachStat}>
                    <Text style={st.coachStatValue}>{coach.rating} ★</Text>
                    <Text style={st.coachStatLabel}>
                      {coach.reviewCount} đánh giá
                    </Text>
                  </View>
                  <View style={st.coachStat}>
                    <Text style={st.coachStatValue}>{coach.experience}y</Text>
                    <Text style={st.coachStatLabel}>kinh nghiệm</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={st.coachSpecialties}>
              {coach.specialties.map((specialty, index) => (
                <View key={index} style={st.specialtyChip}>
                  <Text style={st.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>

            {coach.isVerified && (
              <View style={st.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#10b981" />
                <Text style={st.verifiedText}>Huấn luyện viên đã xác minh</Text>
              </View>
            )}

            {/* Certifications & Awards Section */}
            {coach.certifications && coach.certifications.length > 0 && (
              <View style={st.credentialsSection}>
                <View style={st.credentialsHeader}>
                  <Ionicons name="ribbon-outline" size={18} color="#3b82f6" />
                  <Text style={st.credentialsTitle}>Chứng chỉ</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={st.credentialsContainer}
                >
                  {coach.certifications
                    .filter((cert) => cert.status === "approved")
                    .map((cert) => (
                      <View key={cert.id} style={st.certificationCard}>
                        <View style={st.certificationIcon}>
                          <Ionicons
                            name="document-text-outline"
                            size={16}
                            color="#3b82f6"
                          />
                        </View>
                        <Text style={st.certificationName}>{cert.name}</Text>
                        <Text style={st.certificationOrg}>
                          {cert.issuingOrganization}
                        </Text>
                        <Text style={st.certificationYear}>
                          {new Date(cert.issueDate).getFullYear()}
                          {cert.expiryDate &&
                            ` - ${new Date(cert.expiryDate).getFullYear()}`}
                        </Text>
                      </View>
                    ))}
                </ScrollView>
              </View>
            )}

            {coach.awards && coach.awards.length > 0 && (
              <View style={st.credentialsSection}>
                <View style={st.credentialsHeader}>
                  <Ionicons name="trophy-outline" size={18} color="#f59e0b" />
                  <Text style={st.credentialsTitle}>
                    Giải thưởng & Danh hiệu
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={st.credentialsContainer}
                >
                  {coach.awards.map((award) => (
                    <View
                      key={award.id}
                      style={[st.certificationCard, st.awardCard]}
                    >
                      <View style={[st.certificationIcon, st.awardIcon]}>
                        <Ionicons
                          name="card-outline"
                          size={16}
                          color="#f59e0b"
                        />
                      </View>
                      <Text style={st.certificationName}>{award.title}</Text>
                      <Text style={st.certificationOrg}>
                        {award.organization}
                      </Text>
                      <Text style={st.certificationYear}>{award.year}</Text>
                      <View style={st.achievementBadge}>
                        <Text style={st.achievementText}>
                          {award.achievementLevel}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Selected Program Details */}
        {selectedBlock && (
          <View style={st.selectedProgramContainer}>
            <View style={st.selectedProgramHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={st.selectedProgramTitle}>khóa học đã chọn</Text>
            </View>

            {(() => {
              const block = coachSessionBlocks.find(
                (b) => b.id === selectedBlock,
              );
              if (!block) return null;

              const pricePerSession = Math.round(
                block.price / block.totalSessions,
              );

              return (
                <View style={st.selectedProgramDetails}>
                  <View style={st.selectedProgramInfo}>
                    <Text style={st.selectedProgramName}>{block.title}</Text>
                    <Text style={st.selectedProgramDescription}>
                      {block.description}
                    </Text>
                  </View>

                  <View style={st.selectedProgramStats}>
                    <View style={st.selectedProgramStat}>
                      <Text style={st.selectedProgramStatValue}>
                        {block.totalSessions}
                      </Text>
                      <Text style={st.selectedProgramStatLabel}>Buổi học</Text>
                    </View>
                    <View style={st.selectedProgramStat}>
                      <Text style={st.selectedProgramStatValue}>
                        {block.duration}
                      </Text>
                      <Text style={st.selectedProgramStatLabel}>Tuần</Text>
                    </View>
                    <View style={st.selectedProgramStat}>
                      <Text style={st.selectedProgramStatValue}>
                        ₫${(pricePerSession * 25000).toLocaleString("vi-VN")}
                      </Text>
                      <Text style={st.selectedProgramStatLabel}>Mỗi buổi</Text>
                    </View>
                  </View>

                  <View style={st.selectedProgramFeatures}>
                    <View style={st.selectedProgramFeature}>
                      <Ionicons
                        name="fitness-outline"
                        size={14}
                        color="#64748b"
                      />
                      <Text style={st.selectedProgramFeatureText}>
                        Trình độ {block.skillLevelFrom} - {block.skillLevelTo}
                      </Text>
                    </View>
                    <View style={st.selectedProgramFeature}>
                      <Ionicons
                        name={
                          block.deliveryMode === "online"
                            ? "videocam-outline"
                            : "location-outline"
                        }
                        size={14}
                        color="#64748b"
                      />
                      <Text style={st.selectedProgramFeatureText}>
                        {block.deliveryMode === "online"
                          ? "Trực tuyến"
                          : "Trực tiếp"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            <Pressable
              style={st.enrollButton}
              onPress={() => handleEnroll(selectedBlock)}
            >
              <View style={st.enrollButtonContent}>
                <Ionicons name="calendar-outline" size={16} color="#fff" />
                <Text style={st.enrollButtonText}>Đăng Ký khóa học Đầy Đủ</Text>
              </View>
              <Text style={st.enrollButtonPrice}>
                ₫$
                {(
                  (coachSessionBlocks.find((b) => b.id === selectedBlock)
                    ?.price || 0) * 25000
                ).toLocaleString("vi-VN")}
              </Text>
            </Pressable>
          </View>
        )}

        <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
          khóa học Đào Tạo Có Sẵn
        </Text>

        {coachSessionBlocks.length === 0 ? (
          <View style={st.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
            <Text style={st.emptyTitle}>Không có khóa học nào</Text>
            <Text style={st.emptySubtitle}>
              Huấn luyện viên hiện không có khung buổi học nào đang hoạt động.
            </Text>
          </View>
        ) : (
          <>
            <Text style={st.label}>Chọn khóa học Đào Tạo</Text>
            {coachSessionBlocks.map((block) => (
              <SessionBlockCard
                key={block.id}
                block={block}
                isSelected={selectedBlock === block.id}
                onSelect={() => handleBlockSelect(block.id)}
                pricePerSession={Math.round(block.price / block.totalSessions)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Session Block Card Component
function SessionBlockCard({
  block,
  isSelected,
  onSelect,
  pricePerSession,
}: {
  block: (typeof MOCK_SESSION_BLOCKS)[0];
  isSelected: boolean;
  onSelect: () => void;
  pricePerSession: number;
}) {
  return (
    <Pressable
      style={[st.blockCard, isSelected && st.blockCardSelected]}
      onPress={onSelect}
    >
      <View style={st.blockHeader}>
        <Text style={st.blockTitle}>{block.title}</Text>
        <View style={st.blockMeta}>
          <View>
            <Text style={st.blockPrice}>
              ₫${(block.price * 25000).toLocaleString("vi-VN")}
            </Text>
            <Text style={st.blockPricePerSession}>
              ₫${(pricePerSession * 25000).toLocaleString("vi-VN")}/buổi
            </Text>
          </View>
          <Text style={st.blockDuration}>{block.duration} tuần</Text>
        </View>
      </View>

      <Text style={st.blockDescription}>{block.description}</Text>

      <View style={st.blockStats}>
        <View style={st.statItem}>
          <Text style={st.statValue}>{block.totalSessions}</Text>
          <Text style={st.statLabel}>Buổi học</Text>
        </View>
        <View style={st.statItem}>
          <Text style={st.statValue}>
            {block.skillLevelFrom}-{block.skillLevelTo}
          </Text>
          <Text style={st.statLabel}>Trình độ</Text>
        </View>
        <View style={st.statItem}>
          <Text style={st.statValue}>{block.deliveryMode}</Text>
          <Text style={st.statLabel}>Hình thức</Text>
        </View>
      </View>

      <View style={st.blockLocation}>
        <Ionicons
          name={
            block.deliveryMode === "online" ? "globe-outline" : "pin-outline"
          }
          size={14}
          color="#64748b"
        />
        <Text style={st.locationText}>
          {block.deliveryMode === "online"
            ? block.meetingLink
            : block.courtAddress}
        </Text>
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "800",
    color: "#111827",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  // Session Block Card
  blockCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  blockCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  blockMeta: {
    alignItems: "flex-end",
  },
  blockPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  blockDuration: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  blockDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  blockStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
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
  blockLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 6,
    flex: 1,
  },

  // enrollButton: {
  //   backgroundColor: "#111827",
  //   borderRadius: 12,
  //   paddingVertical: 14,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginTop: 16,
  // },

  // Coach Info Section
  coachInfo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  coachHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  coachAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e5e7eb",
  },
  coachDetails: {
    flex: 1,
    marginLeft: 12,
  },
  coachName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  coachHeadline: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  coachStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coachStat: {
    alignItems: "center",
  },
  coachStatValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  coachStatLabel: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
  },
  coachSpecialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  specialtyChip: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10b981",
    marginLeft: 4,
  },
  // Credentials & Awards Styles
  credentialsSection: {
    marginTop: 16,
  },
  credentialsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  credentialsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 8,
  },
  credentialsContainer: {
    paddingHorizontal: 4,
  },
  certificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  awardCard: {
    borderColor: "#fef3c7",
    backgroundColor: "#fffbeb",
  },
  certificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  awardIcon: {
    backgroundColor: "#fef3c7",
  },
  certificationName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
    lineHeight: 16,
  },
  certificationOrg: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 4,
  },
  certificationYear: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500",
  },
  achievementBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  achievementText: {
    fontSize: 8,
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Selected Program Details Styles
  selectedProgramContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#10b981",
    marginBottom: 16,
    overflow: "hidden",
  },
  selectedProgramHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#10b981",
    gap: 8,
  },
  selectedProgramTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  selectedProgramDetails: {
    padding: 16,
  },
  selectedProgramInfo: {
    marginBottom: 16,
  },
  selectedProgramName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  selectedProgramDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  selectedProgramStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  selectedProgramStat: {
    alignItems: "center",
    flex: 1,
  },
  selectedProgramStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 2,
  },
  selectedProgramStatLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  selectedProgramFeatures: {
    gap: 8,
  },
  selectedProgramFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedProgramFeatureText: {
    fontSize: 12,
    color: "#64748b",
  },
  enrollButton: {
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  enrollButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  enrollButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  enrollButtonPrice: {
    color: "#fbbf24",
    fontWeight: "800",
    fontSize: 16,
  },
  blockPricePerSession: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
});
