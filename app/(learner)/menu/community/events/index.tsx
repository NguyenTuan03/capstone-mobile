import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Event = {
  id: string;
  title: string;
  date: string; // ISO
  location: string;
  players: number;
  capacity: number;
  fee: number; // 0 = free
  tags: string[];
};

const EVENTS: Event[] = [
  {
    id: "e1",
    title: "Saturday Open Play",
    date: new Date(Date.now() + 86400000).toISOString(),
    location: "Crescent Court, Q.7",
    players: 10,
    capacity: 16,
    fee: 0,
    tags: ["Open Play", "Beginner Friendly"],
  },
  {
    id: "e2",
    title: "Doubles Ladder Night",
    date: new Date(Date.now() + 3 * 86400000).toISOString(),
    location: "Binh Thanh Court",
    players: 22,
    capacity: 24,
    fee: 50,
    tags: ["Doubles", "Ladder"],
  },
  {
    id: "e3",
    title: "Clinic: 3rd Shot Drop",
    date: new Date(Date.now() + 5 * 86400000).toISOString(),
    location: "Thu Duc Arena",
    players: 8,
    capacity: 12,
    fee: 120,
    tags: ["Clinic", "Technique"],
  },
];

export default function Events() {
  const insets = useSafeAreaInsets();
  const [filterFree, setFilterFree] = useState<boolean>(false);
  const data = useMemo(
    () => EVENTS.filter((e) => (filterFree ? e.fee === 0 : true)),
    [filterFree],
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      <TopTabs current="events" />
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={st.h1}>Events</Text>
        <Text style={st.sub}>Giải, open play, clinic quanh bạn</Text>

        {/* Quick filter */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Pressable
            onPress={() => setFilterFree((v) => !v)}
            style={[st.filter, filterFree && st.filterActive]}
          >
            <Ionicons
              name="pricetag-outline"
              size={16}
              color={filterFree ? "#fff" : "#111827"}
            />
            <Text style={[st.filterText, filterFree && st.filterTextActive]}>
              Free only
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <EventCard e={item} />}
      />
    </SafeAreaView>
  );
}

function EventCard({ e }: { e: Event }) {
  const d = new Date(e.date);
  const day = d.toLocaleString(undefined, { day: "2-digit" });
  const mon = d.toLocaleString(undefined, { month: "short" }).toUpperCase();
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/menu/community/events/[id]",
          params: { id: e.id },
        })
      }
    >
      <LinearGradient
        colors={["#f9fafb", "#eef2ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={st.eCard}
      >
        <View style={st.dateBox}>
          <Text style={st.dateDay}>{day}</Text>
          <Text style={st.dateMon}>{mon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={st.eTitle}>{e.title}</Text>
          <Text style={st.eSub}>{e.location}</Text>
          <View
            style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}
          >
            <Ionicons name="people-outline" size={16} color="#6b7280" />
            <Text style={st.eSub}>
              &nbsp;{e.players}/{e.capacity} ·{" "}
              {e.fee === 0 ? "Free" : `$${e.fee}`}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}
          >
            {e.tags.map((t) => (
              <View key={t} style={st.tag}>
                <Text style={st.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </LinearGradient>
    </Pressable>
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

  filter: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterActive: { backgroundColor: "#111827", borderColor: "#111827" },
  filterText: { marginLeft: 6, fontWeight: "700", color: "#111827" },
  filterTextActive: { color: "#fff" },

  eCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
  dateBox: {
    width: 52,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateDay: { color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 20 },
  dateMon: { color: "#cbd5e1", fontSize: 12, fontWeight: "700" },
  eTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  eSub: { color: "#6b7280" },
  tag: {
    backgroundColor: "#111827",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 6,
  },
  tagText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
