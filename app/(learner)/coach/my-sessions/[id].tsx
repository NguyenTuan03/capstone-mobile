import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
        <Text>Không tìm thấy buổi học</Text>
      </SafeAreaView>
    );
  }

  const isFuture = +new Date(s.startAt) > Date.now();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
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
            Chi tiết Buổi học
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8 }}>
          Buổi học với {s.coachName}
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
          <Text>Link họp: {s.meetingUrl}</Text>
        ) : (
          <Text>Địa điểm: {s.location}</Text>
        )}
      </ScrollView>

      {/* Fixed Bottom Button Container */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingHorizontal: 16,
          paddingVertical: 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {isFuture && s.status === "upcoming" && (
            <>
              <Pressable
                onPress={() => router.replace(s.meetingUrl! as any)}
                style={{
                  backgroundColor: "#111827",
                  padding: 12,
                  borderRadius: 10,
                  marginRight: 8,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  Tham gia
                </Text>
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
                  flex: 1,
                }}
              >
                <Text style={{ fontWeight: "800", textAlign: "center" }}>
                  Hủy
                </Text>
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
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "800",
                  textAlign: "center",
                }}
              >
                Đánh dấu Hoàn thành
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
