import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NoteItem = memo(({ 
  item, 
  onPress, 
  onLongPress,
  onDelete, 
  onEdit,
  showActions = false 
}) => {
  // Different background colors for variety (like in the image)
  const backgroundColors = [
    '#E3F2FD', // Light blue
    '#FFF3E0', // Light orange
    '#F1F8E9', // Light green
    '#FCE4EC', // Light pink
    '#F3E5F5', // Light purple
    '#E8F5E8', // Light mint
  ];
  
  // Use item ID to consistently assign colors
  const colorIndex = parseInt(item.id.slice(-1), 16) % backgroundColors.length;
  const backgroundColor = backgroundColors[colorIndex];
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
      delayLongPress={500}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.contentText} numberOfLines={3}>
          {item.content}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 18,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  contentText: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

NoteItem.displayName = 'NoteItem';

export default NoteItem;
