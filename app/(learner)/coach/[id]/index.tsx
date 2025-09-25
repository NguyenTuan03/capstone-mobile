import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// helper: convert "Mon"+"07:30" -> ISO of the next coming day
const dayIdx: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};
function nextDateISO(weekday: string, hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  const delta = (dayIdx[weekday] - now.getDay() + 7) % 7 || 7; // next occurrence
  target.setDate(now.getDate() + delta);
  target.setHours(h, m, 0, 0);
  return target.toISOString();
}

const days = ["Mon", "Wed", "Thu", "Sat"];
const slots = ["06:30", "17:30", "19:00"];

export default function Book() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [d, setD] = useState<string | null>(days[0]);
  const [s, setS] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const onConfirm = () => {
    router.replace(`/(learner)/payment` as any);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
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
          Book Session
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
        Book with Coach {id}
      </Text>
      <Text style={st.label}>Select Day</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {days.map((x) => (
          <Pressable
            key={x}
            onPress={() => setD(x)}
            style={[st.pill, d === x && st.pillActive]}
          >
            <Text style={[st.pillText, d === x && st.pillTextActive]}>{x}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={st.label}>Select Time</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {slots.map((x) => (
          <Pressable
            key={x}
            onPress={() => setS(x)}
            style={[st.slot, s === x && st.slotActive]}
          >
            <Text style={[st.slotText, s === x && st.slotTextActive]}>{x}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        disabled={!s || !d}
        onPress={onConfirm}
        style={[st.cta, (!s || !d) && { opacity: 0.5 }]}
      >
        <Text style={st.ctaText}>Confirm Booking</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "800",
    color: "#111827",
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
    marginBottom: 8,
  },
  pillActive: { backgroundColor: "#111827", borderColor: "#111827" },
  pillText: { color: "#111827", fontWeight: "700" },
  pillTextActive: { color: "#fff" },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
    marginBottom: 8,
  },
  slotActive: { backgroundColor: "#111827", borderColor: "#111827" },
  slotText: { color: "#111827", fontWeight: "700" },
  slotTextActive: { color: "#fff" },
  cta: {
    marginTop: 24,
    backgroundColor: "#111827",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#fff", fontWeight: "800" },
});
