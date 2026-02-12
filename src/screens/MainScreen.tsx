import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import ConversionInput from "../components/ConversionInput";
import CurrencyDropdown from "../components/CurrencyDropdown";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  checkNetworkStatus,
  clearError,
  loadCurrencyPairs,
  loadExchangeRate,
  setDestinationCurrency,
  setSourceCurrency,
  swapCurrencies,
} from "../redux/slices/currencySlice";
import { addConversion } from "../redux/slices/historySlice";
import { AppDispatch, RootState } from "../redux/store";
import { formatAmount } from "../utils/validators";

const MainScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    pairs,
    sourceCurrency,
    destinationCurrency,
    exchangeRate,
    loading,
    error,
    isOffline,
  } = useSelector((state: RootState) => state.currency);

  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Load currency pairs on mount
    dispatch(loadCurrencyPairs());
    dispatch(checkNetworkStatus());

    // Check network status periodically
    const interval = setInterval(() => {
      dispatch(checkNetworkStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch exchange rate when currencies change
    if (sourceCurrency && destinationCurrency) {
      dispatch(
        loadExchangeRate({
          source: sourceCurrency,
          destination: destinationCurrency,
        }),
      );
    }
  }, [sourceCurrency, destinationCurrency]);

  useEffect(() => {
    // Calculate conversion in real-time
    if (amount && exchangeRate) {
      const numAmount = parseFloat(amount);
      const converted = numAmount * exchangeRate;
      setConvertedAmount(formatAmount(converted));

      // Save to history if valid amount
      if (numAmount > 0) {
        dispatch(
          addConversion({
            amount: numAmount,
            fromCurrency: sourceCurrency,
            toCurrency: destinationCurrency,
            convertedAmount: converted,
            rate: exchangeRate,
            timestamp: Date.now(),
          }),
        );
      }
    } else {
      setConvertedAmount("");
    }
  }, [amount, exchangeRate]);

  const handleSwap = () => {
    // Animate rotation
    rotation.value = withSpring(rotation.value + 180);

    // Swap currencies
    dispatch(swapCurrencies());

    // Clear amounts
    setAmount("");
    setConvertedAmount("");
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(loadCurrencyPairs());
  };

  // Extract unique source currencies with null check
  const sourceCurrencies =
    pairs && pairs.length > 0
      ? Array.from(new Set(pairs.map((p) => p.source_currency_code))).map(
          (code) => {
            const pair = pairs.find((p) => p.source_currency_code === code);
            return {
              code,
              name: pair?.source_currency_name || code,
            };
          },
        )
      : [];

  // Extract destination currencies for selected source
  const destinationCurrencies =
    pairs && pairs.length > 0
      ? pairs
          .filter((p) => p.source_currency_code === sourceCurrency)
          .map((p) => ({
            code: p.destination_currency_code,
            name: p.destination_currency_name,
          }))
      : [];

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ⚠️ You're offline. Showing cached data.
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Currency Converter</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              accessibilityLabel="Retry"
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <CurrencyDropdown
            label="From"
            options={sourceCurrencies}
            selectedValue={sourceCurrency}
            onSelect={(value) => dispatch(setSourceCurrency(value))}
          />

          <ConversionInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.swapContainer}>
            <TouchableOpacity
              onPress={handleSwap}
              style={styles.swapButton}
              accessibilityLabel="Swap currencies"
            >
              <Animated.Text style={[styles.swapIcon, animatedStyle]}>
                ⇅
              </Animated.Text>
            </TouchableOpacity>
          </View>

          <CurrencyDropdown
            label="To"
            options={destinationCurrencies}
            selectedValue={destinationCurrency}
            onSelect={(value) => dispatch(setDestinationCurrency(value))}
            searchable
          />

          <ConversionInput
            label="Converted Amount"
            value={convertedAmount}
            onChangeText={() => {}}
            editable={false}
          />

          {exchangeRate && (
            <View style={styles.rateContainer}>
              <Text style={styles.rateText}>
                1 {sourceCurrency} = {formatAmount(exchangeRate)}{" "}
                {destinationCurrency}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("History")}
          accessibilityLabel="View conversion history"
        >
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingSpinner visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  offlineBanner: {
    backgroundColor: "#ff9800",
    padding: 12,
    alignItems: "center",
  },
  offlineText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  swapContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  swapButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  swapIcon: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  rateContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    alignItems: "center",
  },
  rateText: {
    fontSize: 14,
    color: "#0284c7",
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#c00",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
  historyButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    minHeight: 56,
    justifyContent: "center",
  },
  historyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MainScreen;
