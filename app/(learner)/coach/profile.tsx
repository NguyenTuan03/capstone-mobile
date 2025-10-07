// CoachProfileViewRN.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Coach = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  students: number;
  price: number;
  priceOnline: number;
  specialty: string;
  location: string;
  bio: string;
  experience: string;
  certifications: string[];
  languages: string[];
  teachingStyle: string;
  availability: string[];
  courses: {
    id: number;
    title: string;
    students: number;
    rating: number;
    lessons: number;
  }[];
  onlineAvailable: boolean;
  offlineAvailable: boolean;
  courts: string[];
};

const MOCK_COACHES: Coach[] = [
  {
    id: 1,
    name: "Coach John Smith",
    avatar: "J",
    rating: 4.9,
    reviews: 156,
    students: 342,
    price: 40,
    priceOnline: 35,
    specialty: "Beginner Training",
    location: "District 1, HCMC",
    bio: "Certified pickleball instructor with 10+ years of experience. Specialized in helping beginners build strong fundamentals.",
    experience: "10 years",
    certifications: [
      "IPTPA Certified",
      "PPR Certified Coach",
      "First Aid Certified",
    ],
    languages: ["English", "Vietnamese"],
    teachingStyle:
      "Patient and encouraging, focusing on proper technique and gradual progression",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    courses: [
      {
        id: 1,
        title: "Beginner Basics",
        students: 1245,
        rating: 4.8,
        lessons: 12,
      },
      {
        id: 2,
        title: "Serving Masterclass",
        students: 456,
        rating: 4.7,
        lessons: 8,
      },
    ],
    onlineAvailable: true,
    offlineAvailable: true,
    courts: ["Saigon Sports Club", "Phu My Hung Courts"],
  },
];

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    user: "Nguyen Van A",
    avatar: "A",
    rating: 5,
    comment: "Best coach ever! Very patient and knowledgeable.",
  },
  {
    id: 2,
    user: "Tran Thi B",
    avatar: "B",
    rating: 5,
    comment: "Improved my game significantly in just 3 months.",
  },
];

export default function CoachProfileViewRN() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const coach = useMemo(() => {
    const cid = Number(id);
    return MOCK_COACHES.find((c) => c.id === cid) ?? MOCK_COACHES[0];
  }, [id]);
  const testimonials = MOCK_TESTIMONIALS;

  const handleBack = () => router.back();
  const handleBook = () =>
    router.push(`/(learner)/coach/booking?id=${coach.id}` as any);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 50,
        paddingBottom: insets.bottom + 50,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backRow}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#4B5563" />
          <Text style={styles.backText}>Back to Coaches</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <LinearGradient
        colors={["#fb923c", "#ef4444"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerRow}>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>{coach.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerName}>{coach.name}</Text>
            <Text style={styles.bannerSub}>{coach.specialty}</Text>
            <View style={styles.bannerStats}>
              <View style={styles.ratingChip}>
                <Feather name="star" size={16} color="#facc15" />
                <Text style={styles.ratingChipText}>{coach.rating}</Text>
              </View>
              <Text style={styles.bannerStatText}>{coach.reviews} reviews</Text>
              <Text style={styles.bannerStatText}>
                • {coach.students} students
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.paragraph}>{coach.bio}</Text>

          <View style={styles.grid2}>
            <View style={styles.gridCell}>
              <Text style={styles.labelXs}>Experience</Text>
              <Text style={styles.valueSm}>{coach.experience}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.labelXs}>Location</Text>
              <Text style={styles.valueSm}>{coach.location}</Text>
            </View>
            <View style={[styles.gridCell, { width: "100%" }]}>
              <Text style={styles.labelXs}>Languages</Text>
              <Text style={styles.valueSm}>{coach.languages.join(", ")}</Text>
            </View>
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.card}>
          <View style={styles.rowGap8}>
            <Feather name="award" size={20} color="#059669" />
            <Text style={styles.cardTitle}>Certifications</Text>
          </View>
          <View style={{ gap: 8, marginTop: 8 }}>
            {coach.certifications.map((cert, idx) => (
              <View key={idx} style={styles.rowGap6}>
                <Feather name="check-circle" size={16} color="#059669" />
                <Text style={styles.textSm}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Teaching Style */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Teaching Style</Text>
          <Text style={styles.paragraph}>{coach.teachingStyle}</Text>
        </View>

        {/* Session Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Options</Text>
          <View style={{ gap: 12, marginTop: 8 }}>
            {coach.onlineAvailable && (
              <View
                style={[
                  styles.optionBox,
                  { borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" },
                ]}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.rowGap8}>
                    <Feather name="monitor" size={20} color="#2563EB" />
                    <Text style={styles.bold}>Online Session</Text>
                  </View>
                  <Text style={[styles.rateInline, { color: "#2563EB" }]}>
                    ${coach.priceOnline}/hr
                  </Text>
                </View>
                <Text style={styles.hintBlue}>
                  Video call via integrated platform
                </Text>
              </View>
            )}
            {coach.offlineAvailable && (
              <View
                style={[
                  styles.optionBox,
                  { borderColor: "#A7F3D0", backgroundColor: "#ECFDF5" },
                ]}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.rowGap8}>
                    <Feather name="map-pin" size={20} color="#059669" />
                    <Text style={styles.bold}>Offline Session</Text>
                  </View>
                  <Text style={[styles.rateInline, { color: "#059669" }]}>
                    ${coach.price}/hr
                  </Text>
                </View>
                <Text style={styles.hintGreen}>
                  Available courts: {coach.courts.join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Availability</Text>
          <View style={styles.daysWrap}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
              const active = coach.availability.includes(d);
              return (
                <View
                  key={d}
                  style={[
                    styles.dayPill,
                    active
                      ? { backgroundColor: "#DCFCE7" }
                      : { backgroundColor: "#F3F4F6" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayPillText,
                      active ? { color: "#15803D" } : { color: "#9CA3AF" },
                    ]}
                  >
                    {d}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Created Courses */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Created Courses</Text>
          <View style={{ gap: 8 }}>
            {coach.courses.map((c) => (
              <View key={c.id} style={styles.courseCell}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textSmBold}>{c.title}</Text>
                  <View style={styles.rowGap8}>
                    <Text style={styles.metaXs}>{c.students} students</Text>
                    <Text style={styles.metaXs}>•</Text>
                    <Text style={styles.metaXs}>{c.lessons} lessons</Text>
                    <Text style={styles.metaXs}>•</Text>
                    <View style={styles.rowGap4}>
                      <Feather name="star" size={12} color="#fbbf24" />
                      <Text style={styles.metaXs}>{c.rating}</Text>
                    </View>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="#9CA3AF" />
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.card}>
          <View style={styles.rowGap8}>
            <Feather name="message-square" size={20} color="#EA580C" />
            <Text style={styles.cardTitle}>Student Testimonials</Text>
          </View>
          <View style={{ gap: 12, marginTop: 8 }}>
            {testimonials.map((t) => (
              <View key={t.id} style={styles.testCell}>
                <View style={styles.testTop}>
                  <View style={styles.testAvatar}>
                    <Text style={styles.testAvatarText}>{t.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.textSmBold}>{t.user}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Feather
                        key={i}
                        name="star"
                        size={12}
                        color={i < t.rating ? "#fbbf24" : "#D1D5DB"}
                        style={{ marginLeft: 2 }}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.textSm}>{t.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Book button (floating box mimic) */}
        <View style={styles.bookBox}>
          <TouchableOpacity
            onPress={handleBook}
            style={styles.primaryBtn}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Book a Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontSize: 14 },

  banner: { padding: 24 },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  bannerAvatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bannerAvatarText: { color: "#EA580C", fontWeight: "800", fontSize: 40 },
  bannerName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  bannerSub: { color: "#fff", opacity: 0.9, marginTop: 2 },
  bannerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingChipText: { color: "#fff", fontWeight: "800" },
  bannerStatText: { color: "#fff" },

  // Card & text
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },
  paragraph: { color: "#374151", fontSize: 14, lineHeight: 20 },

  // Grid
  grid2: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  gridCell: { width: "48%" },
  labelXs: { color: "#6B7280", fontSize: 12, marginBottom: 2 },
  valueSm: { fontSize: 14, fontWeight: "600" },

  // Session options
  rowGap8: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowGap6: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowGap4: { flexDirection: "row", alignItems: "center", gap: 4 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bold: { fontWeight: "700", color: "#111827" },
  rateInline: { fontWeight: "800", fontSize: 18 },
  optionBox: { borderWidth: 1, borderRadius: 10, padding: 12 },
  hintBlue: { color: "#1D4ED8", fontSize: 12, marginTop: 6 },
  hintGreen: { color: "#047857", fontSize: 12, marginTop: 6 },

  // Availability
  daysWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  dayPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  dayPillText: { fontWeight: "600", fontSize: 13 },

  // Courses
  courseCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textSm: { color: "#111827", fontSize: 14 },
  textSmBold: { color: "#111827", fontSize: 14, fontWeight: "700" },
  metaXs: { color: "#6B7280", fontSize: 12 },

  // Testimonials
  testCell: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  testTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  testAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  testAvatarText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // Book box
  bookBox: {
    borderWidth: 2,
    borderColor: "#10B981",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  primaryBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
