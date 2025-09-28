import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TypeScript interfaces
interface Student {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  sessions: number;
  rating: number;
  avatar: string;
  lastSession: string;
  nextGoal: string;
  strengths: string[];
  improvements: string[];
}

interface StudentCardProps {
  student: Student;
}

const students: Student[] = [
  {
    id: "1",
    name: "John Smith",
    level: "Beginner",
    progress: 75,
    sessions: 8,
    rating: 4.8,
    avatar: "🏓",
    lastSession: "2 days ago",
    nextGoal: "Master Forehand",
    strengths: ["Consistency", "Footwork"],
    improvements: ["Backhand", "Serve"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    level: "Intermediate",
    progress: 60,
    sessions: 12,
    rating: 4.9,
    avatar: "🎾",
    lastSession: "1 day ago",
    nextGoal: "Tournament Ready",
    strengths: ["Power", "Strategy"],
    improvements: ["Net Play", "Consistency"],
  },
  {
    id: "3",
    name: "Mike Wilson",
    level: "Advanced",
    progress: 90,
    sessions: 20,
    rating: 5.0,
    avatar: "🏆",
    lastSession: "Today",
    nextGoal: "Competition Level",
    strengths: ["All-around", "Mental Game"],
    improvements: ["Fine-tuning"],
  },
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  filterButton: {
    color: "#4f46e5",
  },
  searchContainer: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    zIndex: 1,
    marginTop: -10,
  },
  searchInput: {
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  studentsCount: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  // Student card styles
  studentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: "#f3f4f6",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  studentLevel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  lastSession: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  sessionCount: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4f46e5",
    borderRadius: 4,
  },
  goalContainer: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  goalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tagLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 4,
    minWidth: 80,
  },
  tag: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  strengthTag: {
    backgroundColor: "#dcfce7",
  },
  improvementTag: {
    backgroundColor: "#fed7d7",
  },
  tagText: {
    fontSize: 12,
    color: "#374151",
  },
  strengthTagText: {
    color: "#166534",
  },
  improvementTagText: {
    color: "#991b1b",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

// StudentCard Component
const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.avatar}</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentLevel}>{student.level}</Text>
          <Text style={styles.lastSession}>
            Last session: {student.lastSession}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingRow}>
            <Feather name="star" size={14} color="#facc15" />
            <Text style={styles.ratingText}>{student.rating}</Text>
          </View>
          <Text style={styles.sessionCount}>{student.sessions} sessions</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{student.progress}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBar, { width: `${student.progress}%` }]}
          />
        </View>
      </View>

      {/* Next Goal */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalLabel}>Next Goal:</Text>
        <Text style={styles.goalText}>{student.nextGoal}</Text>
      </View>

      {/* Strengths and Improvements */}
      <View style={styles.tagsContainer}>
        <View style={styles.tagRow}>
          <Text style={styles.tagLabel}>Strengths:</Text>
          {student.strengths.map((strength, index) => (
            <View key={index} style={[styles.tag, styles.strengthTag]}>
              <Text style={[styles.tagText, styles.strengthTagText]}>
                {strength}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.tagRow}>
          <Text style={styles.tagLabel}>Focus Areas:</Text>
          {student.improvements.map((improvement, index) => (
            <View key={index} style={[styles.tag, styles.improvementTag]}>
              <Text style={[styles.tagText, styles.improvementTagText]}>
                {improvement}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push(`/(coach)/students/${student.id}`)}
        >
          <Feather name="eye" size={16} color="#374151" />
          <Text style={styles.secondaryButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Feather name="calendar" size={16} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Component
export default function StudentsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>My Students</Text>
            <TouchableOpacity>
              <Feather name="filter" size={24} color="#4f46e5" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <Feather name="search" size={20} color="#9ca3af" />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search students..."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.studentsCount}>
          {students.length} active students
        </Text>
        {students
          .filter(
            (student) =>
              student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              student.level.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
      </View>
    </ScrollView>
  );
}
