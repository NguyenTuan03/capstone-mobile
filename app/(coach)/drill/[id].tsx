import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

const DB = {
  d1: {
    title: "Dink – Control & Consistency",
    thumb:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
    skill: "Dink",
    level: "Beginner",
    duration: 10,
    intensity: 2,
    desc: "Shadow dinking 10' + target zones.",
  },
  d2: {
    title: "3rd Shot Drop – Mechanics",
    thumb:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=1200&auto=format&fit=crop",
    skill: "3rd Shot",
    level: "Intermediate",
    duration: 15,
    intensity: 3,
    desc: "Focus on arc height & landing area.",
  },
  d3: {
    title: "Serve – Accuracy Ladder",
    thumb:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    skill: "Serve",
    level: "Advanced",
    duration: 12,
    intensity: 4,
    desc: "Target corners with 5x reps.",
  },
  d4: {
    title: "Return – Deep Placement",
    thumb:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop",
    skill: "Return",
    level: "Intermediate",
    duration: 8,
    intensity: 2,
    desc: "Shadow dinking 10' + target zones.",
  },
} as const;

export default function DrillDetail() {
  const { id } = useLocalSearchParams<{ id: keyof typeof DB }>();
  const data = id ? DB[id] : undefined;

  const [title, setTitle] = useState(data?.title ?? "");
  const [desc, setDesc] = useState(data?.desc ?? "");
  const meta = useMemo(
    () =>
      `${data?.skill} · ${data?.level} · ${data?.duration}m · INT ${data?.intensity}/5`,
    [id],
  );

  if (!data) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text>Drill not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
        <Text style={{ fontWeight: "900", color: "#111827" }}>Drill</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ padding: 16 }}>
        <Image source={{ uri: data.thumb }} style={st.hero} />
        <Text style={st.meta}>{meta}</Text>

        <TextInput value={title} onChangeText={setTitle} style={st.input} />
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Description / steps / targets…"
          placeholderTextColor="#9ca3af"
          multiline
          style={[st.input, { height: 120, textAlignVertical: "top" }]}
        />

        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Pressable
            style={[st.primary, { flex: 1, justifyContent: "center" }]}
            onPress={() => Alert.alert("Saved ✅")}
          >
            <Ionicons name="save-outline" size={16} color="#fff" />
            <Text style={st.primaryTxt}>Save</Text>
          </Pressable>
          <Pressable
            style={[st.secondary, { flex: 1 }]}
            onPress={() => router.push("/(coach)/drill/assign")}
          >
            <Text style={st.secondaryTxt}>Cancel</Text>
          </Pressable>
        </View>

        <View style={{ height: 12 }} />
        <Pressable
          style={[st.assign]}
          onPress={() => router.push("/(coach)/drill/assign")}
        >
          <Ionicons name="send-outline" size={16} color="#111827" />
          <Text style={st.assignTxt}>Assign to students</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  hero: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  meta: { color: "#6b7280", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    color: "#111827",
    fontWeight: "900",
  },
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
    marginLeft: 8,
  },
  secondaryTxt: { color: "#111827", fontWeight: "900" },
  assign: {
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  assignTxt: { color: "#111827", fontWeight: "900", marginLeft: 6 },
});
