import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NoteItem = memo(({ 
  item, 
  onPress, 
  onLongPress,
  onDelete, 
  onEdit,
  showActions = false,
  isSemanticResult = false,
  semanticScore,
  highlightedText,
  matchedKeywords = []
}) => {
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
  const backgroundColor = isSemanticResult ? '#E8F5E9' : backgroundColors[colorIndex];
  
  const displayContent = isSemanticResult && highlightedText 
    ? highlightedText 
    : item.content;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor },
        isSemanticResult && styles.semanticResult
      ]} 
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
      delayLongPress={500}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {isSemanticResult && semanticScore && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {Math.round(semanticScore * 100)}%
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.contentText} numberOfLines={3}>
          {displayContent}
        </Text>
        
        {isSemanticResult && matchedKeywords.length > 0 && (
          <View style={styles.keywordsContainer}>
            <Text style={styles.keywordsLabel}>Keywords: </Text>
            {matchedKeywords.slice(0, 3).map((keyword, index) => (
              <View key={index} style={styles.keywordTag}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.time}>{item.time}</Text>
          {isSemanticResult && (
            <Text style={styles.aiLabel}>🤖 AI</Text>
          )}
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
  semanticResult: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.3,
    flex: 1,
  },
  scoreContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  scoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '400',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  keywordsLabel: {
    fontSize: 12,
    color: '#777',
    marginRight: 4,
  },
  keywordTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  keywordText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '500',
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
