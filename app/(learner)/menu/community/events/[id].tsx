import React from "react";
import { SafeAreaView, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
      <Pressable onPress={() => router.back() as any}>
        <Text style={{ color: "#6b7280" }}>‹ Back</Text>
      </Pressable>
      <Text style={{ fontSize: 22, fontWeight: "800", marginTop: 8 }}>
        Event #{id}
      </Text>
      <Text style={{ color: "#6b7280", marginTop: 6 }}>
        Date · Time · Location · Description…
      </Text>
      <Pressable
        onPress={() => router.back() as any}
        style={{
          backgroundColor: "#111827",
          height: 48,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Register</Text>
      </Pressable>
    </SafeAreaView>
  );
}
