import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Hooks
import { useNotes } from "../hooks/useNotes";
import { useSearch } from "../hooks/useSearch";

// Components
import EmptyState from "../../../components/ui/EmptyState";
import FloatingActionButton from "../../../components/ui/FloatingActionButton";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import SearchBar from "../../../components/ui/SearchBar";
import AddNoteModal from "../components/AddNoteModal";
import NoteItem from "../components/NoteItem";

const NoteListScreen = () => {
  const { notes, loading, addNote, deleteNote, updateNote } = useNotes();
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredNotes,
    hasActiveSearch,
  } = useSearch(notes, ["title", "content"]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  // Effect to open modal after editingNote is set
  useEffect(() => {
    if (shouldOpenModal && editingNote) {
      setIsModalVisible(true);
      setShouldOpenModal(false);
    }
  }, [editingNote, shouldOpenModal]);

  const handleAddNote = useCallback(
    async (title, content) => {
      await addNote(title, content);
    },
    [addNote]
  );

  const handleEditNote = useCallback(
    async (title, content) => {
      if (editingNote) {
        await updateNote(editingNote.id, title, content);
        setEditingNote(null);
      }
    },
    [editingNote, updateNote]
  );

  const handleDeleteNote = useCallback(
    async (noteId) => {
      Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert("Error", "Failed to delete note");
            }
          },
        },
      ]);
    },
    [deleteNote]
  );

  const openAddModal = useCallback(() => {
    setEditingNote(null);
    setIsModalVisible(true);
  }, []);

  const openEditModal = useCallback((note) => {
    setEditingNote(note);
    setShouldOpenModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setShouldOpenModal(false);
    setEditingNote(null);
  }, []);

  const handleModalSave = useCallback(
    async (title, content) => {
      if (editingNote) {
        await handleEditNote(title, content);
      } else {
        await handleAddNote(title, content);
      }
    },
    [editingNote, handleEditNote, handleAddNote]
  );

  const renderNoteItem = useCallback(
    ({ item }) => (
      <NoteItem
        item={item}
        onPress={() => openEditModal(item)}
        onLongPress={() => handleDeleteNote(item.id)}
        showActions={false}
      />
    ),
    [openEditModal, handleDeleteNote]
  );

  const getKeyExtractor = useCallback((item) => item.id, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Loading notes..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search notes..."
      />

      {filteredNotes.length === 0 ? (
        <EmptyState
          title={hasActiveSearch ? "No notes found" : "No notes available"}
          subtitle={
            hasActiveSearch
              ? "Try adjusting your search"
              : "Add a new note to get started!"
          }
        />
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNoteItem}
          keyExtractor={getKeyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      )}

      <FloatingActionButton onPress={openAddModal} 
        style={{ position: "absolute", bottom: 40, right: 25 }}
      />

      <AddNoteModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleModalSave}
        editingNote={editingNote}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default NoteListScreen;
