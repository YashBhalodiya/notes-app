import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddNoteModal = ({ visible, onClose, onSave, editingNote = null }) => {
  const [title, setTitle] = useState(editingNote?.title || "");
  const [content, setContent] = useState(editingNote?.content || "");
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const isEditing = !!editingNote;

  const handleSave = async (title, content, images) => {
    console.log("Save Pressed");
    
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please enter both title and content");
      return;
    }

    try {
      setSaving(true);
      await onSave(title, content, images);
      handleClose();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle(editingNote?.title || "");
    setContent(editingNote?.content || "");
    setSaving(false);
    onClose();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle selected image
      setSelectedImages([...selectedImages, result.assets[0]]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.button}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
              {isEditing ? "Edit Note" : "Add New Note"}
            </Text>

            <TouchableOpacity
              onPress={() => handleSave(title, content, selectedImages)}
              style={[styles.button, styles.saveButton]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              placeholder="Note Title"
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholderTextColor="#666"
              autoFocus={!isEditing}
            />
            <TextInput
              placeholder="Write your note here..."
              value={content}
              onChangeText={setContent}
              style={styles.contentInput}
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Bottom Toolbar */}
          <View style={styles.bottomToolbar}>
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <Ionicons name="image" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  button: {
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
  form: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 12,
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  inputContainer: {
    flex: 1,
  },
  bottomToolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  imageButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default AddNoteModal;
