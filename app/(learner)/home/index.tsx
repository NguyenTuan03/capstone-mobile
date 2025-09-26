// app/(learner)/home/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Rect } from "react-native-svg";

import { useBookings } from "@/modules/learner/context/bookingContext"; // <- context đã làm ở trên
import {
  DividerCurve,
  EmptyFilmCard,
  OutlineButton,
  PrimaryButton,
  RoadmapButton,
  SectionTitle,
  SkillCard,
  Stat,
  VideoCardWithAI,
} from "@/modules/learner/home";

const { height: H } = Dimensions.get("window");
const HERO_H = Math.round(H * 0.5);

const skills = [
  "Serve",
  "Return",
  "Non Bounce Volley",
  "Dinking",
  "3rd Shot Drop",
  "Kitchen Readiness",
  "Court Position",
  "Partner Chemistry",
];

const sampleVideos = [
  {
    id: "1",
    title: "Pickleball Practice Session - Backhand Returns",
    thumbnail:
      "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
    duration: "3:45",
    date: "2 days ago",
    aiAnalysis: {
      overallScore: 85,
      keyInsights: [
        "Strong footwork",
        "Consistent contact point",
        "Good body rotation",
      ],
      recommendations: [
        "Focus on follow-through",
        "Increase racquet head speed",
      ],
      strengths: ["Excellent timing", "Solid stance"],
      areasForImprovement: ["Backswing too early", "Weight transfer"],
    },
  },
  {
    id: "2",
    title: "Dinking Practice - Kitchen Line Drills",
    thumbnail:
      "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
    duration: "5:12",
    date: "1 week ago",
    aiAnalysis: {
      overallScore: 72,
      keyInsights: ["Good touch", "Patient play", "Shot variety"],
      recommendations: ["Lower center of gravity", "Better net clearance"],
      strengths: ["Soft hands", "Shot placement"],
      areasForImprovement: ["Footwork at kitchen", "Consistency"],
    },
  },
];

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const { getUpcoming } = useBookings?.() ?? { getUpcoming: () => [] as any[] };
  const next = useMemo(() => getUpcoming?.()[0], [getUpcoming]);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + insets.bottom }}
      >
        {/* ---------- HERO ---------- */}
        <Animated.View
          style={{
            height: HERO_H,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ImageBackground
            source={{
              uri: "https://i0.wp.com/www.lkldnow.com/wp-content/uploads/2025/07/social_1200x630_HFHP_pickleball_03.jpg?fit=1200%2C630&ssl=1",
            }}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.1)",
                "rgba(0,0,0,0.4)",
                "rgba(0,0,0,0.75)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.heroGrad}
            >
              {/* Avatar + Name */}
              <View style={{ alignItems: "center", marginBottom: 12 }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>TN</Text>
                </View>
                <Text style={styles.name}>TUAN</Text>
              </View>

              {/* 3 stats */}
              <View style={styles.statsRow}>
                <Stat label="DUPR" value="NR +" sub="Not Rated" />
                <Stat label="Your DUPR Goal" value="NR" sub="Not Rated" />
                <Stat label="DUPR Coach" value="David" emphasis />
              </View>

              {/* Achievements */}
              <View style={{ marginBottom: 16 }}>
                <BadgesRow />
              </View>

              {/* CTA */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <PrimaryButton title="✨ AI ANALYZER" onPress={() => {}} />
                <OutlineButton title="VIEW ROADMAP" onPress={() => {}} light />
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        {/* ---------- BODY ---------- */}
        <Animated.View
          style={[
            styles.bodyCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* NEXT SESSION */}
          <SectionTitle
            title="NEXT SESSION"
            caption="Buổi học sắp tới của bạn"
          />
          <NextSessionCard session={next} />

          {/* DUPR SKILLS */}
          <SectionTitle
            title="Personal Skills"
            caption={`See below your scores for your game areas. Your coach has\nrated each area on a DUPR scale of 2 to 8.`}
          />
          <View style={styles.skillGrid}>
            {skills.map((label) => (
              <SkillCard key={label} label={label} value="0.0" />
            ))}
          </View>

          {/* Week progress */}
          <SectionTitle
            title="WEEKLY PROGRESS"
            caption="Practice minutes in the last 7 days"
          />
          <WeekBarChart data={[20, 0, 35, 50, 15, 60, 30]} />

          {/* View full roadmap */}
          <RoadmapButton onPress={() => {}} />

          <DividerCurve />

          {/* LATEST FILM */}
          <SectionTitle
            title="LATEST FILM"
            caption="See below your latest film upload with AI-powered analysis and insights."
          />
          {sampleVideos.map((video) => (
            <VideoCardWithAI key={video.id} video={video} onPress={() => {}} />
          ))}

          {/* Upload More Button */}
          <View
            style={{ alignItems: "center", marginTop: 8, marginBottom: 16 }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: "#F3F4F6",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color="#6b7280" />
              <Text
                style={{ color: "#6b7280", fontWeight: "600", fontSize: 14 }}
              >
                Upload More Videos
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Components ---------------- */

function NextSessionCard({ session }: { session?: any }) {
  if (!session) {
    return (
      <LinearGradient
        colors={["#f9fafb", "#eef2ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.nextWrap}
      >
        <Ionicons name="calendar-outline" size={20} color="#4b5563" />
        <Text style={styles.nextText}>
          Bạn chưa có lịch — đặt buổi học ngay!
        </Text>
        <Pressable style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>Find Coach</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  const from = new Date(session.startAt);
  const to = new Date(session.endAt);
  const time = `${from.toLocaleDateString()} • ${from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}–${to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <LinearGradient
      colors={["#111827", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.nextWrap, { backgroundColor: "#111827" }]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="person-circle" size={22} color="#fff" />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            {session.coachName}
          </Text>
          <Text style={{ color: "#cbd5e1", marginTop: 2 }}>{time}</Text>
        </View>
      </View>
      <Pressable style={[styles.nextBtn, { backgroundColor: "#fff" }]}>
        <Text style={[styles.nextBtnText, { color: "#111827" }]}>Join</Text>
      </Pressable>
    </LinearGradient>
  );
}

function WeekBarChart({ data }: { data: number[] }) {
  const W = 320;
  const H = 80;
  const pad = 12;
  const barW = (W - pad * 2) / (data.length * 1.6);
  const max = Math.max(...data, 1);

  return (
    <View style={styles.chartCard}>
      <Svg width="100%" height={H}>
        {data.map((v, i) => {
          const h = (v / max) * (H - 20);
          const x = pad + i * barW * 1.6;
          const y = H - h - 8;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={6}
              ry={6}
              fill="#111827"
              opacity={0.85}
            />
          );
        })}
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 4,
          marginTop: 4,
        }}
      >
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <Text
            key={`${d}-${i}`}
            style={{
              color: "#6b7280",
              fontSize: 12,
              width: 18,
              textAlign: "center",
            }}
          >
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}

function BadgesRow() {
  const items = [
    {
      id: "streak",
      label: "7-Day Streak",
      icon: "flame" as const,
      from: ["#f97316", "#fb923c"],
    },
    {
      id: "uploads",
      label: "5 Uploads",
      icon: "cloud-upload-outline" as const,
      from: ["#0ea5e9", "#38bdf8"],
    },
    {
      id: "first",
      label: "First Session",
      icon: "sparkles-outline" as const,
      from: ["#a78bfa", "#c4b5fd"],
    },
  ];
  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      renderItem={({ item }) => (
        <LinearGradient
          colors={item.from as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}
        >
          <Ionicons name={item.icon} size={16} color="#fff" />
          <Text style={styles.badgeText}>{item.label}</Text>
        </LinearGradient>
      )}
    />
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  heroGrad: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 28,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  name: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 12,
    letterSpacing: 1.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },

  bodyCard: {
    marginTop: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  nextWrap: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  nextText: {
    color: "#374151",
    fontWeight: "700",
    marginLeft: 6,
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  nextBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#fafafa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "800",
    marginLeft: 6,
    fontSize: 13,
  },
});
