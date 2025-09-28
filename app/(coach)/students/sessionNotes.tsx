import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Note = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  category?: "general" | "technique" | "strategy" | "homework";
};

async function loadNotes(sessionId: string): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(`notes:${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveNotes(sessionId: string, notes: Note[]) {
  await AsyncStorage.setItem(`notes:${sessionId}`, JSON.stringify(notes));
}

interface SessionNotesProps {
  sessionId: string;
  title?: string;
  readonly?: boolean;
  studentName?: string;
  embedded?: boolean; // Whether this component is embedded within another screen
}

export default function SessionNotes({
  sessionId,
  title = "Coach Notes",
  readonly = false,
  studentName,
  embedded = false,
}: SessionNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Note["category"]>("general");
  const [filter, setFilter] = useState<"all" | Note["category"]>("all");
  const insets = useSafeAreaInsets();

  const categories = [
    {
      key: "general" as const,
      label: "General",
      icon: "file-text",
      color: "#6366f1",
    },
    {
      key: "technique" as const,
      label: "Technique",
      icon: "target",
      color: "#10b981",
    },
    {
      key: "strategy" as const,
      label: "Strategy",
      icon: "zap",
      color: "#f59e0b",
    },
    {
      key: "homework" as const,
      label: "Homework",
      icon: "home",
      color: "#ef4444",
    },
  ];

  const filters = [
    { key: "all" as const, label: "All Notes" },
    ...categories.map((cat) => ({ key: cat.key, label: cat.label })),
  ];

  useEffect(() => {
    (async () => {
      const data = await loadNotes(sessionId);
      setNotes(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    })();
  }, [sessionId]);

  const addNote = async () => {
    const text = draft.trim();
    if (!text) return;

    const note: Note = {
      id: String(Date.now()),
      text,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    setDraft("");
    await saveNotes(sessionId, updatedNotes);
  };

  const updateNote = async () => {
    const text = editingText.trim();
    if (!text) return;

    const updatedNotes = notes.map((note) =>
      note.id === editingId
        ? { ...note, text, updatedAt: new Date().toISOString() }
        : note,
    );

    setNotes(updatedNotes);
    setEditingId(null);
    setEditingText("");
    await saveNotes(sessionId, updatedNotes);
  };

  const deleteNote = async (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
          await saveNotes(sessionId, updatedNotes);
        },
      },
    ]);
  };

  const getCategoryInfo = (category?: Note["category"]) => {
    return categories.find((cat) => cat.key === category) || categories[0];
  };

  const filteredNotes =
    filter === "all" ? notes : notes.filter((note) => note.category === filter);

  const renderNoteItem = ({ item }: { item: Note }) => {
    const isEditing = editingId === item.id;
    const categoryInfo = getCategoryInfo(item.category);

    return (
      <View style={styles.noteCard}>
        <View style={styles.noteHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryInfo.color },
            ]}
          >
            <Feather
              name={categoryInfo.icon as any}
              size={12}
              color="#ffffff"
            />
            <Text style={styles.categoryText}>{categoryInfo.label}</Text>
          </View>
          <Text style={styles.noteDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {isEditing ? (
          <TextInput
            value={editingText}
            onChangeText={setEditingText}
            multiline
            style={styles.editInput}
            placeholder="Edit your note..."
            placeholderTextColor="#9ca3af"
          />
        ) : (
          <Text style={styles.noteText}>{item.text}</Text>
        )}

        {item.updatedAt && (
          <Text style={styles.updatedText}>
            Last edited: {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        )}

        {!readonly && (
          <View style={styles.noteActions}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  onPress={updateNote}
                  style={[styles.actionButton, styles.saveButton]}
                >
                  <Feather name="check" size={16} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditingId(null)}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Feather name="x" size={16} color="#ffffff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(item.id);
                    setEditingText(item.text);
                  }}
                  style={[styles.actionButton, styles.editButton]}
                >
                  <Feather name="edit-2" size={16} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteNote(item.id)}
                  style={[styles.actionButton, styles.deleteButton]}
                >
                  <Feather name="trash-2" size={16} color="#ffffff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header - only show if not embedded */}
      {!embedded && (
        <LinearGradient
          colors={["#4f46e5", "#7c3aed"]}
          style={[styles.header, { paddingTop: insets.top }]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{title}</Text>
              {studentName && (
                <Text style={styles.headerSubtitle}>{studentName}</Text>
              )}
            </View>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>
      )}

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterContainer, embedded && { paddingTop: 16 }]}
      >
        {filters.map((filterOption) => (
          <TouchableOpacity
            key={filterOption.key}
            onPress={() => setFilter(filterOption.key)}
            style={[
              styles.filterButton,
              filter === filterOption.key && styles.activeFilterButton,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterOption.key && styles.activeFilterButtonText,
              ]}
            >
              {filterOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Note Section */}
      {!readonly && (
        <View style={styles.addNoteContainer}>
          <Text style={styles.sectionTitle}>Add New Note</Text>

          {/* Category Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => setSelectedCategory(category.key)}
                style={[
                  styles.categoryButton,
                  { borderColor: category.color },
                  selectedCategory === category.key && {
                    backgroundColor: category.color,
                  },
                ]}
              >
                <Feather
                  name={category.icon as any}
                  size={16}
                  color={
                    selectedCategory === category.key
                      ? "#ffffff"
                      : category.color
                  }
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color:
                        selectedCategory === category.key
                          ? "#ffffff"
                          : category.color,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write your coaching notes here... (observations, feedback, homework, etc.)"
            placeholderTextColor="#9ca3af"
            multiline
            style={styles.input}
            numberOfLines={4}
          />

          <TouchableOpacity
            onPress={addNote}
            style={[styles.addButton, { opacity: draft.trim() ? 1 : 0.5 }]}
            disabled={!draft.trim()}
          >
            <Feather name="plus" size={18} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notes List */}
      <View style={[styles.notesListContainer, embedded && { paddingTop: 0 }]}>
        <Text style={styles.sectionTitle}>
          {filter === "all"
            ? "All Notes"
            : `${filters.find((f) => f.key === filter)?.label} Notes`}
          {filteredNotes.length > 0 && ` (${filteredNotes.length})`}
        </Text>

        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="file-text" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptySubtitle}>
              {filter === "all"
                ? "Start by adding your first coaching note"
                : `No ${filters.find((f) => f.key === filter)?.label?.toLowerCase()} notes found`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderNoteItem}
            contentContainerStyle={styles.notesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeFilterButton: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeFilterButtonText: {
    color: "#ffffff",
  },
  addNoteContainer: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  notesListContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notesList: {
    paddingBottom: 20,
  },
  noteCard: {
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
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  noteDate: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  noteText: {
    fontSize: 16,
    color: "#1f2937",
    lineHeight: 24,
    marginBottom: 12,
  },
  updatedText: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
    textAlignVertical: "top",
    minHeight: 80,
    marginBottom: 12,
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#6366f1",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
});
