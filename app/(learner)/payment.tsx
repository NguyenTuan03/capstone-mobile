import { useBookings } from "@/modules/learner/context/bookingContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PayMethod = "payos" | "card";

export default function Payment() {
  const insets = useSafeAreaInsets();
  // lấy params (nếu có)
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const { getSessionById, sessions } = useBookings() as any;

  const session = useMemo(() => {
    if (sessionId && typeof getSessionById === "function")
      return getSessionById(sessionId);
    if (sessionId && Array.isArray(sessions))
      return sessions.find((s: any) => s.id === sessionId);

    // fallback: mock order khi không có sessionId
    return {
      id: "mock-1",
      coachId: "c1",
      coachName: "Huấn luyện viên đã chọn",
      price: 25,
      mode: "online",
      meetingUrl: "",
      startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    };
  }, [sessionId, getSessionById, sessions]);

  const [method, setMethod] = useState<PayMethod>("payos");
  const [coupon, setCoupon] = useState("");
  const [processing, setProcessing] = useState(false);

  const price = Number(session?.price ?? 0);
  const fee = 0; // có thể cộng thêm phí cổng nếu muốn
  const discount =
    coupon.trim().toUpperCase() === "PICKLE10" ? Math.round(price * 0.1) : 0;
  const total = Math.max(0, price + fee - discount);

  const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onPay = async () => {
    if (!session) {
      Alert.alert("Không có đơn hàng", "Không tìm thấy buổi học.");
      return;
    }
    setProcessing(true);

    // Giả lập gọi API thanh toán (PayOS / charge card)
    setTimeout(() => {
      setProcessing(false);
      // Chuyển sang màn hình success (fake)
      router.replace(`/(learner)/payment-success?sessionId=${sessionId}`);
    }, 1200);
  };

  if (!session) {
    return (
      <SafeAreaView
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}
      >
        <View style={{ padding: 16 }}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </Pressable>
          <Text
            style={{
              marginTop: 16,
              fontWeight: "800",
              fontSize: 18,
              color: "#111827",
            }}
          >
            Thanh Toán
          </Text>
          <Text style={{ marginTop: 8, color: "#6b7280" }}>
            Session not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <Text style={{ fontWeight: "900", color: "#111827", fontSize: 18 }}>
            Payment
          </Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      {/* Hero / Summary */}
      <LinearGradient
        colors={["#18181b", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.muted}>Coach</Text>
            <Text style={styles.bold}>
              {session?.coachName || session?.coachId}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>Mode</Text>
            <Text style={styles.bold}>{session?.mode ?? "online"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>Start</Text>
            <Text style={styles.bold}>{formatDateTime(session?.startAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>End</Text>
            <Text style={styles.bold}>{formatDateTime(session?.endAt)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Payment Methods */}
      <View style={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => setMethod("payos")}
            style={[
              styles.methodBtn,
              method === "payos" && styles.methodActive,
            ]}
          >
            <Ionicons
              name="cash-outline"
              size={18}
              color={method === "payos" ? "#111827" : "#6b7280"}
            />
            <Text
              style={[
                styles.methodText,
                method === "payos" && styles.methodTextActive,
              ]}
            >
              PayOS (mock)
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMethod("card")}
            style={[styles.methodBtn, method === "card" && styles.methodActive]}
          >
            <Ionicons
              name="card-outline"
              size={18}
              color={method === "card" ? "#111827" : "#6b7280"}
            />
            <Text
              style={[
                styles.methodText,
                method === "card" && styles.methodTextActive,
              ]}
            >
              Card (mock)
            </Text>
          </Pressable>
        </View>

        {/* Optional mock card form */}
        {method === "card" && (
          <View style={styles.cardForm}>
            <TextInput
              placeholder="Card number (mock)"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="MM/YY"
                placeholderTextColor="#9ca3af"
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="CVC"
                placeholderTextColor="#9ca3af"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <TextInput
              placeholder="Tên chủ thẻ"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
        )}

        {/* Coupon */}
        <Text style={styles.sectionTitle}>Promo Code</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={coupon}
            onChangeText={setCoupon}
            placeholder="Enter code (e.g. PICKLE10)"
            placeholderTextColor="#9ca3af"
            style={[styles.input, { flex: 1 }]}
            autoCapitalize="characters"
          />
          <Pressable
            onPress={() => {
              if (coupon.trim().toUpperCase() === "PICKLE10") {
                Alert.alert("Đã áp dụng", "Giảm giá 10% đã được áp dụng.");
              } else {
                Alert.alert("Mã không hợp lệ", "Vui lòng thử mã khác.");
              }
            }}
            style={styles.applyBtn}
          >
            <Text style={styles.applyText}>Áp dụng</Text>
          </Pressable>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.row}>
            <Text style={styles.muted}>Giá</Text>
            <Text style={styles.bold}>
              ₫{(price * 25000).toLocaleString("vi-VN")}
            </Text>
          </View>
          {fee > 0 && (
            <View style={styles.row}>
              <Text style={styles.muted}>Phí</Text>
              <Text style={styles.bold}>
                ₫{(fee * 25000).toLocaleString("vi-VN")}
              </Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.row}>
              <Text style={[styles.muted, { color: "#059669" }]}>Giảm giá</Text>
              <Text style={[styles.bold, { color: "#059669" }]}>
                - ₫{(discount * 25000).toLocaleString("vi-VN")}
              </Text>
            </View>
          )}
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={[styles.bold, { fontSize: 16 }]}>Tổng cộng</Text>
            <Text style={[styles.bold, { fontSize: 16 }]}>
              ₫{(total * 25000).toLocaleString("vi-VN")}
            </Text>
          </View>
        </View>

        {/* Pay button */}
        <Pressable
          onPress={onPay}
          disabled={processing}
          style={[styles.payBtn, processing && { opacity: 0.7 }]}
        >
          {processing ? (
            <ActivityIndicator />
          ) : (
            <>
              <Ionicons name="lock-closed-outline" size={16} color="#fff" />
              <Text style={styles.payText}>Thanh toán ngay</Text>
            </>
          )}
        </Pressable>

        {/* Note */}
        <Text style={{ color: "#6b7280", marginTop: 12, textAlign: "center" }}>
          Đây là màn hình thanh toán mô phỏng. Trong thực tế, sẽ chuyển hướng
          đến trang thanh toán PayOS sau khi tạo đơn hàng trên server.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(107, 114, 128, 0.1)",
    width: 36,
    alignItems: "center",
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  muted: { color: "#9ca3af" },
  bold: { color: "#fff", fontWeight: "800" },

  sectionTitle: {
    fontWeight: "800",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  methodBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  methodActive: { backgroundColor: "#fff", borderColor: "#111827" },
  methodText: { color: "#374151", fontWeight: "700" },
  methodTextActive: { color: "#111827" },

  cardForm: { marginTop: 8, gap: 8 },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
  },
  applyBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  applyText: { color: "#fff", fontWeight: "800" },

  totals: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  payBtn: {
    marginTop: 16,
    backgroundColor: "#111827",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payText: { color: "#fff", fontWeight: "800" },
});
