import { Stack } from "expo-router";

export default function MySessionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Sessions",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Session Details",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
