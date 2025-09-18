import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CoachMenu() {
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const verified = false; // mock
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
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={st.h1}>Menu</Text>
      </View>

      {/* Profile card */}
      <View style={st.cardHero}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=23" }}
          style={st.avatar}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={st.name}>David Nguyen</Text>
          <Text style={st.meta}>Pickleball Coach · HCMC</Text>
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            <Badge
              color={verified ? "#16a34a" : "#f59e0b"}
              icon={verified ? "shield-checkmark" : "shield-outline"}
              text={verified ? "Verified" : "Verification pending"}
            />
            <Badge color="#111827" icon="star-outline" text="Top Rated" />
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/(coach)/menu/profile" as any)}
          style={st.primary}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={st.primaryTxt}>Edit</Text>
        </Pressable>
      </View>

      {/* Sections */}
      <Section title="Profile & Setup">
        <Row
          icon={
            <Ionicons name="person-circle-outline" size={18} color="#111827" />
          }
          title="Professional Profile"
          subtitle="Headline, bio, experience, media"
          onPress={() => router.push("/(coach)/menu/profile" as any)}
        />
        <Row
          icon={
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#111827"
            />
          }
          title="Credential Verification"
          subtitle="ID & Certifications"
          onPress={() => router.push("/(coach)/menu/verify" as any)}
          right={
            <Pill
              text={verified ? "Verified" : "Start"}
              tone={verified ? "ok" : "warn"}
            />
          }
        />
        <Row
          icon={
            <MaterialIcons name="sports-tennis" size={18} color="#111827" />
          }
          title="Teaching Specialty & Methodology"
          subtitle="Areas of focus, coaching style"
          onPress={() => router.push("/(coach)/menu/teaching" as any)}
        />
        <Row
          icon={<Ionicons name="pricetag-outline" size={18} color="#111827" />}
          title="Rates & Packages"
          subtitle="Hourly, clinic, group"
          onPress={() => router.push("/(coach)/menu/rates" as any)}
        />
      </Section>

      <Section title="Operations">
        <Row
          icon={<Ionicons name="cash-outline" size={18} color="#111827" />}
          title="Payouts & Bank"
          subtitle="Connect Stripe / Bank account"
          onPress={() => router.push("/(coach)/menu/payouts" as any)}
        />
        <Row
          icon={<Ionicons name="videocam-outline" size={18} color="#111827" />}
          title="Integrations"
          subtitle="Video conferencing provider"
          onPress={() => router.push("/(coach)/menu/integrations" as any)}
        />
        <Row
          icon={
            <Ionicons name="notifications-outline" size={18} color="#111827" />
          }
          title="Notifications"
          subtitle="Booking, reminders, payouts"
          onPress={() => router.push("/(coach)/menu/notifications" as any)}
        />
      </Section>

      <Section title="Account">
        <Row
          icon={
            <Ionicons name="lock-closed-outline" size={18} color="#111827" />
          }
          title="Security"
          subtitle="Password, 2FA"
          onPress={() => router.push("/(coach)/menu/security" as any)}
        />
        <Row
          icon={
            <Ionicons name="help-circle-outline" size={18} color="#111827" />
          }
          title="Support"
          subtitle="Feedback / Contact us"
          onPress={() => router.push("/(coach)/menu/support" as any)}
        />
        <Row
          icon={
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#111827"
            />
          }
          title="About"
          subtitle="Terms · Privacy · App version"
          onPress={() => router.push("/(coach)/menu/about" as any)}
        />
      </Section>

      {/* Quick toggles at bottom */}
      <View style={st.toggleWrap}>
        <ToggleRow
          label="Push Notifications"
          value={pushOn}
          onChange={setPushOn}
        />
        <ToggleRow
          label="Email Notifications"
          value={emailOn}
          onChange={setEmailOn}
        />
      </View>
    </SafeAreaView>
  );
}

/* ============ Reusable ============ */
function Section({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
      <Text style={st.secTitle}>{title}</Text>
      <View style={st.card}>{children}</View>
    </View>
  );
}
function Row({
  icon,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={st.row}>
      <View style={st.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={st.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={st.rowSub}>{subtitle}</Text>}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color="#9ca3af" />}
    </Pressable>
  );
}
function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={[st.row, { paddingHorizontal: 0 }]}>
      <View style={st.rowIcon}>
        <Ionicons name="notifications-outline" size={18} color="#111827" />
      </View>
      <Text style={st.rowTitle}>{label}</Text>
      <View style={{ flex: 1 }} />
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
function Badge({
  color,
  icon,
  text,
}: {
  color: string;
  icon: any;
  text: string;
}) {
  return (
    <View style={[st.badge, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[st.badgeTxt, { color }]}>{text}</Text>
    </View>
  );
}
function Pill({ text, tone }: { text: string; tone?: "ok" | "warn" }) {
  const map = { ok: "#16a34a", warn: "#f59e0b" } as const;
  const c = map[tone ?? "ok"];
  return <Text style={{ color: c, fontWeight: "900" }}>{text}</Text>;
}

/* ============ Styles ============ */
const st: any = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "900", color: "#111827" },

  cardHero: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  name: { fontSize: 16, fontWeight: "900", color: "#111827" },
  meta: { color: "#6b7280", marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  badgeTxt: { fontSize: 12, fontWeight: "800", marginLeft: 6 },

  primary: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "900", marginLeft: 6 },

  secTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#6b7280",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rowTitle: { fontWeight: "900", color: "#111827" },
  rowSub: { color: "#6b7280", marginTop: 2 },

  toggleWrap: { paddingHorizontal: 16, marginTop: 12, marginBottom: 24 },
});
