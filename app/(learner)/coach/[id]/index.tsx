import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK = {
  c1: {
    cover:
      "https://images.unsplash.com/photo-1521417531099-7a2c1c0d3d0e?q=80&w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/200?img=12",
    name: "David Miller",
    rating: 4.9,
    price: 35,
    location: "District 1, HCMC",
    bio: "Former semi-pro. 6+ years coaching doubles tactics. Focus on dinks/3rd shot.",
    specialties: ["Dinking", "3rd Shot", "Strategy", "Defense"],
  },
  c2: {
    cover:
      "https://images.unsplash.com/photo-1549060279-7e168f61e26e?q=80&w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/200?img=32",
    name: "Sophia Nguyen",
    rating: 4.8,
    price: 25,
    location: "Thu Duc City",
    bio: "Footwork + serve/return optimization. Great for beginners→intermediates.",
    specialties: ["Serve", "Return", "Footwork"],
  },
  c3: {
    cover:
      "https://images.unsplash.com/photo-1508606572321-901ea443707f?q=80&w=1200&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/200?img=68",
    name: "Liam Tran",
    rating: 5,
    price: 40,
    location: "District 7, HCMC",
    bio: "Kitchen readiness and doubles strategy. High-intensity but fun.",
    specialties: ["Kitchen Readiness", "Doubles Tactics"],
  },
} as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["08:00", "09:30", "11:00", "14:00", "15:30", "19:00"];

export default function CoachProfile() {
  const { id } = useLocalSearchParams<{ id: keyof typeof MOCK }>();
  const data = useMemo(() => (id ? MOCK[id] : undefined), [id]);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  if (!data) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      <ImageBackground source={{ uri: data.cover }} style={s.cover}>
        <Pressable style={s.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
      </ImageBackground>

      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: -32 }}
        >
          <Image source={{ uri: data.avatar }} style={s.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={s.name}>{data.name}</Text>
            <Text style={s.meta}>
              ★ {data.rating.toFixed(1)} • ${data.price}/h • {data.location}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          {data.specialties.map((t) => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        <Text style={s.section}>About</Text>
        <Text style={s.bio}>{data.bio}</Text>

        <Text style={s.section}>Next 7 days</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DAYS}
          keyExtractor={(d) => d}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => setDay(index)}
              style={[s.dayChip, day === index && s.dayChipActive]}
            >
              <Text style={[s.dayText, day === index && s.dayTextActive]}>
                {item}
              </Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          contentContainerStyle={{ paddingBottom: 8 }}
        />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {TIMES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTime(t)}
              style={[s.timeChip, time === t && s.timeChipActive]}
            >
              <Text style={[s.timeText, time === t && s.timeTextActive]}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sticky CTA */}
      <View style={s.sticky}>
        <View>
          <Text style={{ fontWeight: "800", fontSize: 16 }}>
            ${data.price}/h
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 12 }}>
            {time ? `Selected ${DAYS[day]} ${time}` : "Pick a slot"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push(`/(learner)/coach/${id}/book` as any)}
          style={[s.cta, !time && { opacity: 0.5 }]}
          disabled={!time}
        >
          <Text style={s.ctaText}>Book session</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  cover: {
    height: 160,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    marginBottom: 8,
  },
  back: {
    position: "absolute",
    left: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: { fontSize: 20, fontWeight: "800", color: "#111827" },
  meta: { color: "#6b7280", marginTop: 2 },

  tag: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { color: "#111827", fontWeight: "600", fontSize: 12 },

  section: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "800",
    fontSize: 16,
    color: "#111827",
  },
  bio: { color: "#374151" },

  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dayChipActive: { backgroundColor: "#111", borderColor: "#111" },
  dayText: { color: "#111", fontWeight: "700" },
  dayTextActive: { color: "#fff" },

  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  timeChipActive: { backgroundColor: "#111" },
  timeText: { color: "#111", fontWeight: "700" },
  timeTextActive: { color: "#fff" },

  sticky: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cta: {
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaText: { color: "#fff", fontWeight: "800" },
});
