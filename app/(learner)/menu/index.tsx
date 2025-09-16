import React from "react";
import MenuList, { MenuItem } from "@/components/common/AppMenu";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MenuScreen() {
  const items: MenuItem[] = [
    {
      key: "account",
      label: "My Account",
      icon: <Ionicons name="person-outline" size={20} color="#111" />,
    },
    {
      key: "profile",
      label: "Player Profile",
      icon: <MaterialIcons name="sports-tennis" size={20} color="#111" />,
    },
    {
      key: "goals",
      label: "My DUPR Goals",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
    },
    {
      key: "dupr-app",
      label: "DUPR App",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
    },
    {
      key: "coach",
      label: "Find a Coach",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
    },
    {
      key: "share",
      label: "Share",
      icon: <MaterialIcons name="share" size={20} color="#111" />,
    },
    {
      key: "gift",
      label: "Gift a Player",
      icon: <Ionicons name="gift-outline" size={20} color="#111" />,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <Ionicons name="notifications-outline" size={20} color="#111" />,
    },
    {
      key: "faq",
      label: "FAQ",
      icon: <MaterialIcons name="open-in-new" size={20} color="#111" />,
    },
    {
      key: "feedback",
      label: "Feedback / Support",
      icon: <Ionicons name="thumbs-up-outline" size={20} color="#111" />,
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
      <MenuList title="MENU" items={items} />
    </SafeAreaView>
  );
}
