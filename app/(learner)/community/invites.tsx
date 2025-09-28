import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type InviteStatus = "pending" | "accepted" | "declined";
type Invite = {
  id: string;
  fromName: string;
  fromAvatar: string;
  dupr?: number;
  location?: string;
  message?: string;
  when?: string; // "Sat 07:00 @ District 1"
  status: InviteStatus;
};

const MOCK_INVITES: Invite[] = [
  {
    id: "i1",
    fromName: "Lan Tran",
    fromAvatar: "https://i.pravatar.cc/150?img=5",
    dupr: 3.8,
    location: "Thu Duc",
    message: "Chủ nhật này giao hữu nhẹ?",
    when: "Sun 08:00 @ Thu Duc",
    status: "pending",
  },
  {
    id: "i2",
    fromName: "Huy Le",
    fromAvatar: "https://i.pravatar.cc/150?img=12",
    dupr: 4.1,
    location: "Phu Nhuan",
    message: "Thử đánh doubles tối thứ 4 nhé?",
    when: "Wed 19:00 @ Phu Nhuan",
    status: "pending",
  },
  {
    id: "i3",
    fromName: "Quang Nguyen",
    fromAvatar: "https://i.pravatar.cc/150?img=10",
    dupr: 3.2,
    location: "Q.1, HCMC",
    message: "Nice game last time!",
    when: "Last Sat",
    status: "accepted",
  },
  {
    id: "i4",
    fromName: "Mai Phuong",
    fromAvatar: "https://i.pravatar.cc/150?img=47",
    dupr: 2.9,
    location: "Binh Thanh",
    message: "Hẹn dịp khác nha",
    when: "—",
    status: "declined",
  },
];

export default function InvitesScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<InviteStatus>("pending");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Invite[]>(MOCK_INVITES);

  const counts = useMemo(() => {
    return {
      pending: items.filter((i) => i.status === "pending").length,
      accepted: items.filter((i) => i.status === "accepted").length,
      declined: items.filter((i) => i.status === "declined").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const base = items.filter((i) => i.status === tab);
    if (!q) return base;
    const qq = q.toLowerCase();
    return base.filter(
      (i) =>
        i.fromName.toLowerCase().includes(qq) ||
        (i.location || "").toLowerCase().includes(qq) ||
        (i.when || "").toLowerCase().includes(qq),
    );
  }, [items, tab, q]);

  function onAccept(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "accepted" } : i)),
    );
    // TODO: call API accept
  }
  function onDecline(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "declined" } : i)),
    );
    // TODO: call API decline
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={st.header}>
        <Pressable
          onPress={() => router.back()}
          style={st.backBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text style={st.title}>Lời Mời</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Tabs */}
      <View style={st.tabs}>
        <TabPill
          label={`Chờ (${counts.pending})`}
          active={tab === "pending"}
          onPress={() => setTab("pending")}
        />
        <TabPill
          label={`Đã nhận (${counts.accepted})`}
          active={tab === "accepted"}
          onPress={() => setTab("accepted")}
        />
        <TabPill
          label={`Từ chối (${counts.declined})`}
          active={tab === "declined"}
          onPress={() => setTab("declined")}
        />
      </View>

      {/* Search */}
      <View style={st.search}>
        <Ionicons name="search" size={18} color="#6b7280" />
        <TextInput
          placeholder="Tìm theo tên, địa điểm, thời gian"
          placeholderTextColor="#9ca3af"
          value={q}
          onChangeText={setQ}
          style={{ flex: 1, marginLeft: 8 }}
        />
        {!!q && (
          <Pressable onPress={() => setQ("")}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </Pressable>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState
            tab={tab}
            onBrowse={() => router.replace("/community/partner")}
          />
        }
        renderItem={({ item }) => (
          <InviteCard
            item={item}
            onAccept={() => onAccept(item.id)}
            onDecline={() => onDecline(item.id)}
            showActions={item.status === "pending"}
          />
        )}
      />
    </SafeAreaView>
  );
}

function TabPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[st.pill, active && st.pillActive]}>
      <Text style={[st.pillText, active && st.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

function InviteCard({
  item,
  onAccept,
  onDecline,
  showActions,
}: {
  item: Invite;
  onAccept: () => void;
  onDecline: () => void;
  showActions: boolean;
}) {
  return (
    <LinearGradient
      colors={["#f9fafb", "#eef2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={st.card}
    >
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: item.fromAvatar }} style={st.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={st.name}>{item.fromName}</Text>
            {!!item.dupr && (
              <View style={st.badgeDark}>
                <Text style={st.badgeDarkText}>
                  DUPR {item.dupr.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
          <Text style={st.meta}>
            {item.location || "—"} · {item.when || "—"}
          </Text>
          {!!item.message && (
            <Text style={st.msg}>&quot;{item.message}&quot;</Text>
          )}

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {!showActions && (
              <StatusChip status={item.status as InviteStatus} />
            )}
            {showActions && (
              <>
                <Pressable onPress={onAccept} style={[st.btn, st.btnPrimary]}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={st.btnPrimaryText}>Chấp nhận</Text>
                </Pressable>
                <Pressable onPress={onDecline} style={[st.btn, st.btnGhost]}>
                  <Ionicons name="close" size={16} color="#111827" />
                  <Text style={st.btnGhostText}>Từ chối</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

function StatusChip({ status }: { status: InviteStatus }) {
  const label =
    status === "accepted"
      ? "Đã nhận"
      : status === "declined"
        ? "Từ chối"
        : "Chờ";
  const color =
    status === "accepted"
      ? "#16a34a"
      : status === "declined"
        ? "#ef4444"
        : "#f59e0b";
  return (
    <View
      style={[
        st.statusChip,
        { backgroundColor: color + "22", borderColor: color },
      ]}
    >
      <Text style={[st.statusChipText, { color }]}>{label}</Text>
    </View>
  );
}

function EmptyState({
  tab,
  onBrowse,
}: {
  tab: InviteStatus;
  onBrowse: () => void;
}) {
  const hint =
    tab === "pending"
      ? "Bạn chưa có lời mời nào."
      : tab === "accepted"
        ? "Chưa có lời mời đã nhận."
        : "Không có lời mời bị từ chối.";
  return (
    <View style={st.emptyWrap}>
      <View style={st.emptyIcon}>
        <Ionicons name="mail-open-outline" size={28} color="#6b7280" />
      </View>
      <Text style={st.emptyTitle}>Trống</Text>
      <Text style={st.emptySub}>{hint}</Text>
      <Pressable style={st.emptyBtn} onPress={onBrowse}>
        <Ionicons name="people-outline" size={16} color="#fff" />
        <Text style={st.emptyBtnText}>Tìm đối tác</Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111827" },

  tabs: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    flexDirection: "row",
  },
  pill: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: { backgroundColor: "#111827" },
  pillText: { color: "#111827", fontWeight: "700" },
  pillTextActive: { color: "#fff" },

  search: {
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  card: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e7eb",
  },
  name: { fontSize: 16, fontWeight: "800", color: "#111827" },
  meta: { color: "#6b7280", marginTop: 2 },
  msg: { color: "#111827", marginTop: 6, fontStyle: "italic" },

  badgeDark: {
    marginLeft: 8,
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeDarkText: { color: "#fff", fontSize: 11, fontWeight: "800" },

  btn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  btnPrimary: { backgroundColor: "#111827" },
  btnPrimaryText: { color: "#fff", fontWeight: "800", marginLeft: 6 },
  btnGhost: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  btnGhostText: { color: "#111827", fontWeight: "800", marginLeft: 6 },

  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusChipText: { fontWeight: "800", fontSize: 12 },

  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  emptySub: { marginTop: 4, color: "#6b7280" },
  emptyBtn: {
    marginTop: 12,
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 36,
  },
  emptyBtnText: { color: "#fff", fontWeight: "800", marginLeft: 6 },
});
