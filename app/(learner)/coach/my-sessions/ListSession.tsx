import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Lesson = {
  id: string;
  title: string;
  summary?: string;
  startAt?: string;
  durationMin?: number;
  mode: "online" | "offline";
  meetingUrl?: string; // online
  location?: string; // offline
  status: "upcoming" | "completed" | "canceled";
};

export default function ListSession() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [checkInAt, setCheckInAt] = React.useState<Date | null>(null);
  const [checkOutAt, setCheckOutAt] = React.useState<Date | null>(null);
  const { sessions } = useBookings();
  const handleCheckIn = () => {
    if (session?.mode !== "offline") return;
    if (checkInAt) {
      Alert.alert(
        "Already checked in",
        `Checked in at ${checkInAt.toLocaleTimeString()}`,
      );
      return;
    }
    const now = new Date();
    setCheckInAt(now);
    Alert.alert("Checked in", `Time: ${now.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    if (session?.mode !== "offline") return;
    if (!checkInAt) {
      Alert.alert(
        "Check in first",
        "You need to check in before checking out.",
      );
      return;
    }
    if (checkOutAt) {
      Alert.alert(
        "Already checked out",
        `Checked out at ${checkOutAt.toLocaleTimeString()}`,
      );
      return;
    }
    const now = new Date();
    setCheckOutAt(now);
    const mins = Math.max(
      0,
      Math.round((now.getTime() - checkInAt.getTime()) / 60000),
    );
    Alert.alert("Checked out", `Duration: ${mins} min`);
  };
  // lấy session
  const session = useMemo(
    () => sessions.find((s: any) => s.id === id),
    [sessions, id],
  );

  // mock lessons theo mode
  const lessons: Lesson[] = useMemo(() => {
    const isOnline = session?.mode === "online";
    return [
      {
        id: "l1",
        title: "Warm-up & Footwork",
        summary: "5’ ladder + split-step timing",
        startAt: session?.startAt,
        durationMin: 10,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
      },
      {
        id: "l2",
        title: "Dink Consistency",
        summary: "Cross-court soft dinks, low net clearance",
        durationMin: 20,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
      },
      {
        id: "l3",
        title: "3rd Shot Drop",
        summary: "Arc control to kitchen; target zones",
        durationMin: 20,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
      },
      {
        id: "l4",
        title: "Situational Play",
        summary: "2v2 kitchen control & transitions",
        durationMin: 15,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
      },
      {
        id: "l5",
        title: "Cool-down & Review",
        summary: isOnline
          ? "Strategy recap + Q&A session"
          : "Stretching, form review & match analysis",
        durationMin: 10,
        mode: isOnline ? "online" : "offline",
        meetingUrl: isOnline ? session?.meetingUrl : undefined,
        location: isOnline
          ? undefined
          : (session?.location ?? "District 1 Arena, Court #2"),
        status: "upcoming",
      },
    ];
  }, [session]);

  const joinMeet = async (url?: string) => {
    if (!url) return;
    await Linking.openURL(url);
  };

  const openMap = async (address?: string) => {
    if (!address) return;
    const q = encodeURIComponent(address);
    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${q}`,
    );
  };

  const renderItem = ({ item }: { item: Lesson }) => (
    <View style={st.card}>
      <View style={{ flex: 1 }}>
        <Text style={st.title}>{item.title}</Text>
        {!!item.summary && <Text style={st.summary}>{item.summary}</Text>}

        <View style={st.metaRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={st.metaText}>
            {item.durationMin ? `${item.durationMin} min` : "—"}
          </Text>
          <Text style={st.dot}>•</Text>
          <Ionicons
            name={
              item.mode === "online" ? "videocam-outline" : "location-outline"
            }
            size={16}
            color="#6b7280"
          />
          <Text style={st.metaText}>
            {item.mode === "online" ? "Online" : (item.location ?? "Offline")}
          </Text>
        </View>
      </View>

      {/* actions */}
      {item.mode === "online" ? (
        <Pressable
          onPress={() => joinMeet(item.meetingUrl)}
          style={[st.actionBtn, { backgroundColor: "#111827" }]}
        >
          <Text style={[st.actionText, { color: "#fff" }]}>Join Meet</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => openMap(item.location)}
          style={[
            st.actionBtn,
            {
              backgroundColor: "#f3f4f6",
              borderWidth: 1,
              borderColor: "#e5e7eb",
            },
          ]}
        >
          <Text style={[st.actionText, { color: "#111827" }]}>View Map</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => router.back()} style={st.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Text style={st.headerTitle}>Session Lessons</Text>
          <View style={{ width: 36 }} />
        </View>

        {!!session && (
          <Text style={st.headerSub}>
            {session.coachName} •{" "}
            {new Date(session.startAt).toLocaleDateString()}{" "}
            {new Date(session.startAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
        {/* Attendance (offline only) */}
        {session?.mode === "offline" && (
          <View style={{ paddingHorizontal: 16 }}>
            <View style={att.card}>
              <View style={{ flex: 1 }}>
                <Text style={att.title}>Attendance</Text>
                <View style={att.row}>
                  <Ionicons name="location-outline" size={16} color="#6b7280" />
                  <Text style={att.text}>
                    {session?.location ?? "Training court"}
                  </Text>
                </View>
                <View style={att.row}>
                  <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                  <Text style={att.text}>
                    {new Date(session.startAt).toLocaleDateString()} •{" "}
                    {new Date(session.startAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(session.endAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View
                  style={[
                    att.statusBox,
                    !checkInAt
                      ? { backgroundColor: "#fef3c7", borderColor: "#fde68a" }
                      : !checkOutAt
                        ? { backgroundColor: "#d1fae5", borderColor: "#a7f3d0" }
                        : {
                            backgroundColor: "#e5e7eb",
                            borderColor: "#d1d5db",
                          },
                  ]}
                >
                  <Text style={att.statusText}>
                    {!checkInAt
                      ? "Not checked in"
                      : !checkOutAt
                        ? `Checked in at ${checkInAt.toLocaleTimeString()}`
                        : `Checked out at ${checkOutAt.toLocaleTimeString()}`}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <Pressable
                  disabled={!!checkInAt}
                  onPress={handleCheckIn}
                  style={[
                    att.btn,
                    {
                      backgroundColor: "#111827",
                      opacity: checkInAt ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text style={att.btnText}>Check in</Text>
                </Pressable>
                <Pressable
                  disabled={!checkInAt || !!checkOutAt}
                  onPress={handleCheckOut}
                  style={[
                    att.btn,
                    {
                      backgroundColor: "#f3f4f6",
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      opacity: !checkInAt || checkOutAt ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text style={[att.btnText, { color: "#111827" }]}>
                    Check out
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Lessons */}
      <FlatList
        data={lessons}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 0,
          paddingBottom: session?.status === "completed" ? 100 : 24, // Space for feedback button
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={st.empty}>
            <Ionicons name="book-outline" size={48} color="#d1d5db" />
            <Text style={st.emptyTitle}>No lessons</Text>
            <Text style={st.emptyText}>This session has no lessons yet.</Text>
          </View>
        }
      />

      {/* Feedback Button - Show only for completed sessions */}
      {session?.status === "completed" && (
        <View style={st.feedbackContainer}>
          <Pressable
            onPress={() =>
              router.push(
                `/(learner)/coach/my-sessions/feedback?id=${session.id}` as any,
              )
            }
            style={st.feedbackButton}
          >
            <Ionicons name="star-outline" size={20} color="#fff" />
            <Text style={st.feedbackButtonText}>Write Feedback</Text>
          </Pressable>
        </View>
      )}

      {/* Completion Action - Show for offline sessions that are checked out */}
      {session?.mode === "offline" &&
        checkInAt &&
        checkOutAt &&
        session?.status !== "completed" && (
          <View style={st.feedbackContainer}>
            <Pressable
              onPress={() => {
                // Mark session as completed and show feedback
                Alert.alert(
                  "Session Completed!",
                  "Great job! Would you like to leave feedback for your coach?",
                  [
                    {
                      text: "Later",
                      style: "cancel",
                    },
                    {
                      text: "Write Feedback",
                      onPress: () =>
                        router.push(
                          `/(learner)/coach/my-sessions/feedback?id=${session.id}` as any,
                        ),
                    },
                  ],
                );
              }}
              style={[st.feedbackButton, { backgroundColor: "#059669" }]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={st.feedbackButtonText}>Complete Session</Text>
            </Pressable>
          </View>
        )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(107,114,128,0.1)",
    width: 36,
    alignItems: "center",
  },
  headerTitle: { fontWeight: "900", color: "#111827", fontSize: 18 },
  headerSub: { color: "#6b7280", marginTop: 6 },

  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { color: "#111827", fontWeight: "800" },
  summary: { color: "#374151", marginTop: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { color: "#6b7280", marginLeft: 6 },
  dot: { color: "#9ca3af", marginHorizontal: 6 },
  actionBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  actionText: { fontWeight: "800" },

  empty: { alignItems: "center", paddingVertical: 48 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },

  // Feedback Button
  feedbackContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  feedbackButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  feedbackButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
const att = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  title: { color: "#111827", fontWeight: "800", marginBottom: 6, fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  text: { color: "#6b7280", marginLeft: 6 },
  statusBox: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statusText: { color: "#111827", fontWeight: "700" },
  btn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: 110,
  },
  btnText: { color: "#fff", fontWeight: "800" },
});
