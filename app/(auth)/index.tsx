import AppForm from "@/components/common/AppForm";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text } from "react-native";

export default function AuthScreen() {
  // const { signInUser } = useJWTAuthActions();
  // const { isAuthenticated } = useJWTAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (values: Record<string, string>) => {
    setError(null);
    setSubmitting(true);
    try {
      // await signInUser({ email: values.email, password: values.password });
      router.push("/(learner)/home" as Href);
    } catch {
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppForm
        title="Welcome back"
        items={[
          {
            name: "email",
            label: "Email",
            placeholder: "you@example.com",
            keyboardType: "email-address",
          },
          {
            name: "password",
            label: "Password",
            placeholder: "••••••••",
            secureTextEntry: true,
          },
        ]}
        onSubmit={handleLogin}
        submitting={submitting}
        error={error}
        submitText="Sign in"
        footer={
          <>
            <Text style={{ color: "#6b7280" }}>Do not have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={{ color: "#3b82f6" }}>Register</Text>
            </Pressable>
          </>
        }
      />
    </>
  );
}
