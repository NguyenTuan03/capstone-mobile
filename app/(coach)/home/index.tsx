import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Rect } from "react-native-svg";

/** --------- MOCK DATA (đổi sang API/Context sau) --------- */
const coach = { name: "David Nguyen", avatarText: "DN" };
const kpi = {
  mtd: Number("124000").toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  }),
  todaySessions: 3,
  activeStudents: 15, // Number of actively enrolled students
};
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
// No requests needed with automatic booking system
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
              <Text style={styles.hello}>{hi}, Huấn luyện viên</Text>
              <Text style={styles.name}>{coach.name}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => router.push("/menu/profile")}
              style={styles.editBtn}
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.editBtnText}>Chỉnh sửa hồ sơ</Text>
            </Pressable>
          </LinearGradient>
        </ImageBackground>

        {/* -------- KPI -------- */}
        <View style={styles.kpiRow}>
          <KpiCard
            label="Thu nhập tài chính"
            value={`${kpi.mtd}`}
            icon="cash-outline"
          />
          <KpiCard
            label="Buổi học hôm nay"
            value={String(kpi.todaySessions)}
            icon="time-outline"
            onPress={() => router.push("/(coach)/calendar/index" as any)}
          />
          <KpiCard
            label="Học viên đang hoạt động"
            value={String(kpi.activeStudents)}
            icon="people-outline"
            onPress={() => router.push("/(coach)/students" as any)}
          />
        </View>

        {/* -------- QUICK ACTIONS -------- */}
        <Section title="Hành động nhanh">
          <View style={styles.qaRow}>
            <QA
              icon="barbell-outline"
              label="Quản lý Bài tập"
              onPress={() => router.push("/(coach)/menu/drills" as any)}
            />
            <QA
              icon="document-text-outline"
              label="Ghi chú buổi học"
              onPress={() => {
                const nextSession = upcoming[0];
                if (nextSession) {
                  router.push({
                    pathname: "/(coach)/calendar/session/[id]",
                    params: { id: nextSession.id, fromCalendar: "true" },
                  });
                } else {
                  router.push("/(coach)/calendar/index" as any);
                }
              }}
            />
            <QA
              icon="analytics-outline"
              label="Xem phân tích"
              onPress={() => router.push("/(coach)/earnings/index" as any)}
            />
            <QA
              icon="add-circle-outline"
              label="Tạo chương trình"
              onPress={() => router.push("/(coach)/menu/session-blocks" as any)}
            />
          </View>
        </Section>
        <Section
          title="Bài tập & Phân công"
          caption="Tạo bài tập, giao bài cho học viên"
        >
          <Card onPress={() => router.push("/(coach)/menu/drills" as any)}>
            <View style={styles.cardRow}>
              <Ionicons name="barbell-outline" size={18} color="#111827" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.cardTitle}>Mở thư viện Bài tập</Text>
                <Text style={styles.cardSub}>
                  Tạo, chỉnh sửa và giao bài tập
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </View>
          </Card>
        </Section>
        {/* -------- UPCOMING -------- */}
        <Section
          title="Buổi học sắp tới"
          caption="Nhấn để vào chi tiết / bắt đầu cuộc gọi"
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
                    pathname: "/(coach)/calendar/session/[id]",
                    params: { id: item.id, fromCalendar: "true" },
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
                        pathname: "/(coach)/calendar/session/[id]",
                        params: { id: item.id, fromCalendar: "true" },
                      })
                    }
                    style={styles.joinBtn}
                  >
                    <Text style={styles.joinBtnText}>Xem</Text>
                  </Pressable>
                </View>
              </Card>
            )}
          />
        </Section>

        {/* -------- TODAY'S SCHEDULE -------- */}
        <Section
          title="Lịch trình hôm nay"
          caption="Các buổi học của bạn hôm nay"
        >
          <FlatList
            data={upcoming.filter((s) => s.time.includes("Today"))}
            keyExtractor={(x) => x.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={() => (
              <Card>
                <View style={styles.cardRow}>
                  <Ionicons
                    name="calendar-clear-outline"
                    size={18}
                    color="#64748b"
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      Không có buổi học hôm nay
                    </Text>
                    <Text style={styles.cardSub}>
                      Tận hưởng ngày nghỉ của bạn!
                    </Text>
                  </View>
                </View>
              </Card>
            )}
            renderItem={({ item }) => (
              <Card
                onPress={() =>
                  router.push({
                    pathname: "/(coach)/calendar/session/[id]",
                    params: { id: item.id, fromCalendar: "true" },
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
                        pathname: "/(coach)/calendar/session/[id]",
                        params: { id: item.id, fromCalendar: "true" },
                      })
                    }
                    style={styles.joinBtn}
                  >
                    <Text style={styles.joinBtnText}>Bắt đầu</Text>
                  </Pressable>
                </View>
              </Card>
            )}
          />
        </Section>

        {/* -------- RECENT ACTIVITY -------- */}
        <Section
          title="Hoạt động gần đây"
          caption="Các cập nhật mới nhất từ huấn luyện của bạn"
        >
          <Card>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Ionicons
                    name="person-add-outline"
                    size={16}
                    color="#10b981"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Đăng ký mới</Text>
                  <Text style={styles.activitySub}>
                    Học viên Minh đã đăng ký Chiến lược & Chiến thuật
                  </Text>
                </View>
                <Text style={styles.activityTime}>2h ago</Text>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="#3b82f6"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Buổi học hoàn thành</Text>
                  <Text style={styles.activitySub}>
                    Buổi học 3 với học viên Tuan đã kết thúc
                  </Text>
                </View>
                <Text style={styles.activityTime}>5h ago</Text>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Ionicons name="star-outline" size={16} color="#f59e0b" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Đánh giá mới</Text>
                  <Text style={styles.activitySub}>
                    Học viên Lan để lại đánh giá 5 sao
                  </Text>
                </View>
                <Text style={styles.activityTime}>1d ago</Text>
              </View>
            </View>
          </Card>
        </Section>

        {/* -------- EARNINGS CHART -------- */}
        <Section title="Thu nhập tài chính" caption="7 ngày gần nhất">
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
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.legendTxt}>
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
  if (h < 11) return "Chào buổi sáng";
  if (h < 17) return "Chào buổi chiều";
  return "Chào buổi tối";
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 50,
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
  coachStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  statText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  verifyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  verifyText: { color: "#fbbf24", fontSize: 10, fontWeight: "600" },
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
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: { fontWeight: "900", color: "#111827" },
  cardSub: { color: "#6b7280", marginTop: 2 },
  sessionBlockName: {
    color: "#6366f1",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  blockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  blockBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

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

  // Activity Styles
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  activitySub: {
    fontSize: 12,
    color: "#64748b",
  },
  activityTime: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },
  specialtyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  techniquesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  techniqueChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  techniqueText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },
  specialtyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 4,
  },
  specialtyFooterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
});
