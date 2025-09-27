import React from "react";
import MenuList, { MenuItem } from "@/components/common/AppMenu";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, router } from "expo-router";

export default function MenuScreen() {
  const items: MenuItem[] = [
    {
      key: "account",
      label: "Tài khoản của tôi",
      icon: <Ionicons name="person-outline" size={20} color="#111" />,
      onPress: () => router.push("/menu/account"),
    },
    {
      key: "profile",
      label: "Hồ sơ người chơi",
      icon: <MaterialIcons name="sports-tennis" size={20} color="#111" />,
    },
    {
      key: "community",
      label: "Cộng đồng",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
      onPress: () => router.push("/menu/community"),
    },
    {
      key: "dupr-app",
      label: "Ứng dụng DUPR",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
    },
    {
      key: "coach",
      label: "Tìm huấn luyện viên",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
    },
    {
      key: "share",
      label: "Chia sẻ",
      icon: <MaterialIcons name="share" size={20} color="#111" />,
    },
    {
      key: "gift",
      label: "Tặng người chơi",
      icon: <Ionicons name="gift-outline" size={20} color="#111" />,
    },
    {
      key: "notifications",
      label: "Thông báo",
      icon: <Ionicons name="notifications-outline" size={20} color="#111" />,
    },
    {
      key: "feedback",
      label: "Feedback / Support",
      icon: <Ionicons name="thumbs-up-outline" size={20} color="#111" />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <MaterialIcons name="logout" size={20} color="#111" />,
      onPress: () => router.push("/(auth)" as Href),
    },
  ];
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
      }}
    >
      <ScrollView>
        <MenuList title="MENU" items={items} />
      </ScrollView>
    </SafeAreaView>
  );
}
