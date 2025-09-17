import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function Segmented({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: "on" | "off";
  onChange: (v: "on" | "off") => void;
}) {
  return (
    <View style={s.segment}>
      <Pressable
        style={[s.segmentBtn, value === "on" && s.segmentBtnActive]}
        onPress={() => onChange("on")}
      >
        <Text style={[s.segmentText, value === "on" && s.segmentTextActive]}>
          {left}
        </Text>
      </Pressable>
      <Pressable
        style={[s.segmentBtn, value === "off" && s.segmentBtnActive]}
        onPress={() => onChange("off")}
      >
        <Text style={[s.segmentText, value === "off" && s.segmentTextActive]}>
          {right}
        </Text>
      </Pressable>
    </View>
  );
}

/** Row item gradient card */
export function GradientItem({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={["#f4f4f4", "#eaeaea"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.card}
      >
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.cardValue}>{value}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  header: { fontSize: 20, fontWeight: "700", letterSpacing: 1, color: "#111" },
  avatar: {
    position: "absolute",
    right: 16,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#c982ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    color: "#111",
  },
  sub: { color: "#6b7280", marginTop: 6, lineHeight: 18 },

  segmentWrap: { paddingHorizontal: 16, marginTop: 16 },
  segment: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  segmentBtnActive: { backgroundColor: "#111" },
  segmentText: { color: "#111", fontWeight: "600" },
  segmentTextActive: { color: "#fff" },

  tip: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: "center",
  },
  tipText: { color: "#7c3aed", fontWeight: "600" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: { fontSize: 18, color: "#111", fontWeight: "600" },
  cardValue: { color: "#9ca3af", fontWeight: "600" },
});
