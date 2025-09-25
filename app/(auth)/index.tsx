import AppForm from "@/components/common/AppForm";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function AuthScreen() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (values: Record<string, string>) => {
    setError(null);
    setSubmitting(true);

    // Giả lập loading time
    setTimeout(() => {
      if (values.password === "c") {
        router.push("/(coach)/home" as Href);
      } else {
        router.push("/(learner)/home" as Href);
      }
      setSubmitting(false);
    }, 500);
  };

  return (
    <AppForm
      title="Welcome back 👋"
      subtitle="login to continue your training journey."
      skipValidation={true}
      items={[
        {
          name: "email",
          label: "Email",
          placeholder: "you@example.com",
          keyboardType: "email-address",
          leftIcon: null, // dùng default mail icon
        },
        {
          name: "password",
          label: "Password",
          placeholder: "••••••••",
          secureTextEntry: true,
          leftIcon: null, // dùng default lock icon
        },
      ]}
      onSubmit={handleLogin}
      submitting={submitting}
      error={error}
      submitText="Sign in"
      footer={
        <View style={{ gap: 8, alignItems: "center" }}>
          <Pressable
            onPress={() => router.push("/(auth)/forgot-password" as Href)}
          >
            <Text style={{ color: "#6b7280", textDecorationLine: "underline" }}>
              Forgot password?
            </Text>
          </Pressable>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={{ color: "#6b7280" }}>
              Don&apos;t have an account?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register" as Href)}>
              <Text style={{ color: "#2563eb", fontWeight: "700" }}>
                Register
              </Text>
            </Pressable>
          </View>
        </View>
      }
    />
  );
}
