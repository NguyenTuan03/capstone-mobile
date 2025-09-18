import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Payouts() {
  const [connected, setConnected] = useState(false);
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
      <Header title="Payouts & Bank" />
      <View style={{ padding: 16 }}>
        <View style={st.card}>
          <Text style={st.kv}>Status</Text>
          <Text style={st.val}>
            {connected ? "Connected" : "Not connected"}
          </Text>
          <Pressable
            style={[st.primary, { marginTop: 12 }]}
            onPress={() => setConnected(true)}
          >
            <Ionicons name="link-outline" size={16} color="#fff" />
            <Text style={st.primaryTxt}>
              {connected ? "Manage on Stripe" : "Connect Stripe"}
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: "#6b7280", marginTop: 10 }}>
          Your payouts are processed securely via Stripe. Once connected, you
          can receive earnings directly to your bank.
        </Text>

        <Pressable
          style={[st.secondary, { marginTop: 14 }]}
          onPress={() => router.back()}
        >
          <Text style={st.secondaryTxt}>Done</Text>
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
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  kv: { color: "#6b7280", fontWeight: "800" },
  val: { fontWeight: "900", color: "#111827", marginTop: 2 },
  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryTxt: { color: "#fff", fontWeight: "900", marginLeft: 6 },
  secondary: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTxt: { color: "#111827", fontWeight: "900" },
});
