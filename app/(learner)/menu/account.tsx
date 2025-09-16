import React from "react";
import { SafeAreaView, View, Text, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "700",
            marginRight: 22,
          }}
        >
          MY ACCOUNT
        </Text>
      </View>

      {/* Avatar + QR */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            backgroundColor: "#C084FC",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#000", fontWeight: "800", fontSize: 28 }}>
            TN
          </Text>
        </View>
        <Text style={{ color: "#6b7280", marginBottom: 16 }}>
          Edit profile photo
        </Text>

        {/* QR code fake */}
        <Image
          source={{
            uri: "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=userid123",
          }}
          style={{ width: 120, height: 120 }}
        />
      </View>

      {/* Info rows */}
      <InfoRow label="FIRST NAME" value="Tuan" />
      <InfoRow label="LAST NAME" value="Nguyen" />
      <InfoRow
        label="EMAIL"
        value="nguyenanhtuan.170164@gmail.com"
        selectable
      />
      <InfoRow
        label="PASSWORD"
        value="********"
        action={
          <Pressable
            onPress={() => console.log("Change password")}
            style={{
              borderWidth: 1,
              borderColor: "#111",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Change</Text>
          </Pressable>
        }
      />

      {/* Bottom actions */}
      <View style={{ marginTop: 32, alignItems: "center", gap: 20 }}>
        <Pressable onPress={() => console.log("Restore purchases")}>
          <Text style={{ fontSize: 15, fontWeight: "600" }}>
            Restore Purchases
          </Text>
        </Pressable>

        <Pressable onPress={() => console.log("Delete account")}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "red" }}>
            Delete Account
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  action,
  selectable,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
  selectable?: boolean;
}) {
  return (
    <View
      style={{
        borderTopWidth: 0.5,
        borderColor: "#E5E7EB",
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            marginTop: 2,
            maxWidth: 240,
          }}
          selectable={selectable}
        >
          {value}
        </Text>
      </View>
      {action}
    </View>
  );
}
