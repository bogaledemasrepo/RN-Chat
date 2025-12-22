import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

// --- Props Interface ---
interface BeautifulInputProps extends TextInputProps {
  label: string;
}
// --- End Props Interface ---


const BeautifulInput: React.FC<BeautifulInputProps> = ({
  label,
  placeholder,
  ...rest // 'rest' will contain all other standard TextInputProps (like onChangeText, value, etc.)
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label above the input */}
      <Text style={styles.label}>{label}</Text>

      {/* The main TextInput component */}
      <TextInput
        {...rest} // Spread all remaining TextInput props
        style={[
          styles.input,
          // Apply a different style when the input is focused
          isFocused && styles.inputFocused
        ]}
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#999999"
      />
    </View>
  );
};

// --- Stylesheet (remains the same as the JavaScript version) ---
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 50,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
});

export default BeautifulInput;