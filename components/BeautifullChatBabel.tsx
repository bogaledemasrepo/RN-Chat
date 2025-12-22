import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isLeft?: boolean; // True for receiver, False for sender
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, timestamp, isLeft }) => {
  const containerStyle: ViewStyle = isLeft ? styles.receiverContainer : styles.senderContainer;
  const bubbleStyle: ViewStyle = isLeft ? styles.receiverBubble : styles.senderBubble;
  const textStyle: TextStyle = isLeft ? styles.receiverText : styles.senderText;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={textStyle}>{message}</Text>
        <Text style={[styles.timestamp, isLeft ? styles.receiverTime : styles.senderTime]}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    flexDirection: 'row',
    width: '100%',
  },
  senderContainer: {
    justifyContent: 'flex-end',
  },
  receiverContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    // Soft shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  senderBubble: {
    backgroundColor: '#007AFF', // iOS Blue
    borderBottomRightRadius: 2, // "Tail" effect
    // marginRight: 10,
  },
  receiverBubble: {
    backgroundColor: '#F0F0F0', // Light Gray
    borderBottomLeftRadius: 2, // "Tail" effect
    marginLeft: 10,
  },
  senderText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 20,
  },
  receiverText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
  senderTime: {
    color: '#E0E0E0',
  },
  receiverTime: {
    color: '#999',
  },
});

export default ChatBubble;