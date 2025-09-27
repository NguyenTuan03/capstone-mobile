import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Tutorial = {
  id: string;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  thumbnail: string;
  description: string;
  videoUrl?: string;
  views: number;
  rating: number;
};

const SAMPLE_TUTORIALS: Tutorial[] = [
  {
    id: "1",
    title: "Basic Serve Technique",
    duration: "8:30",
    difficulty: "Beginner",
    category: "Serves",
    thumbnail: "🏓",
    description: "Learn the fundamentals of pickleball serving technique",
    views: 1250,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Dink Shot Mastery",
    duration: "12:15",
    difficulty: "Intermediate",
    category: "Shots",
    thumbnail: "🎯",
    description: "Master the art of dinking at the kitchen line",
    views: 892,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Third Shot Drop Strategy",
    duration: "15:20",
    difficulty: "Advanced",
    category: "Strategy",
    thumbnail: "🧠",
    description: "Advanced third shot drop techniques and positioning",
    views: 567,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Return of Serve Fundamentals",
    duration: "10:45",
    difficulty: "Beginner",
    category: "Returns",
    thumbnail: "↩️",
    description: "Perfect your return of serve technique",
    views: 934,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Court Positioning Guide",
    duration: "14:30",
    difficulty: "Intermediate",
    category: "Strategy",
    thumbnail: "📍",
    description: "Learn optimal court positioning for doubles play",
    views: 756,
    rating: 4.8,
  },
  {
    id: "6",
    title: "Advanced Volley Techniques",
    duration: "11:20",
    difficulty: "Advanced",
    category: "Shots",
    thumbnail: "⚡",
    description: "Master advanced volley shots and timing",
    views: 423,
    rating: 4.9,
  },
];

const CATEGORIES = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Serves",
  "Returns",
  "Shots",
  "Strategy",
];

const DIFFICULTY_COLORS = {
  Beginner: { bg: "#dcfce7", text: "#16a34a" },
  Intermediate: { bg: "#fef3c7", text: "#d97706" },
  Advanced: { bg: "#fee2e2", text: "#dc2626" },
};

export default function VideoLibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter tutorials based on search and category
  const filteredTutorials = useMemo(() => {
    return SAMPLE_TUTORIALS.filter((tutorial) => {
      const matchesSearch =
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        tutorial.difficulty === selectedCategory ||
        tutorial.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#6b7280" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Video Tutorials</Text>
      <TouchableOpacity style={styles.headerButton}>
        <Ionicons name="bookmark-outline" size={24} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tutorials..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTutorialCard = ({ item }: { item: Tutorial }) => {
    const difficultyStyle = DIFFICULTY_COLORS[item.difficulty];

    return (
      <TouchableOpacity
        style={styles.tutorialCard}
        onPress={() => router.push(`/(learner)/roadmap/library/${item.id}`)}
      >
        <View style={styles.thumbnailContainer}>
          <Text style={styles.thumbnailEmoji}>{item.thumbnail}</Text>
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={16} color="#ffffff" />
          </View>
        </View>

        <View style={styles.tutorialContent}>
          <Text style={styles.tutorialTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.tutorialDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.tutorialMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="eye-outline" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{item.views.toLocaleString()}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.metaText}>{item.rating}</Text>
            </View>
          </View>

          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyStyle.bg },
            ]}
          >
            <Text
              style={[styles.difficultyText, { color: difficultyStyle.text }]}
            >
              {item.difficulty}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {selectedCategory === "All"
          ? "Popular Tutorials"
          : `${selectedCategory} Tutorials`}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {filteredTutorials.length}{" "}
        {filteredTutorials.length === 1 ? "tutorial" : "tutorials"}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="videocam-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No tutorials found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or category filter
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.stickyHeader}>
          {renderSearchBar()}
          {renderCategories()}
        </View>

        {renderSectionHeader()}

        {filteredTutorials.length > 0 ? (
          <FlatList
            data={filteredTutorials}
            renderItem={renderTutorialCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.tutorialsList}
          />
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerButton: {
    padding: 8,
  },
  stickyHeader: {
    backgroundColor: "#f9fafb",
    paddingBottom: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    marginLeft: 12,
    marginRight: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  tutorialsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  tutorialCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    position: "relative",
  },
  thumbnailEmoji: {
    fontSize: 24,
  },
  playOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialContent: {
    flex: 1,
    marginRight: 12,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  tutorialDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  tutorialMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
