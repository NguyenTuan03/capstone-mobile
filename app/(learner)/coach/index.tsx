import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window"); // Used for responsive layout calculations

// Synchronized Coach type with detail.tsx
type Coach = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  price: number;
  location: string;
  specialties: string[];
  experience: string;
  availability: string;
  sessionTypes: string[];
  languages: string[];
  certifications: string[];
  isOnline?: boolean;
  methodology:
    | {
        sessionStructure: {
          warmup: string[];
          coreDrills: { name: string; goal: string; metric?: string }[];
          situationalPlay?: string[];
          cooldown?: string[];
        };
        teachingPrinciples: string[];
        levelGuidelines: {
          level: "Beginner" | "Intermediate" | "Advanced";
          focus: string[];
          successCriteria: string[];
        }[];
        equipment?: string[];
        safetyNotes?: string[];
        videoFeedback?: { used: boolean; notes?: string };
      }
    | string;
  reviews: {
    id: string;
    learner: string;
    date: string;
    rating: number;
    comment: string;
  }[];
};

type FilterType = "All" | string;

const CoachScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"coaches" | "community">(
    "coaches",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<FilterType>("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState<FilterType>("All");
  const [priceRange, setPriceRange] = useState<FilterType>("All");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Synchronized mock data with detail.tsx
  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockCoaches: Coach[] = [
        {
          id: "c1",
          name: "David Miller",
          avatar: "https://i.pravatar.cc/200?img=12",
          rating: 4.9,
          price: 35,
          location: "District 1, HCMC",
          specialties: ["Dinking", "3rd Shot", "Strategy"],
          experience: "5+ years professional coaching",
          availability: "Mon-Fri: 6AM-8PM, Weekends: 7AM-6PM",
          sessionTypes: ["Individual", "Group"],
          languages: ["English", "Vietnamese"],
          certifications: ["USAPA Certified", "IFP Level 2"],
          isOnline: true,
          methodology: {
            sessionStructure: {
              warmup: ["Footwork ladder 5'", "Soft dinks cross-court 5'"],
              coreDrills: [
                {
                  name: "3rd Shot Drop Reps",
                  goal: "Arc control to kitchen",
                  metric: "8/10 in-bounds",
                },
                {
                  name: "Dink Consistency",
                  goal: "Low net clearance",
                  metric: "50 continuous dinks",
                },
              ],
              situationalPlay: [
                "2v2 kitchen control",
                "Transition zone defense",
              ],
              cooldown: ["Stretch calves/forearm 3'"],
            },
            teachingPrinciples: [
              "Game-based learning: drill → mini-game → game",
              "Quantified reps với KPI rõ ràng",
              "Video feedback cuối buổi để sửa form",
            ],
            levelGuidelines: [
              {
                level: "Beginner",
                focus: ["Serve/Return ổn định", "Basic dinks"],
                successCriteria: ["8/10 serve in", "20 dinks liên tục"],
              },
              {
                level: "Intermediate",
                focus: ["3rd shot drop", "Transition footwork"],
                successCriteria: [
                  "60% drop thành công",
                  "Ra/vào kitchen đúng nhịp",
                ],
              },
              {
                level: "Advanced",
                focus: ["Shot selection & patterns", "Doubles tactics"],
                successCriteria: [
                  "Ra quyết định đúng ≥70%",
                  "Kiểm soát kitchen >60% rally",
                ],
              },
            ],
            equipment: ["2–3 bóng game-ready", "Ladder", "Cones"],
            safetyNotes: ["Khởi động cổ tay/gối đủ", "Uống nước mỗi 15'"],
            videoFeedback: {
              used: true,
              notes: "Quay slow-mo dinking & 3rd shot",
            },
          },
          reviews: [
            {
              id: "r1a",
              learner: "Alex Chen",
              date: "2024-01-15",
              rating: 5,
              comment:
                "David's methodology is incredible! My 3rd shot drop improved dramatically in just 3 sessions. The video feedback really helped me see what I was doing wrong.",
            },
            {
              id: "r1b",
              learner: "Maria Rodriguez",
              date: "2024-02-08",
              rating: 5,
              comment:
                "Best pickleball coach I've worked with. Very structured approach and clear progression. My dinking consistency went from 20 to 50+ rallies!",
            },
            {
              id: "r1c",
              learner: "John Park",
              date: "2024-02-22",
              rating: 4,
              comment:
                "Excellent technical knowledge and patient teaching style. Really helped me understand court positioning and shot selection.",
            },
          ],
        },
        {
          id: "c2",
          name: "Sophia Nguyen",
          avatar: "https://i.pravatar.cc/200?img=32",
          rating: 4.8,
          price: 25,
          location: "Thu Duc City",
          specialties: ["Serve", "Return", "Footwork"],
          experience: "4+ years coaching experience",
          availability: "Tue-Thu: 5PM-9PM, Weekends: 8AM-5PM",
          sessionTypes: ["Individual", "Online"],
          languages: ["Vietnamese", "English"],
          certifications: ["USAPA Certified", "Youth Coach"],
          isOnline: false,
          methodology:
            "I use a combination of video analysis, drills, and live feedback to help learners improve their skills.",
          reviews: [
            {
              id: "r2a",
              learner: "Jane Smith",
              date: "2024-02-01",
              rating: 5,
              comment:
                "Sophia is a great coach! She helped me improve my serve consistency from 60% to 85% in just 4 sessions. Her attention to detail is amazing.",
            },
            {
              id: "r2b",
              learner: "David Wilson",
              date: "2024-02-14",
              rating: 4,
              comment:
                "Really focused on fundamentals which was exactly what I needed. My footwork has improved significantly and I feel more confident on the court.",
            },
          ],
        },
        {
          id: "c3",
          name: "Liam Tran",
          avatar: "https://i.pravatar.cc/200?img=68",
          rating: 5.0,
          price: 40,
          location: "District 7, HCMC",
          specialties: ["Kitchen Readiness", "Doubles Tactics"],
          experience: "7+ years competitive coaching",
          availability: "Mon-Wed-Fri: 6AM-12PM",
          sessionTypes: ["Individual", "Group"],
          languages: ["English", "Vietnamese"],
          certifications: ["Professional Player", "Advanced Coach"],
          isOnline: true,
          methodology:
            "I use a combination of video analysis, drills, and live feedback to help learners improve their skills.",
          reviews: [
            {
              id: "r3a",
              learner: "Mike Johnson",
              date: "2024-01-20",
              rating: 5,
              comment:
                "Liam is an absolute master of doubles strategy! My partner and I went from losing most games to winning our local tournament. His kitchen tactics are game-changing.",
            },
            {
              id: "r3b",
              learner: "Emma Davis",
              date: "2024-02-05",
              rating: 5,
              comment:
                "Best investment I've made in my pickleball journey. Liam's doubles positioning lessons completely transformed my game. Now I feel confident at the net!",
            },
          ],
        },
        {
          id: "c4",
          name: "Michelle Park",
          avatar: "https://i.pravatar.cc/200?img=45",
          rating: 4.6,
          price: 30,
          location: "Da Nang",
          specialties: ["Youth Training", "Beginner Fundamentals"],
          experience: "3+ years youth coaching",
          availability: "Available weekends",
          sessionTypes: ["Group", "Offline"],
          languages: ["Vietnamese", "English", "Korean"],
          certifications: ["Youth Coach Certified", "Safety Training"],
          isOnline: false,
          methodology:
            "Passionate about teaching young players with fun and engaging methods that build confidence and skills.",
          reviews: [
            {
              id: "r4a",
              learner: "Parent - Kim Lee",
              date: "2024-02-20",
              rating: 5,
              comment:
                "Michelle is amazing with kids! My 10-year-old daughter went from never holding a paddle to playing mini-tournaments. Very patient and encouraging.",
            },
            {
              id: "r4b",
              learner: "Parent - Tran Duc",
              date: "2024-03-01",
              rating: 4,
              comment:
                "Great coach for beginners. My son really enjoys the sessions and his fundamentals have improved dramatically.",
            },
          ],
        },
      ];
      setCoaches(mockCoaches);
      setFilteredCoaches(mockCoaches);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCoaches().then(() => setRefreshing(false));
  }, []);

  const locations = ["All", "Ho Chi Minh City", "Hanoi", "Da Nang"];
  const specialties = [
    "All",
    "Beginner Training",
    "Advanced Techniques",
    "Strategy & Tactics",
    "Youth Training",
  ];
  const priceRanges = ["All", "Under 300k", "300k-500k", "Above 500k"];

  // Filter coaches based on search and filters
  useEffect(() => {
    let filtered = coaches.filter((coach) => {
      const matchesSearch =
        coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.specialties.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        coach.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === "All" || coach.location === selectedLocation;

      const matchesSpecialty =
        selectedSpecialty === "All" ||
        coach.specialties.includes(selectedSpecialty);

      let matchesPrice = true;
      if (priceRange === "Under 300k") matchesPrice = coach.price < 300000;
      else if (priceRange === "300k-500k")
        matchesPrice = coach.price >= 300000 && coach.price <= 500000;
      else if (priceRange === "Above 500k") matchesPrice = coach.price > 500000;

      return (
        matchesSearch && matchesLocation && matchesSpecialty && matchesPrice
      );
    });

    setFilteredCoaches(filtered);
  }, [searchQuery, selectedLocation, selectedSpecialty, priceRange, coaches]);

  const formatPrice = (price: number) => {
    return `$${price}/hour`;
  };

  const handleBookSession = (coach: Coach) => {
    Alert.alert(
      "Book Session",
      `Would you like to book a session with ${coach.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book Online Session",
          onPress: () =>
            router.push(
              `/(learner)/payment?coachId=${coach.id}&type=online&coachName=${encodeURIComponent(coach.name)}&price=${coach.price}`,
            ),
        },
        {
          text: "Book Offline Session",
          onPress: () =>
            router.push(
              `/(learner)/payment?coachId=${coach.id}&type=offline&coachName=${encodeURIComponent(coach.name)}&price=${coach.price}`,
            ),
        },
      ],
    );
  };

  const handleViewDetail = (coach: Coach) => {
    router.push(`/(learner)/coach/${coach.id}/detail`);
  };

  const handleProfilePress = () => {
    router.push("/(learner)/menu");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={14} color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#FFD700" />,
      );
    }
    return stars;
  };

  // Update renderCoachCard to use new data structure
  const renderCoachCard = ({ item }: { item: Coach }) => (
    <TouchableOpacity
      style={styles.coachCard}
      onPress={() => setSelectedCoach(item)}
      activeOpacity={0.7}
    >
      <View style={styles.coachCardContent}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.coachAvatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>{item.name}</Text>
          <Text style={styles.coachSpecialty}>{item.specialties[0]}</Text>

          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>
              ({item.reviews.length} reviews)
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.location}>{item.location}</Text>
          </View>

          <View style={styles.sessionTypes}>
            {item.sessionTypes.map((type, index) => (
              <View key={index} style={styles.sessionTypeChip}>
                <Text style={styles.sessionTypeText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.coachActions}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <Text style={styles.availability}>{item.availability}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => handleViewDetail(item)}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#2E7D32"
              />
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleBookSession(item)}
            >
              <LinearGradient
                colors={["#2E7D32", "#388E3C"]}
                style={styles.bookButtonGradient}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <LinearGradient colors={["#2E7D32", "#388E3C"]} style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>Find Your Coach</Text>
          <Text style={styles.headerSubtitle}>
            {filteredCoaches.length} coaches available
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <Ionicons name="person-circle-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#666" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search coaches, specialties, or locations..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderActiveFilters = () => {
    const hasActiveFilters =
      selectedLocation !== "All" ||
      selectedSpecialty !== "All" ||
      priceRange !== "All";

    if (!hasActiveFilters) return null;

    return (
      <ScrollView
        horizontal
        style={styles.activeFilters}
        showsHorizontalScrollIndicator={false}
      >
        {selectedLocation !== "All" && (
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{selectedLocation}</Text>
            <TouchableOpacity onPress={() => setSelectedLocation("All")}>
              <Ionicons name="close-circle" size={16} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        )}
        {selectedSpecialty !== "All" && (
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{selectedSpecialty}</Text>
            <TouchableOpacity onPress={() => setSelectedSpecialty("All")}>
              <Ionicons name="close-circle" size={16} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        )}
        {priceRange !== "All" && (
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{priceRange}</Text>
            <TouchableOpacity onPress={() => setPriceRange("All")}>
              <Ionicons name="close-circle" size={16} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="person-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No coaches found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Finding coaches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <>
        {renderSearchBar()}
        {renderActiveFilters()}

        <FlatList
          data={filteredCoaches}
          renderItem={renderCoachCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.coachList,
            filteredCoaches.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2E7D32"]}
              tintColor="#2E7D32"
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      </>

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Location Filter */}
              <Text style={styles.filterLabel}>Location</Text>
              <View style={styles.filterOptions}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.filterOption,
                      selectedLocation === location &&
                        styles.selectedFilterOption,
                    ]}
                    onPress={() => setSelectedLocation(location)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedLocation === location &&
                          styles.selectedFilterOptionText,
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Specialty Filter */}
              <Text style={styles.filterLabel}>Specialty</Text>
              <View style={styles.filterOptions}>
                {specialties.map((specialty) => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.filterOption,
                      selectedSpecialty === specialty &&
                        styles.selectedFilterOption,
                    ]}
                    onPress={() => setSelectedSpecialty(specialty)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedSpecialty === specialty &&
                          styles.selectedFilterOptionText,
                      ]}
                    >
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Filter */}
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.filterOptions}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterOption,
                      priceRange === range && styles.selectedFilterOption,
                    ]}
                    onPress={() => setPriceRange(range)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        priceRange === range && styles.selectedFilterOptionText,
                      ]}
                    >
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedLocation("All");
                  setSelectedSpecialty("All");
                  setPriceRange("All");
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <LinearGradient
                  colors={["#2E7D32", "#388E3C"]}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Coach Detail Modal */}
      <Modal visible={!!selectedCoach} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCoach && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Coach Details</Text>
                  <TouchableOpacity onPress={() => setSelectedCoach(null)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <ScrollView>
                  <View style={styles.coachDetailHeader}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: selectedCoach.avatar }}
                        style={styles.coachDetailAvatar}
                      />
                      {selectedCoach.isOnline && (
                        <View style={styles.onlineIndicatorLarge} />
                      )}
                    </View>
                    <Text style={styles.coachDetailName}>
                      {selectedCoach.name}
                    </Text>
                    <Text style={styles.coachDetailSpecialty}>
                      {selectedCoach.specialties.join(", ")}
                    </Text>
                    <View style={styles.coachDetailRating}>
                      {renderStars(selectedCoach.rating)}
                      <Text style={styles.rating}>{selectedCoach.rating}</Text>
                      <Text style={styles.reviewCount}>
                        ({selectedCoach.reviews.length} reviews)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.coachDetailSection}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.sectionContent}>
                      {typeof selectedCoach.methodology === "string"
                        ? selectedCoach.methodology
                        : JSON.stringify(selectedCoach.methodology)}
                    </Text>
                  </View>

                  <View style={styles.coachDetailSection}>
                    <Text style={styles.sectionTitle}>
                      Experience & Languages
                    </Text>
                    <Text style={styles.sectionContent}>
                      Experience: {selectedCoach.experience}
                    </Text>
                    {selectedCoach.languages && (
                      <Text style={styles.sectionContent}>
                        Languages: {selectedCoach.languages.join(", ")}
                      </Text>
                    )}
                  </View>

                  <View style={styles.coachDetailSection}>
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {selectedCoach.certifications.map((cert, index) => (
                      <View key={index} style={styles.certificationItem}>
                        <Ionicons
                          name="medal-outline"
                          size={16}
                          color="#2E7D32"
                        />
                        <Text style={styles.certificationText}>{cert}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.coachDetailSection}>
                    <Text style={styles.sectionTitle}>Session Types</Text>
                    <View style={styles.sessionTypesDetail}>
                      {selectedCoach.sessionTypes.map((type, index) => (
                        <View key={index} style={styles.sessionTypeDetailChip}>
                          <Text style={styles.sessionTypeDetailText}>
                            {type}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.coachDetailSection}>
                    <Text style={styles.sectionTitle}>
                      Pricing & Availability
                    </Text>
                    <Text style={styles.priceDetail}>
                      {formatPrice(selectedCoach.price)}
                    </Text>
                    <Text style={styles.availabilityDetail}>
                      {selectedCoach.availability}
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.bookDetailButton}
                    onPress={() => {
                      setSelectedCoach(null);
                      handleBookSession(selectedCoach);
                    }}
                  >
                    <LinearGradient
                      colors={["#2E7D32", "#388E3C"]}
                      style={styles.bookDetailButtonGradient}
                    >
                      <Text style={styles.bookDetailButtonText}>
                        Book Session
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  filterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  activeFilters: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  filterChipText: {
    color: "#2E7D32",
    fontSize: 12,
    marginRight: 4,
  },
  coachList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  coachCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coachCardContent: {
    padding: 16,
    flexDirection: "row",
  },
  avatarContainer: {
    position: "relative",
  },
  coachAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  onlineIndicatorLarge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  coachInfo: {
    flex: 1,
    marginLeft: 16,
  },
  coachName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  coachSpecialty: {
    fontSize: 14,
    color: "#2E7D32",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  sessionTypes: {
    flexDirection: "row",
  },
  sessionTypeChip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
  },
  sessionTypeText: {
    fontSize: 10,
    color: "#666",
  },
  coachActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: 100,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  availability: {
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  detailButtonText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "600",
  },
  bookButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  bookButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: "#2E7D32",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedFilterOptionText: {
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2E7D32",
    marginRight: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    borderRadius: 8,
    marginLeft: 10,
    overflow: "hidden",
  },
  applyButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  coachDetailHeader: {
    alignItems: "center",
    padding: 20,
  },
  coachDetailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  coachDetailName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  coachDetailSpecialty: {
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 8,
  },
  coachDetailRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  coachDetailSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  certificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  certificationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  sessionTypesDetail: {
    flexDirection: "row",
  },
  sessionTypeDetailChip: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  sessionTypeDetailText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  priceDetail: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  availabilityDetail: {
    fontSize: 14,
    color: "#666",
  },
  bookDetailButton: {
    borderRadius: 8,
    overflow: "hidden",
    flex: 1,
  },
  bookDetailButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  bookDetailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Header Actions
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: width * 0.05,
    marginVertical: 10,
    borderRadius: 25,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#2E7D32",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  // Community Styles
  content: {
    flex: 1,
  },
  communityContainer: {
    padding: 20,
  },
  communitySection: {
    marginBottom: 24,
  },
  eventCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  eventGradient: {
    padding: 20,
    alignItems: "center",
  },
  eventTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  eventDate: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupDetails: {
    marginLeft: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  groupMembers: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  partnerCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  partnerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  partnerDetails: {
    marginLeft: 12,
  },
  partnerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  partnerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  inviteCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  inviteInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inviteDetails: {
    marginLeft: 12,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  inviteSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  inviteBadge: {
    backgroundColor: "#9C27B0",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CoachScreen;
