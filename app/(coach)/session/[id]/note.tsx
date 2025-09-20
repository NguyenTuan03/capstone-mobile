import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** mock session */
const SESS = {
  s1: {
    id: "s1",
    student: {
      id: "u1",
      name: "Tuấn",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    dateISO: new Date().toISOString(),
    mode: "online" as const,
    place: undefined,
  },
  s2: {
    id: "s2",
    student: {
      id: "u2",
      name: "Lan",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    dateISO: new Date(Date.now() + 86400e3).toISOString(),
    mode: "offline" as const,
    place: "Crescent Court",
  },
} as const;

const SKILLS = ["Serve", "Return", "Dink", "3rd Shot", "Position"] as const;

export default function SessionNotes() {
  const { id } = useLocalSearchParams<{ id: keyof typeof SESS }>();
  const s = id ? SESS[id] : undefined;
  const inset = useSafeAreaInsets();
  // ratings 1..5
  const [rating, setRating] = useState<Record<string, number>>({
    Serve: 3,
    Return: 3,
    Dink: 3,
    "3rd Shot": 3,
    Position: 3,
  });
  const [goals, setGoals] = useState<string[]>(["Consistency", "Footwork"]);
  const [obs, setObs] = useState("");
  const [actions, setActions] = useState("");
  const [attachedDrill, setAttachedDrill] = useState<string | null>(null);

  if (!s) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          paddingTop: inset.top,
          paddingBottom: inset.bottom + 50,
        }}
      >
        <Text>Session not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: inset.top,
        paddingBottom: inset.bottom + 100,
      }}
    >
      {/* header */}
      <ScrollView>
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
          <Text style={{ fontWeight: "900", color: "#111827" }}>
            Session Notes
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* hero */}
        <View style={st.cardHero}>
          <Image source={{ uri: s.student.avatar }} style={st.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={st.name}>{s.student.name}</Text>
            <Text style={st.meta}>
              {new Date(s.dateISO).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              · {s.mode === "online" ? "Online" : s.place}
            </Text>
          </View>
          {/* <Pressable
          style={st.linkBtn}
          onPress={() => router.push("/(coach)/drill/assign")}
        >
          <Ionicons name="barbell-outline" size={16} color="#111827" />
          <Text style={st.linkTxt}>Open Drills</Text>
        </Pressable> */}
        </View>

        {/* body */}
        <View style={{ padding: 16 }}>
          {/* Ratings */}
          <Text style={st.sectionTitle}>Ratings (1–5)</Text>
          {SKILLS.map((sk) => (
            <View key={sk} style={st.rateRow}>
              <Text style={st.rateLabel}>{sk}</Text>
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => setRating((prev) => ({ ...prev, [sk]: n }))}
                    style={[st.star, rating[sk] >= n && st.starActive]}
                  >
                    <Ionicons
                      name="star"
                      size={14}
                      color={rating[sk] >= n ? "#fff" : "#9ca3af"}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          {/* Goals */}
          <Text style={st.sectionTitle}>Goals</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {[
              "Consistency",
              "Footwork",
              "Decision",
              "Serve power",
              "Drop height",
            ].map((g) => {
              const active = goals.includes(g);
              return (
                <Pressable
                  key={g}
                  onPress={() =>
                    setGoals((prev) =>
                      active ? prev.filter((x) => x !== g) : [...prev, g],
                    )
                  }
                  style={[st.chip, active && st.chipActive]}
                >
                  <Text style={[st.chipTxt, active && st.chipTxtActive]}>
                    {g}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Observations */}
          <Text style={st.sectionTitle}>Observations</Text>
          <TextInput
            value={obs}
            onChangeText={setObs}
            placeholder="What went well? What to improve?"
            placeholderTextColor="#9ca3af"
            multiline
            style={st.input}
          />

          {/* Action Items */}
          <Text style={st.sectionTitle}>Action Items</Text>
          <TextInput
            value={actions}
            onChangeText={setActions}
            placeholder="Next steps for learner…"
            placeholderTextColor="#9ca3af"
            multiline
            style={st.input}
          />

          {/* Attach Drill */}
          <Text style={st.sectionTitle}>Attach Drill</Text>
          <View style={{ flexDirection: "row" }}>
            {[
              "d1: Dink – Control",
              "d2: 3rd Shot – Mechanics",
              "d3: Serve – Ladder",
            ].map((d) => {
              const active = attachedDrill === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => setAttachedDrill(active ? null : d)}
                  style={[st.optBtn, active && st.optBtnActive]}
                >
                  <Text style={[st.optTxt, active && st.optTxtActive]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: "row", marginTop: 14 }}>
            <Pressable
              style={[st.primary, { flex: 1, justifyContent: "center" }]}
              onPress={() => Alert.alert("Saved ✅", "Notes saved (mock).")}
            >
              <Text style={st.primaryTxt}>Send</Text>
            </Pressable>
            {/* <Pressable
              style={[st.secondary, { flex: 1 }]}
              onPress={() =>
                Alert.alert("Sent 📩", "Notes sent to learner (mock).")
              }
            >
              <Text style={st.secondaryTxt}>Save & Send</Text>
            </Pressable> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  cardHero: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e5e7eb",
  },
  name: { fontWeight: "900", color: "#111827" },
  meta: { color: "#6b7280", fontSize: 12, marginTop: 2 },
  linkBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  linkTxt: { marginLeft: 6, fontWeight: "800", color: "#111827" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginTop: 14,
    marginBottom: 6,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rateLabel: { fontWeight: "800", color: "#111827" },
  star: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    backgroundColor: "#fff",
  },
  starActive: { backgroundColor: "#111827", borderColor: "#111827" },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 6,
    marginBottom: 6,
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipTxt: { color: "#111827", fontWeight: "800" },
  chipTxtActive: { color: "#fff" },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    color: "#111827",
  },

  optBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginTop: 6,
  },
  optBtnActive: { backgroundColor: "#111827", borderColor: "#111827" },
  optTxt: { color: "#111827", fontWeight: "800" },
  optTxtActive: { color: "#fff" },

  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "900" },
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
