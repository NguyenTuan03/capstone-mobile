// app/(learner)/home/index.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DividerCurve,
  EmptyFilmCard,
  OutlineButton,
  PrimaryButton,
  SectionTitle,
  SkillCard,
  Stat,
} from "@/modules/learner/home";

const { height: H } = Dimensions.get("window");
const HERO_H = Math.round(H * 0.5);

const skills = [
  "Serve",
  "Return",
  "Non Bounce Volley",
  "Dinking",
  "3rd Shot Drop",
  "Kitchen Readiness",
  "Court Position",
  "Partner Chemistry",
];

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight(); // chiều cao thực tế của tab bar
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: tabBarHeight + insets.bottom,
        }}
      >
        {/* ---------- HERO (2/3 màn hình) ---------- */}
        <View style={{ height: HERO_H }}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
            }}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.65)"]}
              style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: 24,
                justifyContent: "flex-end",
                paddingBottom: 20,
              }}
            >
              {/* Avatar + Name */}
              <View style={{ alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 999,
                    backgroundColor: "#A700FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "800", fontSize: 28 }}
                  >
                    TN
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 32,
                    fontWeight: "800",
                    marginTop: 8,
                  }}
                >
                  TUAN
                </Text>
              </View>

              {/* 3 stats */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <Stat label="DUPR" value="NR +" sub="Not Rated" />
                <Stat label="Your DUPR Goal" value="NR" sub="Not Rated" />
                <Stat label="DUPR Coach" value="David" emphasis />
              </View>

              {/* CTA */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <PrimaryButton title="SUBSCRIBE" onPress={() => {}} />
                <OutlineButton title="VIEW ROADMAP" onPress={() => {}} light />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* ---------- BODY ---------- */}
        <View
          style={{
            marginTop: 0,
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 16,
            paddingTop: 20,
          }}
        >
          {/* DUPR SKILLS */}
          <SectionTitle
            title="DUPR SKILLS"
            caption={`See below your scores for your game areas. Your coach has\nrated each area on a DUPR scale of 2 to 8.`}
          />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              rowGap: 12,
            }}
          >
            {skills.map((label) => (
              <SkillCard key={label} label={label} value="0.0" />
            ))}
          </View>

          {/* View full roadmap */}
          <View style={{ marginTop: 18, marginBottom: 18 }}>
            <OutlineButton title="View Full Roadmap" onPress={() => {}} />
          </View>

          {/* curved divider kiểu card bo 2 góc */}
          <DividerCurve />

          {/* ---------- LATEST FILM ---------- */}
          <SectionTitle
            title="LATEST FILM"
            caption="See below your latest film upload. Tap to play and review your coach's feedback."
          />

          <EmptyFilmCard onUpload={() => {}} onViewAll={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
