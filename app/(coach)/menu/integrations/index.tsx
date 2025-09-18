import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PROVIDERS = ["Zoom", "Google Meet", "LiveKit/Agora"] as const;
type Provider = (typeof PROVIDERS)[number];

export default function Integrations() {
  const [prov, setProv] = useState<Provider>("LiveKit/Agora");
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
      <Header title="Integrations" />
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#6b7280", fontWeight: "800" }}>
          Video Conferencing
        </Text>
        <View style={{ marginTop: 10 }}>
          {PROVIDERS.map((p) => (
            <Pressable key={p} style={st.row} onPress={() => setProv(p)}>
              <Ionicons
                name={prov === p ? "radio-button-on" : "radio-button-off"}
                size={18}
                color="#111827"
              />
              <Text style={st.rowTxt}>{p}</Text>
            </Pressable>
          ))}
        </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rowTxt: { marginLeft: 8, fontWeight: "900", color: "#111827" },
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
