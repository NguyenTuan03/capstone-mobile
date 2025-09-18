import React from "react";
import { Pressable, Text, View } from "react-native";

export type MenuItem = {
  key: string;
  label: string;
  icon?: any;
  onPress?: () => void;
};

type MenuListProps = {
  title?: string;
  items: MenuItem[];
};

export default function MenuList({ title, items }: MenuListProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {title && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      )}
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={item.onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
            borderBottomWidth: 0.5,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <View style={{ width: 32, alignItems: "center" }}>{item.icon}</View>
          <Text style={{ marginLeft: 12, fontSize: 15, fontWeight: "700" }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
