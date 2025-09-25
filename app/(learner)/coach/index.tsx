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
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <CoachCard coach={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <View style={s.headerContainer}>
            <LinearGradient
              colors={["#18181b", "#111827"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.hero}
            >
              <View style={s.heroHeader}>
                <Text style={s.heroTitle}>Find a Coach</Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/(learner)/coach/my-sessions" as any)
                }
                style={s.mySessionsBtn}
              >
                <Ionicons name="calendar-outline" size={18} color="#111827" />
                <Text style={s.mySessionsText}>My Sessions</Text>
                <Ionicons name="chevron-forward" size={14} color="#111827" />
              </Pressable>

              <Text style={s.heroSub}>
                Filter by location, specialty, and price — book a session in
                30s.
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
          </View>
        }
      />
    </SafeAreaView>
  );
}

function CoachCard({ coach }: { coach: Coach }) {
  const handleDetailPress = (e: any) => {
    e.stopPropagation();
    router.push(`/(learner)/coach/${coach.id}/detail` as any);
  };

  const handleBookPress = (e: any) => {
    e.stopPropagation();
    router.push(`/(learner)/coach/${coach.id}` as any);
  };

  return (
    <Pressable
      onPress={() => router.push(`/(learner)/coach/${coach.id}/detail` as any)}
      style={s.card}
    >
      {/* Avatar */}
      <Image source={{ uri: coach.avatar }} style={s.avatar} />

      {/* Info */}
      <View style={s.cardContent}>
        <Text style={s.name}>{coach.name}</Text>

        <View style={s.ratingRow}>
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text style={s.ratingText}>{coach.rating.toFixed(1)}</Text>
          <Text style={s.dot}>•</Text>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={s.locText}>{coach.location}</Text>
        </View>

        <View style={s.specialtiesRow}>
          {coach.specialties.slice(0, 3).map((specialty, index) => (
            <View key={specialty} style={s.tag}>
              <Text style={s.tagText}>{specialty}</Text>
            </View>
          ))}
        </View>

        {/* Price & Actions */}
        <View style={s.cardFooter}>
          <View style={s.priceContainer}>
            <Text style={s.price}>${coach.price}</Text>
            <Text style={s.priceUnit}>/hour</Text>
          </View>
          <View style={s.actionButtons}>
            <Pressable
              onPress={handleDetailPress}
              style={[s.actionBtn, s.detailBtn]}
            >
              <Text style={s.detailBtnText}>Detail</Text>
            </Pressable>
            <Pressable
              onPress={handleBookPress}
              style={[s.actionBtn, s.bookBtn]}
            >
              <Text style={s.bookBtnText}>Book</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
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
  headerContainer: {
    marginBottom: 16,
    marginHorizontal: -16, // Offset parent padding
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
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

  price: { fontWeight: "800", color: "#111827", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#f3f4f6",
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  specialtiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceUnit: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginLeft: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  detailBtn: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  detailBtnText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 12,
  },
  bookBtn: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
