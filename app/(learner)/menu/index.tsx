import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

type MenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  onPress: () => void;
  badge?: string;
  isNew?: boolean;
};

export default function MenuScreen() {
  const router = useRouter();
  const [userStats] = useState({
    name: "Alex Johnson",
    level: "Intermediate",
    avatar: "https://i.pravatar.cc/200?img=8",
    totalPoints: 1850,
    completedLessons: 47,
    upcomingSessions: 2,
  });

  const menuSections: MenuSection[] = [
    {
      id: "learning",
      title: "Learning & Progress",
      items: [
        {
          id: "roadmap",
          title: "Learning Roadmap",
          subtitle: "Structured curriculum and lessons",
          icon: "map-outline",
          iconColor: "#2E7D32",
          onPress: () => router.push("/(learner)/roadmap"),
        },
        {
          id: "library",
          title: "Video Library",
          subtitle: "Access all tutorial videos",
          icon: "play-circle-outline",
          iconColor: "#1976D2",
          onPress: () => router.push("/(learner)/roadmap/library"),
        },
        {
          id: "progress",
          title: "Progress Tracking",
          subtitle: "View your learning analytics",
          icon: "trending-up-outline",
          iconColor: "#7B1FA2",
          onPress: () => Alert.alert("Progress", "Track your learning journey"),
        },
        {
          id: "achievements",
          title: "Achievements & Badges",
          subtitle: "Your unlocked achievements",
          icon: "trophy-outline",
          iconColor: "#F57C00",
          onPress: () =>
            Alert.alert("Achievements", "View your badges and rewards"),
        },
      ],
    },
    {
      id: "ai-analysis",
      title: "AI & Analysis",
      items: [
        {
          id: "upload",
          title: "Video Analysis",
          subtitle: "Upload videos for AI feedback",
          icon: "videocam-outline",
          iconColor: "#D32F2F",
          onPress: () => router.push("/(learner)/upload"),
        },
        {
          id: "technique-history",
          title: "Analysis History",
          subtitle: "Review past AI feedback",
          icon: "analytics-outline",
          iconColor: "#303F9F",
          onPress: () => Alert.alert("History", "View your analysis history"),
        },
        {
          id: "skill-assessment",
          title: "Skill Assessment",
          subtitle: "Take skill level tests",
          icon: "checkmark-circle-outline",
          iconColor: "#388E3C",
          onPress: () => Alert.alert("Assessment", "Evaluate your skills"),
          isNew: true,
        },
      ],
    },
    {
      id: "coaching",
      title: "Coaching & Sessions",
      items: [
        {
          id: "find-coaches",
          title: "Find Coaches",
          subtitle: "Browse and connect with coaches",
          icon: "people-outline",
          iconColor: "#5D4037",
          onPress: () => router.push("/(learner)/coach"),
        },
        {
          id: "my-sessions",
          title: "My Sessions",
          subtitle: "Manage your bookings",
          icon: "calendar-outline",
          iconColor: "#1976D2",
          onPress: () => router.push("/(learner)/coach/my-sessions"),
          badge: userStats.upcomingSessions.toString(),
        },
        {
          id: "session-notes",
          title: "Session Notes",
          subtitle: "Coach feedback and notes",
          icon: "document-text-outline",
          iconColor: "#7B1FA2",
          onPress: () => Alert.alert("Notes", "View session feedback"),
        },
        {
          id: "session-history",
          title: "Session History",
          subtitle: "Past coaching sessions",
          icon: "time-outline",
          iconColor: "#455A64",
          onPress: () => Alert.alert("History", "View session history"),
        },
      ],
    },
    {
      id: "community",
      title: "Community & Social",
      items: [
        {
          id: "community-hub",
          title: "Community Hub",
          subtitle: "Events, groups, and rankings",
          icon: "globe-outline",
          iconColor: "#E91E63",
          onPress: () => router.push("/(learner)/community"),
        },
        {
          id: "find-partners",
          title: "Find Practice Partners",
          subtitle: "Connect with local players",
          icon: "person-add-outline",
          iconColor: "#00BCD4",
          onPress: () => router.push("/(learner)/community/partner"),
        },
        {
          id: "invitations",
          title: "Community Invitations",
          subtitle: "Event and group invites",
          icon: "mail-outline",
          iconColor: "#FF5722",
          onPress: () => router.push("/(learner)/community/invites"),
          badge: "3",
        },
        {
          id: "tournaments",
          title: "Tournaments & Events",
          subtitle: "Join competitive events",
          icon: "medal-outline",
          iconColor: "#FF9800",
          onPress: () =>
            Alert.alert("Tournaments", "Browse upcoming tournaments"),
        },
      ],
    },
    {
      id: "account",
      title: "Account & Settings",
      items: [
        {
          id: "profile",
          title: "Profile Settings",
          subtitle: "Manage your profile information",
          icon: "person-outline",
          iconColor: "#424242",
          onPress: () => router.push("/(learner)/menu/account"),
        },
        {
          id: "notifications",
          title: "Notifications",
          subtitle: "Manage notification preferences",
          icon: "notifications-outline",
          iconColor: "#FF5722",
          onPress: () =>
            Alert.alert("Notifications", "Manage notification settings"),
        },
        {
          id: "privacy",
          title: "Privacy & Security",
          subtitle: "Account security settings",
          icon: "shield-outline",
          iconColor: "#4CAF50",
          onPress: () => Alert.alert("Privacy", "Manage privacy settings"),
        },
        {
          id: "payments",
          title: "Payment Methods",
          subtitle: "Manage payment and billing",
          icon: "card-outline",
          iconColor: "#9C27B0",
          onPress: () => Alert.alert("Payments", "Manage payment methods"),
        },
      ],
    },
    {
      id: "support",
      title: "Support & Help",
      items: [
        {
          id: "help-center",
          title: "Help Center",
          subtitle: "FAQs and guides",
          icon: "help-circle-outline",
          iconColor: "#2196F3",
          onPress: () => Alert.alert("Help", "Browse help articles"),
        },
        {
          id: "feedback",
          title: "Feedback & Support",
          subtitle: "Contact our support team",
          icon: "chatbubble-outline",
          iconColor: "#4CAF50",
          onPress: () => Alert.alert("Support", "Contact support team"),
        },
        {
          id: "share-app",
          title: "Share App",
          subtitle: "Invite friends to join",
          icon: "share-outline",
          iconColor: "#FF5722",
          onPress: () => Alert.alert("Share", "Share app with friends"),
        },
        {
          id: "about",
          title: "About Pickleball Pro",
          subtitle: "App version and info",
          icon: "information-circle-outline",
          iconColor: "#607D8B",
          onPress: () => Alert.alert("About", "App version 1.0.0"),
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.push("/(auth)"),
      },
    ]);
  };

  const renderUserProfile = () => (
    <LinearGradient
      colors={["#2E7D32", "#388E3C"]}
      style={styles.profileSection}
    >
      <View style={styles.profileContent}>
        <Image
          source={{ uri: userStats.avatar }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userStats.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{userStats.level}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {userStats.completedLessons}
              </Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {userStats.upcomingSessions}
              </Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[styles.menuIcon, { backgroundColor: `${item.iconColor}15` }]}
        >
          <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
        </View>
        <View style={styles.menuTextContainer}>
          <View style={styles.menuTitleRow}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>
          {item.subtitle && (
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: MenuSection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionCard}>
        {section.items.map((item, index) => (
          <View key={item.id}>
            {renderMenuItem(item)}
            {index < section.items.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderUserProfile()}

        {menuSections.map(renderSection)}

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pickleball Pro v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  levelText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginLeft: 80,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
