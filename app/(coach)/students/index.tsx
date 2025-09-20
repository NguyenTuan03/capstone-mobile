import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
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

/** -------- Mock data (đổi sang API/Context sau) -------- */
export type Student = {
  id: string;
  name: string;
  avatar: string;
  dupr: number; // 2.0 - 8.0
  tags: string[]; // ["Beginner","Doubles"]
  nextSession?: { dateISO: string; mode: "online" | "offline"; place?: string };
  progress: number; // 0..1 completion of current plan
};

const STUDENTS: Student[] = [
  {
    id: "u1",
    name: "Tuấn",
    avatar: "https://i.pravatar.cc/150?img=15",
    dupr: 3.1,
    tags: ["Beginner", "Doubles"],
    nextSession: {
      dateISO: new Date(Date.now() + 36e5).toISOString(),
      mode: "online",
    },
    progress: 0.35,
  },
  {
    id: "u2",
    name: "Lan",
    avatar: "https://i.pravatar.cc/150?img=5",
    dupr: 3.9,
    tags: ["Intermediate", "Singles"],
    nextSession: {
      dateISO: new Date(Date.now() + 2 * 86400e3).toISOString(),
      mode: "offline",
      place: "Crescent Court",
    },
    progress: 0.6,
  },
  {
    id: "u3",
    name: "Huy",
    avatar: "https://i.pravatar.cc/150?img=12",
    dupr: 4.3,
    tags: ["Advanced", "Doubles"],
    progress: 0.12,
  },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
type Level = (typeof LEVELS)[number];

export default function StudentsList() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level | null>(null);

  const data = useMemo(() => {
    return STUDENTS.filter((s) => {
      const hitQ = !q || s.name.toLowerCase().includes(q.toLowerCase());
      const hitLevel = !level || s.tags.includes(level);
      return hitQ && hitLevel;
    });
  }, [q, level]);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={st.h1}>Students</Text>

        {/* Search */}
        <View style={st.search}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search by name"
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

        {/* Level filter */}
        <FlatList
          data={LEVELS as readonly string[]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => x}
          contentContainerStyle={{ paddingVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setLevel(level === item ? null : (item as Level))}
            >
              <View style={[st.chip, level === item && st.chipActive]}>
                <Text
                  style={[st.chipText, level === item && st.chipTextActive]}
                >
                  {item}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <StudentCard s={item} />}
        ListEmptyComponent={
          <View style={st.empty}>
            <Ionicons name="person-outline" size={22} color="#9ca3af" />
            <Text style={st.emptyTitle}>No students found</Text>
            <Text style={st.emptySub}>
              Try a different search or clear filters.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function StudentCard({ s }: { s: Student }) {
  const nextTxt = s.nextSession
    ? `${new Date(s.nextSession.dateISO).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · ${
        s.nextSession.mode === "online" ? "Online" : s.nextSession.place
      }`
    : "No upcoming session";
  const progressPct = Math.round(s.progress * 100);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(coach)/students/[id]" as any,
          params: { id: s.id },
        })
      }
    >
      <LinearGradient
        colors={["#f9fafb", "#eef2ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={st.card}
      >
        <Image source={{ uri: s.avatar }} style={st.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={st.name}>{s.name}</Text>
            <View style={st.duprPill}>
              <Ionicons name="podium-outline" size={12} color="#111827" />
              <Text style={st.duprTxt}> {s.dupr.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={st.sub}>{nextTxt}</Text>
          {/* tags */}
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            {s.tags.slice(0, 2).map((t) => (
              <View key={t} style={st.tag}>
                <Text style={st.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>
          {/* progress */}
          <View style={st.progressWrap}>
            <View style={[st.progressBar, { width: `${progressPct}%` }]} />
          </View>
          <Text style={st.progressTxt}>{progressPct}% plan completed</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </LinearGradient>
    </Pressable>
  );
}

/* -------- styles -------- */
const st = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "900", color: "#111827" },
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
  chipText: { color: "#111827", fontWeight: "700" },
  chipTextActive: { color: "#fff" },

  card: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  name: { fontSize: 16, fontWeight: "900", color: "#111827" },
  sub: { color: "#6b7280", marginTop: 2 },
  duprPill: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  duprTxt: { fontWeight: "800", color: "#111827", fontSize: 12 },
  tag: {
    backgroundColor: "#111827",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 6,
  },
  tagTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
  progressWrap: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: { height: 8, backgroundColor: "#111827" },
  progressTxt: { color: "#6b7280", fontSize: 12, marginTop: 4 },

  empty: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
  },
  emptyTitle: { fontWeight: "900", color: "#111827", marginTop: 6 },
  emptySub: { color: "#6b7280", marginTop: 2, textAlign: "center" },
});
