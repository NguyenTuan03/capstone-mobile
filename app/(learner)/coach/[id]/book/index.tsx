import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = ["06:30", "07:30", "09:00", "17:30", "19:00"];

export default function Book() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [d, setD] = useState<string | null>(days[0]);
  const [s, setS] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: insets.top,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "800" }}>Book with {id}</Text>

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
        onPress={() => {
          alert(`Booked ${d} ${s}`);
          router.back();
        }}
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
