import React from "react";
import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function PaymentSuccess() {
  const insets = useSafeAreaInsets();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      <View style={{ padding: 16, alignItems: "center" }}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={64} color="#10b981" />
        </View>
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.sub}>
          Your booking {sessionId ? `#${sessionId}` : ""} is confirmed.
        </Text>

        <Pressable
          onPress={() => router.replace("/(learner)/coach/my-sessions" as any)}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>Go to My Sessions</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(learner)" as any)}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconWrap: { marginTop: 24, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "900", color: "#111827", marginTop: 4 },
  sub: { color: "#6b7280", marginTop: 6, textAlign: "center" },
  cta: {
    marginTop: 24,
    backgroundColor: "#111827",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  ctaText: { color: "#fff", fontWeight: "800" },
  secondary: { marginTop: 12, padding: 12 },
  secondaryText: { color: "#6b7280", fontWeight: "700" },
});
