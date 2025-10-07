import {
  Feather,
  FontAwesome5, // home, book-open, users, user, search, map-pin, clock, star, calendar, video, check-circle, target, upload, play-circle, zap, award, activity, settings, chevron-right, lock, file-text, phone, mail, globe, monitor, map, user-check, graduation-cap, message-square
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ===================================================================
// SAMPLE DATA
// ===================================================================
const coaches = [
  {
    id: 1,
    name: "Coach John Smith",
    avatar: "J",
    rating: 4.9,
    reviews: 156,
    students: 342,
    price: 40,
    priceOnline: 35,
    specialty: "Beginner Training",
    location: "District 1, HCMC",
    bio: "Certified pickleball instructor with 10+ years of experience. Specialized in helping beginners build strong fundamentals.",
    experience: "10 years",
    certifications: [
      "IPTPA Certified",
      "PPR Certified Coach",
      "First Aid Certified",
    ],
    languages: ["English", "Vietnamese"],
    teachingStyle:
      "Patient and encouraging, focusing on proper technique and gradual progression",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    courses: [
      {
        id: 1,
        title: "Beginner Basics",
        students: 1245,
        rating: 4.8,
        lessons: 12,
      },
      {
        id: 2,
        title: "Serving Masterclass",
        students: 456,
        rating: 4.7,
        lessons: 8,
      },
    ],
    onlineAvailable: true,
    offlineAvailable: true,
    courts: ["Saigon Sports Club", "Phu My Hung Courts"],
  },
  {
    id: 2,
    name: "Coach Sarah Lee",
    avatar: "S",
    rating: 4.8,
    reviews: 203,
    students: 567,
    price: 50,
    priceOnline: 45,
    specialty: "Advanced Technique",
    location: "District 3, HCMC",
    bio: "Former professional player turned coach. Expert in advanced strategies and competitive play.",
    experience: "8 years",
    certifications: ["USAPA Ambassador", "Advanced Strategy Specialist"],
    languages: ["English", "Korean", "Vietnamese"],
    teachingStyle:
      "Intensive training with focus on competitive techniques and mental game",
    availability: ["Tue", "Thu", "Sat", "Sun"],
    courses: [
      {
        id: 3,
        title: "Forehand Mastery",
        students: 856,
        rating: 4.9,
        lessons: 8,
      },
      {
        id: 4,
        title: "Tournament Prep",
        students: 234,
        rating: 4.8,
        lessons: 10,
      },
    ],
    onlineAvailable: true,
    offlineAvailable: true,
    courts: ["District 3 Sports Center"],
  },
  {
    id: 3,
    name: "Coach Mike Chen",
    avatar: "M",
    rating: 4.7,
    reviews: 89,
    students: 178,
    price: 35,
    priceOnline: 30,
    specialty: "Strategy & Tactics",
    location: "District 7, HCMC",
    bio: "Strategic coach focusing on game IQ and decision making. Great for intermediate players.",
    experience: "5 years",
    certifications: ["PPR Certified", "Sports Psychology Certificate"],
    languages: ["English", "Mandarin", "Vietnamese"],
    teachingStyle:
      "Analytical approach with video analysis and strategic drills",
    availability: ["Mon", "Tue", "Thu", "Sat"],
    courses: [
      {
        id: 5,
        title: "Smart Pickleball",
        students: 345,
        rating: 4.6,
        lessons: 6,
      },
    ],
    onlineAvailable: true,
    offlineAvailable: false,
    courts: [],
  },
];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const testimonials = [
  {
    id: 1,
    user: "Nguyen Van A",
    avatar: "A",
    rating: 5,
    comment: "Best coach ever! Very patient and knowledgeable.",
  },
  {
    id: 2,
    user: "Tran Thi B",
    avatar: "B",
    rating: 5,
    comment: "Improved my game significantly in just 3 months.",
  },
  {
    id: 3,
    user: "Le Van C",
    avatar: "C",
    rating: 4,
    comment: "Great teaching style, highly recommend!",
  },
];

// ===================================================================
// UTILS
// ===================================================================
const DayChip = ({ label, active }: { label: string; active: boolean }) => (
  <View
    style={[
      styles.dayChip,
      active
        ? { backgroundColor: "#DCFCE7", borderColor: "#BBF7D0" }
        : { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
    ]}
  >
    <Text
      style={[
        styles.dayChipText,
        active ? { color: "#15803D" } : { color: "#9CA3AF" },
      ]}
    >
      {label}
    </Text>
  </View>
);

const RatePill = ({ online, price }: { online?: boolean; price: number }) => (
  <View style={{ alignItems: "flex-end" }}>
    <Text style={styles.rateFrom}>from</Text>
    <Text style={[styles.rateValue, { color: online ? "#2563EB" : "#059669" }]}>
      ${price}
    </Text>
    <Text style={styles.rateUnit}>per hour</Text>
  </View>
);

// ===================================================================
// MAIN
// ===================================================================
export default function PickleballLearnerAppNative() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "home" | "courses" | "drills" | "coaches" | "profile"
  >("drills");
  const [selectedCoach, setSelectedCoach] = useState<
    (typeof coaches)[number] | null
  >(null);
  const [bookingStep, setBookingStep] = useState<
    null | "type" | "schedule" | "confirm"
  >(null);
  const [sessionType, setSessionType] = useState<null | "online" | "offline">(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<
    "30min" | "1h" | "1.5h"
  >("1h");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // SUBVIEWS
  // -----------------------------------------------------------------
  // ---- Drills mock & views ----
  const drills = [
    { id: 1, title: "Forehand Consistency", due: "2025-10-12", reps: 30 },
    { id: 2, title: "Backhand Control", due: "2025-10-15", reps: 25 },
    { id: 3, title: "Serve Accuracy", due: "2025-10-20", reps: 40 },
  ];
  const [selectedDrill, setSelectedDrill] = useState<
    (typeof drills)[number] | null
  >(null);

  const DrillListView = () => {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>Bài tập được giao</Text>
          <Text style={styles.muted}>Hoàn thành để cải thiện kỹ năng</Text>
        </View>

        <View style={{ gap: 12 }}>
          {drills.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => setSelectedDrill(d)}
              activeOpacity={0.9}
              style={styles.card}
            >
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.textSmBold}>{d.title}</Text>
                  <Text style={styles.metaSm}>Mục tiêu: {d.reps} lần</Text>
                </View>
                <Text style={styles.metaSm}>Hạn {d.due}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedDrill(d)}
                style={[styles.primaryBlockBtn, { marginTop: 10 }]}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBlockText}>Bắt đầu</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const DrillDetailView = ({ drill }: { drill: (typeof drills)[number] }) => {
    const [uploadedVideo, setUploadedVideo] = useState<null | {
      name: string;
      size: string;
      duration: string;
    }>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const beginUpload = () => {
      setUploadedVideo({
        name: `${drill.title}.mp4`,
        size: "42MB",
        duration: "00:24",
      });
      setUploading(true);
      setUploadProgress(0);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setUploadProgress((p) => {
          const next = p + 10;
          if (next >= 100) {
            timerRef.current && clearInterval(timerRef.current);
            setUploading(false);
            // start AI analysis
            setAnalyzing(true);
            const t2 = setTimeout(() => {
              setAnalyzing(false);
              setShowResults(true);
            }, 2000);
            return 100;
          }
          return next;
        });
      }, 300);
    };

    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedDrill(null)}
            style={styles.backRow}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
            <Text style={styles.backText}>Quay lại danh sách bài tập</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{drill.title}</Text>
          <Text style={styles.metaSm}>
            Mục tiêu: {drill.reps} lần • Hạn {drill.due}
          </Text>

          {!uploadedVideo && !uploading && !analyzing && !showResults && (
            <TouchableOpacity
              onPress={beginUpload}
              style={[styles.primaryBlockBtn, { marginTop: 12 }]}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryBlockText}>Tải video luyện tập</Text>
            </TouchableOpacity>
          )}

          {uploading && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.metaSm}>Đang tải... {uploadProgress}%</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${uploadProgress}%` }]}
                />
              </View>
            </View>
          )}

          {analyzing && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.metaSm}>
                AI đang phân tích kỹ thuật của bạn...
              </Text>
            </View>
          )}

          {showResults && (
            <View style={{ marginTop: 12, gap: 8 }}>
              <Text style={styles.textSmBold}>Phản hồi từ AI</Text>
              <View style={styles.rowGap6}>
                <Feather name="check-circle" size={16} color="#059669" />
                <Text style={styles.textSm}>Xoay vai tốt</Text>
              </View>
              <View style={styles.rowGap6}>
                <Feather name="alert-circle" size={16} color="#EA580C" />
                <Text style={styles.textSm}>
                  Điểm chạm hơi muộn; hãy vung vợt sớm hơn
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedDrill(null)}
                style={[styles.primaryBlockBtn, { marginTop: 8 }]}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBlockText}>
                  Quay lại bài tập được giao
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };
  const CoachListView = () => {
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>Find Your Coach</Text>
          <Text style={styles.muted}>
            Connect with certified pickleball instructors
          </Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Search coaches..."
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.85}>
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 2 }}
        >
          {["All", "Online", "Offline", "Top Rated", "Nearby"].map(
            (filter, idx) => (
              <View
                key={idx}
                style={[
                  styles.filterChip,
                  filter === "All"
                    ? { backgroundColor: "#10B981" }
                    : { backgroundColor: "#F3F4F6" },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === "All" ? { color: "#fff" } : { color: "#374151" },
                  ]}
                >
                  {filter}
                </Text>
              </View>
            ),
          )}
        </ScrollView>

        <View style={{ gap: 12 }}>
          {coaches.map((coach) => (
            <TouchableOpacity
              key={coach.id}
              onPress={() =>
                router.push(
                  `/(learner)/coach/profile?id=${String(coach.id)}` as any,
                )
              }
              style={styles.coachCard}
              activeOpacity={0.9}
            >
              <View style={styles.cardRow}>
                <LinearGradient
                  colors={["#fb923c", "#ef4444"]}
                  start={{ x: 0.1, y: 0.1 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.coachAvatarLg}
                >
                  <Text style={styles.coachAvatarTextLg}>{coach.avatar}</Text>
                </LinearGradient>

                <View style={{ flex: 1 }}>
                  <Text style={styles.coachName}>{coach.name}</Text>

                  <View style={styles.rowGap8}>
                    <View style={styles.rowGap4}>
                      <Feather name="star" size={16} color="#fbbf24" />
                      <Text style={styles.boldSm}>{coach.rating}</Text>
                    </View>
                    <Text style={styles.metaSm}>({coach.reviews} reviews)</Text>
                    <Text style={styles.metaSm}>
                      • {coach.students} students
                    </Text>
                  </View>

                  <View style={[styles.rowGap6, { marginTop: 4 }]}>
                    <Feather name="map-pin" size={14} color="#6B7280" />
                    <Text style={styles.metaSm}>{coach.location}</Text>
                  </View>

                  <View style={[styles.rowGap6, { marginTop: 6 }]}>
                    {coach.onlineAvailable && (
                      <View
                        style={[styles.pill, { backgroundColor: "#DBEAFE" }]}
                      >
                        <Feather name="monitor" size={12} color="#2563EB" />
                        <Text style={[styles.pillText, { color: "#1D4ED8" }]}>
                          Online
                        </Text>
                      </View>
                    )}
                    {coach.offlineAvailable && (
                      <View
                        style={[styles.pill, { backgroundColor: "#DCFCE7" }]}
                      >
                        <Feather name="map" size={12} color="#059669" />
                        <Text style={[styles.pillText, { color: "#047857" }]}>
                          Offline
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <RatePill online price={coach.priceOnline} />
              </View>

              <Text style={styles.specialty}>
                <Text style={{ fontWeight: "600" }}>Specialty: </Text>
                {coach.specialty}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/(learner)/coach/profile?id=${String(coach.id)}` as any,
                  )
                }
                style={styles.primaryBlockBtn}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBlockText}>View Profile</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const CoachProfileView = ({ coach }: { coach: (typeof coaches)[number] }) => {
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedCoach(null);
              setBookingStep(null);
            }}
            style={styles.backRow}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#4B5563" />
            <Text style={styles.backText}>Back to Coaches</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <LinearGradient
          colors={["#fb923c", "#ef4444"]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerRow}>
            <View style={styles.coachAvatarXl}>
              <Text style={styles.coachAvatarTextXl}>{coach.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerName}>{coach.name}</Text>
              <Text style={styles.bannerSub}>{coach.specialty}</Text>
              <View style={styles.bannerStats}>
                <View style={styles.ratingChip}>
                  <Feather name="star" size={16} color="#facc15" />
                  <Text style={styles.ratingChipText}>{coach.rating}</Text>
                </View>
                <Text style={styles.bannerStatText}>
                  {coach.reviews} reviews
                </Text>
                <Text style={styles.bannerStatText}>
                  • {coach.students} students
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          {/* About */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.paragraph}>{coach.bio}</Text>

            <View style={styles.grid2Wrap}>
              <View style={styles.gridCell}>
                <Text style={styles.labelXs}>Experience</Text>
                <Text style={styles.valueSm}>{coach.experience}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.labelXs}>Location</Text>
                <Text style={styles.valueSm}>{coach.location}</Text>
              </View>
              <View style={[styles.gridCell, { width: "100%" }]}>
                <Text style={styles.labelXs}>Languages</Text>
                <Text style={styles.valueSm}>{coach.languages.join(", ")}</Text>
              </View>
            </View>
          </View>

          {/* Certifications */}
          <View style={styles.card}>
            <View style={styles.rowGap8}>
              <FontAwesome5 name="graduation-cap" size={20} color="#059669" />
              <Text style={styles.cardTitle}>Certifications</Text>
            </View>
            <View style={{ marginTop: 8, gap: 8 }}>
              {coach.certifications.map((cert, idx) => (
                <View key={idx} style={styles.rowGap6}>
                  <Feather name="check-circle" size={16} color="#059669" />
                  <Text style={styles.textSm}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Teaching Style */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Teaching Style</Text>
            <Text style={styles.paragraph}>{coach.teachingStyle}</Text>
          </View>

          {/* Session Options */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Session Options</Text>
            <View style={{ gap: 12, marginTop: 8 }}>
              {coach.onlineAvailable && (
                <View
                  style={[
                    styles.optionBox,
                    { borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.rowGap8}>
                      <Feather name="monitor" size={20} color="#2563EB" />
                      <Text style={styles.bold}>Online Session</Text>
                    </View>
                    <Text style={[styles.rateInline, { color: "#2563EB" }]}>
                      ${coach.priceOnline}/hr
                    </Text>
                  </View>
                  <Text style={styles.hintBlue}>
                    Video call via integrated platform
                  </Text>
                </View>
              )}
              {coach.offlineAvailable && (
                <View
                  style={[
                    styles.optionBox,
                    { borderColor: "#A7F3D0", backgroundColor: "#ECFDF5" },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.rowGap8}>
                      <Feather name="map" size={20} color="#059669" />
                      <Text style={styles.bold}>Offline Session</Text>
                    </View>
                    <Text style={[styles.rateInline, { color: "#059669" }]}>
                      ${coach.price}/hr
                    </Text>
                  </View>
                  <Text style={styles.hintGreen}>
                    Available courts: {coach.courts.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Availability</Text>
            <View style={styles.daysWrap}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <DayChip
                  key={d}
                  label={d}
                  active={coach.availability.includes(d)}
                />
              ))}
            </View>
          </View>

          {/* Created Courses */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Created Courses</Text>
            <View style={{ gap: 8 }}>
              {coach.courses.map((c) => (
                <View key={c.id} style={styles.courseCell}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.textSmBold}>{c.title}</Text>
                    <View style={styles.rowGap8}>
                      <Text style={styles.metaXs}>{c.students} students</Text>
                      <Text style={styles.metaXs}>•</Text>
                      <Text style={styles.metaXs}>{c.lessons} lessons</Text>
                      <Text style={styles.metaXs}>•</Text>
                      <View style={styles.rowGap4}>
                        <Feather name="star" size={12} color="#fbbf24" />
                        <Text style={styles.metaXs}>{c.rating}</Text>
                      </View>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              ))}
            </View>
          </View>

          {/* Testimonials */}
          <View style={styles.card}>
            <View style={styles.rowGap8}>
              <Feather name="message-square" size={20} color="#EA580C" />
              <Text style={styles.cardTitle}>Student Testimonials</Text>
            </View>
            <View style={{ gap: 12, marginTop: 8 }}>
              {testimonials.map((t) => (
                <View key={t.id} style={styles.testCell}>
                  <View style={styles.testTop}>
                    <View style={styles.testAvatar}>
                      <Text style={styles.testAvatarText}>{t.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.textSmBold}>{t.user}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Feather
                          key={i}
                          name="star"
                          size={12}
                          color={i < t.rating ? "#fbbf24" : "#D1D5DB"}
                          style={{ marginLeft: 2 }}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.textSm}>{t.comment}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Floating Book Button (mô phỏng sticky box) */}
          <View style={styles.bookBox}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(learner)/coach/booking",
                  params: { id: String(coach.id) },
                })
              }
              style={styles.primaryBlockBtnLg}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryBlockTextLg}>Book a Session</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const BookingFlow = ({ coach }: { coach: (typeof coaches)[number] }) => {
    // Ensure hooks are not called conditionally
    const days = useMemo(() => {
      return Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const iso = d.toISOString().split("T")[0];
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon/Tue/...
        const isAvailable = coach.availability.includes(dayName);
        return { iso, dayName, dateNum: d.getDate(), isAvailable };
      });
    }, [coach]);
    if (bookingStep === "type") {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setBookingStep(null)}
              style={styles.backRow}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
          >
            <View>
              <Text style={styles.title}>Choose Session Type</Text>
              <Text style={styles.muted}>
                Select how you want to learn with {coach.name}
              </Text>
            </View>

            {coach.onlineAvailable && (
              <TouchableOpacity
                onPress={() => {
                  setSessionType("online");
                  setBookingStep("schedule");
                }}
                style={[styles.optionCard, { borderColor: "#BFDBFE" }]}
                activeOpacity={0.9}
              >
                <View style={styles.optionRow}>
                  <View style={styles.optionIconBlue}>
                    <Feather name="monitor" size={32} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Online Session</Text>
                    <Text style={styles.optionDesc}>
                      Connect via video call from anywhere. Perfect for
                      technique review and strategy discussions.
                    </Text>
                    <View style={styles.rowGap12}>
                      <View style={styles.rowGap6}>
                        <Feather name="video" size={16} color="#2563EB" />
                        <Text style={[styles.textSm, { color: "#2563EB" }]}>
                          Video Call
                        </Text>
                      </View>
                      <View style={styles.rowGap6}>
                        <Feather name="clock" size={16} color="#2563EB" />
                        <Text style={[styles.textSm, { color: "#2563EB" }]}>
                          Flexible timing
                        </Text>
                      </View>
                    </View>
                    <View style={styles.optionPriceRow}>
                      <Text style={[styles.optionPrice, { color: "#2563EB" }]}>
                        ${coach.priceOnline}
                      </Text>
                      <Text style={styles.metaSm}> per hour</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {coach.offlineAvailable && (
              <TouchableOpacity
                onPress={() => {
                  setSessionType("offline");
                  setBookingStep("schedule");
                }}
                style={[styles.optionCard, { borderColor: "#A7F3D0" }]}
                activeOpacity={0.9}
              >
                <View style={styles.optionRow}>
                  <View style={styles.optionIconGreen}>
                    <Feather name="map" size={32} color="#059669" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Offline Session</Text>
                    <Text style={styles.optionDesc}>
                      In-person training at the court. Hands-on instruction with
                      immediate feedback.
                    </Text>
                    <View style={[styles.rowGap12, { marginBottom: 6 }]}>
                      <View style={styles.rowGap6}>
                        <Feather name="map-pin" size={16} color="#059669" />
                        <Text style={[styles.textSm, { color: "#059669" }]}>
                          On-court
                        </Text>
                      </View>
                      <View style={styles.rowGap6}>
                        <Feather name="user-check" size={16} color="#059669" />
                        <Text style={[styles.textSm, { color: "#059669" }]}>
                          1-on-1 or Group
                        </Text>
                      </View>
                    </View>
                    <View style={styles.locationHint}>
                      <Text style={styles.locationHintTitle}>
                        Available locations:
                      </Text>
                      {coach.courts.map((c, i) => (
                        <Text key={i} style={styles.locationHintItem}>
                          • {c}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.optionPriceRow}>
                      <Text style={[styles.optionPrice, { color: "#059669" }]}>
                        ${coach.price}
                      </Text>
                      <Text style={styles.metaSm}> per hour</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      );
    }

    if (bookingStep === "schedule") {
      // chọn 14 ngày tới; map sang 7 cột bằng flexWrap
      const total = sessionType === "online" ? coach.priceOnline : coach.price;

      return (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setBookingStep("type")}
              style={styles.backRow}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
          >
            <View>
              <Text style={styles.title}>Schedule Session</Text>
              <Text style={styles.muted}>
                {sessionType === "online" ? "Online" : "Offline"} session with{" "}
                {coach.name}
              </Text>
            </View>

            {/* Select Date */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Select Date</Text>
              <View style={styles.daysGrid}>
                {days.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  const cellStyle = d.isAvailable
                    ? isSelected
                      ? styles.dayCellSelected
                      : styles.dayCell
                    : styles.dayCellDisabled;
                  const textDayStyle = d.isAvailable
                    ? isSelected
                      ? styles.dayNameSelected
                      : styles.dayName
                    : styles.dayNameDisabled;
                  const textNumStyle = d.isAvailable
                    ? isSelected
                      ? styles.dayNumSelected
                      : styles.dayNum
                    : styles.dayNumDisabled;

                  return (
                    <TouchableOpacity
                      key={d.iso}
                      disabled={!d.isAvailable}
                      onPress={() => setSelectedDate(d.iso)}
                      style={cellStyle}
                      activeOpacity={0.85}
                    >
                      <Text style={textDayStyle}>{d.dayName}</Text>
                      <Text style={textNumStyle}>{d.dateNum}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Select Time */}
            {selectedDate && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Select Time</Text>
                <View style={styles.grid3}>
                  {timeSlots.map((t) => {
                    const isSelected = selectedTime === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setSelectedTime(t)}
                        style={[
                          styles.timeCell,
                          isSelected && styles.timeCellSelected,
                        ]}
                        activeOpacity={0.85}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            isSelected && styles.timeTextSelected,
                          ]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Duration */}
            {selectedDate && selectedTime && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Duration</Text>
                <View style={styles.grid3}>
                  {(["30min", "1h", "1.5h"] as const).map((dur) => {
                    const active = selectedDuration === dur;
                    return (
                      <TouchableOpacity
                        key={dur}
                        onPress={() => setSelectedDuration(dur)}
                        style={[
                          styles.durationCell,
                          active && styles.durationCellSelected,
                        ]}
                        activeOpacity={0.85}
                      >
                        <Text
                          style={[
                            styles.durationText,
                            active && styles.durationTextSelected,
                          ]}
                        >
                          {dur}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Select Location (offline only) */}
            {sessionType === "offline" && selectedDate && selectedTime && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Select Location</Text>
                <View style={{ gap: 8 }}>
                  {coach.courts.map((court, idx) => {
                    const active = selectedLocation === court;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedLocation(court)}
                        style={[
                          styles.locationCell,
                          active && styles.locationCellSelected,
                        ]}
                        activeOpacity={0.9}
                      >
                        <View style={styles.rowGap8}>
                          <Feather name="map-pin" size={16} color="#059669" />
                          <Text style={styles.textSmBold}>{court}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Summary */}
            {selectedDate &&
              selectedTime &&
              (sessionType === "online" ||
                (sessionType === "offline" && selectedLocation)) && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Session Summary</Text>
                  <View style={{ gap: 8 }}>
                    <View style={styles.sumRow}>
                      <Text style={styles.sumLabel}>Type:</Text>
                      <Text style={styles.sumValue}>{sessionType}</Text>
                    </View>
                    <View style={styles.sumRow}>
                      <Text style={styles.sumLabel}>Date:</Text>
                      <Text style={styles.sumValue}>{selectedDate}</Text>
                    </View>
                    <View style={styles.sumRow}>
                      <Text style={styles.sumLabel}>Time:</Text>
                      <Text style={styles.sumValue}>{selectedTime}</Text>
                    </View>
                    <View style={styles.sumRow}>
                      <Text style={styles.sumLabel}>Duration:</Text>
                      <Text style={styles.sumValue}>{selectedDuration}</Text>
                    </View>
                    {sessionType === "offline" && (
                      <View style={styles.sumRow}>
                        <Text style={styles.sumLabel}>Location:</Text>
                        <Text style={styles.sumValue}>{selectedLocation}</Text>
                      </View>
                    )}

                    <View style={styles.sumTotalRow}>
                      <Text style={styles.sumTotalLabel}>Total:</Text>
                      <Text style={styles.sumTotalValue}>${total}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setBookingStep("confirm")}
                    style={[styles.primaryBlockBtn, { marginTop: 12 }]}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.primaryBlockText}>
                      Continue to Payment
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </ScrollView>
        </View>
      );
    }

    if (bookingStep === "confirm") {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setBookingStep("schedule")}
              style={styles.backRow}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#4B5563" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
          >
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <View style={styles.confirmIcon}>
                <Feather name="check-circle" size={40} color="#059669" />
              </View>
              <Text style={styles.title}>Booking Confirmed!</Text>
              <Text style={styles.muted}>Your session has been scheduled</Text>
            </View>

            <View style={styles.card}>
              <Text style={[styles.cardTitle, { textAlign: "center" }]}>
                Session Details
              </Text>

              <View style={styles.coachRow}>
                <View style={styles.coachAvatarMd}>
                  <Text style={styles.coachAvatarTextMd}>
                    {selectedCoach?.avatar}
                  </Text>
                </View>
                <View>
                  <Text style={styles.bold}>{selectedCoach?.name}</Text>
                  <Text style={styles.metaSm}>{selectedCoach?.specialty}</Text>
                </View>
              </View>

              <View style={{ gap: 10 }}>
                <View style={styles.detailRow}>
                  <Feather
                    name={sessionType === "online" ? "monitor" : "map"}
                    size={20}
                    color={sessionType === "online" ? "#2563EB" : "#059669"}
                  />
                  <View>
                    <Text style={styles.bold}>{sessionType} Session</Text>
                    {sessionType === "offline" && selectedLocation ? (
                      <Text style={styles.metaXs}>{selectedLocation}</Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Feather name="calendar" size={20} color="#6B7280" />
                  <Text style={styles.textSm}>{selectedDate}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Feather name="clock" size={20} color="#6B7280" />
                  <Text style={styles.textSm}>
                    {selectedTime} ({selectedDuration})
                  </Text>
                </View>

                <View style={styles.sumTotalRow}>
                  <Text style={styles.sumTotalLabel}>Total Paid:</Text>
                  <Text style={styles.sumTotalValue}>
                    $
                    {sessionType === "online"
                      ? selectedCoach?.priceOnline
                      : selectedCoach?.price}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.nextBox}>
              <Text style={styles.nextTitle}>What&apos;s Next?</Text>
              <Text style={styles.nextItem}>
                • You will receive a confirmation email
              </Text>
              <Text style={styles.nextItem}>
                •{" "}
                {sessionType === "online"
                  ? "Video call link will be sent 10 minutes before session"
                  : `Meet at ${selectedLocation ?? selectedCoach?.courts?.[0]} at the scheduled time`}
              </Text>
              <Text style={styles.nextItem}>
                • Coach will contact you if needed
              </Text>
            </View>

            <View style={styles.rowGap8}>
              <TouchableOpacity
                onPress={() => {
                  setBookingStep(null);
                  setSelectedCoach(null);
                  setActiveTab("home");
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedDuration("1h");
                  setSelectedLocation(null);
                  setSessionType(null);
                }}
                style={styles.primaryBlockBtn}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBlockText}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ghostBlockBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.ghostBlockText}>Add to Calendar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    return null;
  };

  const CoachesTab = () => {
    if (bookingStep && selectedCoach)
      return <BookingFlow coach={selectedCoach} />;
    if (selectedCoach) return <CoachProfileView coach={selectedCoach} />;
    return <CoachListView />;
  };

  const DrillsTab = () => {
    if (selectedDrill) return <DrillDetailView drill={selectedDrill} />;
    return <DrillListView />;
  };

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <View style={{ flex: 1, paddingBottom: 72 }}>
          {activeTab === "drills" && <DrillsTab />}
          {activeTab === "coaches" && <CoachesTab />}
        </View>

        {/* Bottom Tab */}
        <View style={styles.bottomBar}>
          {[
            { id: "home", icon: "home", label: "Home" },
            { id: "courses", icon: "book-open", label: "Courses" },
            { id: "drills", icon: "target", label: "Drills" },
            { id: "coaches", icon: "users", label: "Coaches" },
            { id: "profile", icon: "user", label: "Profile" },
          ].map((t) => {
            const active = activeTab === (t.id as any);
            const color = active ? "#059669" : "#9CA3AF";
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setActiveTab(t.id as any)}
                style={styles.tabBtn}
                activeOpacity={0.8}
              >
                <Feather name={t.icon as any} size={22} color={color} />
                <Text style={[styles.tabLabel, { color }]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ===================================================================
// STYLES
// ===================================================================
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { padding: 16, gap: 16 },

  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontSize: 14 },

  // Banner (Profile)
  banner: { padding: 24 },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  coachAvatarXl: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  coachAvatarTextXl: { color: "#EA580C", fontWeight: "800", fontSize: 40 },
  bannerName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  bannerSub: { color: "#fff", opacity: 0.9, marginTop: 2 },
  bannerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingChipText: { color: "#fff", fontWeight: "800" },
  bannerStatText: { color: "#fff" },

  // Typography
  title: { fontSize: 22, fontWeight: "800", color: "#0F172A" },
  bold: { fontWeight: "700", color: "#111827" },
  boldSm: { fontWeight: "700", color: "#111827", fontSize: 14 },
  textSm: { color: "#111827", fontSize: 14 },
  textSmBold: { color: "#111827", fontSize: 14, fontWeight: "700" },
  metaSm: { color: "#6B7280", fontSize: 13 },
  metaXs: { color: "#6B7280", fontSize: 12 },
  muted: { color: "#4B5563", marginTop: 4 },
  paragraph: { color: "#374151", fontSize: 14, lineHeight: 20 },

  // Search
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#111827",
  },
  searchBtn: { backgroundColor: "#10B981", padding: 12, borderRadius: 10 },

  // Filter chips
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  filterChipText: { fontWeight: "600" },

  // Coach card
  coachCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  coachAvatarLg: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  coachAvatarTextLg: { color: "#fff", fontWeight: "800", fontSize: 28 },
  coachName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  rowGap4: { flexDirection: "row", alignItems: "center", gap: 4 },
  rowGap6: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowGap8: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowGap12: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { fontSize: 12, fontWeight: "600" },
  specialty: { color: "#4B5563", fontSize: 13, marginBottom: 10 },
  primaryBlockBtn: {
    backgroundColor: "#10B981",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBlockText: { color: "#fff", fontWeight: "700" },
  rateFrom: {
    color: "#9CA3AF",
    fontSize: 11,
    marginBottom: 2,
    textAlign: "right",
  },
  rateValue: { fontSize: 22, fontWeight: "800" },
  rateUnit: { color: "#9CA3AF", fontSize: 11 },

  // Profile cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },
  grid2Wrap: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  gridCell: { width: "48%" },
  labelXs: { color: "#6B7280", fontSize: 12, marginBottom: 2 },
  valueSm: { fontSize: 14, fontWeight: "600" },

  optionBox: { borderWidth: 1, borderRadius: 10, padding: 12 },
  rateInline: { fontWeight: "800", fontSize: 18 },
  hintBlue: { color: "#1D4ED8", fontSize: 12, marginTop: 6 },
  hintGreen: { color: "#047857", fontSize: 12, marginTop: 6 },

  daysWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dayChipText: { fontWeight: "600", fontSize: 13 },
  locationHint: {
    backgroundColor: "#ECFDF5", // bg-green-50
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0", // border-green-200
    padding: 12,
    marginTop: 8,
  },
  locationHintTitle: {
    color: "#065F46", // text-green-800
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
  },
  locationHintItem: {
    color: "#065F46",
    fontSize: 12,
    marginLeft: 4,
  },
  // Course cell
  courseCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // Testimonial
  testCell: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  testTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  testAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  testAvatarText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // Book box (floating)
  bookBox: {
    borderWidth: 2,
    borderColor: "#10B981",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  primaryBlockBtnLg: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBlockTextLg: { color: "#fff", fontWeight: "800", fontSize: 16 },

  // Booking Type
  optionCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  optionRow: { flexDirection: "row", gap: 12 },
  optionIconBlue: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconGreen: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  optionDesc: { color: "#4B5563", fontSize: 13, marginBottom: 8 },
  optionPriceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginTop: 8,
  },
  optionPrice: { fontSize: 22, fontWeight: "800" },

  // Schedule
  daysGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  dayCell: {
    width: "13.6%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  dayCellSelected: {
    width: "13.6%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#10B981",
  },
  dayCellDisabled: {
    width: "13.6%",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    opacity: 0.5,
  },
  dayName: { fontSize: 11, fontWeight: "600", color: "#111827" },
  dayNameSelected: { fontSize: 11, fontWeight: "700", color: "#fff" },
  dayNameDisabled: { fontSize: 11, fontWeight: "600", color: "#9CA3AF" },
  dayNum: { fontSize: 14, color: "#111827" },
  dayNumSelected: { fontSize: 14, color: "#fff", fontWeight: "700" },
  dayNumDisabled: { fontSize: 14, color: "#9CA3AF" },

  grid3: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  timeCell: {
    width: "31.5%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  timeCellSelected: { backgroundColor: "#10B981" },
  timeText: { fontWeight: "600", color: "#111827" },
  timeTextSelected: { color: "#fff" },

  durationCell: {
    width: "31.5%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  durationCellSelected: { backgroundColor: "#10B981" },
  durationText: { fontWeight: "700", color: "#111827" },
  durationTextSelected: { color: "#fff" },

  locationCell: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  locationCellSelected: { borderColor: "#10B981", backgroundColor: "#ECFDF5" },

  sumRow: { flexDirection: "row", justifyContent: "space-between" },
  sumLabel: { color: "#6B7280", fontSize: 14 },
  sumValue: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
    textTransform: "capitalize",
  },
  sumTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 12,
    paddingTop: 12,
  },
  sumTotalLabel: { fontWeight: "700", fontSize: 16 },
  sumTotalValue: { fontWeight: "800", fontSize: 22, color: "#059669" },

  // Confirm
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },
  coachAvatarMd: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#FB923C",
    alignItems: "center",
    justifyContent: "center",
  },
  coachAvatarTextMd: { color: "#fff", fontWeight: "800", fontSize: 18 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  nextBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 10,
    padding: 12,
  },
  nextTitle: { color: "#1D4ED8", fontWeight: "700", marginBottom: 8 },
  nextItem: { color: "#1D4ED8", fontSize: 13, marginBottom: 2 },

  // Generic progress bar (used in uploads)
  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 6,
  },
  progressFill: { height: 8, backgroundColor: "#10B981", borderRadius: 999 },

  ghostBlockBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
  },
  ghostBlockText: { color: "#111827", fontWeight: "600" },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 10,
  },
  tabLabel: { fontSize: 11, marginTop: 2 },
});
