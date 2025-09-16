import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Pressable, Text, View } from "react-native";

export function Stat({
  label,
  value,
  sub,
  emphasis,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={{ color: "#D1D5DB", fontSize: 12 }}>{label}</Text>
      <Text
        style={{
          color: "#fff",
          fontSize: emphasis ? 18 : 16,
          fontWeight: emphasis ? "800" : "700",
        }}
      >
        {value}
      </Text>
      {sub ? (
        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>{sub}</Text>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: "#111827",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

export function OutlineButton({
  title,
  onPress,
  light = false,
}: {
  title: string;
  onPress: () => void;
  light?: boolean;
}) {
  const color = light ? "rgba(255,255,255,0.9)" : "#111827";
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    >
      <Text style={{ color, fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}

export function SectionTitle({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ textAlign: "center", fontWeight: "800", fontSize: 16 }}>
        {title}
      </Text>
      {caption ? (
        <Text
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginTop: 8,
            lineHeight: 20,
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

export function SkillCard({ label, value }: { label: string; value: string }) {
  const { width: W } = Dimensions.get("window");
  const cardW = (W - 16 * 2 - 12) / 2;
  return (
    <View
      style={{
        width: cardW,
        backgroundColor: "#F1F2F4",
        borderRadius: 18,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: "#374151", fontWeight: "600", flexShrink: 1 }}>
        {label}
      </Text>
      <View
        style={{
          width: 58,
          height: 40,
          borderRadius: 12,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text style={{ fontWeight: "800", color: "#111827" }}>{value}</Text>
      </View>
    </View>
  );
}

export function DividerCurve() {
  // dải bo góc trên/dưới như ảnh tham chiếu
  return (
    <View style={{ marginHorizontal: -16, marginVertical: 12 }}>
      <View
        style={{
          height: 18,
          backgroundColor: "#fff",
          borderTopRightRadius: 24,
        }}
      />
      <View
        style={{
          height: 10,
          backgroundColor: "#EDEEF0",
          marginHorizontal: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      />
    </View>
  );
}

export function EmptyFilmCard({
  onUpload,
  onViewAll,
}: {
  onUpload: () => void;
  onViewAll: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: 8, marginBottom: 8 }}>
      <Text
        style={{
          textAlign: "center",
          color: "#6b7280",
          marginTop: 8,
          marginBottom: 24,
        }}
      >
        You currently have no films
      </Text>

      <Pressable
        onPress={onUpload}
        style={{
          alignSelf: "center",
          width: "80%",
          backgroundColor: "#111827",
          paddingVertical: 16,
          borderRadius: 22,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "800" }}>UPLOAD FILM</Text>
      </Pressable>

      <View style={{ marginTop: 22, marginBottom: 8 }}>
        <OutlineButton title="View All Films" onPress={onViewAll} />
      </View>
    </View>
  );
}
