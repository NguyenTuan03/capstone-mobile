import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Drill = {
  id: string;
  title: string;
  course: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  attempts: number;
  completed: boolean;
  score?: number;
};

const MOCK_DRILLS: Drill[] = [
  {
    id: "d1",
    title: "Backhand Basics",
    course: "Foundations of Tennis",
    description: "Practice your backhand swing with focus on stance and grip.",
    difficulty: "Easy",
    duration: "8 min",
    attempts: 2,
    completed: true,
    score: 85,
  },
  {
    id: "d2",
    title: "Footwork Ladder",
    course: "Intermediate Footwork",
    description: "Improve agility with lateral and forward ladder drills.",
    difficulty: "Medium",
    duration: "12 min",
    attempts: 0,
    completed: false,
  },
  {
    id: "d3",
    title: "Serve Target Practice",
    course: "Advanced Strategy",
    description: "Hit consistent serves to the deuce and ad boxes.",
    difficulty: "Hard",
    duration: "10 min",
    attempts: 1,
    completed: false,
  },
];

const LEVELS = ["All", "Easy", "Medium", "Hard"] as const;
type LevelFilter = (typeof LEVELS)[number];

const DrillTabs: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<LevelFilter>("All");
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const drills = useMemo(() => {
    if (activeLevel === "All") return MOCK_DRILLS;
    return MOCK_DRILLS.filter((d) => d.difficulty === activeLevel);
  }, [activeLevel]);

  const drill = selectedDrill || drills[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!selectedDrill ? (
        <>
          <View>
            <Text style={styles.title}>Practice Drills</Text>
            <Text style={styles.subtitle}>
              Upload your video for AI-powered feedback
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {LEVELS.map((level) => {
              const isActive = level === activeLevel;
              return (
                <Pressable
                  key={level}
                  onPress={() => setActiveLevel(level)}
                  style={[
                    styles.filterPill,
                    isActive
                      ? styles.filterPillActive
                      : styles.filterPillInactive,
                  ]}
                >
                  <Text
                    style={
                      isActive
                        ? styles.filterTextActive
                        : styles.filterTextInactive
                    }
                  >
                    {level}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.list}>
            {drills.map((d) => (
              <View key={d.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.thumbSquare}>
                    <Ionicons name="golf" size={28} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardHeaderRow}>
                      <View>
                        <Text style={styles.cardTitle}>{d.title}</Text>
                        <Text style={styles.cardCourse}>{d.course}</Text>
                      </View>
                      {d.completed && (
                        <View style={styles.scoreRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#059669"
                          />
                          <Text style={styles.scoreText}>{d.score}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardDescription}>{d.description}</Text>
                    <View style={styles.metaRow}>
                      <View
                        style={[
                          styles.badge,
                          d.difficulty === "Easy"
                            ? styles.badgeEasy
                            : d.difficulty === "Medium"
                              ? styles.badgeMedium
                              : styles.badgeHard,
                        ]}
                      >
                        <Text style={styles.badgeText}>{d.difficulty}</Text>
                      </View>
                      <Text style={styles.metaText}>{d.duration}</Text>
                      {d.attempts > 0 && (
                        <Text style={styles.metaText}>
                          {d.attempts} attempts
                        </Text>
                      )}
                    </View>
                    <Pressable
                      style={styles.primaryButton}
                      onPress={() => setSelectedDrill(d)}
                    >
                      <Text style={styles.primaryButtonText}>
                        {d.completed ? "Practice Again" : "Start Drill"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.backRow}>
            <Pressable onPress={() => setSelectedDrill(null)}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <View>
              <Text style={styles.detailTitle}>{drill.title}</Text>
              <Text style={styles.detailSubtitle}>{drill.course}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inlineRow}>
              <Ionicons name="play-circle" size={20} color="#059669" />
              <Text style={styles.sectionTitle}>Coach Demo Video</Text>
            </View>
            <View style={[styles.videoPlaceholder, styles.greenGradient]}>
              <Ionicons name="play" size={48} color="#fff" />
            </View>
            <Text style={styles.cardDescription}>{drill.description}</Text>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: "#10B981" }]}
            >
              <Text style={styles.primaryButtonText}>Watch Coach Demo</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.inlineRow}>
              <Ionicons name="cloud-upload" size={20} color="#7C3AED" />
              <Text style={styles.sectionTitle}>Your Practice Video</Text>
            </View>

            {!uploadedVideo ? (
              <View style={styles.uploadDropzone}>
                <Ionicons name="cloud-upload" size={40} color="#8B5CF6" />
                <Text style={styles.uploadTitle}>
                  Upload Your Practice Video
                </Text>
                <Text style={styles.uploadSubtitle}>
                  Record yourself doing this drill
                </Text>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => setUploadedVideo(true)}
                >
                  <Text style={styles.secondaryButtonText}>Choose Video</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={[styles.videoPlaceholder, styles.purpleGradient]}>
                  <Ionicons name="play" size={48} color="#fff" />
                </View>
                <Pressable
                  style={[
                    styles.primaryButton,
                    analyzing && styles.disabledButton,
                  ]}
                  disabled={analyzing}
                  onPress={() => {
                    setAnalyzing(true);
                    setTimeout(() => {
                      setAnalyzing(false);
                      setShowResults(true);
                    }, 1500);
                  }}
                >
                  {analyzing ? (
                    <Text style={styles.primaryButtonText}>
                      AI Analyzing...
                    </Text>
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Compare with Coach
                    </Text>
                  )}
                </Pressable>
              </>
            )}
          </View>

          {showResults && (
            <View style={styles.card}>
              <View style={styles.inlineRow}>
                <Ionicons name="flash" size={20} color="#F59E0B" />
                <Text style={styles.sectionTitle}>AI Analysis Results</Text>
              </View>

              <View style={styles.resultsBanner}>
                <View style={{ alignItems: "center", marginBottom: 12 }}>
                  <Text style={styles.overallScore}>
                    {drill.score || 82}/100
                  </Text>
                  <Text style={styles.resultsLabel}>Overall Score</Text>
                </View>
                <View style={styles.resultsGrid}>
                  <View style={styles.resultsCell}>
                    <Text
                      style={[styles.resultsCellScore, { color: "#2563EB" }]}
                    >
                      88
                    </Text>
                    <Text style={styles.resultsCellLabel}>Posture</Text>
                  </View>
                  <View style={styles.resultsCell}>
                    <Text
                      style={[styles.resultsCellScore, { color: "#7C3AED" }]}
                    >
                      79
                    </Text>
                    <Text style={styles.resultsCellLabel}>Movement</Text>
                  </View>
                  <View style={styles.resultsCell}>
                    <Text
                      style={[styles.resultsCellScore, { color: "#EA580C" }]}
                    >
                      85
                    </Text>
                    <Text style={styles.resultsCellLabel}>Follow-through</Text>
                  </View>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <View style={[styles.tipItem, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tipTitle, { color: "#065F46" }]}>
                      Good Form
                    </Text>
                    <Text style={[styles.tipText, { color: "#047857" }]}>
                      Your grip and stance match the coach technique well
                    </Text>
                  </View>
                </View>
                <View style={[styles.tipItem, { backgroundColor: "#FFFBEB" }]}>
                  <Ionicons name="golf" size={20} color="#CA8A04" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tipTitle, { color: "#92400E" }]}>
                      Needs Improvement
                    </Text>
                    <Text style={[styles.tipText, { color: "#B45309" }]}>
                      Extend your follow-through motion more
                    </Text>
                  </View>
                </View>
                <View style={[styles.tipItem, { backgroundColor: "#EFF6FF" }]}>
                  <Ionicons name="trophy" size={20} color="#2563EB" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tipTitle, { color: "#1E40AF" }]}>
                      Pro Tip
                    </Text>
                    <Text style={[styles.tipText, { color: "#1D4ED8" }]}>
                      Keep your weight on the front foot during contact
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={[
                    styles.primaryButton,
                    { flex: 1, backgroundColor: "#7C3AED" },
                  ]}
                >
                  <Text style={styles.primaryButtonText}>Try Again</Text>
                </Pressable>
                <Pressable style={[styles.outlineButton, { flex: 1 }]}>
                  <Text style={styles.outlineButtonText}>Next Drill</Text>
                </Pressable>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default DrillTabs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  filters: {
    gap: 8,
    paddingBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterPillActive: {
    backgroundColor: "#7C3AED",
  },
  filterPillInactive: {
    backgroundColor: "#F3F4F6",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  filterTextInactive: {
    color: "#374151",
    fontWeight: "500",
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  thumbSquare: {
    width: 80,
    height: 80,
    backgroundColor: "#A78BFA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  cardCourse: {
    color: "#6B7280",
    fontSize: 12,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scoreText: {
    color: "#059669",
    fontWeight: "700",
  },
  cardDescription: {
    color: "#4B5563",
    fontSize: 13,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeEasy: {
    backgroundColor: "#D1FAE5",
  },
  badgeMedium: {
    backgroundColor: "#FEF3C7",
  },
  badgeHard: {
    backgroundColor: "#FEE2E2",
  },
  badgeText: {
    fontSize: 12,
    color: "#111827",
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  backText: {
    color: "#4B5563",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  detailSubtitle: {
    color: "#6B7280",
    fontSize: 12,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  videoPlaceholder: {
    height: 192,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  greenGradient: {
    backgroundColor: "#34D399",
  },
  purpleGradient: {
    backgroundColor: "#C084FC",
  },
  secondaryButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  uploadDropzone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#C4B5FD",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#F5F3FF",
  },
  uploadTitle: {
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#111827",
  },
  uploadSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  resultsBanner: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  overallScore: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10B981",
  },
  resultsLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  resultsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  resultsCell: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  resultsCellScore: {
    fontWeight: "700",
    fontSize: 16,
  },
  resultsCellLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  tipTitle: {
    fontWeight: "600",
    fontSize: 13,
  },
  tipText: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
});
