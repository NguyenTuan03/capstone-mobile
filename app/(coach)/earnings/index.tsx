import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TypeScript interfaces
interface EarningsData {
  today: number;
  week: number;
  month: number;
  pending: number;
}

interface PerformanceMetric {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface EarningsCardProps {
  title: string;
  value: string;
  colors: [string, string];
}

interface MetricCardProps {
  metric: PerformanceMetric;
}

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();

  // Mock earnings data
  const earnings: EarningsData = {
    today: 250,
    week: 1450,
    month: 5200,
    pending: 320,
  };

  // Performance metrics data
  const performanceMetrics: PerformanceMetric[] = [
    {
      id: "1",
      title: "Session Completion",
      subtitle: "This month",
      value: "98%",
      color: "#10b981",
      bgColor: "#dcfce7",
      icon: "trending-up",
    },
    {
      id: "2",
      title: "Average Rating",
      subtitle: "From 24 students",
      value: "4.9",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      icon: "star",
    },
    {
      id: "3",
      title: "Active Students",
      subtitle: "Current month",
      value: "24",
      color: "#3b82f6",
      bgColor: "#dbeafe",
      icon: "users",
    },
  ];

  const EarningsCard: React.FC<EarningsCardProps> = ({
    title,
    value,
    colors,
  }) => (
    <LinearGradient colors={colors} style={styles.earningsCard}>
      <Text style={styles.earningsCardTitle}>{title}</Text>
      <Text style={styles.earningsCardValue}>${value}</Text>
    </LinearGradient>
  );

  const MetricCard: React.FC<MetricCardProps> = ({ metric }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricContent}>
        <View style={styles.metricLeft}>
          <View
            style={[
              styles.metricIconContainer,
              { backgroundColor: metric.bgColor },
            ]}
          >
            <Feather name={metric.icon as any} size={20} color={metric.color} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
          </View>
        </View>
        <Text style={[styles.metricValue, { color: metric.color }]}>
          {metric.value}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <View style={styles.earningsGrid}>
            <EarningsCard
              title="Today"
              value={earnings.today.toString()}
              colors={["#10b981", "#059669"]}
            />
            <EarningsCard
              title="This Week"
              value={earnings.week.toString()}
              colors={["#3b82f6", "#2563eb"]}
            />
            <EarningsCard
              title="This Month"
              value={earnings.month.toString()}
              colors={["#8b5cf6", "#7c3aed"]}
            />
            <EarningsCard
              title="Pending"
              value={earnings.pending.toString()}
              colors={["#f59e0b", "#d97706"]}
            />
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.metricsContainer}>
            {performanceMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </View>
        </View>

        {/* Additional Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Feather name="calendar" size={20} color="#4f46e5" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Peak Hours</Text>
                <Text style={styles.insightDescription}>
                  Most sessions between 2PM - 6PM
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Feather name="target" size={20} color="#10b981" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Monthly Goal</Text>
                <Text style={styles.insightDescription}>
                  86% of $6,000 target achieved
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "86%" }]} />
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Feather name="award" size={20} color="#f59e0b" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Student</Text>
                <Text style={styles.insightDescription}>
                  Sarah Johnson - 12 sessions this month
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  earningsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  earningsCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  earningsCardTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  earningsCardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  metricsContainer: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  metricSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  insightCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  insightDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginTop: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
});
