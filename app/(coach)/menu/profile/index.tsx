import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CoachProfileEdit() {
  const [headline, setHeadline] = useState("Pickleball Coach · DUPR 4.5");
  const [bio, setBio] = useState(
    "10+ năm kinh nghiệm. Tập trung vào footwork, dinking và game IQ.",
  );
  const [experience, setExp] = useState("5");
  const [location, setLoc] = useState("HCMC, VN");
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <Header title="Professional Profile" />
      <View style={{ padding: 16 }}>
        <View style={st.row}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=23" }}
            style={st.avatar}
          />
          <Pressable style={st.btn}>
            <Ionicons name="cloud-upload-outline" size={16} color="#111827" />
            <Text style={st.btnTxt}>Change Photo</Text>
          </Pressable>
        </View>

        <Label>Headline</Label>
        <Input value={headline} onChangeText={setHeadline} />

        <Label>Bio</Label>
        <Input
          value={bio}
          onChangeText={setBio}
          multiline
          style={{ height: 120, textAlignVertical: "top" }}
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Label>Years of Experience</Label>
            <Input
              value={experience}
              onChangeText={setExp}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Label>Location</Label>
            <Input value={location} onChangeText={setLoc} />
          </View>
        </View>

        <Pressable
          style={[st.primary, { marginTop: 14 }]}
          onPress={() => router.back()}
        >
          <Text style={st.primaryTxt}>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={{ color: "#6b7280" }}>‹ Back</Text>
      </Pressable>
      <View style={{ flex: 1 }} />
      <Text style={{ fontWeight: "900", color: "#111827" }}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}
const Label = ({ children }: any) => (
  <Text
    style={{
      color: "#6b7280",
      fontWeight: "800",
      marginTop: 12,
      marginBottom: 6,
    }}
  >
    {children}
  </Text>
);
const Input = (p: any) => <TextInput {...p} style={[st.input, p.style]} />;

const st = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  btnTxt: { marginLeft: 6, fontWeight: "800", color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    color: "#111827",
  },
  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "900" },
});
