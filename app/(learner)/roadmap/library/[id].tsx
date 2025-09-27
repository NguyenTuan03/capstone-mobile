import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

type Tutorial = {
  id: string;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
  views: number;
  rating: number;
  instructor: string;
  tags: string[];
  transcript?: string;
};

const SAMPLE_TUTORIALS: Tutorial[] = [
  {
    id: "1",
    title: "Basic Serve Technique",
    duration: "8:30",
    difficulty: "Beginner",
    category: "Serves",
    thumbnail: "🏓",
    description:
      "Learn the fundamentals of pickleball serving technique. This comprehensive tutorial covers proper stance, grip, ball toss, and follow-through to help you develop a consistent and effective serve.",
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: 1250,
    rating: 4.8,
    instructor: "Coach Sarah Chen",
    tags: ["serving", "fundamentals", "technique"],
    transcript:
      "Welcome to our basic serve technique tutorial. In this lesson, we'll cover the fundamental aspects of serving in pickleball. First, let's discuss proper stance and positioning...",
  },
  {
    id: "2",
    title: "Dink Shot Mastery",
    duration: "12:15",
    difficulty: "Intermediate",
    category: "Shots",
    thumbnail: "🎯",
    description:
      "Master the art of dinking at the kitchen line. Learn proper placement, touch, and strategy for effective dink shots.",
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: 892,
    rating: 4.9,
    instructor: "Pro Player Mike Johnson",
    tags: ["dinking", "kitchen", "soft game"],
    transcript:
      "Dinking is one of the most important skills in pickleball. Today we'll learn how to execute perfect dinks with control and precision...",
  },
  {
    id: "3",
    title: "Advanced Footwork Drills",
    duration: "15:45",
    difficulty: "Advanced",
    category: "Training",
    thumbnail: "👟",
    description:
      "Improve your court movement with these advanced footwork drills designed for competitive players.",
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: 634,
    rating: 4.7,
    instructor: "Coach Maria Rodriguez",
    tags: ["footwork", "movement", "agility"],
    transcript:
      "Good footwork is the foundation of excellent pickleball. These drills will help you move more efficiently around the court...",
  },
];

const DIFFICULTY_COLORS = {
  Beginner: { bg: "#dcfce7", text: "#16a34a" },
  Intermediate: { bg: "#fef3c7", text: "#d97706" },
  Advanced: { bg: "#fee2e2", text: "#dc2626" },
};

export default function LibraryVideoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Find the tutorial data
  const tutorial =
    SAMPLE_TUTORIALS.find((t) => t.id === id) || SAMPLE_TUTORIALS[0];
  const difficultyStyle = DIFFICULTY_COLORS[tutorial.difficulty];

  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
    setShowControls(true);
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const renderVideoPlayer = () => (
    <View style={styles.videoContainer}>
      <TouchableOpacity
        style={styles.videoWrapper}
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: tutorial.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {showControls && (
          <View style={styles.videoControls}>
            {/* Play/Pause Button */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#ffffff"
              />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(currentPosition / duration) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Additional Controls */}
            <View style={styles.additionalControls}>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="settings-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="expand-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.header, scrollY > 50 && styles.headerShadow]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Video Tutorial</Text>
      <TouchableOpacity
        style={styles.bookmarkButton}
        onPress={() => setIsBookmarked(!isBookmarked)}
      >
        <Ionicons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          size={24}
          color={isBookmarked ? "#3b82f6" : "#6b7280"}
        />
      </TouchableOpacity>
    </View>
  );

  const renderVideoInfo = () => (
    <View style={styles.videoInfo}>
      <Text style={styles.videoTitle}>{tutorial.title}</Text>

      <View style={styles.videoMeta}>
        <View style={styles.metaRow}>
          <Ionicons name="person-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{tutorial.instructor}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{tutorial.duration}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="eye-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>
            {tutorial.views.toLocaleString()} views
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.metaText}>{tutorial.rating}</Text>
        </View>
      </View>

      <View
        style={[
          styles.difficultyBadge,
          { backgroundColor: difficultyStyle.bg },
        ]}
      >
        <Text style={[styles.difficultyText, { color: difficultyStyle.text }]}>
          {tutorial.difficulty} • {tutorial.category}
        </Text>
      </View>

      <Text style={styles.videoDescription}>{tutorial.description}</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {tutorial.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.primaryButton}>
        <Ionicons name="download-outline" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>Download Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Ionicons name="share-outline" size={20} color="#374151" />
        <Text style={styles.secondaryButtonText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Ionicons name="bookmark-outline" size={20} color="#374151" />
        <Text style={styles.secondaryButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTranscriptSection = () => (
    <View style={styles.transcriptSection}>
      <TouchableOpacity
        style={styles.transcriptHeader}
        onPress={() => setShowTranscript(!showTranscript)}
      >
        <Text style={styles.transcriptTitle}>Video Transcript</Text>
        <Ionicons
          name={showTranscript ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6b7280"
        />
      </TouchableOpacity>

      {showTranscript && tutorial.transcript && (
        <View style={styles.transcriptContent}>
          <ScrollView
            style={styles.transcriptScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.transcriptText}>{tutorial.transcript}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderRelatedVideos = () => {
    const relatedVideos = SAMPLE_TUTORIALS.filter(
      (t) =>
        t.id !== tutorial.id &&
        (t.category === tutorial.category ||
          t.difficulty === tutorial.difficulty),
    ).slice(0, 3);

    if (relatedVideos.length === 0) return null;

    return (
      <View style={styles.relatedSection}>
        <Text style={styles.sectionTitle}>Related Videos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedScrollContent}
        >
          {relatedVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.relatedVideoCard}
              onPress={() =>
                router.push(`/(learner)/roadmap/library/${video.id}`)
              }
            >
              <View style={styles.relatedThumbnail}>
                <Text style={styles.relatedEmoji}>{video.thumbnail}</Text>
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={12} color="#ffffff" />
                </View>
              </View>
              <View style={styles.relatedContent}>
                <Text style={styles.relatedTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={styles.relatedMeta}>{video.instructor}</Text>
                <Text style={styles.relatedDuration}>{video.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderScrollToTopButton = () => {
    if (scrollY < 200) return null;

    return (
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <Ionicons name="chevron-up" size={24} color="#ffffff" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {renderHeader()}
      {renderVideoPlayer()}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {renderVideoInfo()}
        {renderActionButtons()}
        {renderTranscriptSection()}
        {renderRelatedVideos()}
      </ScrollView>

      {renderScrollToTopButton()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    zIndex: 1000,
  },
  headerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  bookmarkButton: {
    padding: 8,
  },
  videoContainer: {
    backgroundColor: "#000000",
    aspectRatio: 16 / 9,
  },
  videoWrapper: {
    flex: 1,
    position: "relative",
  },
  video: {
    flex: 1,
  },
  videoControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeText: {
    color: "#ffffff",
    fontSize: 12,
    minWidth: 40,
    textAlign: "center",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  controlButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 32,
  },
  videoMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#6b7280",
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  videoDescription: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  transcriptSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  transcriptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  transcriptContent: {
    paddingTop: 16,
    maxHeight: 300,
  },
  transcriptScrollView: {
    maxHeight: 280,
  },
  transcriptText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },
  relatedSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  relatedScrollContent: {
    paddingRight: 20,
  },
  relatedVideoCard: {
    width: 200,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  relatedThumbnail: {
    width: "100%",
    height: 100,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  relatedEmoji: {
    fontSize: 32,
  },
  playOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  relatedContent: {
    flex: 1,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  relatedMeta: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  relatedDuration: {
    fontSize: 12,
    color: "#9ca3af",
  },
  scrollToTopButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
