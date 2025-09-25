import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SessionStatus = "upcoming" | "completed" | "canceled";

export default function MySessions() {
  const { sessions } = useBookings();
  const [filter, setFilter] = useState<SessionStatus | "all">("all");
  const insets = useSafeAreaInsets();
  const filteredSessions = useMemo(() => {
    if (filter === "all") return sessions;
    return sessions.filter((s) => s.status === filter);
  }, [sessions, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "canceled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
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
            My Sessions
          </Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.subtitle}>
          {sessions.length} session{sessions.length !== 1 ? "s" : ""} booked
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {(["all", "upcoming", "completed", "canceled"] as const).map(
          (status) => (
            <Pressable
              key={status}
              onPress={() => setFilter(status)}
              style={[
                styles.filterChip,
                filter === status && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === status && styles.filterTextActive,
                ]}
              >
                {status === "all" ? "All" : getStatusText(status)}
              </Text>
            </Pressable>
          ),
        )}
      </View>

      {/* Sessions List */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push(`/(learner)/coach/my-sessions/${item.id}` as any)
            }
            style={styles.sessionCard}
          >
            <View style={styles.sessionHeader}>
              <Text style={styles.coachName}>{item.coachName}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>

            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  {new Date(item.startAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  {new Date(item.startAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(item.endAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name={
                    item.mode === "online"
                      ? "videocam-outline"
                      : "location-outline"
                  }
                  size={16}
                  color="#6b7280"
                />
                <Text style={styles.detailText}>
                  {item.mode === "online" ? "Online" : item.location}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>${item.price}/hour</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No sessions found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === "all"
                ? "Book your first session with a coach"
                : `No ${filter} sessions`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  separator: {
    height: 12,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
  sessionHeader: {
    flex: 1,
    marginRight: 12,
  },
  coachName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  sessionDetails: {
    flex: 2,
    marginRight: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 6,
  },
  cardFooter: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
});
