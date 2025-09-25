// app/(learner)/home/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  Dimensions,
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
  SectionTitle,
  SkillCard,
  Stat,
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

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const { getUpcoming } = useBookings?.() ?? { getUpcoming: () => [] as any[] };
  const next = useMemo(() => getUpcoming?.()[0], [getUpcoming]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + insets.bottom }}
      >
        {/* ---------- HERO ---------- */}
        <View style={{ height: HERO_H }}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
            }}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
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

              {/* CTA */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <PrimaryButton title="✨ AI ANALYZER" onPress={() => {}} />
                <OutlineButton title="VIEW ROADMAP" onPress={() => {}} light />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* ---------- BODY ---------- */}
        <View style={styles.bodyCard}>
          {/* NEXT SESSION */}
          <SectionTitle title="NEXT SESSION" caption="Your next session" />
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
          <View style={{ marginTop: 18, marginBottom: 18 }}>
            <OutlineButton title="View Full Roadmap" onPress={() => {}} />
          </View>

          <DividerCurve />

          {/* LATEST FILM */}
          <SectionTitle
            title="LATEST FILM"
            caption="See below your latest film upload. Tap to play and review your coach's feedback."
          />
          <EmptyFilmCard onUpload={() => {}} onViewAll={() => {}} />

          {/* Badges */}
          <SectionTitle title="ACHIEVEMENTS" caption="Keep the streak!" />
          <BadgesRow />
        </View>
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
          you don&apos;t have a session — book one now!
        </Text>
        <Pressable style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>Find a Coach</Text>
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
    paddingBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#A700FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 28 },
  name: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },

  bodyCard: {
    marginTop: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 60,
  },

  nextWrap: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  nextText: { color: "#374151", fontWeight: "700", marginLeft: 6, flex: 1 },
  nextBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#111827",
  },
  nextBtnText: { color: "#fff", fontWeight: "800" },

  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    marginTop: 8,
    marginBottom: 12,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontWeight: "800", marginLeft: 6 },
});
