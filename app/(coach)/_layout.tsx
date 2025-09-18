import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";
export default function LearnerTabs() {
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
          title: "Dashboard",
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
          title: "Calendar",
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
        name="students/index"
        options={{
          title: "Students",
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
        name="earnings/index"
        options={{
          title: "Earnings",
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
        name="menu/index"
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
    </Tabs>
  );
}
