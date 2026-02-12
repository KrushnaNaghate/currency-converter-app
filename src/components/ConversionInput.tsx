import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { validateAmount } from "../utils/validators";

interface ConversionInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
}

const ConversionInput: React.FC<ConversionInputProps> = ({
  label,
  value,
  onChangeText,
  editable = true,
}) => {
  const handleTextChange = (text: string) => {
    if (validateAmount(text)) {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={handleTextChange}
        keyboardType="decimal-pad"
        placeholder="0.00"
        editable={editable}
        accessibilityLabel={label}
        accessibilityHint={editable ? "Enter amount" : "Converted amount"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    padding: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    minHeight: 56,
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
});

export default ConversionInput;
