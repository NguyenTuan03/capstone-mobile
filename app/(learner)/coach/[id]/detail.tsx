// app/(learner)/coach/[id]/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Methodology = {
  sessionStructure: {
    // cấu trúc 1 buổi
    warmup: string[];
    coreDrills: { name: string; goal: string; metric?: string }[];
    situationalPlay?: string[];
    cooldown?: string[];
  };
  teachingPrinciples: string[]; // triết lý/cách tiếp cận
  levelGuidelines: {
    // tiêu chí theo level
    level: "Beginner" | "Intermediate" | "Advanced";
    focus: string[];
    successCriteria: string[]; // tiêu chí đạt
  }[];
  equipment?: string[]; // dụng cụ cần
  safetyNotes?: string[]; // lưu ý an toàn
  videoFeedback?: { used: boolean; notes?: string }; // cách phản hồi bằng video
};

// TODO: move to a shared file, e.g. "@/modules/learner/data/coaches"
const COACHES = [
  {
    id: "c1",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/200?img=12",
    rating: 4.9,
    price: 35,
    location: "District 1, HCMC",
    specialties: ["Dinking", "3rd Shot", "Strategy"],
    methodology: {
      sessionStructure: {
        warmup: ["Footwork ladder 5’", "Soft dinks cross-court 5’"],
        coreDrills: [
          {
            name: "3rd Shot Drop Reps",
            goal: "Arc control to kitchen",
            metric: "8/10 in-bounds",
          },
          {
            name: "Dink Consistency",
            goal: "Low net clearance",
            metric: "50 continuous dinks",
          },
        ],
        situationalPlay: ["2v2 kitchen control", "Transition zone defense"],
        cooldown: ["Stretch calves/forearm 3’"],
      },
      teachingPrinciples: [
        "Game-based learning: drill → mini-game → game",
        "Quantified reps với KPI rõ ràng",
        "Video feedback cuối buổi để sửa form",
      ],
      levelGuidelines: [
        {
          level: "Beginner",
          focus: ["Serve/Return ổn định", "Basic dinks"],
          successCriteria: ["8/10 serve in", "20 dinks liên tục"],
        },
        {
          level: "Intermediate",
          focus: ["3rd shot drop", "Transition footwork"],
          successCriteria: ["60% drop thành công", "Ra/vào kitchen đúng nhịp"],
        },
        {
          level: "Advanced",
          focus: ["Shot selection & patterns", "Doules tactics"],
          successCriteria: [
            "Ra quyết định đúng ≥70%",
            "Kiểm soát kitchen >60% rally",
          ],
        },
      ],
      equipment: ["2–3 bóng game-ready", "Ladder", "Cones"],
      safetyNotes: ["Khởi động cổ tay/gối đủ", "Uống nước mỗi 15’"],
      videoFeedback: { used: true, notes: "Quay slow-mo dinking & 3rd shot" },
    } as Methodology,
  },
  {
    id: "c2",
    name: "Sophia Nguyen",
    avatar: "https://i.pravatar.cc/200?img=32",
    rating: 4.8,
    price: 25,
    location: "Thu Duc City",
    specialties: ["Serve", "Return", "Footwork"],
    methodology:
      "I use a combination of video analysis, drills, and live feedback to help learners improve their skills.",
    reviews: [
      {
        id: "r2",
        learner: "Jane Smith",
        date: "2024-02-01",
        rating: 4.5,
        comment:
          "Sophia is a great coach! She helped me improve my skills in no time.",
      },
    ],
  },
  {
    id: "c3",
    name: "Liam Tran",
    avatar: "https://i.pravatar.cc/200?img=68",
    rating: 5,
    price: 40,
    location: "District 7, HCMC",
    specialties: ["Kitchen Readiness", "Doubles Tactics"],
    methodology:
      "I use a combination of video analysis, drills, and live feedback to help learners improve their skills.",
    reviews: [
      {
        id: "r3",
        learner: "Mike Johnson",
        date: "2024-03-01",
        rating: 5,
        comment:
          "Liam is a great coach! He helped me improve my skills in no time.",
      },
    ],
  },
];

export default function CoachDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const coach = useMemo(() => COACHES.find((c) => c.id === id) || null, [id]);
  const insets = useSafeAreaInsets();
  if (!coach) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ padding: 16 }}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </Pressable>
          <Text style={styles.title}>Coach Detail</Text>
          <Text style={{ color: "#6b7280", marginTop: 8 }}>
            Coach not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f9fafb",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#6b7280" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={styles.title}>Coach Detail</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: coach.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{coach.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.rating}>{coach.rating.toFixed(1)}</Text>
                <Text style={styles.dot}>•</Text>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={styles.location}>{coach.location}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${coach.price}</Text>
              <Text style={styles.priceUnit}>/hour</Text>
            </View>
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsContainer}>
            {coach.specialties.map((specialty) => (
              <View key={specialty} style={styles.tag}>
                <Text style={styles.tagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>
            {coach.name} is an experienced pickleball coach specializing in{" "}
            {coach.specialties[0]} and modern doubles strategy. Sessions are
            tailored to your level with clear drills and video feedback.
          </Text>
        </View>

        {/* Teaching Methodology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teaching Methodology</Text>
          {typeof coach.methodology === "object" ? (
            <MethodologySection data={coach.methodology} />
          ) : (
            <Text style={styles.paragraph}>{coach.methodology}</Text>
          )}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learner Feedback</Text>
          <View style={styles.reviewsContainer}>
            {coach.reviews && coach.reviews.length > 0 ? (
              coach.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Ionicons name="person-circle" size={20} color="#9ca3af" />
                    <Text style={styles.reviewerName}>{review.learner}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.starsContainer}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < review.rating ? "star" : "star-outline"}
                        size={14}
                        color={i < review.rating ? "#f59e0b" : "#d1d5db"}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function MethodologySection({ data }: { data?: Methodology }) {
  const [open, setOpen] = useState<{ [k: string]: boolean }>({
    structure: true,
    principles: false,
    levels: false,
    equipment: false,
    safety: false,
    feedback: false,
  });
  if (!data) return null;

  const Row = ({ title, keyName, children }: any) => (
    <View style={{ marginTop: 12 }}>
      <Pressable
        onPress={() => setOpen((p) => ({ ...p, [keyName]: !p[keyName] }))}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={open[keyName] ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6b7280"
        />
      </Pressable>
      {open[keyName] ? <View style={{ marginTop: 4 }}>{children}</View> : null}
    </View>
  );

  const Bullet = ({ text }: { text: string }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 2,
      }}
    >
      <Text style={{ marginTop: 2, marginRight: 6 }}>•</Text>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.methodCard}>
      <Row title="Session Structure" keyName="structure">
        {data.sessionStructure?.warmup?.length ? (
          <>
            <Text style={styles.mutedBold}>Warm-up</Text>
            {data.sessionStructure.warmup.map((x, i) => (
              <Bullet key={`wu-${i}`} text={x} />
            ))}
          </>
        ) : null}

        {data.sessionStructure?.coreDrills?.length ? (
          <>
            <Text style={[styles.mutedBold, { marginTop: 8 }]}>
              Core Drills
            </Text>
            {data.sessionStructure.coreDrills.map((d, i) => (
              <View key={`cd-${i}`} style={{ marginBottom: 6 }}>
                <Text style={[styles.paragraph, { fontWeight: "700" }]}>
                  {d.name}
                </Text>
                <Text style={styles.paragraph}>Goal: {d.goal}</Text>
                {d.metric ? (
                  <Text style={[styles.paragraph, { color: "#059669" }]}>
                    Metric: {d.metric}
                  </Text>
                ) : null}
              </View>
            ))}
          </>
        ) : null}

        {data.sessionStructure?.situationalPlay?.length ? (
          <>
            <Text style={[styles.mutedBold, { marginTop: 8 }]}>
              Situational Play
            </Text>
            {data.sessionStructure.situationalPlay.map((x, i) => (
              <Bullet key={`sp-${i}`} text={x} />
            ))}
          </>
        ) : null}

        {data.sessionStructure?.cooldown?.length ? (
          <>
            <Text style={[styles.mutedBold, { marginTop: 8 }]}>Cool-down</Text>
            {data.sessionStructure.cooldown.map((x, i) => (
              <Bullet key={`cdl-${i}`} text={x} />
            ))}
          </>
        ) : null}
      </Row>

      <Row title="Teaching Principles" keyName="principles">
        {data.teachingPrinciples?.map((x, i) => (
          <Bullet key={`tp-${i}`} text={x} />
        ))}
      </Row>

      <Row title="Level Guidelines" keyName="levels">
        {data.levelGuidelines?.map((lv, i) => (
          <View key={`lv-${i}`} style={styles.levelBox}>
            <Text style={{ fontWeight: "800", color: "#111827" }}>
              {lv.level}
            </Text>
            <Text style={styles.mutedBold}>Focus</Text>
            {lv.focus.map((f, j) => (
              <Bullet key={`f-${i}-${j}`} text={f} />
            ))}
            <Text style={[styles.mutedBold, { marginTop: 6 }]}>
              Success Criteria
            </Text>
            {lv.successCriteria.map((c, j) => (
              <Bullet key={`c-${i}-${j}`} text={c} />
            ))}
          </View>
        ))}
      </Row>

      {data.equipment?.length ? (
        <Row title="Equipment" keyName="equipment">
          {data.equipment.map((x, i) => (
            <Bullet key={`eq-${i}`} text={x} />
          ))}
        </Row>
      ) : null}

      {(data.safetyNotes?.length ?? 0) > 0 ? (
        <Row title="Safety Notes" keyName="safety">
          {data.safetyNotes!.map((x, i) => (
            <Bullet key={`sn-${i}`} text={x} />
          ))}
        </Row>
      ) : null}

      <Row title="Video Feedback" keyName="feedback">
        {data.videoFeedback?.used ? (
          <>
            <Bullet text="Coach uses video for form review" />
            {data.videoFeedback?.notes ? (
              <Bullet text={data.videoFeedback.notes} />
            ) : null}
          </>
        ) : (
          <Text style={styles.paragraph}>Not used</Text>
        )}
      </Row>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(107,114,128,0.1)",
    width: 36,
    alignItems: "center",
  },
  title: {
    fontWeight: "900",
    color: "#111827",
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Space for bottom button
  },

  // Profile Section
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#f3f4f6",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#111827",
    fontWeight: "700",
    marginLeft: 4,
    fontSize: 14,
  },
  dot: {
    color: "#9ca3af",
    marginHorizontal: 6,
  },
  location: {
    color: "#6b7280",
    fontSize: 14,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    color: "#059669",
    fontWeight: "900",
    fontSize: 20,
  },
  priceUnit: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "500",
  },

  // Sections
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  // Tags
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
  },
  tagText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 12,
  },

  // Content
  paragraph: {
    color: "#374151",
    lineHeight: 22,
    fontSize: 14,
  },

  // Reviews
  reviewsContainer: {
    gap: 12,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#f3f4f6",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    color: "#111827",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  reviewDate: {
    color: "#6b7280",
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 2,
  },
  reviewComment: {
    color: "#374151",
    lineHeight: 20,
    fontSize: 14,
  },
  noReviews: {
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },

  // Bottom Button
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  // Methodology Section (keep existing styles)
  methodCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  levelBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#fafafa",
  },

  // Legacy styles for methodology component
  mutedBold: {
    color: "#6b7280",
    fontWeight: "700",
  },
  muted: {
    color: "#6b7280",
  },
});
