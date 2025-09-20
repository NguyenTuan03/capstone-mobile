import React from "react";
import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LibraryVideoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  // demo source — thay bằng URL thật từ backend/AI
  const source = {
    uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      {/* Header */}
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
        <Text style={{ fontWeight: "900", color: "#111827" }}>Video</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Player */}
      <View style={{ padding: 16 }}>
        <Video
          source={source}
          style={st.player}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={false}
        />
        <Text style={st.title}>#{id} — Title từ backend</Text>
        <Text style={st.meta}>Skill · Level · 12m</Text>

        {/* CTA */}
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Pressable style={st.primary}>
            <Ionicons name="help-circle-outline" size={16} color="#fff" />
            <Text style={st.primaryTxt}>Làm Quiz</Text>
          </Pressable>
          <Pressable style={st.secondary} onPress={() => {}}>
            <Text style={st.secondaryTxt}>Lưu offline</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const st: any = StyleSheet.create({
  player: {
    width: "100%",
    height: 210,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  title: { fontWeight: "900", color: "#111827", marginTop: 10 },
  meta: { color: "#6b7280", marginTop: 2 },
  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
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
    marginLeft: 8,
    paddingHorizontal: 12,
  },
  secondaryTxt: { color: "#111827", fontWeight: "900" },
});
