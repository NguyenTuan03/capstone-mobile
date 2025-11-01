import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { VideoView, useVideoPlayer } from "expo-video";
import { Video as ExpoAVVideo, ResizeMode } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Mode = "overlay" | "split";

const { height } = Dimensions.get("window");
const H_OVERLAY = height * 0.46;
const H_SPLIT = height * 0.28;

const POLL_MS = 500; // giảm tần suất cập nhật -> đỡ lag
const END_EPS = 0.25; // giây

export default function CompareScreen() {
  const [mode, setMode] = useState<Mode>("overlay");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // ready flags
  const [coachReady, setCoachReady] = useState(false);
  const [learnerReady, setLearnerReady] = useState(false);

  // progress (ms)
  const [coachPos, setCoachPos] = useState(0);
  const [coachDur, setCoachDur] = useState(0);
  const [learnerPos, setLearnerPos] = useState(0);
  const [learnerDur, setLearnerDur] = useState(0);

  // opacity (overlay)
  const [opacity, setOpacity] = useState(0.5);
  const animatedOpacity = useRef(new Animated.Value(0.5)).current;
  const onOpacityChange = (v: number) => {
    animatedOpacity.setValue(v);
    setOpacity(v);
  };

  // refs
  const coachRef = useRef<any>(null); // expo-video player
  const learnerRef = useRef<any>(null); // expo-video player
  const overlayRef = useRef<ExpoAVVideo | null>(null); // expo-av (layer trên)
  const wantsPlayRef = useRef(false);

  // sources
  const coachSrc =
    "https://pickaball-public-bucket.s3.us-east-1.amazonaws.com/videos/coach.mp4";
  const learnerSrc =
    "https://pickaball-public-bucket.s3.us-east-1.amazonaws.com/videos/learner.mp4";

  // --------- bootstrap: HEAD check ----------
  useEffect(() => {
    (async () => {
      try {
        const [a, b] = await Promise.all([
          fetch(coachSrc, { method: "HEAD" }),
          fetch(learnerSrc, { method: "HEAD" }),
        ]);
        if (!a.ok || !b.ok) throw new Error("Video not accessible");
        setLoading(false);
      } catch (e: any) {
        setErr(e?.message ?? "Unknown error");
        setLoading(false);
      }
    })();
  }, []);

  // --------- expo-video players ----------
  const coach = useVideoPlayer(coachSrc, (p: any) => {
    p.loop = false;
    p.muted = false;
    p.pause();
    coachRef.current = p;
  });
  const learner = useVideoPlayer(learnerSrc, (p: any) => {
    p.loop = false;
    p.muted = false;
    p.pause();
    learnerRef.current = p;
  });

  // mark ready + progress poll (nhẹ nhàng, 500ms)
  useEffect(() => {
    const id = setInterval(() => {
      if (coach) {
        if (coach.duration > 0 && !coachReady) setCoachReady(true);
        setCoachPos(coach.currentTime * 1000);
        setCoachDur(coach.duration * 1000);
      }
      if (learner) {
        if (learner.duration > 0 && !learnerReady) setLearnerReady(true);
        setLearnerPos(learner.currentTime * 1000);
        setLearnerDur(learner.duration * 1000);
      }

      // tự dừng khi đến cuối (không replay)
      if (isPlaying) {
        const coachEnd =
          coach?.duration > 0 && coach.duration - coach.currentTime <= END_EPS;
        const learnerEnd =
          learner?.duration > 0 &&
          learner.duration - learner.currentTime <= END_EPS;
        if (coachEnd || learnerEnd) {
          wantsPlayRef.current = false;
          setIsPlaying(false);
          coach?.pause();
          learner?.pause();
          overlayRef.current?.pauseAsync();
        }
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [coach, learner, isPlaying, coachReady, learnerReady]);

  // --------- transport ----------
  const togglePlay = async () => {
    try {
      if (isPlaying) {
        wantsPlayRef.current = false;
        coach?.pause();
        learner?.pause();
        await overlayRef.current?.pauseAsync();
        setIsPlaying(false);
        return;
      }

      // nếu ở cuối -> tua về đầu từng video (độc lập)
      if (coach?.duration > 0 && coach.duration - coach.currentTime <= END_EPS)
        coach.currentTime = 0;
      if (
        learner?.duration > 0 &&
        learner.duration - learner.currentTime <= END_EPS
      )
        learner.currentTime = 0;

      wantsPlayRef.current = true;

      coach?.play();
      learner?.play();

      if (mode === "overlay") {
        // overlayRef đang hiển thị COACH, nên bám theo thời gian coach
        const coachMs = (coach?.currentTime ?? 0) * 1000;
        await overlayRef.current?.setPositionAsync(coachMs);
        await overlayRef.current?.playAsync();
        await overlayRef.current?.setRateAsync(1.0, true);
      }
      setIsPlaying(true);
    } catch {
      Alert.alert("Lỗi", "Không thể play/pause");
    }
  };

  const nudge = async (sec: number) => {
    const c = coach?.currentTime ?? 0;
    const l = learner?.currentTime ?? 0;
    const cNew = Math.max(0, Math.min(c + sec, coach?.duration ?? c));
    const lNew = Math.max(0, Math.min(l + sec, learner?.duration ?? l));
    if (coach) coach.currentTime = cNew;
    if (learner) learner.currentTime = lNew;
    if (mode === "overlay") {
      await overlayRef.current?.setPositionAsync(
        (coach?.currentTime ?? 0) * 1000,
      );
    }
  };

  // --------- sliders (ĐỘC LẬP) ----------
  const onCoachSlide = async (ratio: number) => {
    if (!coach) return;
    const t = ratio * coach.duration;
    coach.currentTime = t;
    if (mode === "overlay") {
      await overlayRef.current?.setPositionAsync(t * 1000); // overlay bám coach
    }
  };

  const onLearnerSlide = async (ratio: number) => {
    if (!learner) return;
    const t = ratio * learner.duration;
    learner.currentTime = t;
    // không đụng tới coach, cũng không đụng overlay
  };

  // --------- utils ----------
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  // --------- UI ----------
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: "#9CA3AF", marginTop: 8 }}>
          Đang kiểm tra video…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>So sánh kỹ thuật</Text>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, mode === "overlay" && styles.tabActive]}
              onPress={() => setMode("overlay")}
            >
              <Text
                style={[
                  styles.tabText,
                  mode === "overlay" && styles.tabTextActive,
                ]}
              >
                Overlay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === "split" && styles.tabActive]}
              onPress={() => setMode("split")}
            >
              <Text
                style={[
                  styles.tabText,
                  mode === "split" && styles.tabTextActive,
                ]}
              >
                Split
              </Text>
            </TouchableOpacity>
          </View>
          {err ? (
            <Text style={{ color: "#FCA5A5", marginTop: 6 }}>❌ {err}</Text>
          ) : null}
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {mode === "overlay" ? (
            <View
              style={{
                height: H_OVERLAY,
                backgroundColor: "#000",
                position: "relative",
              }}
            >
              {/* Learner dưới (expo-video) */}
              <VideoView
                player={learner}
                style={styles.fill}
                contentFit="contain"
                nativeControls={false}
              />
              <View style={[styles.tag, styles.left, styles.student]}>
                <Ionicons name="person" size={14} color="#fff" />
                <Text style={styles.tagText}>Learner</Text>
              </View>

              {/* Coach trên (expo-av) */}
              <Animated.View
                style={[styles.fill, { opacity: animatedOpacity }]}
                pointerEvents="none"
              >
                <ExpoAVVideo
                  ref={overlayRef}
                  source={{ uri: coachSrc }}
                  style={styles.full}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                  isLooping={false}
                  isMuted={false}
                  onLoad={async () => {
                    // sync vị trí ban đầu = thời gian của coach hiện tại
                    const ms = (coach?.currentTime ?? 0) * 1000;
                    await overlayRef.current?.setPositionAsync(ms);
                    if (wantsPlayRef.current) {
                      await overlayRef.current?.playAsync();
                      await overlayRef.current?.setRateAsync(1.0, true);
                    }
                    await overlayRef.current?.setStatusAsync({
                      progressUpdateIntervalMillis: POLL_MS,
                    });
                  }}
                  onPlaybackStatusUpdate={(st: any) => {
                    if (st?.didJustFinish) {
                      wantsPlayRef.current = false;
                      setIsPlaying(false);
                      coach?.pause();
                      learner?.pause();
                      overlayRef.current?.pauseAsync();
                    }
                  }}
                />
              </Animated.View>
              <Animated.View
                style={[
                  styles.tag,
                  styles.right,
                  styles.coach,
                  { opacity: animatedOpacity },
                ]}
              >
                <Ionicons name="school" size={14} color="#fff" />
                <Text style={styles.tagText}>Coach</Text>
              </Animated.View>

              {/* Opacity + 2 sliders độc lập */}
              <View style={styles.overlayPanel}>
                <View style={styles.opacityHdr}>
                  <Ionicons name="layers" size={16} color="#fff" />
                  <Text style={styles.opacityText}>Độ trong suốt</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={opacity}
                  onValueChange={onOpacityChange}
                  minimumTrackTintColor="#8B5CF6"
                  maximumTrackTintColor="rgba(255,255,255,.3)"
                  thumbTintColor="#fff"
                />
                <Text style={styles.small}>Coach</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={coachDur > 0 ? coachPos / coachDur : 0}
                  onSlidingComplete={onCoachSlide}
                  minimumTrackTintColor="#34D399"
                  maximumTrackTintColor="rgba(255,255,255,.3)"
                  thumbTintColor="#fff"
                />
                <Text style={styles.small}>Learner</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={learnerDur > 0 ? learnerPos / learnerDur : 0}
                  onSlidingComplete={onLearnerSlide}
                  minimumTrackTintColor="#60A5FA"
                  maximumTrackTintColor="rgba(255,255,255,.3)"
                  thumbTintColor="#fff"
                />
              </View>
            </View>
          ) : (
            // SPLIT MODE
            <View style={{ gap: 10 }}>
              {/* COACH */}
              <View style={styles.splitBox}>
                <VideoView
                  player={coach}
                  style={styles.full}
                  contentFit="contain"
                />
                <View style={[styles.tag, styles.left, styles.coach]}>
                  <Ionicons name="school" size={14} color="#fff" />
                  <Text style={styles.tagText}>Coach</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.small}>Coach</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={coachDur > 0 ? coachPos / coachDur : 0}
                  onSlidingComplete={onCoachSlide}
                  minimumTrackTintColor="#34D399"
                  maximumTrackTintColor="rgba(255,255,255,.3)"
                  thumbTintColor="#fff"
                />
              </View>
              {/* LEARNER */}
              <View style={styles.splitBox}>
                <VideoView
                  player={learner}
                  style={styles.full}
                  contentFit="contain"
                />
                <View style={[styles.tag, styles.left, styles.student]}>
                  <Ionicons name="person" size={14} color="#fff" />
                  <Text style={styles.tagText}>Learner</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.small}>Learner</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={learnerDur > 0 ? learnerPos / learnerDur : 0}
                  onSlidingComplete={onLearnerSlide}
                  minimumTrackTintColor="#60A5FA"
                  maximumTrackTintColor="rgba(255,255,255,.3)"
                  thumbTintColor="#fff"
                />
              </View>
            </View>
          )}

          {/* Transport chung */}
          <View style={styles.transport}>
            <TouchableOpacity onPress={() => nudge(-5)} style={styles.transBtn}>
              <Ionicons name="play-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={togglePlay}
              style={[styles.transBtn, styles.playBtn]}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => nudge(5)} style={styles.transBtn}>
              <Ionicons name="play-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Time readouts */}
          <View style={styles.timeRow}>
            <Text style={styles.time}>
              Coach: {fmt(coachPos)} / {fmt(coachDur)}
            </Text>
            <Text style={styles.time}>
              Learner: {fmt(learnerPos)} / {fmt(learnerDur)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 54 : 16,
    paddingBottom: 10,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  tabs: { flexDirection: "row", gap: 8 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "rgba(139,92,246,.25)",
    borderColor: "#8B5CF6",
  },
  tabText: { color: "#A1A1AA", fontWeight: "600" },
  tabTextActive: { color: "#EDE9FE" },

  card: {
    marginHorizontal: 12,
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
  },

  // overlay
  fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  full: { width: "100%", height: "100%" },
  overlayPanel: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,.85)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,.5)",
  },
  opacityHdr: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 6,
  },
  opacityText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  slider: { width: "100%", height: 36 },
  small: { color: "#CBD5E1", fontSize: 11, marginBottom: -4, marginTop: 6 },

  tag: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  left: { top: 10, left: 10 },
  right: { top: 10, right: 10 },
  coach: { backgroundColor: "rgba(16,185,129,.95)" },
  student: { backgroundColor: "rgba(59,130,246,.95)" },
  tagText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  // split
  splitBox: {
    height: H_SPLIT,
    backgroundColor: "#000",
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },

  // transport
  transport: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 26,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,.6)",
  },
  transBtn: { padding: 8 },
  playBtn: { backgroundColor: "rgba(139,92,246,.45)", borderRadius: 28 },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  time: { color: "#A7B0C0", fontSize: 12 },
});
