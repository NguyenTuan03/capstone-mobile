import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DUPR_LEVELS = ["1.0-2.0", "2.5-3.0", "3.5-4.0", "4.5+"] as const;
const ALL = [
  ...DUPR_LEVELS,
  "Singles",
  "Doubles",
  "Dinking",
  "3rd Shot",
  "Footwork",
  "Strategy",
];

export default function Teaching() {
  const [selected, setSelected] = useState<string[]>(["Doubles", "Dinking"]);
  const [method, setMethod] = useState(
    "Game-based learning, focus on consistency and decision making.",
  );
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
      <Header title="Teaching Specialty & Methodology" />
      <View style={{ padding: 16 }}>
        <Text style={st.label}>Specialties</Text>
        <FlatList
          data={ALL}
          numColumns={3}
          keyExtractor={(x) => x}
          renderItem={({ item }) => {
            const active = selected.includes(item);
            return (
              <Pressable
                onPress={() =>
                  setSelected((prev) =>
                    active ? prev.filter((t) => t !== item) : [...prev, item],
                  )
                }
              >
                <View style={[st.chip, active && st.chipActive]}>
                  <Text style={[st.chipTxt, active && st.chipTxtActive]}>
                    {item}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        />

        <Text style={st.label}>Methodology</Text>
        <TextInput
          value={method}
          onChangeText={setMethod}
          multiline
          placeholder="Describe your approach…"
          placeholderTextColor="#9ca3af"
          style={st.input}
        />

        <Pressable style={st.primary} onPress={() => router.back()}>
          <Text style={st.primaryTxt}>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={{ color: "#6b7280" }}>‹ Back</Text>
      </Pressable>
      <View style={{ flex: 1 }} />
      <Text style={{ fontWeight: "900", color: "#111827" }}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const st = StyleSheet.create({
  label: {
    color: "#6b7280",
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 12,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
    minWidth: 100,
    alignItems: "center",
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipTxt: { color: "#111827", fontWeight: "800" },
  chipTxtActive: { color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    height: 140,
    textAlignVertical: "top",
  },
  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  primaryTxt: { color: "#fff", fontWeight: "900" },
});
