import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, cancelSession, completeSession } = useBookings();
  const s = id ? getById(id) : undefined;
  const insets = useSafeAreaInsets();
  if (!s) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text>Session not found</Text>
      </SafeAreaView>
    );
  }

  const isFuture = +new Date(s.startAt) > Date.now();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
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
        <Text style={{ fontWeight: "900", color: "#111827", fontSize: 18 }}>
          Session Details
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
        Session with {s.coachName}
      </Text>
      <Text style={{ color: "#6b7280", marginTop: 6 }}>
        {new Date(s.startAt).toLocaleString()} —{" "}
        {new Date(s.endAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={{ marginTop: 6, fontWeight: "700" }}>
        {s.mode.toUpperCase()}
      </Text>
      {s.mode === "online" ? (
        <Text>Meeting: {s.meetingUrl}</Text>
      ) : (
        <Text>Location: {s.location}</Text>
      )}

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {isFuture && s.status === "upcoming" && (
          <>
            <Pressable
              onPress={() => router.replace(s.meetingUrl! as any)}
              style={{
                backgroundColor: "#111827",
                padding: 12,
                borderRadius: 10,
                marginRight: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>Join</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                cancelSession(s.id);
                router.back();
              }}
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: "800" }}>Cancel</Text>
            </Pressable>
          </>
        )}
        {!isFuture && s.status === "upcoming" && (
          <Pressable
            onPress={() => {
              completeSession(s.id);
              router.back();
            }}
            style={{
              backgroundColor: "#10B981",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>
              Mark Completed
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
