import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Rect } from "react-native-svg";
import { Href, router } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** --------- MOCK DATA (đổi sang API/Context sau) --------- */
const coach = { name: "David Nguyen", avatarText: "DN" };
const kpi = { mtd: 1240, todaySessions: 3, pending: 2 };
const upcoming = [
  {
    id: "s1",
    student: "Tuan",
    time: "Today 19:00–20:00",
    mode: "online" as const,
  },
  {
    id: "s2",
    student: "Lan",
    time: "Tomorrow 07:00–08:00",
    mode: "offline" as const,
    place: "Crescent Court",
  },
];
const requests = [
  {
    id: "r1",
    student: "Huy",
    time: "Fri 18:30–19:30",
    note: "Wants doubles drill",
  },
  {
    id: "r2",
    student: "Minh",
    time: "Sat 07:00–08:00",
    note: "Beginner clinic",
  },
];
const earnings7d = [80, 0, 120, 220, 60, 300, 160]; // mini chart

export default function CoachHome() {
  const hi = useMemo(() => helloByHour(), []);
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + insets.bottom }}
      >
        {/* -------- HERO -------- */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b",
          }}
          style={{ height: 220 }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
            style={styles.hero}
          >
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{coach.avatarText}</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.hello}>{hi}, Coach</Text>
              <Text style={styles.name}>{coach.name}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => router.push("/menu/profile")}
              style={styles.editBtn}
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </Pressable>
          </LinearGradient>
        </ImageBackground>

        {/* -------- KPI -------- */}
        <View style={styles.kpiRow}>
          <KpiCard
            label="MTD Earnings"
            value={`$${kpi.mtd}`}
            icon="cash-outline"
          />
          <KpiCard
            label="Sessions Today"
            value={String(kpi.todaySessions)}
            icon="time-outline"
            onPress={() => router.push("/calendar/index")}
          />
          <KpiCard
            label="Pending Requests"
            value={String(kpi.pending)}
            icon="alert-circle-outline"
            onPress={() => router.push("/calendar/index")}
          />
        </View>

        {/* -------- QUICK ACTIONS -------- */}
        <Section title="Quick Actions">
          <View style={styles.qaRow}>
            <QA
              icon="videocam-outline"
              label="Start Call"
              //   onPress={() => router.push("/call/temp/index")}
              onPress={() => {}}
            />
            <QA
              icon="clipboard-outline"
              label="Add Notes"
              onPress={() => router.push("/students/index")}
            />
            <QA
              icon="barbell-outline"
              label="Assign Drill"
              onPress={() => router.push("/students/index")}
            />
            <QA
              icon="calendar-outline"
              label="Add Slots"
              onPress={() => router.push("/calendar/index")}
            />
          </View>
        </Section>

        {/* -------- UPCOMING -------- */}
        <Section
          title="Upcoming Sessions"
          caption="Nhấn để vào chi tiết / bắt đầu call"
        >
          <FlatList
            data={upcoming}
            keyExtractor={(x) => x.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <Card
                onPress={() =>
                  router.push({
                    pathname: "/calendar/index",
                    params: { focus: item.id },
                  })
                }
              >
                <View style={styles.cardRow}>
                  <Ionicons
                    name={
                      item.mode === "online" ? "globe-outline" : "pin-outline"
                    }
                    size={18}
                    color="#111827"
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.student}</Text>
                    <Text style={styles.cardSub}>
                      {item.time} ·{" "}
                      {item.mode === "online" ? "Online" : item.place}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      router.push({
                        // pathname: "/(coach)/call/temp/index",
                        // params: { sessionId: item.id },
                      } as Href)
                    }
                    style={styles.joinBtn}
                  >
                    <Text style={styles.joinBtnText}>Join</Text>
                  </Pressable>
                </View>
              </Card>
            )}
          />
        </Section>

        {/* -------- NEW REQUESTS -------- */}
        <Section
          title="New Requests"
          caption="Xử lý nhanh các yêu cầu đặt lịch mới"
        >
          <FlatList
            data={requests}
            keyExtractor={(x) => x.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.cardRow}>
                  <Ionicons name="person-outline" size={18} color="#111827" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.student}</Text>
                    <Text style={styles.cardSub}>
                      {item.time} · {item.note}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable
                      style={[styles.reqBtn, { backgroundColor: "#111827" }]}
                    >
                      <Text style={[styles.reqText, { color: "#fff" }]}>
                        Approve
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.reqBtn, { backgroundColor: "#F3F4F6" }]}
                    >
                      <Text style={[styles.reqText, { color: "#111827" }]}>
                        Decline
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Card>
            )}
          />
        </Section>

        {/* -------- EARNINGS CHART -------- */}
        <Section title="MTD Earnings" caption="7 ngày gần nhất">
          <Card>
            <MiniBar data={earnings7d} />
          </Card>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= Components ================= */

function KpiCard({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.kpiCard}>
      <LinearGradient
        colors={["#f9fafb", "#eef2ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.kpiInner}
      >
        <Ionicons name={icon} size={18} color="#111827" />
        <Text style={styles.kpiVal}>{value}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function QA({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.qaItem}>
      <View style={styles.qaIcon}>
        <Ionicons name={icon} size={18} color="#fff" />
      </View>
      <Text style={styles.qaText}>{label}</Text>
    </Pressable>
  );
}

function Section({
  title,
  caption,
  children,
}: React.PropsWithChildren<{ title: string; caption?: string }>) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
      <Text style={styles.secTitle}>{title}</Text>
      {!!caption && <Text style={styles.secCap}>{caption}</Text>}
      <View style={{ marginTop: 10 }}>{children}</View>
    </View>
  );
}

function Card({
  children,
  onPress,
}: React.PropsWithChildren<{ onPress?: () => void }>) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {children}
    </Pressable>
  );
}

function MiniBar({ data }: { data: number[] }) {
  const H = 90;
  const pad = 12;
  const barGap = 10;
  const barW = 18;
  const max = Math.max(...data, 1);
  return (
    <View>
      <Svg height={H} width={pad * 2 + data.length * (barW + barGap)}>
        {data.map((v, i) => {
          const h = (v / max) * (H - 24);
          const x = pad + i * (barW + barGap);
          const y = H - h - 12;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={6}
              ry={6}
              fill="#111827"
              opacity={0.9}
            />
          );
        })}
      </Svg>
      <View style={styles.chartLegend}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
          <Text key={d} style={styles.legendTxt}>
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* ================= Styles ================= */
function helloByHour() {
  const h = new Date().getHours();
  if (h < 11) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 16,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#A700FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  hello: { color: "#E5E7EB", fontWeight: "700", fontSize: 12 },
  name: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 0.5 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editBtnText: { color: "#fff", fontWeight: "800", marginLeft: 6 },

  kpiRow: {
    paddingHorizontal: 16,
    marginTop: -24,
    flexDirection: "row",
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
    borderRadius: 14,
  },
  kpiInner: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  kpiVal: { marginTop: 6, fontSize: 18, fontWeight: "900", color: "#111827" },
  kpiLabel: { color: "#6b7280", fontWeight: "700", marginTop: 2, fontSize: 12 },

  qaRow: { flexDirection: "row", justifyContent: "space-between" },
  qaItem: { alignItems: "center", width: "23%" },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  qaText: {
    marginTop: 6,
    fontWeight: "700",
    color: "#111827",
    fontSize: 12,
    textAlign: "center",
  },

  secTitle: { fontSize: 18, fontWeight: "900", color: "#111827" },
  secCap: { color: "#6b7280", marginTop: 2 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontWeight: "900", color: "#111827" },
  cardSub: { color: "#6b7280", marginTop: 2 },

  joinBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  joinBtnText: { color: "#fff", fontWeight: "800" },

  reqBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  reqText: { fontWeight: "800" },

  chartLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  legendTxt: { color: "#6b7280", fontSize: 12 },
});
