import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  style,
  ...props 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={22} style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 13,
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 10,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    padding: 0,
  },
});

export default SearchBar;
