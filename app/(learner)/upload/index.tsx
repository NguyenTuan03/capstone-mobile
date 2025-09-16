import React from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function UploadScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top + 12 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        {/* Header */}
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
          UPLOAD
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: 40,
            lineHeight: 20,
          }}
        >
          See below your film uploads. Tap to play and review your coach&apos;s
          feedback.
        </Text>

        {/* Empty state */}
        <Text style={{ color: "#6b7280", marginBottom: 24 }}>
          You currently have no films.
        </Text>

        {/* Upload button */}
        <Pressable
          onPress={() => console.log("Upload film")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111",
            paddingVertical: 14,
            paddingHorizontal: 28,
            borderRadius: 12,
          }}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            UPLOAD FILM
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
