import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// Import an icon library for the chevron (e.g., react-native-vector-icons)
// For this example, we'll use a simple character for the chevron:
const CHEVRON_DOWN = '▼';

// --- Type Definitions ---
interface DropdownItem {
  label: string;
  value: string | number;
}

interface BeautifulDropdownProps {
  label: string;
  items: DropdownItem[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
}
// --- End Type Definitions ---

const BeautifulDropdown: React.FC<BeautifulDropdownProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find the currently selected label to display in the input box
  const selectedLabel = items.find(item => item.value === selectedValue)?.label || placeholder;

  const handleSelect = (value: string | number) => {
    onValueChange(value);
    setIsOpen(false); // Close the dropdown after selection
  };
// ... (rest of the component)// ... (inside BeautifulDropdown component)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* 1. Input Box (The clickable area) */}
      <Pressable
        style={[styles.input, isOpen && styles.inputFocused]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text
          style={[
            styles.selectedText,
            // Dim the text if the placeholder is showing
            selectedValue === '' && styles.placeholderText,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>{isOpen ? '▲' : CHEVRON_DOWN}</Text>
      </Pressable>

      {/* 2. Options Container (Conditionally rendered) */}
      {isOpen && (
        <View style={styles.optionsContainer}>
          <ScrollView style={styles.scrollView}>
            {items.map((item, index) => (
              <Pressable
                key={item.value}
                style={[
                  styles.optionItem,
                  // Highlight the currently selected item
                  item.value === selectedValue && styles.selectedOptionItem,
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
    // Important: Z-index ensures the dropdown options appear above other elements
    zIndex: 10, 
  },
  label: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 15,
    flexDirection: 'row', // Align text and chevron
    justifyContent: 'space-between',
    alignItems: 'center',
    // Apply a soft shadow for depth
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3 },
      android: { elevation: 2 },
    }),
  },
  inputFocused: {
    borderColor: '#007AFF', // Blue focus ring
    borderWidth: 2,
  },
  selectedText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    color: '#999999',
  },
  chevron: {
    fontSize: 12,
    color: '#666666',
  },
  optionsContainer: {
    // Position the dropdown options right below the input box
    position: 'absolute',
    top: 50 + 10, // Input height + label space (approx 60 total)
    left: 0,
    right: 0,
    maxHeight: 200, // Limit height to make it scrollable
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF', // Use the focus color for border
    // Ensure the options box has more elevation than the input
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
      android: { elevation: 8 },
    }),
    overflow: 'hidden', // Ensures items stay within border-radius
  },
  scrollView: {
    paddingVertical: 4,
  },
  optionItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  selectedOptionItem: {
    backgroundColor: '#E0F0FF', // Light blue background for selected item
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default BeautifulDropdown;