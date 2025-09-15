import AppForm from "@/components/common/AppForm";
import { useJWTAuthActions } from "@/services/jwt-auth/JWTAuthProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, Pressable } from "react-native";

const Register = () => {
  const { signInUser } = useJWTAuthActions();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (values: Record<string, string>) => {
    if (values.password !== values.confirm) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signInUser({ email: values.email, password: values.password });
      router.replace("/(tabs)");
    } catch {
      setError("Register failed");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <AppForm
        title="Create Account"
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
          {
            name: "confirm",
            label: "Confirm Password",
            placeholder: "••••••••",
            secureTextEntry: true,
          },
        ]}
        onSubmit={handleRegister}
        submitting={submitting}
        error={error}
        submitText="Sign up"
        footer={
          <>
            <Text style={{ color: "#6b7280" }}>Already have an account?</Text>
            <Pressable onPress={() => router.replace("/(auth)")}>
              <Text style={{ color: "#3b82f6" }}>Login</Text>
            </Pressable>
          </>
        }
      />
    </>
  );
};

export default Register;
