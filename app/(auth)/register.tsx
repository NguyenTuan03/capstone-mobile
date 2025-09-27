import AppForm from "@/components/common/AppForm";
import { useJWTAuthActions } from "@/services/jwt-auth/JWTAuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text } from "react-native";

const Register = () => {
  const { signInUser } = useJWTAuthActions();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (values: Record<string, string>) => {
    if (values.password !== values.confirm) {
      setError("Mật khẩu không khớp");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signInUser({ email: values.email, password: values.password });
      router.replace("/(tabs)");
    } catch {
      setError("Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <AppForm
        title="Tạo Tài Khoản"
        items={[
          {
            name: "email",
            label: "Email",
            placeholder: "ban@example.com",
            keyboardType: "email-address",
          },
          {
            name: "password",
            label: "Mật khẩu",
            placeholder: "••••••••",
            secureTextEntry: true,
          },
          {
            name: "confirm",
            label: "Xác nhận mật khẩu",
            placeholder: "••••••••",
            secureTextEntry: true,
          },
        ]}
        onSubmit={handleRegister}
        submitting={submitting}
        error={error}
        submitText="Đăng ký"
        footer={
          <>
            <Text style={{ color: "#6b7280" }}>Đã có tài khoản?</Text>
            <Pressable onPress={() => router.replace("/(auth)")}>
              <Text style={{ color: "#3b82f6" }}>Đăng nhập</Text>
            </Pressable>
          </>
        }
      />
    </>
  );
};

export default Register;
