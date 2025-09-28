import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
export default function CoachTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111827", // text/icon active
        tabBarInactiveTintColor: "#9CA3AF", // text/icon inactive
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
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
        name="calendar/index"
        options={{
          title: "Lịch học",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Học viên",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings/index"
        options={{
          title: "Thu nhập",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cash" : "cash-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "menu" : "menu-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="drill"
        options={{
          href: null, // Ẩn khỏi tab bar
        }}
      />
    </Tabs>
  );
}
