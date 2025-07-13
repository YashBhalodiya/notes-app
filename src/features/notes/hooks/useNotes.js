import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const STORAGE_KEY = 'notes';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const savedNotes = await AsyncStorage.getItem(STORAGE_KEY);
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
  }, []);

  const saveNotesToStorage = useCallback(async (noteList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(noteList));
      console.log("Notes saved to storage:", noteList.length);
    } catch (error) {
      console.log("Error saving notes:", error);
      throw error;
    }
  }, []);

  const addNote = useCallback(async (title, content) => {
    if (!title.trim() || !content.trim()) {
      throw new Error("Please enter both title and content");
    }

    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    };

    // Get current notes from AsyncStorage to ensure we have the latest
    const savedNotes = await AsyncStorage.getItem(STORAGE_KEY);
    const currentNotes = savedNotes ? JSON.parse(savedNotes) : [];
    
    // Check for duplicates
    const alreadyExists = currentNotes.some(note => 
      note.title === newNote.title && note.content === newNote.content
    );
    
    if (alreadyExists) {
      throw new Error("A note with this title and content already exists");
    }
    
    const updatedNotes = [...currentNotes, newNote];
    await saveNotesToStorage(updatedNotes);
    setNotes(updatedNotes);
    
    console.log("New note added successfully. Total notes:", updatedNotes.length);
    return newNote;
  }, [saveNotesToStorage]);

  const deleteNote = useCallback(async (noteId) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await saveNotesToStorage(updatedNotes);
      setNotes(updatedNotes);
      console.log("Note deleted successfully. Total notes:", updatedNotes.length);
    } catch (error) {
      console.log("Error deleting note:", error);
      throw error;
    }
  }, [notes, saveNotesToStorage]);

  const updateNote = useCallback(async (noteId, title, content) => {
    try {
      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              title: title.trim(), 
              content: content.trim(),
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
            }
          : note
      );
      await saveNotesToStorage(updatedNotes);
      setNotes(updatedNotes);
      console.log("Note updated successfully");
    } catch (error) {
      console.log("Error updating note:", error);
      throw error;
    }
  }, [notes, saveNotesToStorage]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    addNote,
    deleteNote,
    updateNote,
    refreshNotes: loadNotes
  };
};
