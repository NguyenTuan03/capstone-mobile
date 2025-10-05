import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, useRouter } from "expo-router";

// TypeScript interfaces
interface CoachProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description?: string;
  action?: () => void;
}

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const coachProfile: CoachProfile = {
    id: "1",
    name: "Coach Anderson",
    avatar: "https://i.pravatar.cc/150?img=8",
    title: "Certified Pickleball Instructor",
    rating: 4.9,
    reviewCount: 127,
    specialties: [
      "Beginner Training",
      "Advanced Techniques",
      "Competition Prep",
    ],
  };

  const profileItems: MenuItem[] = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: "user",
      description: "Update your personal information",
      action: () =>
        Alert.alert("Edit Profile", "Profile editing feature coming soon!"),
    },
    {
      id: "availability",
      title: "Availability & Pricing",
      icon: "calendar",
      description: "Manage your schedule and rates",
      action: () =>
        Alert.alert("Availability", "Availability settings coming soon!"),
    },
    {
      id: "specialties",
      title: "Teaching Specialties",
      icon: "target",
      description: "Update your areas of expertise",
      action: () =>
        Alert.alert("Specialties", "Specialties management coming soon!"),
    },
    {
      id: "credentials",
      title: "Credentials",
      icon: "award",
      description: "Manage your certifications",
      action: () =>
        Alert.alert("Credentials", "Credentials management coming soon!"),
    },
  ];

  const appItems: MenuItem[] = [
    {
      id: "notifications",
      title: "Notifications",
      icon: "bell",
      description: "Manage notification preferences",
      action: () =>
        Alert.alert("Notifications", "Notification settings coming soon!"),
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      icon: "shield",
      description: "Control your privacy preferences",
      action: () => Alert.alert("Privacy", "Privacy settings coming soon!"),
    },
    {
      id: "payment",
      title: "Payment Methods",
      icon: "credit-card",
      description: "Manage payment and banking info",
      action: () => Alert.alert("Payment", "Payment methods coming soon!"),
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle",
      description: "Get help and contact support",
      action: () => Alert.alert("Help", "Help & Support coming soon!"),
    },
  ];

  const accountItems: MenuItem[] = [
    {
      id: "logout",
      title: "Sign Out",
      icon: "log-out",
      description: "Sign out of your account",
      action: () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: () => router.push("/(auth)" as Href),
          },
        ]);
      },
    },
  ];

  const renderMenuItem = (item: MenuItem, isLast: boolean = false) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, isLast && styles.lastMenuItem]}
      onPress={item.action}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Feather name={item.icon as any} size={20} color="#6b7280" />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.menuItemDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Profile Section */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.profileSection}>
          <Image source={{ uri: coachProfile.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{coachProfile.name}</Text>
            <Text style={styles.profileTitle}>{coachProfile.title}</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>
                {coachProfile.rating} ({coachProfile.reviewCount} reviews)
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.specialtiesContainer}>
          <Text style={styles.specialtiesTitle}>Specialties</Text>
          <View style={styles.specialtiesTags}>
            {coachProfile.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          <View style={styles.sectionCard}>
            {profileItems.map((item, index) =>
              renderMenuItem(item, index === profileItems.length - 1),
            )}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.sectionCard}>
            {appItems.map((item, index) =>
              renderMenuItem(item, index === appItems.length - 1),
            )}
          </View>
        </View>

        {/* Account */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionCard}>
            {accountItems.map((item, index) =>
              renderMenuItem(item, index === accountItems.length - 1),
            )}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Pickleball Coach</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>
            © 2024 Pickleball Coach App
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  specialtiesContainer: {
    marginTop: 8,
  },
  specialtiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  specialtiesTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    overflow: "hidden",
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
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  appInfoCopyright: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
