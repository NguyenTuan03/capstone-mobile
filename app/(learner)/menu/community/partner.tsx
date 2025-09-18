import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Player = {
  id: string;
  name: string;
  avatar: string;
  dupr: number; // 2.0 - 8.0
  location: string;
  distanceKm: number;
  availability: string[]; // ["Mon 19:00", "Sat 07:00"]
  tags: string[]; // ["Doubles","Serve"]
};

const DATA: Player[] = [
  {
    id: "p1",
    name: "Minh Pham",
    avatar: "https://i.pravatar.cc/150?img=1",
    dupr: 3.2,
    location: "Q.1, HCMC",
    distanceKm: 3.2,
    availability: ["Mon 19:00", "Sat 07:00"],
    tags: ["Doubles", "Dinking"],
  },
  {
    id: "p2",
    name: "Lan Tran",
    avatar: "https://i.pravatar.cc/150?img=5",
    dupr: 3.8,
    location: "Thu Duc",
    distanceKm: 9.4,
    availability: ["Tue 20:00", "Sun 08:00"],
    tags: ["3rd Shot", "Kitchen"],
  },
  {
    id: "p3",
    name: "Huy Le",
    avatar: "https://i.pravatar.cc/150?img=12",
    dupr: 4.1,
    location: "Phu Nhuan",
    distanceKm: 5.1,
    availability: ["Wed 18:30"],
    tags: ["Serve", "Footwork"],
  },
];

const ALL_TAGS = [
  "Doubles",
  "Singles",
  "Dinking",
  "3rd Shot",
  "Kitchen",
  "Serve",
  "Footwork",
];

export default function PartnerMatching() {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [maxKm, setMaxKm] = useState<number>(15);

  const data = useMemo(() => {
    return DATA.filter((p) => {
      const hitQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.location.toLowerCase().includes(q.toLowerCase());
      const hitTag = !tag || p.tags.includes(tag);
      const hitKm = p.distanceKm <= maxKm;
      return hitQ && hitTag && hitKm;
    });
  }, [q, tag, maxKm]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Tabs on top */}
      <TopTabs current="partner" />

      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={st.h1}>Partner Matching</Text>
        <Text style={st.sub}>Tìm bạn đánh chung theo trình độ & vị trí</Text>

        {/* Search */}
        <View style={st.search}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search by name or location"
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

        {/* Quick filters */}
        <FlatList
          data={ALL_TAGS}
          keyExtractor={(t) => t}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => setTag(tag === item ? null : item)}>
              <View style={[st.chip, tag === item && st.chipActive]}>
                <Text style={[st.chipText, tag === item && st.chipTextActive]}>
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
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <PartnerCard p={item} />}
      />
    </SafeAreaView>
  );
}

function PartnerCard({ p }: { p: Player }) {
  return (
    <LinearGradient
      colors={["#f9fafb", "#eef2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={st.cardWrap}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: p.avatar }} style={st.avatar} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={st.name}>{p.name}</Text>
          <Text style={st.meta}>
            {p.location} · {p.distanceKm}km · DUPR {p.dupr.toFixed(1)}
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}
          >
            {p.tags.slice(0, 3).map((t) => (
              <View key={t} style={st.tag}>
                <Text style={st.tagText}>{t}</Text>
              </View>
            ))}
          </View>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}
          >
            {p.availability.map((a) => (
              <View key={a} style={st.slot}>
                <Text style={st.slotText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pressable onPress={() => alert("Invite sent 🎾")} style={st.inviteBtn}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={st.inviteText}>Invite</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function TopTabs({ current }: { current: "partner" | "events" }) {
  return (
    <View style={st.topTabs}>
      <Pressable
        onPress={() => router.replace("/menu/community/partner")}
        style={[st.topTab, current === "partner" && st.topTabActive]}
      >
        <Text
          style={[st.topTabText, current === "partner" && st.topTabTextActive]}
        >
          Partner
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace("/menu/community/events")}
        style={[st.topTab, current === "events" && st.topTabActive]}
      >
        <Text
          style={[st.topTabText, current === "events" && st.topTabTextActive]}
        >
          Events
        </Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "800", color: "#111827" },
  sub: { color: "#6b7280", marginTop: 4 },
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

  cardWrap: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
  name: { fontSize: 16, fontWeight: "800", color: "#111827" },
  meta: { color: "#6b7280", marginTop: 2 },
  tag: {
    backgroundColor: "#111827",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 6,
  },
  tagText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  slot: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 6,
    marginTop: 6,
  },
  slotText: { color: "#111827", fontWeight: "700", fontSize: 12 },
  inviteBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 36,
  },
  inviteText: { color: "#fff", fontWeight: "800", marginLeft: 6 },

  topTabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
  },
  topTab: {
    flex: 1,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  topTabActive: { backgroundColor: "#111827" },
  topTabText: { color: "#111827", fontWeight: "700" },
  topTabTextActive: { color: "#fff" },
});
