import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CommunityScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "groups" | "leaderboard"
  >("overview");
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Refs for enhanced scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowScrollToTop(offsetY > 300);
      },
    },
  );

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);

  const renderHeader = () => (
    <LinearGradient colors={["#2E7D32", "#388E3C"]} style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>Community Hub</Text>
          <Text style={styles.headerSubtitle}>
            Connect, Learn, Play Together
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/(learner)/menu")}
        >
          <Ionicons name="person-circle-outline" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      {[
        { key: "overview", label: "Overview", icon: "home-outline" },
        { key: "events", label: "Events", icon: "calendar-outline" },
        { key: "groups", label: "Groups", icon: "people-outline" },
        { key: "leaderboard", label: "Rankings", icon: "trophy-outline" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton,
            activeTab === tab.key && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push("/(learner)/community/partner")}
        >
          <LinearGradient
            colors={["#FF6B6B", "#FF8E8E"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="people" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Find Partners</Text>
            <Text style={styles.quickActionSubtitle}>
              Match by skill & location
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard}>
          <LinearGradient
            colors={["#4ECDC4", "#44A08D"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="location" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Find Courts</Text>
            <Text style={styles.quickActionSubtitle}>
              Nearby available courts
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard}>
          <LinearGradient
            colors={["#A8E6CF", "#7FCDCD"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="trophy" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Challenges</Text>
            <Text style={styles.quickActionSubtitle}>
              Join weekly challenges
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push("/(learner)/community/invites")}
        >
          <LinearGradient
            colors={["#FFB6C1", "#FFA0AC"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="mail" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Invitations</Text>
            <Text style={styles.quickActionSubtitle}>3 pending invites</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Community Activity</Text>
      <View style={styles.activityCard}>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="trophy" size={16} color="#FF6B35" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Sarah J. won the Weekend Tournament!
            </Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="people" size={16} color="#4ECDC4" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              Mike C. joined &quot;Advanced Players&quot; group
            </Text>
            <Text style={styles.activityTime}>5 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="calendar" size={16} color="#A8E6CF" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              New tournament: &quot;Spring Championship&quot; announced
            </Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCommunityStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Community Stats</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1,247</Text>
          <Text style={styles.statLabel}>Active Players</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>Weekly Events</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Available Courts</Text>
        </View>
      </View>
    </View>
  );

  const renderUpcomingEvents = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>

      <TouchableOpacity style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventTypeChip, { backgroundColor: "#FF6B35" }]}>
            <Text style={styles.eventTypeText}>TOURNAMENT</Text>
          </View>
          <View style={styles.skillLevelChip}>
            <Text style={styles.skillLevelText}>Intermediate</Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>Weekend Warriors Tournament</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>2024-01-15 at 09:00 AM</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>Central Sports Complex</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>24/32 participants</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinEventButton}>
          <Text style={styles.joinEventText}>Join Event</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventTypeChip, { backgroundColor: "#4ECDC4" }]}>
            <Text style={styles.eventTypeText}>MEETUP</Text>
          </View>
          <View style={styles.skillLevelChip}>
            <Text style={styles.skillLevelText}>Beginner</Text>
          </View>
        </View>

        <Text style={styles.eventTitle}>Beginner Friendly Meetup</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>2024-01-13 at 06:00 PM</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>
              Community Recreation Center
            </Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.eventDetailText}>12/20 participants</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinEventButton}>
          <Text style={styles.joinEventText}>Join Event</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const renderCommunityGroups = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Community Groups</Text>

      <TouchableOpacity style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <View>
            <Text style={styles.groupName}>Beginner Players United</Text>
            <Text style={styles.groupDescription}>
              Perfect group for those just starting their pickleball journey
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.groupJoinButton, styles.groupJoinedButton]}
          >
            <Text style={[styles.groupJoinText, styles.groupJoinedText]}>
              Joined
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.groupFooter}>
          <View style={styles.groupMemberInfo}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.groupMemberText}>127 members</Text>
          </View>
          <View
            style={[styles.groupCategoryChip, { backgroundColor: "#E3F2FD" }]}
          >
            <Text style={styles.groupCategoryText}>skill</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <View>
            <Text style={styles.groupName}>Downtown Picklers</Text>
            <Text style={styles.groupDescription}>
              Players from the downtown area - easy meetups!
            </Text>
          </View>
          <TouchableOpacity style={styles.groupJoinButton}>
            <Text style={styles.groupJoinText}>Join</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.groupFooter}>
          <View style={styles.groupMemberInfo}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.groupMemberText}>89 members</Text>
          </View>
          <View
            style={[styles.groupCategoryChip, { backgroundColor: "#E8F5E8" }]}
          >
            <Text style={styles.groupCategoryText}>location</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Community Leaderboard</Text>
      <Text style={styles.sectionSubtitle}>
        Rankings based on participation, achievements, and community engagement
      </Text>

      <View style={styles.leaderboardContainer}>
        {[
          {
            name: "Sarah Johnson",
            avatar: "https://i.pravatar.cc/200?img=1",
            points: 2850,
            rank: 1,
            badge: "🏆",
          },
          {
            name: "Mike Chen",
            avatar: "https://i.pravatar.cc/200?img=2",
            points: 2720,
            rank: 2,
            badge: "🥈",
          },
          {
            name: "Emma Davis",
            avatar: "https://i.pravatar.cc/200?img=3",
            points: 2650,
            rank: 3,
            badge: "🥉",
          },
          {
            name: "Alex Rodriguez",
            avatar: "https://i.pravatar.cc/200?img=4",
            points: 2480,
            rank: 4,
            badge: "⭐",
          },
          {
            name: "Lisa Wang",
            avatar: "https://i.pravatar.cc/200?img=5",
            points: 2350,
            rank: 5,
            badge: "⭐",
          },
        ].map((item) => (
          <View key={item.rank} style={styles.leaderboardItem}>
            <View style={styles.leaderboardLeft}>
              <Text style={styles.leaderboardRank}>#{item.rank}</Text>
              <Image
                source={{ uri: item.avatar }}
                style={styles.leaderboardAvatar}
              />
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardName}>{item.name}</Text>
                <Text style={styles.leaderboardPoints}>
                  {item.points.toLocaleString()} points
                </Text>
              </View>
            </View>
            <Text style={styles.leaderboardBadge}>{item.badge}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {renderQuickActions()}
            {renderRecentActivity()}
            {renderCommunityStats()}
          </>
        );
      case "events":
        return renderUpcomingEvents();
      case "groups":
        return renderCommunityGroups();
      case "leaderboard":
        return renderLeaderboard();
      default:
        return renderQuickActions();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabNavigation()}

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2E7D32"]}
            tintColor="#2E7D32"
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {renderContent()}
      </ScrollView>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Animated.View
          style={[
            styles.scrollToTopButton,
            {
              opacity: scrollY.interpolate({
                inputRange: [300, 400],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [300, 400],
                    outputRange: [0.8, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.scrollToTopInner}
            onPress={scrollToTop}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-up" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Extra space for scroll to top button
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 4,
  },
  activeTabButton: {
    backgroundColor: "#2E7D32",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 16,
  },
  quickActionsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  quickActionCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  quickActionGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  quickActionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  quickActionSubtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  eventTypeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  skillLevelChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
  },
  skillLevelText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1976D2",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: "#666",
  },
  joinEventButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  joinEventText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    maxWidth: width * 0.6,
  },
  groupDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    maxWidth: width * 0.6,
  },
  groupJoinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  groupJoinedButton: {
    backgroundColor: "#2E7D32",
  },
  groupJoinText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
  groupJoinedText: {
    color: "#fff",
  },
  groupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupMemberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  groupMemberText: {
    fontSize: 12,
    color: "#666",
  },
  groupCategoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  groupCategoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666",
  },
  leaderboardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leaderboardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  leaderboardRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    width: 32,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  leaderboardPoints: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  leaderboardBadge: {
    fontSize: 24,
  },
  // Scroll to Top Button Styles
  scrollToTopButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  scrollToTopInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
