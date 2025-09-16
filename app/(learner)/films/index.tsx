import { SafeAreaView, Text, View } from "react-native";

export default function FilmsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Films</Text>
      </View>
    </SafeAreaView>
  );
}
