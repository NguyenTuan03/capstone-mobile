import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateCourseScreen() {
  const [courseName, setCourseName] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [courseType, setCourseType] = useState("group");
  const [totalSessions, setTotalSessions] = useState("8");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("2");
  const [startDate, setStartDate] = useState("23/10/2025");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [schedules, setSchedules] = useState([]);

  const priceOptions = [
    "500k",
    "1 triệu",
    "1.5 triệu",
    "2 triệu",
    "2.5 triệu",
    "3 triệu",
    "5 triệu",
    "10 triệu",
  ];

  const renderSectionHeader = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
  ) => (
    <View style={styles.sectionHeader as any}>
      <Ionicons name={icon} size={20} color="#059669" />
      <Text style={styles.sectionTitle as any}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Khóa Học Mới</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Name & Level */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Tên khóa học <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !courseName && styles.inputError]}
                placeholder="VD: Pickleball cơ bản cho người mới bắt đầu"
                value={courseName}
                onChangeText={setCourseName}
                placeholderTextColor="#9CA3AF"
              />
              {!courseName && (
                <Text style={styles.errorText}>Tên khóa học là bắt buộc</Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trình độ</Text>
            <View style={styles.segmentControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  level === "beginner" && styles.segmentButtonActive,
                ]}
                onPress={() => setLevel("beginner")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    level === "beginner" && styles.segmentTextActive,
                  ]}
                >
                  Cơ bản
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  level === "intermediate" && styles.segmentButtonActive,
                ]}
                onPress={() => setLevel("intermediate")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    level === "intermediate" && styles.segmentTextActive,
                  ]}
                >
                  Trung bình
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  level === "advanced" && styles.segmentButtonActive,
                ]}
                onPress={() => setLevel("advanced")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    level === "advanced" && styles.segmentTextActive,
                  ]}
                >
                  Nâng cao
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Course Type */}
        <View style={styles.section}>
          {renderSectionHeader("people", "Loại hình khóa học")}

          <TouchableOpacity
            style={[
              styles.typeCard,
              courseType === "individual" && styles.typeCardActive,
            ]}
            onPress={() => setCourseType("individual")}
          >
            <View style={styles.typeCardContent}>
              <Text style={styles.typeCardTitle}>Cá nhân (1 người)</Text>
              <Text style={styles.typeCardDesc}>
                Huấn luyện 1-1, hiệu quả cao nhất
              </Text>
            </View>
            {courseType === "individual" && (
              <Ionicons name="checkmark-circle" size={24} color="#059669" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeCard,
              courseType === "group" && styles.typeCardActive,
            ]}
            onPress={() => setCourseType("group")}
          >
            <View style={styles.typeCardContent}>
              <Text style={styles.typeCardTitle}>Nhóm (2-6 người)</Text>
              <Text style={styles.typeCardDesc}>
                Học theo nhóm, chi phí tiết kiệm
              </Text>
            </View>
            {courseType === "group" && (
              <Ionicons name="checkmark-circle" size={24} color="#059669" />
            )}
          </TouchableOpacity>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          {renderSectionHeader("calendar", "Lịch học và thời lượng")}

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>
                Tổng số buổi học <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={totalSessions}
                onChangeText={setTotalSessions}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>
                Số buổi mỗi tuần <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>2 buổi/tuần</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Ngày bắt đầu <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.dateText}>{startDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ngày kết thúc dự kiến:</Text>
              <Text style={styles.summaryValue}>20/11/2025</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng thời gian học:</Text>
              <Text style={styles.summaryValue}>4 tuần</Text>
            </View>
          </View>
        </View>

        {/* Add Schedule Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Thêm lịch học</Text>

          <View style={styles.scheduleForm}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Thứ</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>Chọn thứ</Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </View>
              </View>
              <View
                style={[styles.inputGroup, { flex: 1, marginHorizontal: 4 }]}
              >
                <Text style={styles.label}>Bắt đầu</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>Chọn giờ</Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Kết thúc</Text>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerText}>Chọn giờ</Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color="#D97706" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>
                Lịch các khóa học đang diễn ra
              </Text>
              <View style={styles.conflictItem}>
                <Ionicons name="calendar" size={16} color="#D97706" />
                <Text style={styles.conflictText}>Thứ 2 14:00 - 15:30</Text>
              </View>
              <View style={styles.conflictItem}>
                <Ionicons name="calendar" size={16} color="#D97706" />
                <Text style={styles.conflictText}>Thứ 4 14:00 - 15:30</Text>
              </View>
              <Text style={styles.warningNote}>
                * Vui lòng tránh chọn thời gian trùng với lịch đã có
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Mô tả khóa học</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học này..."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          {renderSectionHeader("cash", "Giá khóa học")}

          <Text style={styles.label}>
            Giá khóa học <Text style={styles.required}>*</Text> (Nhóm 4 người)
          </Text>
          <View style={styles.priceGrid}>
            {priceOptions.map((priceOption) => (
              <TouchableOpacity
                key={priceOption}
                style={[
                  styles.priceButton,
                  price === priceOption && styles.priceButtonActive,
                ]}
                onPress={() => setPrice(priceOption)}
              >
                <Text
                  style={[
                    styles.priceButtonText,
                    price === priceOption && styles.priceButtonTextActive,
                  ]}
                >
                  {priceOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, !price && styles.inputError]}
              placeholder="Hoặc nhập giá tùy chỉnh"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            {!price && (
              <Text style={styles.errorText}>Giá khóa học là bắt buộc</Text>
            )}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={18} color="#3B82F6" />
            <Text style={styles.infoText}>
              Bước giá: 100,000đ. Bạn có thể chọn nhanh các mức giá phổ biến
              hoặc nhập giá tùy chỉnh.
            </Text>
          </View>
        </View>

        {/* Preview Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.previewButton}>
            <Ionicons name="eye-outline" size={20} color="#059669" />
            <Text style={styles.previewButtonText}>Xem trước khóa học</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Tạo khóa học</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  segmentControl: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  segmentTextActive: {
    color: "#059669",
    fontWeight: "600",
  },
  typeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  typeCardActive: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  typeCardContent: {
    flex: 1,
  },
  typeCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  typeCardDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 14,
    color: "#111827",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  scheduleForm: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  warningContent: {
    flex: 1,
    marginLeft: 8,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 8,
  },
  conflictItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  conflictText: {
    fontSize: 12,
    color: "#92400E",
    marginLeft: 6,
  },
  warningNote: {
    fontSize: 11,
    color: "#D97706",
    marginTop: 6,
    fontStyle: "italic",
  },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    minHeight: 100,
  },
  priceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  priceButton: {
    width: "25%",
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    alignItems: "center",
  },
  priceButtonActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#059669",
  },
  priceButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  priceButtonTextActive: {
    color: "#059669",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#1E40AF",
    marginLeft: 8,
    lineHeight: 18,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#059669",
    paddingVertical: 12,
    borderRadius: 8,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    marginLeft: 6,
  },
  bottomActions: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
      },
      android: { elevation: 8 },
    }),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    backgroundColor: "#059669",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
