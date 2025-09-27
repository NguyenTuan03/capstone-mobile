import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { useBookings } from "@/modules/learner/context/bookingContext";
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
  location: string;
  specialties: string[];
};

const COACHES: Coach[] = [
  {
    id: "c1",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/200?img=12",
    rating: 4.9,
    location: "Quận 1, TP.HCM",
    specialties: ["Bóng dink", "Cú thứ ba", "Chiến thuật"],
  },
  {
    id: "c2",
    name: "Sophia Nguyen",
    avatar: "https://i.pravatar.cc/200?img=32",
    rating: 4.8,
    location: "Thủ Đức",
    specialties: ["Phát bóng", "Đón bóng", "Chuyển động chân"],
  },
  {
    id: "c3",
    name: "Liam Tran",
    avatar: "https://i.pravatar.cc/200?img=68",
    rating: 5,
    location: "Quận 7, TP.HCM",
    specialties: ["Sẵn sàng khu vực bếp", "Chiến thuật đôi"],
  },
];

const SPECIALTIES = [
  "Bóng dink",
  "Phát bóng",
  "Cú thứ ba",
  "Đón bóng",
  "Chuyển động chân",
  "Chiến thuật",
] as const;

export default function Coaches() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const data = useMemo(() => {
    return COACHES.filter(
      (c) =>
        (!q ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.location.toLowerCase().includes(q.toLowerCase())) &&
        (!spec || c.specialties.includes(spec)),
    );
  }, [q, spec]);

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
                <Text style={s.heroTitle}>Tìm Huấn Luyện Viên</Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/(learner)/coach/my-sessions" as any)
                }
                style={s.mySessionsBtn}
              >
                <Ionicons name="calendar-outline" size={18} color="#111827" />
                <Text style={s.mySessionsText}>Buổi Học Của Tôi</Text>
                <Ionicons name="chevron-forward" size={14} color="#111827" />
              </Pressable>

              <Text style={s.heroSub}>
                Lọc theo địa điểm và chuyên môn — đăng ký khóa học đào tạo trong
                30 giây.
              </Text>

              {/* Search */}
              <View style={s.searchWrap}>
                <Ionicons name="search" size={18} color="#6b7280" />
                <TextInput
                  placeholder="Tìm kiếm huấn luyện viên hoặc địa điểm..."
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

        {/* Actions */}
        <View style={s.cardFooter}>
          <View style={s.actionButtons}>
            <Pressable
              onPress={handleDetailPress}
              style={[s.actionBtn, s.detailBtn]}
            >
              <Text style={s.detailBtnText}>Xem Chi Tiết</Text>
            </Pressable>
            <Pressable
              onPress={handleBookPress}
              style={[s.actionBtn, s.bookBtn]}
            >
              <Text style={s.bookBtnText}>Xem khóa học</Text>
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
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  mySessionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  mySessionsText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  heroSub: {
    color: "#d1d5db",
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  searchWrap: {
    marginTop: 16,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  searchInput: {
    color: "#fff",
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  filters: { marginTop: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#374151",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  chipActive: { backgroundColor: "#fff", borderColor: "#111827" },
  chipText: { color: "#f3f4f6", fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: "#111827", fontWeight: "700" },

  name: { fontSize: 18, fontWeight: "700", color: "#111827" },
  ratingText: { color: "#6b7280", marginLeft: 4, fontWeight: "600" },
  dot: { color: "#d1d5db", marginHorizontal: 8 },
  locText: { color: "#6b7280", marginLeft: 4, fontSize: 14 },
  tag: {
    backgroundColor: "#f0f9ff",
    borderColor: "#0ea5e9",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { color: "#0369a1", fontWeight: "600", fontSize: 12 },

  price: { fontWeight: "800", color: "#111827", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#f0f9ff",
  },
  cardContent: {
    flex: 1,
    gap: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  specialtiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  detailBtn: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  detailBtnText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 13,
  },
  bookBtn: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
