import Icon from "@react-native-vector-icons/ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteListScreen() {
  const router = useRouter();
  const {title, description} = useLocalSearchParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
  if (title && description) {
    const newNote = {
      title: title.toString(),
      content: description.toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    }
    const alreadyExists = notes.some(note=> note.title === newNote.title && note.content=== newNote.content)
    if (!alreadyExists) {
      setNotes(prevNotes => [...prevNotes, newNote]);
    }
  }
  }, [title, description])

  const renderNoteItem = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.noteDate}>{item.date}</Text>
      <Text style={styles.noteTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={22} style={styles.searchIcon} />
        <TextInput
          placeholder="Search.."
          style={styles.searchField}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.listContainer}>
        <Icon
          name="add"
          size={50}
          style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1, borderRadius: 30, backgroundColor: "#007AFF", padding: 8, color: "#fff" }}
          onPress={() => router.push("/AddNoteScreen")}
        />
        {
        notes.length === 0 && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Icon name="document-text" size={50} color="#999" />
            
          <Text style={{ marginTop: 20, fontSize: 18, color: "#999"  }}>
            No notes available. Add a new note!
          </Text>
          </View>
        )}
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderColor: "black",
  },
  searchIcon: {
    marginRight: 10,
    color: "#666",
  },
  searchField: {
    flex: 1,
    fontSize: 20,
    color: "black",
    padding: 0,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 20,
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
  noteDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  noteTime: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});
