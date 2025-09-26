import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

/** --- same mock DB (đổi sang API/Context sau) --- */
type Student = {
  id: string;
  name: string;
  avatar: string;
  dupr: number;
  tags: string[];
  nextSession?: { dateISO: string; mode: "online" | "offline"; place?: string };
  progress: number;
};
const DB: Record<string, Student> = {
  u1: {
    id: "u1",
    name: "Tuấn",
    avatar: "https://i.pravatar.cc/150?img=15",
    dupr: 3.1,
    tags: ["2.5-3.0", "Doubles"],
    nextSession: {
      dateISO: new Date(Date.now() + 36e5).toISOString(),
      mode: "online",
    },
    progress: 0.35,
  },
  u2: {
    id: "u2",
    name: "Lan",
    avatar: "https://i.pravatar.cc/150?img=5",
    dupr: 3.9,
    tags: ["3.5-4.0", "Singles"],
    nextSession: {
      dateISO: new Date(Date.now() + 2 * 86400e3).toISOString(),
      mode: "offline",
      place: "Crescent Court",
    },
    progress: 0.6,
  },
  u3: {
    id: "u3",
    name: "Huy",
    avatar: "https://i.pravatar.cc/150?img=12",
    dupr: 4.3,
    tags: ["4.5+", "Doubles"],
    progress: 0.12,
  },
};

type Assignment = {
  id: string;
  title: string;
  dueISO?: string;
  status: "open" | "done";
};
type Note = { id: string; content: string; createdISO: string };

const INIT_ASSIGN: Assignment[] = [
  {
    id: "a1",
    title: "3rd Shot Drop – 15 mins",
    dueISO: new Date(Date.now() + 2 * 86400e3).toISOString(),
    status: "open",
  },
  { id: "a2", title: "Dinking cross-court – 10 mins", status: "done" },
];
const INIT_NOTES: Note[] = [
  {
    id: "n1",
    content: "Footwork ok, cần giữ paddle cao hơn khi ở kitchen.",
    createdISO: new Date().toISOString(),
  },
];

export default function StudentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = id ? DB[id] : undefined;
  const [tab, setTab] = useState<"overview" | "progress" | "notes">("overview");
  const [assigns, setAssigns] = useState<Assignment[]>(INIT_ASSIGN);
  const [notes, setNotes] = useState<Note[]>(INIT_NOTES);

  // add note modal
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState("");

  const chartData = useMemo(() => [2.9, 3.0, 3.1, 3.2, 3.3], []); // giả lập DUPR history

  if (!s) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text>Student not found</Text>
      </SafeAreaView>
    );
  }

  const nextTxt = s.nextSession
    ? `${new Date(s.nextSession.dateISO).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · ${s.nextSession.mode === "online" ? "Online" : s.nextSession.place}`
    : "No upcoming session";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: "rgba(107, 114, 128, 0.1)",
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#6b7280" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontWeight: "900", color: "#111827", fontSize: 16 }}>
          Student Profile
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Hero */}
      <LinearGradient
        colors={["#111827", "#0f172a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={st.hero}
      >
        <Image source={{ uri: s.avatar }} style={st.avatar} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={st.name}>{s.name}</Text>
          <Text style={st.meta}>{nextTxt}</Text>
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            <View style={st.duprPill}>
              <Ionicons name="podium-outline" size={12} color="#111827" />
              <Text style={st.duprTxt}> {s.dupr.toFixed(1)}</Text>
            </View>
            {s.tags.map((t) => (
              <View key={t} style={st.tag}>
                <Text style={st.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pressable onPress={() => router.push("/calendar")} style={st.primary}>
          <Ionicons name="calendar-outline" size={16} color="#111827" />
          <Text style={st.primaryTxt}>Schedule</Text>
        </Pressable>
      </LinearGradient>

      {/* Segmented */}
      <View style={st.tabs}>
        {(["overview", "progress", "notes"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[st.tab, tab === t && st.tabActive]}
          >
            <Text style={[st.tabTxt, tab === t && st.tabTxtActive]}>
              {t[0].toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Body */}
      {tab === "overview" && (
        <FlatList
          data={[
            { key: "qa" },
            { key: "prog" },
            { key: "assign" },
            { key: "notes" },
          ]}
          renderItem={({ item }) => {
            switch (item.key) {
              case "qa":
                return (
                  <Section title="Quick Actions">
                    <View style={st.qaRow}>
                      <QA
                        icon="videocam-outline"
                        label="Start Call"
                        onPress={() =>
                          router.push({
                            pathname: "/(coach)/call/[sessionId]" as any,
                            params: { sessionId: s.id },
                          })
                        }
                      />
                      <QA
                        icon="barbell-outline"
                        label="Assign Drill"
                        onPress={() =>
                          setAssigns((prev) => [
                            {
                              id: `a${Date.now()}`,
                              title: "Shadow swing 10'",
                              status: "open",
                            },
                            ...prev,
                          ])
                        }
                      />
                      <QA
                        icon="clipboard-outline"
                        label="Add Note"
                        onPress={() => setShowNote(true)}
                      />
                    </View>
                  </Section>
                );
              case "prog":
                return (
                  <Section
                    title="Skill Progress"
                    caption="DUPR trend (last 5 checkpoints)"
                  >
                    <Card>
                      <Sparkline values={chartData} />
                    </Card>
                  </Section>
                );
              case "assign":
                return (
                  <Section title="Assignments">
                    <FlatList
                      data={assigns}
                      keyExtractor={(x) => x.id}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 8 }} />
                      )}
                      renderItem={({ item }) => (
                        <Card>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={[
                                st.dot,
                                {
                                  backgroundColor:
                                    item.status === "done"
                                      ? "#22c55e"
                                      : "#f59e0b",
                                },
                              ]}
                            />
                            <Text
                              style={{
                                fontWeight: "900",
                                color: "#111827",
                                flex: 1,
                                marginLeft: 8,
                              }}
                            >
                              {item.title}
                            </Text>
                            {item.status === "open" ? (
                              <RoundBtn
                                label="Mark done"
                                solid
                                onPress={() =>
                                  setAssigns((prev) =>
                                    prev.map((a) =>
                                      a.id === item.id
                                        ? { ...a, status: "done" }
                                        : a,
                                    ),
                                  )
                                }
                              />
                            ) : (
                              <RoundBtn
                                label="Reopen"
                                onPress={() =>
                                  setAssigns((prev) =>
                                    prev.map((a) =>
                                      a.id === item.id
                                        ? { ...a, status: "open" }
                                        : a,
                                    ),
                                  )
                                }
                              />
                            )}
                          </View>
                        </Card>
                      )}
                    />
                  </Section>
                );
              case "notes":
                return (
                  <Section title="Notes">
                    <FlatList
                      data={notes}
                      keyExtractor={(x) => x.id}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 8 }} />
                      )}
                      renderItem={({ item }) => (
                        <Card>
                          <Text style={{ color: "#6b7280", fontSize: 12 }}>
                            {new Date(item.createdISO).toLocaleString()}
                          </Text>
                          <Text
                            style={{
                              marginTop: 6,
                              color: "#111827",
                              fontWeight: "700",
                            }}
                          >
                            {item.content}
                          </Text>
                        </Card>
                      )}
                    />
                  </Section>
                );
              default:
                return null;
            }
          }}
          keyExtractor={(i) => i.key}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListHeaderComponent={<View style={{ height: 10 }} />}
        />
      )}

      {tab === "progress" && (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Section title="Weekly Practice Minutes" caption="Last 7 days">
            <Card>
              <Bars values={[20, 45, 10, 60, 35, 0, 25]} />
            </Card>
          </Section>
          <Section
            title="Skill Breakdown"
            caption="Serve · Return · Dink · 3rd Shot · Position"
          >
            <Card>
              <RadarStub />
            </Card>
          </Section>
        </View>
      )}

      {tab === "notes" && (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Pressable
            onPress={() => setShowNote(true)}
            style={[st.primary, { alignSelf: "flex-start" }]}
          >
            <Ionicons name="add" size={16} color="#111827" />
            <Text style={st.primaryTxt}>New Note</Text>
          </Pressable>
          <FlatList
            data={notes}
            keyExtractor={(x) => x.id}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingVertical: 12 }}
            renderItem={({ item }) => (
              <Card>
                <Text style={{ color: "#6b7280", fontSize: 12 }}>
                  {new Date(item.createdISO).toLocaleString()}
                </Text>
                <Text
                  style={{ marginTop: 6, color: "#111827", fontWeight: "700" }}
                >
                  {item.content}
                </Text>
              </Card>
            )}
          />
        </View>
      )}

      {/* Add Note Modal */}
      <Modal visible={showNote} animationType="slide" transparent>
        <Pressable style={st.backdrop} onPress={() => setShowNote(false)} />
        <View style={st.sheet}>
          <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
            New Note
          </Text>
          <TextInput
            placeholder="Type feedback/notes..."
            placeholderTextColor="#9ca3af"
            value={noteText}
            onChangeText={setNoteText}
            multiline
            style={st.input}
          />
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Pressable
              style={[st.primary, { flex: 1, justifyContent: "center" }]}
              onPress={() => {
                if (!noteText.trim()) return;
                setNotes((prev) => [
                  {
                    id: `n${Date.now()}`,
                    content: noteText.trim(),
                    createdISO: new Date().toISOString(),
                  },
                  ...prev,
                ]);
                setNoteText("");
                setShowNote(false);
              }}
            >
              <Text style={st.primaryTxt}>Save</Text>
            </Pressable>
            <Pressable
              style={[st.secondary, { flex: 1 }]}
              onPress={() => setShowNote(false)}
            >
              <Text style={st.secondaryTxt}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- mini components ---------- */
function Section({
  title,
  caption,
  children,
}: React.PropsWithChildren<{ title: string; caption?: string }>) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
        {title}
      </Text>
      {!!caption && (
        <Text style={{ color: "#6b7280", marginTop: 2 }}>{caption}</Text>
      )}
      <View style={{ marginTop: 10 }}>{children}</View>
    </View>
  );
}
function Card({ children }: React.PropsWithChildren<{}>) {
  return <View style={st.card}>{children}</View>;
}
function QA({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={st.qaItem}>
      <View style={st.qaIcon}>
        <Ionicons name={icon} size={18} color="#fff" />
      </View>
      <Text style={st.qaTxt}>{label}</Text>
    </Pressable>
  );
}
function RoundBtn({
  label,
  onPress,
  solid,
}: {
  label: string;
  onPress: () => void;
  solid?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[st.round, solid && st.roundSolid]}>
      <Text style={[st.roundTxt, solid && st.roundTxtSolid]}>{label}</Text>
    </Pressable>
  );
}

/* ---------- charts ---------- */
function Sparkline({ values }: { values: number[] }) {
  // simple bezier path
  const W = 300,
    H = 80,
    pad = 8;
  const step = (W - pad * 2) / (values.length - 1);
  const min = Math.min(...values),
    max = Math.max(...values);
  const norm = (v: number) =>
    H - pad - ((v - min) / Math.max(0.0001, max - min)) * (H - pad * 2);

  let d = `M ${pad} ${norm(values[0])}`;
  for (let i = 1; i < values.length; i++) {
    const x = pad + i * step;
    const xc = pad + (i - 0.5) * step;
    const y1 = norm(values[i - 1]);
    const y2 = norm(values[i]);
    d += ` C ${xc} ${y1}, ${xc} ${y2}, ${x} ${y2}`;
  }
  return (
    <Svg width="100%" height={H}>
      <Path d={d} stroke="#111827" strokeWidth={2} fill="none" />
    </Svg>
  );
}
function Bars({ values }: { values: number[] }) {
  const H = 90,
    pad = 12,
    gap = 10,
    barW = 18;
  const max = Math.max(...values, 1);
  return (
    <View>
      <Svg height={H} width={pad * 2 + values.length * (barW + gap)}>
        {values.map((v, i) => {
          const h = (v / max) * (H - 24);
          const x = pad + i * (barW + gap);
          const y = H - h - 12;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={6}
              ry={6}
              fill="#111827"
              opacity={0.9}
            />
          );
        })}
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 6,
          paddingHorizontal: 4,
        }}
      >
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <Text key={`${d}-${i}`} style={{ color: "#6b7280", fontSize: 12 }}>
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}
function RadarStub() {
  // placeholder radar (UI only)
  return (
    <View
      style={{ height: 140, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ color: "#6b7280" }}>
        Radar chart (Serve · Return · Dink · 3rd Shot · Position)
      </Text>
    </View>
  );
}

/* ---------- styles ---------- */
const st = StyleSheet.create({
  hero: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  name: { color: "#fff", fontSize: 18, fontWeight: "900" },
  meta: { color: "#cbd5e1", marginTop: 2 },
  duprPill: {
    backgroundColor: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  duprTxt: { fontWeight: "900", color: "#111827", fontSize: 12 },
  tag: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 6,
  },
  tagTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
  primary: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  primaryTxt: { color: "#111827", fontWeight: "900", marginLeft: 6 },
  secondary: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  secondaryTxt: { fontWeight: "900", color: "#111827" },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginTop: 10,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabActive: { backgroundColor: "#111827" },
  tabTxt: { color: "#111827", fontWeight: "800" },
  tabTxtActive: { color: "#fff" },

  qaRow: { flexDirection: "row", justifyContent: "space-between" },
  qaItem: { alignItems: "center", width: "32%" },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  qaTxt: {
    marginTop: 6,
    fontWeight: "800",
    color: "#111827",
    fontSize: 12,
    textAlign: "center",
  },

  dot: { width: 10, height: 10, borderRadius: 5 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
  },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  round: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  roundSolid: { backgroundColor: "#111827", borderColor: "#111827" },
  roundTxt: { fontWeight: "800", color: "#111827" },
  roundTxtSolid: { color: "#fff" },
});
