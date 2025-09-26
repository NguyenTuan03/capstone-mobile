import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DUPR_LEVELS = ["1.0-2.0", "2.5-3.0", "3.5-4.0", "4.5+"] as const;
type DuprLevel = (typeof DUPR_LEVELS)[number];
type Video = {
  id: string;
  title: string;
  skill: "Dink" | "Serve" | "Return" | "3rd Shot";
  level: DuprLevel;
  duration: number; // minutes
  thumb: string;
  progress?: number; // 0..1
  aiPick?: boolean;
};

const SKILLS = ["Dink", "Serve", "Return", "3rd Shot"] as const;

const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Dink: Control & Consistency",
    skill: "Dink",
    level: "2.5-3.0",
    duration: 12,
    thumb:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    aiPick: true,
    progress: 0.35,
  },
  {
    id: "v2",
    title: "Serve: Power vs Accuracy",
    skill: "Serve",
    level: "4.5+",
    duration: 14,
    thumb:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "v3",
    title: "Return: Placement for Advantage",
    skill: "Return",
    level: "3.5-4.0",
    duration: 10,
    thumb:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "v4",
    title: "3rd Shot: Drop Mechanics",
    skill: "3rd Shot",
    level: "3.5-4.0",
    duration: 16,
    thumb:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=1200&auto=format&fit=crop",
    aiPick: true,
  },
  {
    id: "v5",
    title: "Kitchen Footwork (Dink under pressure)",
    skill: "Dink",
    level: "2.5-3.0",
    duration: 9,
    thumb:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function RoadmapLibrary() {
  const params = useLocalSearchParams<{ skill?: string }>();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState<Video["skill"] | "All">("All");
  const [level, setLevel] = useState<DuprLevel | null>(null);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    // nếu mở từ roadmap item: /roadmap/library?skill=Dink
    const p = params.skill as Video["skill"] | undefined;
    if (p && (SKILLS as readonly string[]).includes(p)) setSkill(p);
  }, [params.skill]);

  const continueWatching = useMemo(
    () => VIDEOS.filter((v) => (v.progress ?? 0) > 0),
    [],
  );
  const aiPicks = useMemo(() => VIDEOS.filter((v) => v.aiPick), []);

  const list = useMemo(() => {
    return VIDEOS.filter((v) => {
      const hitQ = !q || v.title.toLowerCase().includes(q.trim().toLowerCase());
      const hitSkill = skill === "All" || v.skill === skill;
      const hitLevel = !level || v.level === level;
      return hitQ && hitSkill && hitLevel;
    });
  }, [q, skill, level]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
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
            Video Library
          </Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={st.h1}>LIBRARY</Text>
        <Text style={st.sub}>
          Video được AI đề xuất theo skill/level của bạn. Xem xong làm Quiz để
          cập nhật điểm Roadmap.
        </Text>

        {/* Search */}
        <View style={st.search}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search videos…"
            placeholderTextColor="#9ca3af"
            value={q}
            onChangeText={setQ}
            style={{ flex: 1, marginLeft: 8 }}
          />
          {!!q && (
            <Pressable onPress={() => setQ("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </Pressable>
          )}
        </View>

        {/* Filters */}
        <FlatList
          data={["All", ...SKILLS] as const}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => String(x)}
          contentContainerStyle={{ paddingVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSkill(item as any)}>
              <View
                style={[
                  st.chip,
                  skill === item && st.chipActive,
                  item === "All" && { marginRight: 6 },
                ]}
              >
                <Text style={[st.chipTxt, skill === item && st.chipTxtActive]}>
                  {String(item)}
                </Text>
              </View>
            </Pressable>
          )}
          ListFooterComponent={
            <View style={{ marginLeft: 8, flexDirection: "row" }}>
              {DUPR_LEVELS.map((L) => (
                <Pressable
                  key={L}
                  onPress={() => setLevel(level === L ? null : L)}
                  style={{ marginRight: 8 }}
                >
                  <View style={[st.lvl, level === L && st.lvlActive]}>
                    <Text style={[st.lvlTxt, level === L && st.lvlTxtActive]}>
                      {L}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          }
        />
      </View>

      {/* Body */}
      <FlatList
        data={list}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <>
            {/* Continue watching */}
            {continueWatching.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={st.secTitle}>Continue watching</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={continueWatching}
                  keyExtractor={(v) => "cw_" + v.id}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                  renderItem={({ item }) => <ContinueCard v={item} />}
                />
              </View>
            )}

            {/* For You (AI) */}
            {aiPicks.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={st.secTitle}>For You (AI)</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={aiPicks}
                  keyExtractor={(v) => "ai_" + v.id}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                  renderItem={({ item }) => <WideCard v={item} />}
                />
              </View>
            )}

            <Text style={st.secTitle}>All videos</Text>
          </>
        }
        renderItem={({ item }) => <VideoRow v={item} />}
        ListEmptyComponent={
          <View style={st.empty}>
            <Ionicons name="videocam-outline" size={22} color="#9ca3af" />
            <Text style={st.emptyTitle}>No videos</Text>
            <Text style={st.emptySub}>Thử đổi filter hoặc từ khoá.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ---------- Cards ---------- */
function ContinueCard({ v }: { v: Video }) {
  const pct = Math.round((v.progress ?? 0) * 100);
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(learner)/roadmap/library/[id]",
          params: { id: v.id },
        })
      }
    >
      <View style={st.cw}>
        <Image source={{ uri: v.thumb }} style={st.thumb} />
        <View style={st.cwBadge}>
          <Text style={st.cwBadgeTxt}>{pct}%</Text>
        </View>
        <View style={st.cwBar}>
          <View style={[st.cwFill, { width: `${pct}%` }]} />
        </View>
        <Text numberOfLines={1} style={st.title}>
          {v.title}
        </Text>
        <Text style={st.meta}>
          {v.skill} · {v.level} · {v.duration}m
        </Text>
      </View>
    </Pressable>
  );
}

function WideCard({ v }: { v: Video }) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(learner)/roadmap/library/[id]",
          params: { id: v.id },
        })
      }
    >
      <LinearGradient
        colors={["#f9fafb", "#eef2ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={st.wide}
      >
        <Image source={{ uri: v.thumb }} style={st.wideThumb} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text numberOfLines={1} style={st.title}>
            {v.title}
          </Text>
          <Text style={st.meta}>
            {v.skill} · {v.level} · {v.duration}m
          </Text>
          <View style={st.ai}>
            <Ionicons name="sparkles-outline" size={12} color="#111827" />
            <Text style={st.aiTxt}>AI pick</Text>
          </View>
        </View>
        <Ionicons name="play-circle" size={22} color="#111827" />
      </LinearGradient>
    </Pressable>
  );
}

function VideoRow({ v }: { v: Video }) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(learner)/roadmap/library/[id]",
          params: { id: v.id },
        })
      }
    >
      <View style={st.row}>
        <Image source={{ uri: v.thumb }} style={st.rowThumb} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text numberOfLines={2} style={st.title}>
            {v.title}
          </Text>
          <Text style={st.meta}>
            {v.skill} · {v.level} · {v.duration}m
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </View>
    </Pressable>
  );
}

/* ---------- styles ---------- */
const st: any = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: "900", color: "#111827" },
  sub: { color: "#6b7280", marginTop: 6, lineHeight: 18 },

  search: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipTxt: { color: "#111827", fontWeight: "800" },
  chipTxtActive: { color: "#fff" },

  lvl: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  lvlActive: { backgroundColor: "#111827", borderColor: "#111827" },
  lvlTxt: { fontWeight: "900", color: "#111827" },
  lvlTxtActive: { color: "#fff" },

  secTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },

  cw: { width: 200 },
  thumb: {
    width: 200,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  cwBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(17,24,39,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  cwBadgeTxt: { color: "#fff", fontWeight: "900", fontSize: 12 },
  cwBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    marginTop: 8,
    overflow: "hidden",
  },
  cwFill: { height: 4, backgroundColor: "#111827" },
  title: { fontWeight: "900", color: "#111827", marginTop: 6 },
  meta: { color: "#6b7280", marginTop: 2, fontSize: 12 },

  wide: {
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 1 },
    }),
  },
  wideThumb: {
    width: 90,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },

  row: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  rowThumb: {
    width: 96,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },

  empty: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  emptyTitle: { fontWeight: "900", color: "#111827", marginTop: 6 },
  emptySub: { color: "#6b7280", marginTop: 2, textAlign: "center" },
});
