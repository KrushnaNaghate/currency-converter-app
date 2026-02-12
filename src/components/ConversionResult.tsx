import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { formatCurrency, formatNumber } from "../utils/format";

interface ConversionResultProps {
  sourceCurrency: string;
  destinationCurrency: string;
  amount: string;
  convertedAmount: number | null;
  exchangeRate: number | null;
  loading?: boolean;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  sourceCurrency,
  destinationCurrency,
  amount,
  convertedAmount,
  exchangeRate,
  loading = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (convertedAmount !== null) {
      scale.value = withSequence(
        withSpring(1.05, { damping: 15 }),
        withSpring(1),
      );
    }
  }, [convertedAmount]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const numericAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numericAmount) && numericAmount > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Conversion Result</Text>

      <Animated.View style={[styles.resultCard, animatedStyle]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <MaterialIcons name="sync" size={24} color="#3B82F6" />
            <Text style={styles.loadingText}>Converting...</Text>
          </View>
        ) : (
          <>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>You send</Text>
              <Text style={styles.amount}>
                {isValidAmount
                  ? formatCurrency(numericAmount, sourceCurrency)
                  : "-"}
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <MaterialIcons name="south" size={20} color="#9CA3AF" />
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Recipient gets</Text>
              <Text style={styles.convertedAmount}>
                {convertedAmount !== null && isValidAmount
                  ? formatCurrency(convertedAmount, destinationCurrency)
                  : "-"}
              </Text>
            </View>

            {exchangeRate !== null && (
              <View style={styles.rateContainer}>
                <MaterialIcons name="info-outline" size={16} color="#6B7280" />
                <Text style={styles.rateText}>
                  1 {sourceCurrency} = {formatNumber(exchangeRate, 4)}{" "}
                  {destinationCurrency}
                </Text>
              </View>
            )}
          </>
        )}
      </Animated.View>

      <Text style={styles.disclaimer}>
        Exchange rates are for informational purposes only. Actual rates may
        vary.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: "#F0F9FF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "600",
  },
  amountRow: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E40AF",
  },
  convertedAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#BFDBFE",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#BFDBFE",
  },
  rateText: {
    fontSize: 13,
    color: "#6B7280",
  },
  disclaimer: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
