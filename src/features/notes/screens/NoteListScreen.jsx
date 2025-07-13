import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteListScreen() {
  const [notes, setNotes] = useState([]);
  const [isAddNoteVisible, setIsAddNoteVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Modal
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        console.log("Loaded notes from storage:", parsedNotes.length);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.log("Error loading notes:", error);
      Alert.alert("Error", "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const saveNoteToStorage = async (noteList) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(noteList));
      console.log("Notes saved to storage:", noteList.length);
    } catch (error) {
      console.log("Error saving notes:", error);
      throw error;
    }
  };

  const addNewNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      Alert.alert("Error", "Please enter both title and content");
      return;
    }

    try {
      setSaving(true);
      const newNote = {
        id: Date.now().toString(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      };
      // Get current notes from AsyncStorage to ensure we have the latest
      const savedNotes = await AsyncStorage.getItem('notes');
      const currentNotes = savedNotes ? JSON.parse(savedNotes) : [];
      
      // Check for duplicates
      const alreadyExists = currentNotes.some(note => 
        note.title === newNote.title && note.content === newNote.content
      );
      
      if (alreadyExists) {
        Alert.alert("Duplicate Note", "A note with this title and content already exists");
        return;
      }
      
      const updatedNotes = [...currentNotes, newNote];
      await saveNoteToStorage(updatedNotes);
      setNotes(updatedNotes);
      
      // Clear form and close modal
      setNewNoteTitle("");
      setNewNoteContent("");
      setIsAddNoteVisible(false);
      
      console.log("New note added successfully. Total notes:", updatedNotes.length);
      
    } catch (error) {
      console.log("Error adding note:", error);
      Alert.alert("Error", "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const cancelAddNote = () => {
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsAddNoteVisible(false);
  };

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const renderNoteItem = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>{item.date}</Text>
        <Text style={styles.noteTime}>{item.time}</Text>
      </View>
    </View>
  );

  const renderAddNoteModal = () => (
    <Modal
      visible={isAddNoteVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={cancelAddNote}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={cancelAddNote} style={styles.modalButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Note</Text>
            <TouchableOpacity 
              onPress={addNewNote} 
              style={[styles.modalButton, styles.saveButton]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Modal Form */}
          <View style={styles.modalForm}>
            <TextInput
              placeholder="Note Title"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
              style={styles.modalTitleInput}
              placeholderTextColor="#666"
              autoFocus
            />
            <TextInput
              placeholder="Write your note here..."
              value={newNoteContent}
              onChangeText={setNewNoteContent}
              style={styles.modalContentInput}
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} style={styles.searchIcon} />
        <TextInput
          placeholder="Search notes..."
          style={styles.searchField}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.listContainer}>
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text" size={50} color="#999" />
            <Text style={styles.emptyText}>
              {searchQuery ? "No notes found for your search" : "No notes available. Add a new note!"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Add Note Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddNoteVisible(true)}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {renderAddNoteModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 12,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 13,
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 10,
    color: "#666",
  },
  searchField: {
    flex: 1,
    fontSize: 16,
    color: "black",
    padding: 0,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  noteItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: {
    fontSize: 12,
    color: "#999",
  },
  noteTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalForm: {
    flex: 1,
    padding: 16,
  },
  modalTitleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 12,
    marginBottom: 16,
  },
  modalContentInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});
