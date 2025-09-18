import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Notifications() {
  const [booking, setBooking] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [payouts, setPayouts] = useState(true);
  const [email, setEmail] = useState(true);
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
      <Header title="Notifications" />
      <View style={{ padding: 16 }}>
        <Toggle
          label="Booking Requests"
          value={booking}
          onChange={setBooking}
        />
        <Toggle
          label="Session Reminders"
          value={reminders}
          onChange={setReminders}
        />
        <Toggle label="Payout Updates" value={payouts} onChange={setPayouts} />
        <Toggle label="Email Notifications" value={email} onChange={setEmail} />
        <Pressable style={st.primary} onPress={() => router.back()}>
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
function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={st.row}>
      <Text style={st.rowTxt}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
const st = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rowTxt: { fontWeight: "900", color: "#111827" },
  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryTxt: { color: "#fff", fontWeight: "900" },
});
