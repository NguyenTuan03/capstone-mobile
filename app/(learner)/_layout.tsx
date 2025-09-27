import { SkillTrackingProvider } from "@/modules/learner/context/skillTrackingContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
export default function LearnerTabs() {
  return (
    <SkillTrackingProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#111827", // text/icon active
          tabBarInactiveTintColor: "#9CA3AF", // text/icon inactive
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 4,
          },
          tabBarStyle: {
            position: "absolute",
            height: 64,
            borderTopWidth: 0,
            backgroundColor: "#fff",
            marginHorizontal: 16,
            marginBottom: 12,
            borderRadius: 24,
            paddingVertical: 6,
            // shadow
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
              },
              android: { elevation: 8 },
            }),
          },
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="roadmap"
          options={{
            title: "Lộ trình",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons
                name={focused ? "map" : "map"}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="upload/index"
          options={{
            title: "AI",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "cloud-upload" : "cloud-upload-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coach"
          options={{
            title: "HLV",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "play-circle" : "play-circle-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Cộng đồng",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* Hidden screens - không hiển thị trên tab bar */}
        <Tabs.Screen
          name="payment"
          options={{
            href: null, // Ẩn khỏi tab bar
          }}
        />
        <Tabs.Screen
          name="payment-success"
          options={{
            href: null, // Ẩn khỏi tab bar
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            href: null, // Ẩn khỏi tab bar
          }}
        />
      </Tabs>
    </SkillTrackingProvider>
  );
}
