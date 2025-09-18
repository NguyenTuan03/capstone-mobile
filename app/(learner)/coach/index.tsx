import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Coach = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  price: number;
  location: string;
  specialties: string[];
};

const COACHES: Coach[] = [
  {
    id: "c1",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/200?img=12",
    rating: 4.9,
    price: 35,
    location: "District 1, HCMC",
    specialties: ["Dinking", "3rd Shot", "Strategy"],
  },
  {
    id: "c2",
    name: "Sophia Nguyen",
    avatar: "https://i.pravatar.cc/200?img=32",
    rating: 4.8,
    price: 25,
    location: "Thu Duc City",
    specialties: ["Serve", "Return", "Footwork"],
  },
  {
    id: "c3",
    name: "Liam Tran",
    avatar: "https://i.pravatar.cc/200?img=68",
    rating: 5,
    price: 40,
    location: "District 7, HCMC",
    specialties: ["Kitchen Readiness", "Doubles Tactics"],
  },
];

const SPECIALTIES = [
  "Dinking",
  "Serve",
  "3rd Shot",
  "Return",
  "Footwork",
  "Strategy",
] as const;
const PRICE_TIERS = ["$", "$$", "$$$"] as const;

export default function Coaches() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string | null>(null);
  const [tier, setTier] = useState<(typeof PRICE_TIERS)[number] | null>(null);
  const insets = useSafeAreaInsets();
  const data = useMemo(() => {
    return COACHES.filter(
      (c) =>
        (!q ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.location.toLowerCase().includes(q.toLowerCase())) &&
        (!spec || c.specialties.includes(spec)) &&
        (!tier ||
          (tier === "$"
            ? c.price <= 25
            : tier === "$$"
              ? c.price > 25 && c.price <= 35
              : c.price > 35)),
    );
  }, [q, spec, tier]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Hero */}
      <LinearGradient
        colors={["#18181b", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <View style={s.heroHeader}>
          <Text style={s.heroTitle}>Find your Coach</Text>
        </View>

        <Pressable
          onPress={() => router.push("/(learner)/coach/my-sessions" as any)}
          style={s.mySessionsBtn}
        >
          <Ionicons name="calendar-outline" size={18} color="#111827" />
          <Text style={s.mySessionsText}>My Sessions</Text>
          <Ionicons name="chevron-forward" size={14} color="#111827" />
        </Pressable>
        <Text style={s.heroSub}>
          Lọc theo vị trí, chuyên môn, giá — book lịch trong 30s.
        </Text>

        {/* Search */}
        <View style={s.searchWrap}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search coach or location..."
            placeholderTextColor="#9ca3af"
            value={q}
            onChangeText={setQ}
            style={s.searchInput}
          />
        </View>

        {/* Filters */}
        <View style={s.filters}>
          <ScrollChips
            items={SPECIALTIES as unknown as string[]}
            value={spec}
            onChange={setSpec}
            icon={(active: boolean) => (
              <MaterialIcons
                name="sports-tennis"
                size={14}
                color={active ? "#111" : "#6b7280"}
              />
            )}
          />
          <ScrollChips
            items={PRICE_TIERS as unknown as string[]}
            value={tier}
            onChange={setTier}
            icon={() => (
              <Ionicons name="cash-outline" size={14} color="#6b7280" />
            )}
          />
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(i: any) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }: { item: any }) => <CoachCard coach={item} />}
      />
    </SafeAreaView>
  );
}

function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Pressable
      onPress={() => router.push(`/(learner)/coach/${coach.id}` as any)}
      style={s.card}
    >
      <Image source={{ uri: coach.avatar }} style={s.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={s.name}>{coach.name}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          {renderStars(coach.rating)}
          <Text style={s.ratingText}>{coach.rating.toFixed(1)}</Text>
          <Text style={s.dot}>•</Text>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={s.locText}>{coach.location}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 8,
          }}
        >
          {coach.specialties.slice(0, 3).map((t) => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={s.price}>${coach.price}/h</Text>
        <Pressable
          onPress={() =>
            router.push(`/(learner)/coach/${coach.id}/book` as any)
          }
          style={s.bookBtn}
        >
          <Text style={s.bookText}>Book</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const arr = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <View style={{ flexDirection: "row", marginRight: 6 }}>
      {arr.map((f, i) => (
        <Ionicons
          key={i}
          name={f ? "star" : "star-outline"}
          size={14}
          color={f ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </View>
  );
}

function ScrollChips({
  items,
  value,
  onChange,
  icon,
}: {
  items: string[];
  value: string | null;
  onChange: (v: any) => void;
  icon?: (active: boolean) => React.ReactNode;
}) {
  return (
    <View style={{ flexDirection: "row", marginTop: 12 }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(i) => i}
        renderItem={({ item }) => {
          const active = value === item;
          return (
            <Pressable
              onPress={() => onChange(active ? null : item)}
              style={[s.chip, active && s.chipActive]}
            >
              <View style={{ marginRight: 6 }}>{icon?.(active)}</View>
              <Text style={[s.chipText, active && s.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroHeader: {
    marginBottom: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  mySessionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mySessionsText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  heroSub: { color: "#d1d5db", marginTop: 4 },
  searchWrap: {
    marginTop: 12,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  searchInput: { color: "#fff", marginLeft: 8, flex: 1 },
  filters: { marginTop: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: { backgroundColor: "#fff", borderColor: "#111" },
  chipText: { color: "#374151", fontWeight: "600" },
  chipTextActive: { color: "#111" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    gap: 12,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 8 },
  name: { fontSize: 16, fontWeight: "700", color: "#111827" },
  ratingText: { color: "#6b7280", marginLeft: 4, fontWeight: "700" },
  dot: { color: "#9ca3af", marginHorizontal: 6 },
  locText: { color: "#6b7280", marginLeft: 4 },
  tag: {
    backgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { color: "#111827", fontWeight: "600", fontSize: 12 },

  price: { fontWeight: "800", color: "#111827" },
  bookBtn: {
    marginTop: 8,
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bookText: { color: "#fff", fontWeight: "700" },
});
