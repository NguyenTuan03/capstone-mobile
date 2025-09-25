import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export type Note = {
  id: string;
  text: string;
  createdAt: string; // ISO
  updatedAt?: string;
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

export default function SessionNotes({
  sessionId,
  title = "Coach Notes",
  readonly = false, // set true nếu chỉ muốn hiển thị
}: {
  sessionId: string;
  title?: string;
  readonly?: boolean;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    (async () => {
      const data = await loadNotes(sessionId);
      setNotes(data);
    })();
  }, [sessionId]);

  const addNote = async () => {
    const text = draft.trim();
    if (!text) return;
    const n: Note = {
      id: String(Date.now()),
      text,
      createdAt: new Date().toISOString(),
    };
    const next = [n, ...notes];
    setNotes(next);
    setDraft("");
    await saveNotes(sessionId, next);
  };

  const startEdit = (n: Note) => {
    setEditingId(n.id);
    setEditingText(n.text);
  };
  const confirmEdit = async () => {
    const text = editingText.trim();
    if (!text) return;
    const next = notes.map((n) =>
      n.id === editingId
        ? { ...n, text, updatedAt: new Date().toISOString() }
        : n,
    );
    setNotes(next);
    setEditingId(null);
    setEditingText("");
    await saveNotes(sessionId, next);
  };

  const removeNote = async (id: string) => {
    Alert.alert("Delete note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const next = notes.filter((n) => n.id !== id);
          setNotes(next);
          await saveNotes(sessionId, next);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Note }) => {
    const isEditing = editingId === item.id;
    return (
      <View style={st.noteCard}>
        <View style={{ flex: 1 }}>
          {isEditing ? (
            <TextInput
              value={editingText}
              onChangeText={setEditingText}
              multiline
              style={[st.noteText, st.editInput]}
              placeholder="Edit note..."
              placeholderTextColor="#9ca3af"
            />
          ) : (
            <Text style={st.noteText}>{item.text}</Text>
          )}
          <Text style={st.noteMeta}>
            {new Date(item.createdAt).toLocaleString()}
            {item.updatedAt
              ? ` • edited ${new Date(item.updatedAt).toLocaleString()}`
              : ""}
          </Text>
        </View>

        {!readonly && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {isEditing ? (
              <Pressable
                onPress={confirmEdit}
                style={[st.iconBtn, { backgroundColor: "#10b981" }]}
              >
                <Ionicons name="checkmark" size={16} color="#fff" />
              </Pressable>
            ) : (
              <Pressable onPress={() => startEdit(item)} style={st.iconBtn}>
                <Ionicons name="pencil" size={16} color="#111827" />
              </Pressable>
            )}
            <Pressable onPress={() => removeNote(item.id)} style={st.iconBtn}>
              <Ionicons name="trash-outline" size={16} color="#111827" />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={st.wrap}>
      <Text style={st.title}>{title}</Text>

      {!readonly && (
        <View style={st.addRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ghi chú cho buổi học (kế hoạch, lỗi thường gặp, bài tập về nhà...)"
            placeholderTextColor="#9ca3af"
            multiline
            style={st.input}
          />
          <Pressable
            onPress={addNote}
            style={[st.addBtn, { opacity: draft.trim() ? 1 : 0.5 }]}
            disabled={!draft.trim()}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={st.addText}>Add</Text>
          </Pressable>
        </View>
      )}

      {notes.length === 0 ? (
        <View style={st.empty}>
          <Ionicons name="document-text-outline" size={28} color="#cbd5e1" />
          <Text style={st.emptyText}>Chưa có ghi chú nào</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingTop: 8 }}
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  wrap: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  title: { fontWeight: "900", color: "#111827", fontSize: 16 },
  addRow: { marginTop: 8 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    color: "#111827",
    lineHeight: 20,
  },
  addBtn: {
    marginTop: 8,
    backgroundColor: "#111827",
    borderRadius: 10,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  addText: { color: "#fff", fontWeight: "800" },
  empty: { alignItems: "center", paddingVertical: 16, gap: 6 },
  emptyText: { color: "#6b7280" },

  noteCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    flexDirection: "row",
    gap: 8,
  },
  noteText: { color: "#111827" },
  noteMeta: { color: "#6b7280", marginTop: 6, fontSize: 12 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  editInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
  },
});
