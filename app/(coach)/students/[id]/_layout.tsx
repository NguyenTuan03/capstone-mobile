import { Stack } from "expo-router";

export default function StudentDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Student Detail",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
