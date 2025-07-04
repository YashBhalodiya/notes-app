import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.innerContainer}
      >
        <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Content"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (title.trim() && description.trim()) {
                router.replace({ pathname: "/", params: { title, description } });
              } else {
                alert("Please fill in both title and content");
              }
            }}
          >
            <Text style={styles.buttonText}>Save Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ccc" }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: "black" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    height: 50,
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 8,
  },
  descriptionInput: {
    flex: 1,
    borderColor: "black",
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: "top",
    fontSize: 18,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    backgroundColor: "blue",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
