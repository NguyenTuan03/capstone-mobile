import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types

interface Drill {
  id: string;
  title: string;
  description: string;
  skill:
    | "Serve"
    | "Return"
    | "Dink"
    | "3rd Shot"
    | "Volley"
    | "Lob"
    | "Strategy";
  level: string;
  duration: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  equipment: string[];
  videoUrl?: string;
}

interface SessionData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  mode: "online" | "offline";
  location?: string;
  meetingLink?: string;
  skillLevel: string;
  maxStudents: number;
  price: number;
  objectives: string[];
  drills: Drill[];
  includesVideoAnalysis: boolean;
  includesProgressReport: boolean;
  recurrence: "none" | "weekly" | "biweekly" | "monthly";
}

type WizardStep = "basic" | "drills" | "scheduling" | "review";

const CreateSessionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic");
  const [loading, setLoading] = useState(false);

  // Mock data

  const mockDrills: Drill[] = [
    {
      id: "d1",
      title: "Dink Control & Consistency",
      description: "Focus on soft touch and control in the kitchen",
      skill: "Dink",
      level: "2.0-3.0",
      duration: 15,
      intensity: 2,
      equipment: ["Paddle", "Balls"],
      videoUrl: "https://example.com/dink-drill",
    },
    {
      id: "d2",
      title: "Third Shot Drop Technique",
      description: "Master the third shot drop from baseline",
      skill: "3rd Shot",
      level: "3.0-4.0",
      duration: 20,
      intensity: 3,
      equipment: ["Paddle", "Balls", "Cones"],
    },
    {
      id: "d3",
      title: "Serve Accuracy Training",
      description: "Improve serve placement and consistency",
      skill: "Serve",
      level: "2.0-3.5",
      duration: 12,
      intensity: 3,
      equipment: ["Paddle", "Balls", "Target cones"],
    },
  ];

  // Session state
  const [sessionData, setSessionData] = useState<SessionData>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    mode: "offline",
    location: "",
    meetingLink: "",
    skillLevel: "2.0-3.0",
    maxStudents: 4,
    price: 200000,
    objectives: [],
    drills: [],
    includesVideoAnalysis: false,
    includesProgressReport: true,
    recurrence: "none",
  });

  const [newObjective, setNewObjective] = useState("");

  // Wizard navigation
  const steps = [
    { id: "basic", title: "Thông tin cơ bản", icon: "information-circle" },
    { id: "drills", title: "Bài tập", icon: "fitness" },
    { id: "scheduling", title: "Lịch trình", icon: "calendar" },
    { id: "review", title: "Xem lại", icon: "checkmark-circle" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id as WizardStep);
    }
  };

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        "Thành công!",
        "Buổi tập đã được tạo thành công. Học viên sẽ nhận được thông báo.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo buổi tập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setSessionData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setSessionData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const toggleDrill = (drill: Drill) => {
    console.log("Toggling drill:", drill.title);
    setSessionData((prev) => {
      const exists = prev.drills.find((d) => d.id === drill.id);
      if (exists) {
        console.log("Removing drill:", drill.title);
        return {
          ...prev,
          drills: prev.drills.filter((d) => d.id !== drill.id),
        };
      } else {
        console.log("Adding drill:", drill.title);
        return {
          ...prev,
          drills: [...prev.drills, drill],
        };
      }
    });
  };

  const getDifficultyColor = (intensity: number) => {
    switch (intensity) {
      case 1:
        return "#10b981";
      case 2:
        return "#84cc16";
      case 3:
        return "#f59e0b";
      case 4:
        return "#ef4444";
      case 5:
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getSkillColor = (skill: string) => {
    const colors = {
      Serve: "#3b82f6",
      Return: "#8b5cf6",
      Dink: "#10b981",
      "3rd Shot": "#f59e0b",
      Volley: "#ef4444",
      Lob: "#06b6d4",
      Strategy: "#6366f1",
    };
    return colors[skill as keyof typeof colors] || "#6b7280";
  };

  // Render components for each step
  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Thông tin buổi tập</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tên buổi tập *</Text>
        <TextInput
          style={styles.input}
          value={sessionData.title}
          onChangeText={(text) =>
            setSessionData((prev) => ({ ...prev, title: text }))
          }
          placeholder="VD: Kỹ thuật giao bóng cơ bản"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={sessionData.description}
          onChangeText={(text) =>
            setSessionData((prev) => ({ ...prev, description: text }))
          }
          placeholder="Mô tả chi tiết về nội dung buổi tập..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
          <Text style={styles.label}>Trình độ</Text>
          <TextInput
            style={styles.input}
            value={sessionData.skillLevel}
            onChangeText={(text) =>
              setSessionData((prev) => ({ ...prev, skillLevel: text }))
            }
            placeholder="2.0-3.0"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Số học viên tối đa</Text>
          <TextInput
            style={styles.input}
            value={sessionData.maxStudents.toString()}
            onChangeText={(text) =>
              setSessionData((prev) => ({
                ...prev,
                maxStudents: parseInt(text) || 1,
              }))
            }
            keyboardType="numeric"
            placeholder="4"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          style={styles.input}
          value={sessionData.price.toString()}
          onChangeText={(text) =>
            setSessionData((prev) => ({
              ...prev,
              price: parseInt(text.replace(/\D/g, "")) || 0,
            }))
          }
          keyboardType="numeric"
          placeholder="200000"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.helperText}>
          Giá hiển thị: {sessionData.price.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mục tiêu buổi tập</Text>
        <View style={styles.objectiveInput}>
          <TextInput
            style={[styles.input, styles.flex1, styles.marginRight]}
            value={newObjective}
            onChangeText={setNewObjective}
            placeholder="Thêm mục tiêu..."
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.addButton} onPress={addObjective}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {sessionData.objectives.map((objective, index) => (
          <View key={index} style={styles.objectiveItem}>
            <Text style={styles.objectiveText}>• {objective}</Text>
            <TouchableOpacity onPress={() => removeObjective(index)}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Step Navigation Buttons */}
      <View style={styles.stepNavigationContainer}>
        {currentStepIndex > 0 && (
          <TouchableOpacity
            style={styles.backStepButton}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
            <Text style={styles.backStepButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextStepButton} onPress={handleNext}>
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.nextStepGradient}
          >
            <Text style={styles.nextStepButtonText}>Tiếp tục</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDrillSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chọn bài tập</Text>
      <Text style={styles.subtitle}>
        Tạo chương trình tập luyện phù hợp với mục tiêu
      </Text>

      <View style={styles.drillStats}>
        <Text style={styles.statsText}>
          Đã chọn: {sessionData.drills.length} bài tập • Tổng thời gian:{" "}
          {sessionData.drills.reduce(
            (total, drill) => total + drill.duration,
            0,
          )}{" "}
          phút
        </Text>
      </View>

      {/* Create New Drill Button */}
      <TouchableOpacity
        style={styles.createDrillButton}
        onPress={() => {
          Alert.alert("Tạo bài tập mới", "Bạn có muốn tạo bài tập mới không?", [
            { text: "Hủy", style: "cancel" },
            {
              text: "Tạo mới",
              onPress: () => {
                // Navigate to drill creation screen
                router.push("/(coach)/drill/new");
              },
            },
          ]);
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
        <Text style={styles.createDrillButtonText}>Tạo bài tập mới</Text>
      </TouchableOpacity>

      {mockDrills.map((drill) => {
        const isSelected = sessionData.drills.find((d) => d.id === drill.id);
        return (
          <TouchableOpacity
            key={drill.id}
            style={[styles.drillCard, isSelected && styles.drillCardSelected]}
            onPress={() => toggleDrill(drill)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.drillHeader}>
              <View style={styles.drillTitleRow}>
                <Text style={styles.drillTitle}>{drill.title}</Text>
                <View style={styles.drillTitleRight}>
                  <View
                    style={[
                      styles.skillBadge,
                      { backgroundColor: getSkillColor(drill.skill) },
                    ]}
                  >
                    <Text style={styles.skillBadgeText}>{drill.skill}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#3b82f6"
                      />
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.drillDescription}>{drill.description}</Text>
            </View>

            <View style={styles.drillDetails}>
              <View style={styles.drillMetric}>
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text style={styles.drillMetricText}>
                  {drill.duration} phút
                </Text>
              </View>
              <View style={styles.drillMetric}>
                <Ionicons
                  name="speedometer-outline"
                  size={16}
                  color="#6b7280"
                />
                <View
                  style={[
                    styles.intensityIndicator,
                    { backgroundColor: getDifficultyColor(drill.intensity) },
                  ]}
                >
                  <Text style={styles.intensityText}>{drill.intensity}</Text>
                </View>
              </View>
              <View style={styles.drillMetric}>
                <Ionicons name="bar-chart-outline" size={16} color="#6b7280" />
                <Text style={styles.drillMetricText}>{drill.level}</Text>
              </View>
            </View>

            <View style={styles.drillEquipment}>
              <Text style={styles.equipmentLabel}>Dụng cụ: </Text>
              <Text style={styles.equipmentText}>
                {drill.equipment.join(", ")}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Step Navigation Buttons */}
      <View style={styles.stepNavigationContainer}>
        {currentStepIndex > 0 && (
          <TouchableOpacity
            style={styles.backStepButton}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
            <Text style={styles.backStepButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextStepButton} onPress={handleNext}>
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.nextStepGradient}
          >
            <Text style={styles.nextStepButtonText}>Tiếp tục</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScheduling = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Lên lịch</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hình thức</Text>
        <View style={styles.segmentedControl}>
          {["offline", "online"].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.segmentButton,
                sessionData.mode === mode && styles.segmentButtonActive,
              ]}
              onPress={() =>
                setSessionData((prev) => ({ ...prev, mode: mode as any }))
              }
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  sessionData.mode === mode && styles.segmentButtonTextActive,
                ]}
              >
                {mode === "offline" ? "🏟️ Trực tiếp" : "💻 Trực tuyến"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
          <Text style={styles.label}>Ngày</Text>
          <TextInput
            style={styles.input}
            value={sessionData.date}
            onChangeText={(text) =>
              setSessionData((prev) => ({ ...prev, date: text }))
            }
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Thời lượng (phút)</Text>
          <TextInput
            style={styles.input}
            value={sessionData.duration.toString()}
            onChangeText={(text) =>
              setSessionData((prev) => ({
                ...prev,
                duration: parseInt(text) || 60,
              }))
            }
            keyboardType="numeric"
            placeholder="60"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
          <Text style={styles.label}>Giờ bắt đầu</Text>
          <TextInput
            style={styles.input}
            value={sessionData.startTime}
            onChangeText={(text) =>
              setSessionData((prev) => ({ ...prev, startTime: text }))
            }
            placeholder="09:00"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Giờ kết thúc</Text>
          <TextInput
            style={styles.input}
            value={sessionData.endTime}
            onChangeText={(text) =>
              setSessionData((prev) => ({ ...prev, endTime: text }))
            }
            placeholder="10:00"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {sessionData.mode === "offline" ? (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa điểm</Text>
          <TextInput
            style={styles.input}
            value={sessionData.location}
            onChangeText={(text) =>
              setSessionData((prev) => ({ ...prev, location: text }))
            }
            placeholder="Nhập địa chỉ sân..."
            placeholderTextColor="#9ca3af"
          />
        </View>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Link Meeting</Text>
          <TextInput
            style={styles.input}
            value={sessionData.meetingLink}
            onChangeText={(text) =>
              setSessionData((prev) => ({ ...prev, meetingLink: text }))
            }
            placeholder="https://zoom.us/j/..."
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lặp lại</Text>
        <View style={styles.segmentedControl}>
          {[
            { key: "none", label: "Không" },
            { key: "weekly", label: "Hàng tuần" },
            { key: "biweekly", label: "2 tuần" },
            { key: "monthly", label: "Hàng tháng" },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.segmentButton,
                sessionData.recurrence === option.key &&
                  styles.segmentButtonActive,
              ]}
              onPress={() =>
                setSessionData((prev) => ({
                  ...prev,
                  recurrence: option.key as any,
                }))
              }
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  sessionData.recurrence === option.key &&
                    styles.segmentButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.featureToggles}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Bao gồm phân tích video AI</Text>
          <Switch
            value={sessionData.includesVideoAnalysis}
            onValueChange={(value) =>
              setSessionData((prev) => ({
                ...prev,
                includesVideoAnalysis: value,
              }))
            }
            trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
            thumbColor={sessionData.includesVideoAnalysis ? "#fff" : "#f4f3f4"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Báo cáo tiến độ</Text>
          <Switch
            value={sessionData.includesProgressReport}
            onValueChange={(value) =>
              setSessionData((prev) => ({
                ...prev,
                includesProgressReport: value,
              }))
            }
            trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
            thumbColor={sessionData.includesProgressReport ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Step Navigation Buttons */}
      <View style={styles.stepNavigationContainer}>
        {currentStepIndex > 0 && (
          <TouchableOpacity
            style={styles.backStepButton}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={20} color="#6b7280" />
            <Text style={styles.backStepButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextStepButton} onPress={handleNext}>
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.nextStepGradient}
          >
            <Text style={styles.nextStepButtonText}>Tiếp tục</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Xem lại thông tin</Text>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Thông tin cơ bản</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Tên buổi tập:</Text>
          <Text style={styles.reviewValue}>{sessionData.title}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Giá:</Text>
          <Text style={styles.reviewValue}>
            {sessionData.price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Lịch trình</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Ngày giờ:</Text>
          <Text style={styles.reviewValue}>
            {sessionData.date} • {sessionData.startTime} - {sessionData.endTime}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Hình thức:</Text>
          <Text style={styles.reviewValue}>
            {sessionData.mode === "offline" ? "🏟️ Trực tiếp" : "💻 Trực tuyến"}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Địa điểm/Link:</Text>
          <Text style={styles.reviewValue}>
            {sessionData.mode === "offline"
              ? sessionData.location
              : sessionData.meetingLink}
          </Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>
          Bài tập ({sessionData.drills.length})
        </Text>
        {sessionData.drills.map((drill) => (
          <View key={drill.id} style={styles.reviewDrillItem}>
            <Text style={styles.reviewDrillTitle}>{drill.title}</Text>
            <Text style={styles.reviewDrillDetails}>
              {drill.duration} phút • {drill.skill} • Cấp độ {drill.intensity}
            </Text>
          </View>
        ))}
        <Text style={styles.totalDuration}>
          Tổng thời gian bài tập:{" "}
          {sessionData.drills.reduce(
            (total, drill) => total + drill.duration,
            0,
          )}{" "}
          phút
        </Text>
      </View>

      {sessionData.objectives.length > 0 && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Mục tiêu</Text>
          {sessionData.objectives.map((objective, index) => (
            <Text key={index} style={styles.reviewObjective}>
              • {objective}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 80 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo buổi tập mới</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStepIndex + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Bước {currentStepIndex + 1} / {steps.length}
        </Text>
      </View>

      {/* Step indicator */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stepIndicator}
        contentContainerStyle={styles.stepIndicatorContent}
      >
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= currentStepIndex && styles.stepCircleActive,
                index < currentStepIndex && styles.stepCircleCompleted,
              ]}
            >
              <Ionicons
                name={
                  index < currentStepIndex ? "checkmark" : (step.icon as any)
                }
                size={20}
                color={index <= currentStepIndex ? "#fff" : "#9ca3af"}
              />
            </View>
            <Text
              style={[
                styles.stepLabel,
                index <= currentStepIndex && styles.stepLabelActive,
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === "basic" && renderBasicInfo()}
        {currentStep === "drills" && renderDrillSelection()}
        {currentStep === "scheduling" && renderScheduling()}
        {currentStep === "review" && renderReview()}
      </ScrollView>

      {/* Navigation buttons - Only show on review step */}
      {currentStep === "review" && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePrevious}
          >
            <Text style={styles.secondaryButtonText}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleCreateSession}
            disabled={loading}
          >
            <LinearGradient
              colors={["#3b82f6", "#1d4ed8"]}
              style={styles.gradientButton}
            >
              {loading ? (
                <Text style={styles.primaryButtonText}>Đang tạo...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Tạo buổi tập</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  stepIndicator: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  stepIndicatorContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepItem: {
    alignItems: "center",
    marginRight: 32,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: "#3b82f6",
  },
  stepCircleCompleted: {
    backgroundColor: "#10b981",
  },
  stepLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 80,
  },
  stepLabelActive: {
    color: "#1f2937",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  segmentButtonTextActive: {
    color: "#1f2937",
  },
  objectiveInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  filterSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  studentCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  studentLocation: {
    fontSize: 12,
    color: "#9ca3af",
  },
  studentBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  studentBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  selectedSummary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  drillStats: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statsText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  drillCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  drillCardSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  drillHeader: {
    marginBottom: 12,
  },
  drillTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  drillTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  drillTitleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedIndicator: {
    marginLeft: 4,
  },
  drillDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  drillDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  drillMetric: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  drillMetricText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  intensityIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  intensityText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  drillEquipment: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  equipmentLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  equipmentText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  featureToggles: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  reviewSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: "#6b7280",
    width: 120,
  },
  reviewValue: {
    fontSize: 14,
    color: "#1f2937",
    flex: 1,
    fontWeight: "500",
  },
  reviewStudentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewStudentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewStudentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  reviewStudentLevel: {
    fontSize: 12,
    color: "#6b7280",
  },
  reviewDrillItem: {
    marginBottom: 8,
  },
  reviewDrillTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  reviewDrillDetails: {
    fontSize: 12,
    color: "#6b7280",
  },
  totalDuration: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    textAlign: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  reviewObjective: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  navigationContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  primaryButton: {
    flex: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  nextStepButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  nextStepGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  nextStepButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  createDrillButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  createDrillButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  stepNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  backStepButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    gap: 8,
  },
  backStepButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
});

export default CreateSessionScreen;
