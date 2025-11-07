import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { get } from "@/services/http/httpService";
import { Subject } from "@/types/subject";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const CoachSubjectScreen = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        console.warn("Không tìm thấy thông tin người dùng");
        return;
      }
      const user = JSON.parse(userString);
      const userId = user.id;

      const res = await get<{ items: Subject[] }>(
        `${API_URL}/v1/subjects?filter=createdBy_eq_${userId}`,
      );
      setSubjects(res.data.items || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách môn học:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Danh sách môn học của toi
      </Text>

      {/* Nút tạo môn học */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#EAEAEA",
          marginBottom: 10,
        }}
        onPress={() => router.push("/(coach)/menu/subject/create" as any)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="add" size={22} color="#000" />
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Tạo môn học</Text>
        </View>
      </TouchableOpacity>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {subjects.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
              Bạn chưa có môn học nào.
            </Text>
          ) : (
            subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#eee",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() =>
                  router.push({
                    pathname:
                      `/(coach)/menu/subject/${subject.id}/lesson` as any,
                    params: { subjectName: subject.name },
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: 6,
                  }}
                >
                  {subject.name}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  {subject.description || "Không có mô tả"}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CoachSubjectScreen;
