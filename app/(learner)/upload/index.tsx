import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [availableVideos, setAvailableVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "analyzed" | "recent">(
    "all",
  );

  // Sample videos data
  useEffect(() => {
    setUploadedVideos([
      {
        id: "1",
        name: "Pickleball Practice Session.mp4",
        size: "45.2 MB",
        date: "2 days ago",
        status: "analyzed",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        aiScore: 85,
      },
      {
        id: "2",
        name: "Dinking Practice.mp4",
        size: "38.7 MB",
        date: "1 week ago",
        status: "processing",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        aiScore: null,
      },
    ]);

    // Available videos with coach feedback and AI analysis
    setAvailableVideos([
      {
        id: "101",
        title: "Advanced Serve Techniques",
        description: "Master your serve with professional techniques",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        duration: "12:45",
        views: 1247,
        uploadDate: "3 days ago",
        category: "Technique",
        difficulty: "Advanced",
        coachName: "Sarah Johnson",
        coachFeedback:
          "Excellent form and power generation. Focus on your trophy position for better consistency.",
        aiAnalysis: {
          overallScore: 92,
          keyInsights: [
            "Excellent power generation",
            "Consistent contact point",
            "Good follow-through",
          ],
          recommendations: ["Work on trophy position", "Practice slice serves"],
          strengths: ["Strong serve motion", "Good footwork"],
          areasForImprovement: ["Ball toss consistency", "Serve variety"],
        },
        tags: ["serve", "technique", "advanced"],
        isPremium: true,
        rating: 4.8,
      },
      {
        id: "102",
        title: "Kitchen Line Dinking Masterclass",
        description: "Learn the art of dinking at the kitchen line",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        duration: "8:30",
        views: 892,
        uploadDate: "1 week ago",
        category: "Strategy",
        difficulty: "Intermediate",
        coachName: "Mike Chen",
        coachFeedback:
          "Great touch and patience at the kitchen line. Your shot selection is improving well.",
        aiAnalysis: {
          overallScore: 78,
          keyInsights: [
            "Good soft hands",
            "Patient play",
            "Excellent shot placement",
          ],
          recommendations: [
            "Lower center of gravity",
            "Practice cross-court dinks",
          ],
          strengths: ["Touch and feel", "Shot placement"],
          areasForImprovement: ["Consistency under pressure", "Net clearance"],
        },
        tags: ["dinking", "kitchen", "strategy"],
        isPremium: false,
        rating: 4.6,
      },
      {
        id: "103",
        title: "Third Shot Drop Perfection",
        description: "Perfect your third shot drop for strategic advantage",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        duration: "15:20",
        views: 1567,
        uploadDate: "2 weeks ago",
        category: "Strategy",
        difficulty: "Intermediate",
        coachName: "Emily Rodriguez",
        coachFeedback:
          "Your third shot drops are becoming more consistent. Work on your arc and height control.",
        aiAnalysis: {
          overallScore: 85,
          keyInsights: [
            "Good arc control",
            "Proper paddle angle",
            "Strategic placement",
          ],
          recommendations: ["Vary your height", "Add spin variation"],
          strengths: ["Consistent execution", "Good court awareness"],
          areasForImprovement: ["Spin control", "Height consistency"],
        },
        tags: ["third shot", "drop", "strategy"],
        isPremium: true,
        rating: 4.9,
      },
      {
        id: "104",
        title: "Return of Serve Fundamentals",
        description: "Master the essential return of serve techniques",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        duration: "10:15",
        views: 2103,
        uploadDate: "3 weeks ago",
        category: "Fundamentals",
        difficulty: "Beginner",
        coachName: "David Park",
        coachFeedback:
          "Solid fundamentals on returns. Focus on getting more depth on your returns.",
        aiAnalysis: {
          overallScore: 73,
          keyInsights: [
            "Good ready position",
            "Solid contact",
            "Good footwork",
          ],
          recommendations: [
            "Aim for deeper returns",
            "Add more pace variation",
          ],
          strengths: ["Consistent returns", "Good positioning"],
          areasForImprovement: ["Return depth", "Pace variation"],
        },
        tags: ["return", "serve", "fundamentals"],
        isPremium: false,
        rating: 4.4,
      },
      {
        id: "105",
        title: "Volley and Net Play Strategies",
        description: "Dominate the net with advanced volley techniques",
        thumbnail:
          "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
        duration: "18:00",
        views: 934,
        uploadDate: "1 month ago",
        category: "Net Play",
        difficulty: "Advanced",
        coachName: "Lisa Thompson",
        coachFeedback:
          "Excellent volley technique and net positioning. Your reflexes are impressive!",
        aiAnalysis: {
          overallScore: 88,
          keyInsights: [
            "Quick reflexes",
            "Proper paddle position",
            "Good net positioning",
          ],
          recommendations: [
            "Practice angle volleys",
            "Work on backhand volleys",
          ],
          strengths: ["Reflex speed", "Net anticipation"],
          areasForImprovement: ["Backhand volley consistency", "Angle control"],
        },
        tags: ["volley", "net play", "advanced"],
        isPremium: true,
        rating: 4.7,
      },
    ]);
  }, []);

  const pickDocument = async () => {
    try {
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Lỗi", "Không thể chọn file. Vui lòng thử lại.");
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert("Chưa chọn file", "Vui lòng chọn file video trước.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);

          // Add to uploaded videos
          const newVideo = {
            id: Date.now().toString(),
            name: selectedFile.name,
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            date: "Just now",
            status: "processing",
            thumbnail:
              "https://images.unsplash.com/photo-1591696205602-2f950c4bcb86?q=80&w=1200&auto=format&fit=crop",
            aiScore: null,
          };
          setUploadedVideos([newVideo, ...uploadedVideos]);
          setSelectedFile(null);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Filter and search videos
  const getFilteredVideos = () => {
    let filtered = availableVideos;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply type filter
    if (filterType === "analyzed") {
      filtered = filtered.filter(
        (video) => video.aiAnalysis.overallScore >= 80,
      );
    } else if (filterType === "recent") {
      filtered = filtered.filter(
        (video) =>
          video.uploadDate.includes("days ago") ||
          video.uploadDate.includes("week ago"),
      );
    }

    return filtered;
  };

  const openVideoDetails = (video: any) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const VideoCard = ({ video }: { video: any }) => (
    <TouchableOpacity
      onPress={() => openVideoDetails(video)}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Video Thumbnail */}
      <View style={{ position: "relative" }}>
        <ImageBackground
          source={{ uri: video.thumbnail }}
          style={{
            width: "100%",
            height: 140,
            justifyContent: "flex-end",
          }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
            }}
          />
        </ImageBackground>

        {/* Duration Badge */}
        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.8)",
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
            {video.duration}
          </Text>
        </View>

        {/* Premium Badge */}
        {video.isPremium && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#F59E0B",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Ionicons name="star-outline" size={10} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>
              PREMIUM
            </Text>
          </View>
        )}

        {/* AI Analysis Badge */}
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(139, 92, 246, 0.9)",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Ionicons name="analytics-outline" size={10} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {video.aiAnalysis.overallScore}%
          </Text>
        </View>
      </View>

      {/* Video Info */}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#111827",
            marginBottom: 4,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {video.title}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 8,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {video.description}
        </Text>

        {/* Video Stats */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="eye-outline" size={12} color="#6b7280" />
              <Text style={{ color: "#6b7280", fontSize: 11 }}>
                {video.views.toLocaleString()}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={{ color: "#6b7280", fontSize: 11 }}>
                {video.rating}
              </Text>
            </View>
          </View>
          <Text style={{ color: "#6b7280", fontSize: 11 }}>
            {video.uploadDate}
          </Text>
        </View>

        {/* Tags */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {video.tags.slice(0, 3).map((tag: string, index: number) => (
            <View
              key={index}
              style={{
                backgroundColor: "#F3F4F6",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ color: "#6b7280", fontSize: 10, fontWeight: "500" }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top + 12 }}
    >
      <FlatList
        data={getFilteredVideos()}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "900",
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                ĐĂNG TẢI
              </Text>
              <Text
                style={{
                  color: "#6b7280",
                  marginBottom: 32,
                  lineHeight: 22,
                  fontSize: 16,
                }}
              >
                Đăng tải video của bạn để phân tích AI
              </Text>
            </View>

            {/* File Upload Area */}
            <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#111827",
                  marginBottom: 16,
                }}
              >
                Chọn video để phân tích AI
              </Text>

              {selectedFile ? (
                <View
                  style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="videocam-outline"
                      size={24}
                      color="#8B5CF6"
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: "#111827",
                          fontSize: 16,
                        }}
                        numberOfLines={1}
                      >
                        {selectedFile.name}
                      </Text>
                      <Text style={{ color: "#6b7280", fontSize: 14 }}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setSelectedFile(null)}>
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {isUploading && (
                    <View style={{ marginBottom: 16 }}>
                      <View
                        style={{
                          height: 8,
                          backgroundColor: "#E5E7EB",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${uploadProgress}%`,
                            backgroundColor: "#8B5CF6",
                            borderRadius: 4,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: "#6b7280",
                          fontSize: 12,
                          marginTop: 4,
                          textAlign: "center",
                        }}
                      >
                        Đang tải... {uploadProgress}%
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Pressable
                  onPress={pickDocument}
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "#8B5CF6",
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    backgroundColor: "#F9FAFB",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={48}
                    color="#8B5CF6"
                  />
                  <Text
                    style={{
                      fontWeight: "700",
                      color: "#111827",
                      fontSize: 16,
                      marginTop: 12,
                    }}
                  >
                    Chọn File Video
                  </Text>
                  <Text
                    style={{
                      color: "#6b7280",
                      fontSize: 14,
                      marginTop: 4,
                      textAlign: "center",
                    }}
                  >
                    MP4, MOV, AVI tối đa 500MB
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={uploadFile}
                disabled={!selectedFile || isUploading}
                style={{
                  backgroundColor:
                    selectedFile && !isUploading ? "#111827" : "#9CA3AF",
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isUploading ? (
                  <ActivityIndicator color="#fff" size={20} />
                ) : (
                  <Ionicons name="play-outline" size={20} color="#fff" />
                )}
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                  {isUploading ? "Đang tải lên..." : "Đăng tải lên"}
                </Text>
              </Pressable>
            </View>

            {/* Uploaded Videos */}
            {uploadedVideos.length > 0 && (
              <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: "#111827",
                    marginBottom: 16,
                  }}
                >
                  Video Của Bạn
                </Text>
                {uploadedVideos.map((video) => (
                  <View
                    key={video.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      padding: 16,
                      marginBottom: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        backgroundColor: "#F3F4F6",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name="videocam-outline"
                        size={24}
                        color="#6b7280"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: "#111827",
                          fontSize: 14,
                        }}
                        numberOfLines={1}
                      >
                        {video.name}
                      </Text>
                      <Text style={{ color: "#6b7280", fontSize: 12 }}>
                        {video.size} • {video.date}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        {video.status === "analyzed" && video.aiScore && (
                          <>
                            <Ionicons
                              name="analytics-outline"
                              size={12}
                              color="#10B981"
                            />
                            <Text
                              style={{
                                color: "#10B981",
                                fontSize: 12,
                                fontWeight: "600",
                                marginLeft: 4,
                              }}
                            >
                              AI Score: {video.aiScore}%
                            </Text>
                          </>
                        )}
                        {video.status === "processing" && (
                          <>
                            <ActivityIndicator size={12} color="#F59E0B" />
                            <Text
                              style={{
                                color: "#F59E0B",
                                fontSize: 12,
                                fontWeight: "600",
                                marginLeft: 4,
                              }}
                            >
                              Processing...
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Available Videos Section Header */}
            <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "900", color: "#111827" }}
                >
                  Video Có Sẵn
                </Text>
                <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="filter-outline" size={20} color="#8B5CF6" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View
                style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="search-outline" size={18} color="#6b7280" />
                <TextInput
                  placeholder="Tìm kiếm video..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{ flex: 1, color: "#111827", fontSize: 14 }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Filter Tabs */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {[
                  { id: "all", label: "Tất Cả Video" },
                  { id: "analyzed", label: "Đánh Giá Cao" },
                  { id: "recent", label: "Gần Đây" },
                ].map((filter, idx, arr) => (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => setFilterType(filter.id as any)}
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      backgroundColor:
                        filterType === filter.id ? "#8B5CF6" : "#F3F4F6",
                      marginRight: idx < arr.length - 1 ? 8 : 0,
                    }}
                  >
                    <Text
                      style={{
                        color: filterType === filter.id ? "#fff" : "#6b7280",
                        fontSize: 12,
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: 12, marginHorizontal: 24 }} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="videocam-off-outline" size={48} color="#D1D5DB" />
            <Text style={{ color: "#6b7280", fontSize: 16, marginTop: 12 }}>
              Không tìm thấy video
            </Text>
            <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>
              Thử điều chỉnh tìm kiếm hoặc bộ lọc
            </Text>
          </View>
        }
      />

      {/* Video Details Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVideoModal(false)}
      >
        {selectedVideo && (
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView>
              {/* Video Thumbnail */}
              <ImageBackground
                source={{ uri: selectedVideo.thumbnail }}
                style={{ width: "100%", height: 250 }}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                  }}
                />
                <View
                  style={{ position: "absolute", top: 12, left: 12, right: 12 }}
                >
                  <TouchableOpacity onPress={() => setShowVideoModal(false)}>
                    <Ionicons name="close-circle" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    right: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "900",
                      marginBottom: 4,
                    }}
                  >
                    {selectedVideo.title}
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}
                  >
                    {selectedVideo.description}
                  </Text>
                </View>
              </ImageBackground>

              {/* Video Details */}
              <View style={{ padding: 24 }}>
                {/* Stats Row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: "#111827",
                      }}
                    >
                      {selectedVideo.views.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      Views
                    </Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: "#F59E0B",
                      }}
                    >
                      {selectedVideo.rating}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      Rating
                    </Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: "#8B5CF6",
                      }}
                    >
                      {selectedVideo.aiAnalysis.overallScore}%
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      AI Score
                    </Text>
                  </View>
                </View>

                {/* Coach Feedback */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#111827",
                      marginBottom: 12,
                    }}
                  >
                    Coach Feedback
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F3F4F6",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: "#8B5CF6",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "800",
                            fontSize: 12,
                          }}
                        >
                          {selectedVideo.coachName
                            .split(" ")
                            .map((n: any[]) => n[0])
                            .join("")}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontWeight: "700", color: "#111827" }}>
                          {selectedVideo.coachName}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                          Professional Coach
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: "#374151", lineHeight: 20 }}>
                      {selectedVideo.coachFeedback}
                    </Text>
                  </View>
                </View>

                {/* AI Analysis */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#111827",
                      marginBottom: 12,
                    }}
                  >
                    AI Analysis
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#EEF2FF",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        color: "#6366F1",
                        marginBottom: 8,
                      }}
                    >
                      Key Insights:
                    </Text>
                    {selectedVideo.aiAnalysis.keyInsights.map(
                      (insight: string, index: number) => (
                        <View
                          key={index}
                          style={{ flexDirection: "row", marginBottom: 4 }}
                        >
                          <Text style={{ color: "#6366F1", marginRight: 8 }}>
                            •
                          </Text>
                          <Text style={{ color: "#374151", flex: 1 }}>
                            {insight}
                          </Text>
                        </View>
                      ),
                    )}

                    <Text
                      style={{
                        fontWeight: "700",
                        color: "#6366F1",
                        marginVertical: 8,
                        marginTop: 12,
                      }}
                    >
                      Recommendations:
                    </Text>
                    {selectedVideo.aiAnalysis.recommendations.map(
                      (rec: string, index: number) => (
                        <View
                          key={index}
                          style={{ flexDirection: "row", marginBottom: 4 }}
                        >
                          <Text style={{ color: "#6366F1", marginRight: 8 }}>
                            •
                          </Text>
                          <Text style={{ color: "#374151", flex: 1 }}>
                            {rec}
                          </Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={{ gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#8B5CF6",
                      paddingVertical: 16,
                      borderRadius: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Ionicons
                      name="play-circle-outline"
                      size={20}
                      color="#fff"
                    />
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                    >
                      Watch Video
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#F3F4F6",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="download-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text
                        style={{
                          color: "#6b7280",
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        Download
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#F3F4F6",
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="share-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text
                        style={{
                          color: "#6b7280",
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        Share
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}
