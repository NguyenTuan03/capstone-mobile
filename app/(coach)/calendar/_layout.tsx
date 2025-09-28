import { Stack } from "expo-router";

export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Calendar" }} />
      <Stack.Screen name="session" options={{ title: "Session" }} />
    </Stack>
  );
}
