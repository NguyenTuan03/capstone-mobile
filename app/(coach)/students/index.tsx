import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Students = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
    >
      <View style={{ padding: 16 }}>
        <Text>Students</Text>
      </View>
    </SafeAreaView>
  );
};

export default Students;
