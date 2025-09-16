import { SafeAreaView, Text, View } from "react-native";

export default function RoadmapScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Roadmap</Text>
      </View>
    </SafeAreaView>
  );
}
