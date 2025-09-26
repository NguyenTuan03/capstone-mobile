import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  const [scale, setScale] = useState(1);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setScale(0.95)}
      onPressOut={() => setScale(1)}
      style={{
        flex: 1,
        backgroundColor: "#111827",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        transform: [{ scale }],
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "900",
          fontSize: 14,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
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
  const [scale, setScale] = useState(1);
  const color = light ? "rgba(255,255,255,0.9)" : "#111827";
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setScale(0.95)}
      onPressOut={() => setScale(1)}
      style={{
        flex: 1,
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        borderWidth: 2,
        borderColor: color,
        backgroundColor: light ? "rgba(255,255,255,0.1)" : "transparent",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: light ? 0.2 : 0.1,
        shadowRadius: 4,
        elevation: 3,
        transform: [{ scale }],
      }}
    >
      <Text
        style={{
          color,
          fontWeight: "800",
          fontSize: 14,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
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
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "900",
          fontSize: 18,
          color: "#111827",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      {caption ? (
        <Text
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginTop: 8,
            lineHeight: 22,
            fontSize: 14,
            fontWeight: "500",
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
        backgroundColor: "#F8F9FA",
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <Text
        style={{
          color: "#374151",
          fontWeight: "700",
          flexShrink: 1,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: 62,
          height: 42,
          borderRadius: 14,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          borderWidth: 1,
          borderColor: "#F3F4F6",
        }}
      >
        <Text
          style={{
            fontWeight: "900",
            color: "#111827",
            fontSize: 16,
            letterSpacing: 0.5,
          }}
        >
          {value}
        </Text>
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

export function RoadmapButton({ onPress }: { onPress: () => void }) {
  const [scale, setScale] = useState(1);

  return (
    <View style={{ alignItems: "center", marginTop: 24, marginBottom: 24 }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => setScale(0.95)}
        onPressOut={() => setScale(1)}
        style={{
          transform: [{ scale }],
        }}
      >
        <LinearGradient
          colors={["#8B5CF6", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 32,
            paddingVertical: 18,
            borderRadius: 30,
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="map-outline" size={20} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontWeight: "900",
                fontSize: 16,
                letterSpacing: 0.5,
              }}
            >
              View Full Roadmap
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </View>
        </LinearGradient>
      </Pressable>
      <Text
        style={{
          color: "#6b7280",
          fontSize: 12,
          marginTop: 8,
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        Track your learning journey
      </Text>
    </View>
  );
}

export function VideoCardWithAI({
  video,
  onPress,
}: {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    date: string;
    aiAnalysis: {
      overallScore: number;
      keyInsights: string[];
      recommendations: string[];
      strengths: string[];
      areasForImprovement: string[];
    };
  };
  onPress: () => void;
}) {
  const [scale, setScale] = useState(1);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setScale(0.98)}
      onPressOut={() => setScale(1)}
      style={{
        transform: [{ scale }],
        marginBottom: 16,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        {/* Video Thumbnail with AI Badge */}
        <View style={{ position: "relative" }}>
          <ImageBackground
            source={{ uri: video.thumbnail }}
            style={{
              width: "100%",
              height: 200,
              justifyContent: "flex-end",
            }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
              }}
            />
          </ImageBackground>

          {/* AI Analysis Badge */}
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(139, 92, 246, 0.9)",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Ionicons name="analytics-outline" size={14} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
              AI ANALYZED
            </Text>
          </View>

          {/* Duration Badge */}
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
              {video.duration}
            </Text>
          </View>
        </View>

        {/* Video Info */}
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#111827",
              marginBottom: 8,
              lineHeight: 22,
            }}
          >
            {video.title}
          </Text>

          {/* AI Score */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "500" }}>
              {video.date}
            </Text>
            <View
              style={{
                backgroundColor: "#F3F4F6",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Text
                style={{ color: "#6b7280", fontSize: 12, fontWeight: "600" }}
              >
                AI Score:
              </Text>
              <Text
                style={{
                  color:
                    video.aiAnalysis.overallScore >= 80
                      ? "#10B981"
                      : video.aiAnalysis.overallScore >= 60
                        ? "#F59E0B"
                        : "#EF4444",
                  fontSize: 14,
                  fontWeight: "800",
                }}
              >
                {video.aiAnalysis.overallScore}%
              </Text>
            </View>
          </View>

          {/* Key Insights */}
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "#374151",
                marginBottom: 6,
              }}
            >
              🔍 Key AI Insights:
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {video.aiAnalysis.keyInsights
                .slice(0, 2)
                .map((insight, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#EEF2FF",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "#6366F1",
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                    >
                      {insight}
                    </Text>
                  </View>
                ))}
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            onPress={onPress}
            style={{
              backgroundColor: "#111827",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons name="play-circle-outline" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
              View Analysis
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
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

      <Pressable
        onPress={onViewAll}
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
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
          marginTop: 22,
          marginBottom: 8,
        }}
      >
        <Ionicons name="film-outline" size={18} color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "800" }}>VIEW ALL FILMS</Text>
      </Pressable>
    </View>
  );
}
