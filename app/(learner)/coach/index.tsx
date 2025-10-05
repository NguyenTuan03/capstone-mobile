import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Coach = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  specialty: string;
};

const MOCK_COACHES: Coach[] = [
  {
    id: "c1",
    name: "Alex Nguyen",
    rating: 4.8,
    reviews: 120,
    location: "HCMC",
    price: "$45/hr",
    specialty: "Backhand Technique",
  },
  {
    id: "c2",
    name: "Taylor Tran",
    rating: 4.6,
    reviews: 86,
    location: "Hanoi",
    price: "$40/hr",
    specialty: "Footwork & Agility",
  },
  {
    id: "c3",
    name: "Chris Le",
    rating: 4.9,
    reviews: 210,
    location: "Da Nang",
    price: "$55/hr",
    specialty: "Serve & Strategy",
  },
];

const CoachScreen: React.FC = () => {
  const [query, setQuery] = useState("");

  const coaches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_COACHES;
    return MOCK_COACHES.filter((c) =>
      [c.name, c.location, c.specialty].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Find Your Coach</Text>
        <Text style={styles.subtitle}>Connect with certified instructors</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search coaches..."
          style={styles.input}
        />
        <Pressable style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.list}>
        {coaches.map((coach) => (
          <View key={coach.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {coach.name.split(" ")[1]?.[0] || coach.name[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.coachName}>{coach.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.ratingValue}>
                    {coach.rating.toFixed(1)}
                  </Text>
                  <Text style={styles.ratingCount}>({coach.reviews})</Text>
                </View>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color="#6B7280" />
                  <Text style={styles.locationText}>{coach.location}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.price}>{coach.price}</Text>
              </View>
            </View>
            <Text style={styles.specialty}>
              <Text style={{ fontWeight: "600" }}>Specialty:</Text>{" "}
              {coach.specialty}
            </Text>
            <View style={styles.actionRow}>
              <Pressable style={[styles.primaryButton, { flex: 1 }]}>
                <Text style={styles.primaryButtonText}>Book Session</Text>
              </Pressable>
              <Pressable style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Profile</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CoachScreen;

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
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
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
  cardHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FB923C",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
  coachName: {
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  ratingValue: {
    fontWeight: "600",
    color: "#111827",
  },
  ratingCount: {
    color: "#6B7280",
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    color: "#6B7280",
    fontSize: 12,
  },
  price: {
    color: "#10B981",
    fontWeight: "700",
    fontSize: 16,
  },
  specialty: {
    color: "#4B5563",
    fontSize: 13,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
});
