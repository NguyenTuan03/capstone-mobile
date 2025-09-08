import { useJWTAuth, useJWTAuthActions } from "@/services/jwt-auth/JWTAuthProvider";
import { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AuthScreen() {
  const { signInUser } = useJWTAuthActions();
  const { isAuthenticated } = useJWTAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return false;
    }
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(email.trim())) {
      setError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    Keyboard.dismiss();
    try {
      await signInUser({ email: email.trim(), password });
      // If credentials are wrong, provider won't set isAuthenticated.
      // We'll surface an error when it remains false after the call.
      setTimeout(() => {
        if (!isAuthenticated) {
          setError("Invalid email or password");
        }
      }, 50);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 80,
              gap: 16,
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 24 }}>
              Welcome back
            </Text>

            {error ? (
              <View style={{ backgroundColor: "#fee2e2", padding: 12, borderRadius: 8 }}>
                <Text style={{ color: "#b91c1c" }}>{error}</Text>
              </View>
            ) : null}

            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "600" }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
                returnKeyType="next"
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "600" }}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                textContentType="password"
                autoComplete="password"
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                }}
                returnKeyType="go"
                onSubmitEditing={onSubmit}
              />
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              style={{
                marginTop: 12,
                backgroundColor: submitting ? "#93c5fd" : "#3b82f6",
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700" }}>Sign in</Text>
              )}
            </Pressable>

            <View style={{ alignItems: "center", marginTop: 12 }}>
              <Text style={{ color: "#6b7280" }}>Forgot your password?</Text>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
