import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const SKILLS = ["Dink", "Serve", "Return", "3rd Shot"] as const;
type Level = "Beginner" | "Intermediate" | "Advanced";

export default function NewDrill() {
  // optional prefill từ params (vd: chọn từ student profile theo skill)
  const { skill: preSkill } = useLocalSearchParams<{ skill?: string }>();

  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState<string>(
    preSkill && SKILLS.includes(preSkill as any) ? (preSkill as any) : "Dink",
  );
  const [level, setLevel] = useState<Level>("Beginner");
  const [duration, setDuration] = useState("10"); // minutes
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [videoUrl, setVideoUrl] = useState("");
  const [desc, setDesc] = useState("");

  function onSave(action: "save" | "assign") {
    if (!title.trim()) {
      Alert.alert("Thiếu tiêu đề");
      return;
    }
    // TODO: POST /drills -> trả về drillId
    const mockId = "d_new_" + Date.now();
    if (action === "save") {
      Alert.alert("Saved ✅", "Drill template đã được lưu (mock).");
      router.back();
    } else {
      router.push({
        pathname: "/(coach)/drill/assign",
        params: {
          drillId: mockId,
          title,
          skill,
          level,
          duration,
          intensity: String(intensity),
          videoUrl,
        },
      });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
        <Text style={{ fontWeight: "900", color: "#111827" }}>New Drill</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={st.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Dink – Control & Consistency"
          placeholderTextColor="#9ca3af"
          style={st.input}
        />

        <Text style={st.label}>Skill</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {SKILLS.map((s) => {
            const active = skill === s;
            return (
              <Pressable key={s} onPress={() => setSkill(s)}>
                <View style={[st.chip, active && st.chipActive]}>
                  <Text style={[st.chipTxt, active && st.chipTxtActive]}>
                    {s}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={st.label}>Level</Text>
        <View style={{ flexDirection: "row" }}>
          {(["Beginner", "Intermediate", "Advanced"] as const).map((L) => {
            const active = level === L;
            return (
              <Pressable
                key={L}
                onPress={() => setLevel(L)}
                style={[st.optBtn, active && st.optBtnActive]}
              >
                <Text style={[st.optTxt, active && st.optTxtActive]}>{L}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={st.label}>Duration (min)</Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              style={st.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.label}>Intensity (1–5)</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setIntensity(n as any)}
                  style={[st.star, intensity >= n && st.starActive]}
                >
                  <Ionicons
                    name="flash"
                    size={14}
                    color={intensity >= n ? "#fff" : "#9ca3af"}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <Text style={st.label}>Reference Video URL (optional)</Text>
        <TextInput
          value={videoUrl}
          onChangeText={setVideoUrl}
          placeholder="https://…"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          style={st.input}
        />

        <Text style={st.label}>Description / Steps / Targets</Text>
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Drill steps, reps, target zones…"
          placeholderTextColor="#9ca3af"
          multiline
          style={[st.input, { height: 140, textAlignVertical: "top" }]}
        />

        {/* Actions */}
        <View style={{ flexDirection: "row", marginTop: 14 }}>
          <Pressable
            style={[st.primary, { flex: 1, justifyContent: "center" }]}
            onPress={() => onSave("save")}
          >
            <Ionicons name="save-outline" size={16} color="#fff" />
            <Text style={st.primaryTxt}>Save</Text>
          </Pressable>
          <Pressable
            style={[st.secondary, { flex: 1 }]}
            onPress={() => onSave("assign")}
          >
            <Text style={st.secondaryTxt}>Save & Assign</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  label: {
    color: "#6b7280",
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    color: "#111827",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 0 },
    }),
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 6,
    marginBottom: 6,
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipTxt: { color: "#111827", fontWeight: "800" },
  chipTxtActive: { color: "#fff" },

  optBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginTop: 6,
  },
  optBtnActive: { backgroundColor: "#111827", borderColor: "#111827" },
  optTxt: { color: "#111827", fontWeight: "800" },
  optTxtActive: { color: "#fff" },

  star: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    backgroundColor: "#fff",
  },
  starActive: { backgroundColor: "#111827", borderColor: "#111827" },

  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
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
});
