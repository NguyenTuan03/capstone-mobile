import { Stack } from "expo-router";

export default function StudentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Students" }} />
      <Stack.Screen
        name="[id]"
        options={{ title: "Student Detail", presentation: "card" }}
      />
    </Stack>
  );
}
