import { GradientItem, Segmented } from "@/modules/learner/roadmap";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, router } from "expo-router";
const ITEMS = ["Dink", "Serve", "Return", "3rd Shot"].map((label) => ({
  id: label,
  label,
  status: "Not Scored",
}));

export default function RoadmapScreen() {
  const [tab, setTab] = useState<"on" | "off">("on");
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
      }}
    >
      {/* Top title */}
      <View style={s.headerWrap}>
        <Text style={s.header}>ROADMAP</Text>
        {/* Avatar pill góc phải nếu cần: fake */}
        <View style={s.avatar}>
          <Text style={s.avatarText}>TN</Text>
        </View>
      </View>

      {/* Section title */}
      <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
        <Text style={s.sectionTitle}>GAME ELEMENT BREAKDOWN</Text>
        <Text style={s.sub}>
          Your strengths and areas for improvement are listed below.{"\n"}
          Scores are updated as you receive feedback from your personal DUPR
          Coach!
        </Text>
      </View>

      {/* Segmented */}
      <View style={s.segmentWrap}>
        <Segmented
          left="On Paddle"
          right="Off Paddle"
          value={tab}
          onChange={(v) => setTab(v)}
        />
      </View>

      {/* Tip pill */}
      <LinearGradient
        colors={["#f3d4ff", "#f2e4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.tip}
      >
        <Text style={s.tipText}>ⓘ Tap on an element to view feedback.</Text>
      </LinearGradient>

      {/* List */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
        }}
        data={ITEMS}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <GradientItem
            title={item.label}
            value={item.status}
            onPress={() => {
              router.push(`/(learner)/roadmap/${item.id}` as Href);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { fontSize: 20, fontWeight: "700", letterSpacing: 1, color: "#111" },
  avatar: {
    position: "absolute",
    right: 16,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#c982ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  segmentWrap: { paddingHorizontal: 16, marginTop: 16 },
  segment: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tip: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: "center",
  },
  tipText: { color: "#7c3aed", fontWeight: "600" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    color: "#111",
  },
  sub: { color: "#6b7280", marginTop: 6, lineHeight: 18 },
});
