import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  const renderHeader = (title: string) => (
    <ThemedView style={styles.header}>
      <ThemedText type="title" style={styles.headerTitle}>
        {title}
      </ThemedText>
      <Pressable
        style={styles.headerButton}
        onPress={() => router.push("/(learner)/menu")}
      >
        <Ionicons name="person-circle-outline" size={28} color="#059669" />
      </Pressable>
    </ThemedView>
  );

  const renderDashboard = () => (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={true}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#059669"]}
          tintColor="#059669"
          progressBackgroundColor="#ffffff"
        />
      }
    >
      {renderHeader("Dashboard")}

      {/* Welcome Section */}
      <ThemedView style={styles.welcomeSection}>
        <ThemedText type="title" style={styles.welcomeTitle}>
          Welcome back, Player!
        </ThemedText>
        <ThemedText style={styles.welcomeSubtitle}>
          Ready to improve your pickleball skills?
        </ThemedText>
        <View style={styles.progressContainer}>
          <ThemedText type="defaultSemiBold" style={styles.progressLabel}>
            Learning Progress
          </ThemedText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "65%" }]} />
          </View>
          <ThemedText style={styles.progressText}>65% Complete</ThemedText>
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Quick Actions
      </ThemedText>
      <View style={styles.quickActionsGrid}>
        <Pressable
          onPress={() => router.push("/(learner)/roadmap/")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="play-circle-outline" size={32} color="#059669" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.actionText}>
            Watch Tutorials
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => {
            /* TODO: Implement video upload functionality */
          }}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="camera-outline" size={32} color="#ea580c" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.actionText}>
            AI Analysis
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(learner)/coach/")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="people-outline" size={32} color="#2563eb" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.actionText}>
            Find Coach
          </ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="location-outline" size={32} color="#7c3aed" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.actionText}>
            Find Courts
          </ThemedText>
        </Pressable>
      </View>

      {/* Recent Activity */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Recent Activity
      </ThemedText>
      <ThemedView style={styles.activityContainer}>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
          </View>
          <View style={styles.activityContent}>
            <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
              Completed: Basic Forehand
            </ThemedText>
            <ThemedText style={styles.activityTime}>2 hours ago</ThemedText>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="star" size={24} color="#eab308" />
          </View>
          <View style={styles.activityContent}>
            <ThemedText type="defaultSemiBold" style={styles.activityTitle}>
              Achievement: First Lesson!
            </ThemedText>
            <ThemedText style={styles.activityTime}>1 day ago</ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );

  return renderDashboard();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#059669",
    fontSize: 20,
  },
  welcomeSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeTitle: {
    color: "#059669",
    fontSize: 24,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: "#6b7280",
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressLabel: {
    color: "#1f2937",
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
  },
  sectionTitle: {
    color: "#1f2937",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  actionButton: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: (width - 56) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    color: "#1f2937",
    fontSize: 14,
    textAlign: "center",
  },
  activityContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityIcon: {
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "#1f2937",
    fontSize: 16,
  },
  activityTime: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
