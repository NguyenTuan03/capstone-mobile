import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Level = "Beginner" | "Intermediate" | "Advanced";
type Student = { id: string; name: string; avatar: string };

const STUDENTS: Student[] = [
  { id: "u1", name: "Tuấn", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "u2", name: "Lan", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "u3", name: "Huy", avatar: "https://i.pravatar.cc/150?img=12" },
];

export default function AssignDrill() {
  const inset = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    drillId?: string;
    title?: string;
    skill?: string;
    level?: Level;
    duration?: string;
    intensity?: string;
    videoUrl?: string;
    studentId?: string; // optional pre-select
  }>();

  const [selected, setSelected] = useState<string[]>([]);
  const [freq, setFreq] = useState<"once" | "daily" | "weekly">("once");
  const [due, setDue] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (params.studentId && STUDENTS.some((s) => s.id === params.studentId)) {
      setSelected([params.studentId]);
    }
  }, [params.studentId]);

  const meta = [
    params.skill,
    params.level,
    params.duration ? `${params.duration}m` : null,
    params.intensity ? `INT ${params.intensity}/5` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  function toggleStudent(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function onSave() {
    if (selected.length === 0) return Alert.alert("Chọn học viên");
    // TODO: POST /assignments { drillId, selected, freq, due, note }
    Alert.alert(
      "Assigned ✅",
      `Giao "${params.title ?? "Drill"}" cho ${selected.length} học viên.`,
    );
    router.back();
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: inset.top,
        paddingBottom: inset.bottom,
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
        <Text style={{ fontWeight: "900", color: "#111827" }}>
          Assign Drill
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Drill summary */}
      <View style={st.cardHero}>
        <View style={st.iconBox}>
          <Ionicons name="barbell-outline" size={18} color="#111827" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={st.name}>{params.title ?? "Untitled Drill"}</Text>
          {!!meta && <Text style={st.meta}>{meta}</Text>}
        </View>
      </View>

      {/* Students */}
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <Text style={st.sectionTitle}>Students</Text>
        <FlatList
          data={STUDENTS}
          keyExtractor={(s) => s.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => {
            const active = selected.includes(item.id);
            return (
              <Pressable onPress={() => toggleStudent(item.id)}>
                <View style={[st.stuChip, active && st.stuChipActive]}>
                  <Image source={{ uri: item.avatar }} style={st.stuAva} />
                  <Text style={[st.stuTxt, active && st.stuTxtActive]}>
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{ paddingVertical: 6 }}
        />
      </View>

      {/* Options */}
      <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
        <Text style={st.sectionTitle}>Frequency</Text>
        <View style={{ flexDirection: "row" }}>
          {(["once", "daily", "weekly"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFreq(f)}
              style={[st.optBtn, freq === f && st.optBtnActive]}
            >
              <Text style={[st.optTxt, freq === f && st.optTxtActive]}>
                {f.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={st.sectionTitle}>Due date (optional)</Text>
        <Pressable style={st.timeBtn} onPress={() => setShowPicker(true)}>
          <Ionicons name="calendar-outline" size={16} color="#111827" />
          <Text style={st.timeTxt}>
            {" "}
            {due ? new Date(due).toLocaleDateString() : "Pick a date"}
          </Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={showPicker}
          mode="date"
          onConfirm={(d) => {
            setDue(d);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />

        <Text style={st.sectionTitle}>Coach note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Focus on arc height / target zones…"
          placeholderTextColor="#9ca3af"
          multiline
          style={st.input}
        />
      </View>

      {/* Actions */}
      <View style={{ flexDirection: "row", padding: 16 }}>
        <Pressable
          style={[st.primary, { flex: 1, justifyContent: "center" }]}
          onPress={onSave}
        >
          <Text style={st.primaryTxt}>Save</Text>
        </Pressable>
        <Pressable
          style={[st.secondary, { flex: 1 }]}
          onPress={() => router.back()}
        >
          <Text style={st.secondaryTxt}>Cancel</Text>
        </Pressable>
      </View>
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontWeight: "900", color: "#111827" },
  meta: { color: "#6b7280", marginTop: 2, fontSize: 12 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginTop: 12,
    marginBottom: 6,
  },

  stuChip: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  stuChipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  stuTxt: { color: "#111827", fontWeight: "800", marginLeft: 6 },
  stuTxtActive: { color: "#fff" },
  stuAva: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e5e7eb",
  },

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

  timeBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    width: 180,
  },
  timeTxt: { fontWeight: "800", color: "#111827" },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
    color: "#111827",
  },

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
