import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** ---------------- Mock data (đổi sang API khi sẵn sàng) ---------------- */
type Txn = {
  id: string;
  dateISO: string;
  kind: "session" | "payout" | "fee" | "refund";
  note: string;
  amount: number;
};
const TXNS_30D: Txn[] = [
  {
    id: "t1",
    dateISO: addDays(-1),
    kind: "session",
    note: "Session · Tuấn",
    amount: 60,
  },
  {
    id: "t2",
    dateISO: addDays(-2),
    kind: "session",
    note: "Session · Lan",
    amount: 55,
  },
  {
    id: "t3",
    dateISO: addDays(-3),
    kind: "fee",
    note: "Platform fee",
    amount: -6,
  },
  {
    id: "t4",
    dateISO: addDays(-5),
    kind: "session",
    note: "Session · Huy",
    amount: 55,
  },
  {
    id: "t5",
    dateISO: addDays(-6),
    kind: "payout",
    note: "Payout to bank",
    amount: -200,
  },
  {
    id: "t6",
    dateISO: addDays(-9),
    kind: "session",
    note: "Clinic · Group",
    amount: 120,
  },
  {
    id: "t7",
    dateISO: addDays(-10),
    kind: "refund",
    note: "Refund · Missed court",
    amount: -30,
  },
  {
    id: "t8",
    dateISO: addDays(-12),
    kind: "session",
    note: "Session · Minh",
    amount: 50,
  },
];

const EARN_7 = [80, 0, 120, 60, 150, 90, 40];
const EARN_30 = [
  40, 60, 0, 120, 60, 150, 90, 40, 30, 60, 90, 0, 120, 80, 20, 0, 110, 50, 70,
  20, 60, 40, 80, 30, 55, 0, 75, 90, 20, 60,
];
const EARN_90 = [...EARN_30, ...EARN_30.slice(0, 30), ...EARN_30.slice(0, 30)];

const BREAKDOWN = [
  { label: "Online", value: 540 },
  { label: "Offline", value: 360 },
  { label: "Clinic", value: 180 },
];

const PAYOUTS = [
  { id: "p1", dateISO: addDays(-6), amount: 200, status: "paid" as const },
  { id: "p2", dateISO: addDays(-1), amount: 150, status: "pending" as const },
];

/** ---------------- Screen ---------------- */
export default function EarningsScreen() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const insets = useSafeAreaInsets();
  const series = useMemo(
    () => (range === "7d" ? EARN_7 : range === "30d" ? EARN_30 : EARN_90),
    [range],
  );
  const txns = useMemo(
    () => TXNS_30D.sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO)),
    [],
  );
  const mtd = useMemo(
    () => sumThisMonth(txns.filter((t) => t.kind !== "payout")),
    [txns],
  );
  const pendingPayout = useMemo(
    () =>
      PAYOUTS.filter((p) => p.status === "pending").reduce(
        (s, p) => s + p.amount,
        0,
      ),
    [],
  );
  const balance = useMemo(() => txns.reduce((s, t) => s + t.amount, 0), [txns]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <FlatList
        data={[{ k: "header" } as const]}
        keyExtractor={(x) => x.k}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            {/* --- Header --- */}
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <Text style={st.h1}>Earnings</Text>
            </View>

            {/* --- KPI row --- */}
            <View style={st.kpiRow}>
              <Kpi
                label="Balance"
                value={fmtMoney(balance)}
                icon="wallet-outline"
              />
              <Kpi
                label="MTD"
                value={fmtMoney(mtd)}
                icon="trending-up-outline"
              />
              <Kpi
                label="Pending Payout"
                value={fmtMoney(pendingPayout)}
                icon="hourglass-outline"
              />
            </View>

            {/* --- Actions --- */}
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 8,
                flexDirection: "row",
              }}
            >
              <Pressable
                style={st.primary}
                onPress={() => Alert.alert("Payout", "Request submitted 🚀")}
              >
                <Ionicons name="cash-outline" size={16} color="#fff" />
                <Text style={st.primaryTxt}>Request Payout</Text>
              </Pressable>
              <Pressable
                style={st.secondary}
                onPress={() => Alert.alert("Export", "CSV exported (mock)")}
              >
                <Ionicons name="download-outline" size={16} color="#111827" />
                <Text style={st.secondaryTxt}>Export CSV</Text>
              </Pressable>
            </View>

            {/* --- Chart card --- */}
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <View style={st.card}>
                <View style={st.cardHead}>
                  <Text style={st.cardTitle}>Revenue</Text>
                  <RangeTabs value={range} onChange={setRange} />
                </View>
                <RevenueChart values={series} />
              </View>
            </View>

            {/* --- Breakdown + Payouts --- */}
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 12,
                flexDirection: "row",
                gap: 10,
              }}
            >
              <View style={[st.card, { flex: 1 }]}>
                <Text style={st.cardTitle}>Breakdown</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Donut segments={BREAKDOWN} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    {BREAKDOWN.map((s, i) => (
                      <View
                        key={s.label}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <View
                          style={[
                            st.dot,
                            {
                              backgroundColor:
                                donutColors[i % donutColors.length],
                            },
                          ]}
                        />
                        <Text
                          style={{
                            fontWeight: "800",
                            color: "#111827",
                            flex: 1,
                          }}
                        >
                          {s.label}
                        </Text>
                        <Text style={{ color: "#6b7280" }}>
                          {fmtMoney(s.value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={[st.card, { width: 180 }]}>
                <Text style={st.cardTitle}>Payouts</Text>
                <View style={{ marginTop: 8 }}>
                  {PAYOUTS.map((p) => (
                    <View key={p.id} style={{ marginBottom: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "800", color: "#111827" }}>
                          {fmtMoney(p.amount)}
                        </Text>
                        <Text
                          style={{
                            color: p.status === "paid" ? "#16a34a" : "#f59e0b",
                            fontWeight: "800",
                          }}
                        >
                          {p.status.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={{ color: "#6b7280" }}>
                        {new Date(p.dateISO).toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* --- Transactions --- */}
            <View
              style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 10 }}
            >
              <Text style={st.secTitle}>Transactions</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <FlatList
              data={txns}
              keyExtractor={(t) => t.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => <TxnRow t={item} />}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

/** ---------------- Components ---------------- */

function Kpi({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <LinearGradient
      colors={["#f9fafb", "#eef2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={st.kpi}
    >
      <Ionicons name={icon} size={18} color="#111827" />
      <Text style={st.kpiVal}>{value}</Text>
      <Text style={st.kpiLab}>{label}</Text>
    </LinearGradient>
  );
}

function RangeTabs({
  value,
  onChange,
}: {
  value: "7d" | "30d" | "90d";
  onChange: (v: "7d" | "30d" | "90d") => void;
}) {
  const ITEM: { k: "7d" | "30d" | "90d"; label: string }[] = [
    { k: "7d", label: "7d" },
    { k: "30d", label: "30d" },
    { k: "90d", label: "90d" },
  ];
  return (
    <View style={st.rangeTabs}>
      {ITEM.map((it) => (
        <Pressable
          key={it.k}
          onPress={() => onChange(it.k)}
          style={[st.rangeBtn, value === it.k && st.rangeBtnActive]}
        >
          <Text style={[st.rangeTxt, value === it.k && st.rangeTxtActive]}>
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function RevenueChart({ values }: { values: number[] }) {
  const W = 320,
    H = 120,
    pad = 12;
  const step = (W - pad * 2) / Math.max(1, values.length - 1);
  const max = Math.max(...values, 1);
  const normY = (v: number) => H - pad - (v / max) * (H - pad * 2);

  let d = `M ${pad} ${normY(values[0])}`;
  for (let i = 1; i < values.length; i++) {
    const x = pad + i * step;
    const xc = pad + (i - 0.5) * step;
    const y1 = normY(values[i - 1]);
    const y2 = normY(values[i]);
    d += ` C ${xc} ${y1}, ${xc} ${y2}, ${x} ${y2}`;
  }

  // area fill path
  const area = `${d} L ${pad + (values.length - 1) * step} ${H - pad} L ${pad} ${H - pad} Z`;

  return (
    <View style={{ marginTop: 10 }}>
      <Svg width="100%" height={H}>
        <Path d={area} fill="rgba(17,24,39,0.08)" />
        <Path d={d} stroke="#111827" strokeWidth={2} fill="none" />
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 4,
        }}
      >
        <Text style={st.axisTxt}>Start</Text>
        <Text style={st.axisTxt}>Now</Text>
      </View>
    </View>
  );
}

const donutColors = ["#111827", "#0ea5e9", "#22c55e"];
function Donut({ segments }: { segments: { label: string; value: number }[] }) {
  const size = 120,
    r = 48,
    cx = size / 2,
    cy = size / 2;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const C = 2 * Math.PI * r;

  let acc = 0;
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="#e5e7eb"
        strokeWidth={12}
        fill="none"
      />
      {segments.map((s, i) => {
        const pct = s.value / total;
        const dash = pct * C;
        const off = C - dash;
        const rot = (acc / total) * 360 - 90;
        acc += s.value;
        return (
          <Circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            stroke={donutColors[i % donutColors.length]}
            strokeWidth={12}
            strokeDasharray={`${dash},${off}`}
            strokeLinecap="round"
            rotation={rot}
            originX={cx}
            originY={cy}
            fill="none"
          />
        );
      })}
      <TextSVG x={cx} y={cy} title={fmtMoney(total)} sub="Total" />
    </Svg>
  );
}
function TextSVG({
  x,
  y,
  title,
  sub,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
}) {
  // simple centered text using SVG <Text> via react-native-svg is verbose; cheat by overlaying View
  return (
    <View
      style={{
        position: "absolute",
        left: x - 40,
        top: y - 18,
        width: 80,
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "900", color: "#111827" }}>{title}</Text>
      <Text style={{ color: "#6b7280", fontSize: 12 }}>{sub}</Text>
    </View>
  );
}

function TxnRow({ t }: { t: Txn }) {
  const positive = t.amount >= 0;
  const icon: Record<Txn["kind"], any> = {
    session: "tennisball-outline" as any,
    payout: "arrow-down-circle-outline" as any,
    fee: "receipt-outline" as any,
    refund: "arrow-undo-outline" as any,
  };
  return (
    <View style={st.txn}>
      <View style={st.txnIcon}>
        <Ionicons name={icon[t.kind]} size={16} color="#111827" />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={st.txnTitle}>{t.note}</Text>
        <Text style={st.txnSub}>
          {new Date(t.dateISO).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Text>
      </View>
      <Text style={[st.txnAmt, { color: positive ? "#16a34a" : "#991b1b" }]}>
        {positive ? "+" : "-"}
        {fmtMoney(Math.abs(t.amount))}
      </Text>
    </View>
  );
}

/** ---------------- Utils ---------------- */
function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
function fmtMoney(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}
function sumThisMonth(tx: Txn[]) {
  const now = new Date();
  const y = now.getFullYear(),
    m = now.getMonth();
  return tx
    .filter((t) => {
      const d = new Date(t.dateISO);
      return d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((s, t) => s + t.amount, 0);
}

/** ---------------- Styles ---------------- */
const st: any = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "900", color: "#111827" },

  kpiRow: {
    paddingHorizontal: 16,
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  kpi: {
    flex: 1,
    borderRadius: 14,
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
  kpiVal: { marginTop: 6, fontSize: 18, fontWeight: "900", color: "#111827" },
  kpiLab: { color: "#6b7280", fontWeight: "700", fontSize: 12, marginTop: 2 },

  primary: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "900", marginLeft: 6 },
  secondary: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  secondaryTxt: { color: "#111827", fontWeight: "900", marginLeft: 6 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 1 },
    }),
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },

  rangeTabs: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 3,
    flexDirection: "row",
  },
  rangeBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  rangeBtnActive: { backgroundColor: "#111827" },
  rangeTxt: { fontWeight: "800", color: "#111827", fontSize: 12 },
  rangeTxtActive: { color: "#fff" },

  axisTxt: { color: "#9ca3af", fontSize: 12, marginTop: 4 },

  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },

  txn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  txnIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  txnTitle: { fontWeight: "900", color: "#111827" },
  txnSub: { color: "#6b7280", marginTop: 2 },
  txnAmt: { fontWeight: "900" },
});
