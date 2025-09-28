import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Coach {
  name: string;
  avatar: string;
  rating: number;
}

interface Session {
  id: number;
  type: "online" | "offline";
  title: string;
  coach: Coach;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: "confirmed" | "completed" | "cancelled";
  location?: string;
  feedback?: string;
  userRating?: number;
  cancelReason?: string;
}

type TabType = "upcoming" | "completed" | "cancelled";

const MySessionsScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Mock data for sessions
  const sessions: Record<TabType, Session[]> = {
    upcoming: [
      {
        id: 1,
        type: "online",
        title: "Advanced Serve Techniques",
        coach: {
          name: "Coach Sarah Johnson",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          rating: 4.9,
        },
        date: "2025-01-05",
        time: "10:00 AM",
        duration: 60,
        price: 45,
        status: "confirmed",
      },
      {
        id: 2,
        type: "offline",
        title: "Beginner Fundamentals",
        coach: {
          name: "Coach Mike Chen",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 4.8,
        },
        date: "2025-01-07",
        time: "2:00 PM",
        duration: 90,
        price: 60,
        location: "Central Sports Complex",
        status: "confirmed",
      },
    ],
    completed: [
      {
        id: 3,
        type: "online",
        title: "Dinking Strategy Session",
        coach: {
          name: "Coach Lisa Park",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4.7,
        },
        date: "2024-12-28",
        time: "3:00 PM",
        duration: 45,
        price: 35,
        status: "completed",
        feedback: "Great session! Learned a lot about court positioning.",
        userRating: 5,
      },
      {
        id: 4,
        type: "offline",
        title: "Footwork Improvement",
        coach: {
          name: "Coach David Wilson",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 4.6,
        },
        date: "2024-12-25",
        time: "11:00 AM",
        duration: 75,
        price: 55,
        location: "Riverside Pickleball Courts",
        status: "completed",
        userRating: 4,
      },
    ],
    cancelled: [
      {
        id: 5,
        type: "online",
        title: "Power Shots Masterclass",
        coach: {
          name: "Coach Emma Davis",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
          rating: 4.8,
        },
        date: "2024-12-30",
        time: "4:00 PM",
        duration: 60,
        price: 50,
        status: "cancelled",
        cancelReason: "Coach unavailable due to illness",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "completed":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleSessionPress = (session: Session) => {
    setSelectedSession(session);
    Alert.alert(
      session.title,
      `Coach: ${session.coach.name}\nDate: ${session.date} at ${session.time}\nDuration: ${session.duration} minutes\nPrice: $${session.price}`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "View Details",
          onPress: () => {
            // Navigate to session details
            router.push(`/(learner)/coach/my-sessions/${session.id}`);
          },
        },
      ],
    );
  };

  const handleJoinSession = (session: Session) => {
    if (session.type === "online") {
      Alert.alert("Join Session", "Starting video call...", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join",
          onPress: () => {
            // Navigate to video call
            console.log("Joining session:", session.id);
          },
        },
      ]);
    } else {
      Alert.alert("Session Location", session.location || "Location TBD", [
        { text: "OK" },
      ]);
    }
  };

  const handleRateSession = (session: Session) => {
    Alert.alert(
      "Rate Session",
      `How would you rate your session with ${session.coach.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "1 Star", onPress: () => console.log("Rated 1 star") },
        { text: "2 Stars", onPress: () => console.log("Rated 2 stars") },
        { text: "3 Stars", onPress: () => console.log("Rated 3 stars") },
        { text: "4 Stars", onPress: () => console.log("Rated 4 stars") },
        { text: "5 Stars", onPress: () => console.log("Rated 5 stars") },
      ],
    );
  };

  const filteredSessions = sessions[activeTab].filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.coach.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderSessionCard = (session: Session) => (
    <TouchableOpacity
      key={session.id}
      style={styles.sessionCard}
      onPress={() => handleSessionPress(session)}
    >
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <View style={styles.coachInfo}>
            <Image
              source={{ uri: session.coach.avatar }}
              style={styles.coachAvatar}
            />
            <View style={styles.coachDetails}>
              <Text style={styles.coachName}>{session.coach.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={styles.ratingText}>{session.coach.rating}</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(session.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(session.status)}</Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{session.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{session.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="hourglass-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{session.duration} min</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name={
              session.type === "online"
                ? "videocam-outline"
                : "location-outline"
            }
            size={16}
            color="#6b7280"
          />
          <Text style={styles.detailText}>
            {session.type === "online"
              ? "Online"
              : session.location || "Location TBD"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>${session.price}</Text>
        </View>
      </View>

      {session.status === "confirmed" && (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinSession(session)}
        >
          <Ionicons
            name={session.type === "online" ? "videocam" : "location"}
            size={16}
            color="#fff"
          />
          <Text style={styles.joinButtonText}>
            {session.type === "online" ? "Join Session" : "View Location"}
          </Text>
        </TouchableOpacity>
      )}

      {session.status === "completed" && session.userRating && (
        <View style={styles.ratingDisplay}>
          <Text style={styles.ratingLabel}>Your Rating:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= session.userRating! ? "star" : "star-outline"}
                size={16}
                color="#fbbf24"
              />
            ))}
          </View>
        </View>
      )}

      {session.status === "completed" && !session.userRating && (
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => handleRateSession(session)}
        >
          <Ionicons name="star-outline" size={16} color="#3b82f6" />
          <Text style={styles.rateButtonText}>Rate Session</Text>
        </TouchableOpacity>
      )}

      {session.status === "cancelled" && session.cancelReason && (
        <View style={styles.cancelInfo}>
          <Text style={styles.cancelLabel}>Cancellation Reason:</Text>
          <Text style={styles.cancelText}>{session.cancelReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Sessions</Text>
        <TouchableOpacity onPress={() => setFilterVisible(!filterVisible)}>
          <Ionicons name="filter" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sessions or coaches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(["upcoming", "completed", "cancelled"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {sessions[tab].length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sessions List */}
      <ScrollView
        style={styles.sessionsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredSessions.length > 0 ? (
          filteredSessions.map(renderSessionCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No {activeTab} sessions</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "upcoming"
                ? "You don't have any upcoming sessions"
                : `You don't have any ${activeTab} sessions`}
            </Text>
            {activeTab === "upcoming" && (
              <TouchableOpacity
                style={styles.bookSessionButton}
                onPress={() => router.push("/(learner)/coach")}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.bookSessionButtonText}>Book a Session</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  sessionsList: {
    flex: 1,
    padding: 20,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  coachInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  coachDetails: {
    flex: 1,
  },
  coachName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  sessionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  rateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
  },
  cancelInfo: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  cancelLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 4,
  },
  cancelText: {
    fontSize: 14,
    color: "#991b1b",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
  },
  bookSessionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  bookSessionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export default MySessionsScreen;
