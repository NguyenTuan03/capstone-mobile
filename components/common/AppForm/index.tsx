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
import { useState } from "react";

type FieldItem = {
  name: string; // key: email, password, confirm...
  label: string; // hiển thị: "Email", "Password"
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric";
};

type AppFormProps = {
  title: string;
  items: FieldItem[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitting: boolean;
  error?: string | null;
  submitText: string;
  footer?: React.ReactNode;
};

export default function AppForm({
  title,
  items,
  onSubmit,
  submitting,
  error,
  submitText,
  footer,
}: AppFormProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formValues);
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
              {title}
            </Text>

            {error ? (
              <View
                style={{
                  backgroundColor: "#fee2e2",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#b91c1c" }}>{error}</Text>
              </View>
            ) : null}

            {/* Render dynamic fields */}
            {items.map((item, idx) => (
              <View style={{ gap: 8 }} key={item.name}>
                <Text style={{ fontWeight: "600" }}>{item.label}</Text>
                <TextInput
                  value={formValues[item.name] || ""}
                  onChangeText={(val) => handleChange(item.name, val)}
                  placeholder={item.placeholder}
                  secureTextEntry={item.secureTextEntry}
                  autoCapitalize={item.autoCapitalize || "none"}
                  keyboardType={item.keyboardType || "default"}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                  returnKeyType={idx === items.length - 1 ? "go" : "next"}
                  onSubmitEditing={
                    idx === items.length - 1 ? handleSubmit : undefined
                  }
                />
              </View>
            ))}

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
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
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {submitText}
                </Text>
              )}
            </Pressable>

            {/* Footer */}
            <View style={{ alignItems: "center", marginTop: 12 }}>
              {footer}
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
