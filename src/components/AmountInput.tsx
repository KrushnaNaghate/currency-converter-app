import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currencyCode?: string;
  error?: string;
  disabled?: boolean;
  label?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currencyCode = "USD",
  error,
  disabled = false,
  label = "Amount",
}) => {
  const scale = useSharedValue(1);

  const handleChange = (text: string) => {
    // Allow only numbers and decimal point
    let inputValue = text.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = inputValue.split(".");
    if (parts.length > 2) {
      inputValue = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    onChange(inputValue);

    // Animate on input
    scale.value = withSpring(1.02, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 150);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          animatedStyle,
        ]}
      >
        <MaterialIcons
          name="attach-money"
          size={24}
          color="#6B7280"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#9CA3AF"
          editable={!disabled}
          selectionColor="#3B82F6"
        />
        <Text style={styles.currencyCode}>{currencyCode}</Text>
      </Animated.View>
      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={14} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <Text style={styles.helperText}>
        Enter the amount you want to convert
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    height: 64,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
  },
  helperText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },
});
