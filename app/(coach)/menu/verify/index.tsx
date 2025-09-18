import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Verify() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
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
      <Header title="Credential Verification" />
      <View style={{ padding: 16 }}>
        <Step n={1} title="Upload ID (front/back)" done={step > 0} />
        <Step n={2} title="Upload Certification (if any)" done={step > 1} />
        <Step n={3} title="Manual Review" pending={step === 2} />

        <Pressable
          style={st.primary}
          onPress={() =>
            setStep((s: 0 | 1 | 2) => (s === 0 ? 1 : s === 1 ? 2 : 2))
          }
        >
          <Text style={st.primaryTxt}>
            {step < 2 ? "Next Step" : "Submit for Review"}
          </Text>
        </Pressable>
        <Text style={{ color: "#6b7280", marginTop: 10 }}>
          We’ll notify you when review is completed.
        </Text>
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
function Step({
  n,
  title,
  done,
  pending,
}: {
  n: number;
  title: string;
  done?: boolean;
  pending?: boolean;
}) {
  const c = done ? "#16a34a" : pending ? "#f59e0b" : "#9ca3af";
  const i = done ? "checkmark-circle" : pending ? "time" : "ellipse-outline";
  return (
    <View style={st.row}>
      <Ionicons name={i as any} size={18} color={c} />
      <Text style={[st.rowTxt, { color: done ? "#111827" : "#6b7280" }]}>
        {n}. {title}
      </Text>
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  rowTxt: { marginLeft: 8, fontWeight: "800" },
  primary: {
    backgroundColor: "#111827",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryTxt: { color: "#fff", fontWeight: "900" },
});
