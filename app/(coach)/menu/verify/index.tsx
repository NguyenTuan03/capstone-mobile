import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CredentialStatus = "pending" | "approved" | "rejected";

type Credential = {
  id: string;
  type: string;
  title: string;
  description: string;
  uploadedDate: string;
  status: CredentialStatus;
  statusReason?: string;
  fileUrl?: string;
};

const MOCK_CREDENTIALS: Credential[] = [
  {
    id: "1",
    type: "id_verification",
    title: "Government ID",
    description: "Driver's License or Passport",
    uploadedDate: "2024-01-15",
    status: "approved",
    fileUrl: "#",
  },
  {
    id: "2",
    type: "certification",
    title: "Pickleball Coaching Certification",
    description: "IPTPA Level 2 Certification",
    uploadedDate: "2024-01-18",
    status: "pending",
    fileUrl: "#",
  },
  {
    id: "3",
    type: "certification",
    title: "First Aid & CPR",
    description: "American Red Cross Certification",
    uploadedDate: "2024-01-20",
    status: "rejected",
    statusReason: "Certificate expired. Please upload current certification.",
    fileUrl: "#",
  },
  {
    id: "4",
    type: "insurance",
    title: "Liability Insurance",
    description: "Professional Liability Coverage",
    uploadedDate: "2024-01-22",
    status: "pending",
    fileUrl: "#",
  },
];

export default function CredentialVerificationScreen() {
  const insets = useSafeAreaInsets();
  const [credentials] = useState<Credential[]>(MOCK_CREDENTIALS);

  const getStatusColor = (status: CredentialStatus) => {
    switch (status) {
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: CredentialStatus) => {
    switch (status) {
      case "approved":
        return "checkmark-circle";
      case "rejected":
        return "close-circle";
      case "pending":
        return "time";
      default:
        return "help-circle";
    }
  };

  const getStatusText = (status: CredentialStatus) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Under Review";
      default:
        return "Unknown";
    }
  };

  const handleUploadCredential = () => {
    Alert.alert(
      "Upload Credential",
      "Choose the type of credential to upload",
      [
        { text: "Government ID", onPress: () => {} },
        { text: "Certification", onPress: () => {} },
        { text: "Insurance", onPress: () => {} },
        { text: "Other", onPress: () => {} },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleViewDocument = (credential: Credential) => {
    Alert.alert("View Document", `View ${credential.title}`, [
      { text: "View", onPress: () => {} },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const getStatusCount = (status: CredentialStatus) => {
    return credentials.filter((c) => c.status === status).length;
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credential Verification</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadCredential}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Status Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryDot,
                { backgroundColor: getStatusColor("pending") },
              ]}
            />
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryCount}>{getStatusCount("pending")}</Text>
          </View>
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryDot,
                { backgroundColor: getStatusColor("approved") },
              ]}
            />
            <Text style={styles.summaryLabel}>Approved</Text>
            <Text style={styles.summaryCount}>
              {getStatusCount("approved")}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryDot,
                { backgroundColor: getStatusColor("rejected") },
              ]}
            />
            <Text style={styles.summaryLabel}>Rejected</Text>
            <Text style={styles.summaryCount}>
              {getStatusCount("rejected")}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Credentials</Text>

        {credentials.map((credential) => (
          <View key={credential.id} style={styles.credentialCard}>
            <View style={styles.credentialHeader}>
              <View style={styles.credentialInfo}>
                <View style={styles.credentialTitleContainer}>
                  <Ionicons
                    name={
                      credential.type === "id_verification"
                        ? "person-outline"
                        : credential.type === "certification"
                          ? "ribbon-outline"
                          : "shield-checkmark-outline"
                    }
                    size={20}
                    color="#1e293b"
                  />
                  <Text style={styles.credentialTitle}>{credential.title}</Text>
                </View>
                <Text style={styles.credentialDescription}>
                  {credential.description}
                </Text>
                <Text style={styles.uploadedDate}>
                  Uploaded on {credential.uploadedDate}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(credential.status) + "20" },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(credential.status)}
                  size={16}
                  color={getStatusColor(credential.status)}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(credential.status) },
                  ]}
                >
                  {getStatusText(credential.status)}
                </Text>
              </View>
            </View>

            {credential.statusReason && (
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text style={styles.reasonText}>{credential.statusReason}</Text>
              </View>
            )}

            <View style={styles.credentialActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleViewDocument(credential)}
              >
                <Ionicons name="document-outline" size={16} color="#64748b" />
                <Text style={styles.actionButtonText}>View Document</Text>
              </TouchableOpacity>

              {credential.status === "rejected" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => handleUploadCredential()}
                >
                  <Ionicons name="refresh-outline" size={16} color="#fff" />
                  <Text style={styles.primaryButtonText}>Re-upload</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Verification Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#3b82f6"
            />
            <Text style={styles.infoTitle}>Verification Process</Text>
          </View>
          <Text style={styles.infoText}>
            Our team typically reviews credentials within 2-3 business days.
            You&apos;ll receive a notification once your documents are verified.
            All credentials must be current and valid.
          </Text>
          <Text style={styles.infoContact}>
            Need help? Contact support@pickleballcoach.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  uploadButton: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    gap: 4,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  summaryCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    marginTop: 8,
  },
  credentialCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  credentialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  credentialInfo: {
    flex: 1,
    marginRight: 12,
  },
  credentialTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  credentialDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  uploadedDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reasonContainer: {
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 12,
    color: "#991b1b",
  },
  credentialActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  primaryButtonText: {
    color: "#fff",
  },
  infoCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    marginTop: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  infoText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
    marginBottom: 8,
  },
  infoContact: {
    fontSize: 12,
    color: "#3730a3",
    fontWeight: "500",
  },
});
