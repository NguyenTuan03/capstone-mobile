import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** ------- Types & Mock ------- */
type Level = "Beginner" | "Intermediate" | "Advanced";
type Drill = {
  id: string;
  title: string;
  skill: "Dink" | "Serve" | "Return" | "3rd Shot";
  level: Level;
  duration: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  thumb: string;
  desc?: string;
};
type Student = { id: string; name: string; avatar: string };
type Assignment = {
  id: string;
  drillId: string;
  studentIds: string[];
  dueISO?: string;
  freq: "once" | "daily" | "weekly";
  note?: string;
};

const STUDENTS: Student[] = [
  { id: "u1", name: "Tuấn", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "u2", name: "Lan", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "u3", name: "Huy", avatar: "https://i.pravatar.cc/150?img=12" },
];

const DRILLS: Drill[] = [
  {
    id: "d1",
    title: "Dink – Control & Consistency",
    skill: "Dink",
    level: "Beginner",
    duration: 10,
    intensity: 2,
    thumb:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
    desc: "Shadow dinking 10' + target zones.",
  },
  {
    id: "d2",
    title: "3rd Shot Drop – Mechanics",
    skill: "3rd Shot",
    level: "Intermediate",
    duration: 15,
    intensity: 3,
    thumb:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "d3",
    title: "Serve – Accuracy Ladder",
    skill: "Serve",
    level: "Advanced",
    duration: 12,
    intensity: 4,
    thumb:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "d4",
    title: "Return – Deep Placement",
    skill: "Return",
    level: "Intermediate",
    duration: 8,
    intensity: 2,
    thumb:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop",
  },
];

/** ------- Screen ------- */
export default function DrillsScreen() {
  const inset = useSafeAreaInsets();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState<Drill["skill"] | "All">("All");
  const [level, setLevel] = useState<Level | null>(null);
  const [assignTo, setAssignTo] = useState<Assignment[]>([]);

  const list = useMemo(
    () =>
      DRILLS.filter((d) => {
        const hitQ = !q || d.title.toLowerCase().includes(q.toLowerCase());
        const hitSkill = skill === "All" || d.skill === skill;
        const hitLevel = !level || d.level === level;
        return hitQ && hitSkill && hitLevel;
      }),
    [q, skill, level],
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: inset.top,
        paddingBottom: inset.bottom + 50,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={st.h1}>Drills & Assignments</Text>

        {/* Search */}
        <View style={st.search}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search drill templates…"
            placeholderTextColor="#9ca3af"
            value={q}
            onChangeText={setQ}
            style={{ flex: 1, marginLeft: 8 }}
          />
          {!!q && (
            <Pressable onPress={() => setQ("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </Pressable>
          )}
        </View>

        {/* Filters */}
        <FlatList
          data={["All", "Dink", "Serve", "Return", "3rd Shot"] as const}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => String(x)}
          contentContainerStyle={{ paddingVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSkill(item as any)}>
              <View style={[st.chip, skill === item && st.chipActive]}>
                <Text style={[st.chipTxt, skill === item && st.chipTxtActive]}>
                  {String(item)}
                </Text>
              </View>
            </Pressable>
          )}
          ListFooterComponent={
            <View style={{ marginLeft: 8, flexDirection: "row" }}>
              {(["Beginner", "Intermediate", "Advanced"] as const).map((L) => (
                <Pressable
                  key={L}
                  onPress={() => setLevel(level === L ? null : L)}
                  style={{ marginRight: 8 }}
                >
                  <View style={[st.lvl, level === L && st.lvlActive]}>
                    <Text style={[st.lvlTxt, level === L && st.lvlTxtActive]}>
                      {L[0]}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          }
        />
      </View>

      {/* Actions */}
      <View style={{ paddingHorizontal: 16, flexDirection: "row", gap: 8 }}>
        <Pressable
          style={st.primary}
          onPress={() => router.push("/(coach)/drill/new" as any)}
        >
          <Ionicons name="add-circle-outline" size={16} color="#fff" />
          <Text style={st.primaryTxt}>New Drill</Text>
        </Pressable>
        <Pressable
          style={st.secondary}
          onPress={() =>
            Alert.alert("Bulk assign", "Chọn drill rồi ấn Assign ở card nhé.")
          }
        >
          <Ionicons name="duplicate-outline" size={16} color="#111827" />
          <Text style={st.secondaryTxt}>Bulk Assign</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <DrillCard
            d={item}
            onOpen={() =>
              router.push({
                pathname: "/(coach)/drill/[id]",
                params: { id: item.id },
              })
            }
            onAssign={() =>
              setAssignTo((prev) => [
                ...prev,
                {
                  id: `as_${Date.now()}`,
                  drillId: item.id,
                  studentIds: [],
                  freq: "once",
                },
              ])
            }
          />
        )}
        ListEmptyComponent={
          <Empty
            title="No drills found"
            subtitle="Thử đổi filter hoặc tạo mới."
          />
        }
      />

      {/* Assign modals (multiple if you click multiple cards; simple UI) */}
      {assignTo.map((asgn) => (
        <AssignModal
          key={asgn.id}
          assignment={asgn}
          drill={DRILLS.find((d) => d.id === asgn.drillId)!}
          students={STUDENTS}
          onClose={() =>
            setAssignTo((prev) => prev.filter((x) => x.id !== asgn.id))
          }
          onSave={(saved) => {
            // TODO: POST /assignments
            setAssignTo((prev) => prev.filter((x) => x.id !== asgn.id));
            Alert.alert(
              "Assigned ✅",
              `Giao "${DRILLS.find((d) => d.id === saved.drillId)?.title}" cho ${saved.studentIds.length} học viên.`,
            );
          }}
        />
      ))}
    </SafeAreaView>
  );
}

function DrillCard({
  d,
  onOpen,
  onAssign,
}: {
  d: Drill;
  onOpen: () => void;
  onAssign: () => void;
}) {
  return (
    <LinearGradient
      colors={["#f9fafb", "#eef2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={st.card}
    >
      <Image source={{ uri: d.thumb }} style={st.thumb} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text numberOfLines={1} style={st.title}>
          {d.title}
        </Text>
        <Text style={st.meta}>
          {d.skill} · {d.level} · {d.duration}m
        </Text>
        <View style={{ flexDirection: "row", marginTop: 6 }}>
          <Pill label={`INT ${d.intensity}/5`} />
          <Pressable onPress={onOpen} style={[st.linkBtn, { marginLeft: 6 }]}>
            <Text style={st.linkBtnTxt}>Details</Text>
          </Pressable>
        </View>
      </View>
      <Pressable onPress={onAssign} style={st.assignBtn}>
        <Ionicons name="send-outline" size={16} color="#fff" />
        <Text style={st.assignTxt}>Assign</Text>
      </Pressable>
    </LinearGradient>
  );
}

/** ------- Assign Modal (inline, simple) ------- */
function AssignModal({
  assignment,
  drill,
  students,
  onClose,
  onSave,
}: {
  assignment: Assignment;
  drill: Drill;
  students: Student[];
  onClose: () => void;
  onSave: (a: Assignment) => void;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [freq, setFreq] = useState<Assignment["freq"]>("once");
  const [due, setDue] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={st.modalWrap}>
      <Pressable style={st.modalBack} onPress={onClose} />
      <View style={st.modal}>
        <Text style={st.modalTitle}>Assign: {drill.title}</Text>

        {/* Students multi-select */}
        <Text style={st.label}>Students</Text>
        <FlatList
          data={students}
          keyExtractor={(s) => s.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          contentContainerStyle={{ marginTop: 6 }}
          renderItem={({ item }) => {
            const active = ids.includes(item.id);
            return (
              <Pressable
                onPress={() =>
                  setIds((prev) =>
                    active
                      ? prev.filter((x) => x !== item.id)
                      : [...prev, item.id],
                  )
                }
              >
                <View style={[st.stuChip, active && st.stuChipActive]}>
                  <Image source={{ uri: item.avatar }} style={st.stuAva} />
                  <Text style={[st.stuTxt, active && st.stuTxtActive]}>
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />

        {/* Frequency */}
        <Text style={[st.label, { marginTop: 12 }]}>Frequency</Text>
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

        {/* Due date */}
        <Text style={[st.label, { marginTop: 12 }]}>Due date (optional)</Text>
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

        {/* Note */}
        <Text style={[st.label, { marginTop: 12 }]}>Coach note (optional)</Text>
        <TextInput
          placeholder="Anything learners should focus on…"
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
          multiline
          style={st.input}
        />

        {/* Actions */}
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Pressable
            style={[st.primary, { flex: 1, justifyContent: "center" }]}
            onPress={() => {
              if (ids.length === 0) return Alert.alert("Chọn học viên");
              onSave({
                ...assignment,
                studentIds: ids,
                freq,
                dueISO: due ? due.toISOString() : undefined,
                note: note.trim() || undefined,
              });
            }}
          >
            <Text style={st.primaryTxt}>Save</Text>
          </Pressable>
          <Pressable style={[st.secondary, { flex: 1 }]} onPress={onClose}>
            <Text style={st.secondaryTxt}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** ------- Reusable ------- */
function Pill({ label }: { label: string }) {
  return (
    <View style={st.pill}>
      <Text style={st.pillTxt}>{label}</Text>
    </View>
  );
}
function Empty({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={st.empty}>
      <Ionicons name="barbell-outline" size={22} color="#9ca3af" />
      <Text style={st.emptyTitle}>{title}</Text>
      {!!subtitle && <Text style={st.emptySub}>{subtitle}</Text>}
    </View>
  );
}

/** ------- Styles ------- */
const st = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "900", color: "#111827" },
  search: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  chipTxt: { color: "#111827", fontWeight: "800" },
  chipTxtActive: { color: "#fff" },

  lvl: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  lvlActive: { backgroundColor: "#111827", borderColor: "#111827" },
  lvlTxt: { fontWeight: "900", color: "#111827" },
  lvlTxtActive: { color: "#fff" },

  primary: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "900", marginLeft: 6 },
  secondary: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryTxt: { color: "#111827", fontWeight: "900", marginLeft: 6 },

  card: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  thumb: {
    width: 86,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  title: { fontWeight: "900", color: "#111827" },
  meta: { color: "#6b7280", marginTop: 2, fontSize: 12 },
  assignBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  assignTxt: { color: "#fff", fontWeight: "900", marginLeft: 6 },
  linkBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  linkBtnTxt: { fontWeight: "800", color: "#111827", fontSize: 12 },

  pill: {
    backgroundColor: "#111827",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  pillTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  empty: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
  },
  emptyTitle: { fontWeight: "900", color: "#111827", marginTop: 6 },
  emptySub: { color: "#6b7280", marginTop: 2, textAlign: "center" },

  modalWrap: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  modalBack: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  label: { color: "#6b7280", fontWeight: "800", marginTop: 8 },
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
    width: 160,
  },
  timeTxt: { fontWeight: "800", color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    minHeight: 90,
    textAlignVertical: "top",
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
});
