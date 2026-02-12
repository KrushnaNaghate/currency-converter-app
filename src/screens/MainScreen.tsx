import { MaterialIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect } from "react";
import {
  RefreshControl,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AmountInput } from "../components/AmountInput";
import { ConversionResult } from "../components/ConversionResult";
import { CurrencyDropdown } from "../components/CurrencyDropdown";
import { ErrorView } from "../components/ErrorView";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { OfflineBanner } from "../components/OfflineBanner";
import {
  addToHistory,
  clearConversionError,
  fetchExchangeRate,
  selectAmount,
  selectConversionError,
  selectConversionLoading,
  selectConvertedAmount,
  selectExchangeRate,
  setAmount,
} from "../redux/slices/conversionSlice";
import {
  clearError,
  fetchCurrencyPairs,
  selectCurrencyError,
  selectCurrencyLoading,
  selectDestinationCurrencies,
  selectSelectedDestination,
  selectSelectedSource,
  selectSourceCurrencies,
  setSelectedDestination,
  setSelectedSource,
  swapCurrencies,
} from "../redux/slices/currencySlice";
import { AppDispatch } from "../redux/store";

export const MainScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOnline, setIsOnline] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const sourceCurrencies = useSelector(selectSourceCurrencies);
  const destinationCurrencies = useSelector(selectDestinationCurrencies);
  const selectedSource = useSelector(selectSelectedSource);
  const selectedDestination = useSelector(selectSelectedDestination);
  const currencyLoading = useSelector(selectCurrencyLoading);
  const currencyError = useSelector(selectCurrencyError);
  const amount = useSelector(selectAmount);
  const exchangeRate = useSelector(selectExchangeRate);
  const convertedAmount = useSelector(selectConvertedAmount);
  const conversionLoading = useSelector(selectConversionLoading);
  const conversionError = useSelector(selectConversionError);

  const swapRotation = useSharedValue(0);

  // Network status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch currency pairs on mount
  useEffect(() => {
    if (sourceCurrencies.length === 0) {
      dispatch(fetchCurrencyPairs());
    }
  }, [dispatch, sourceCurrencies.length]);

  // Fetch exchange rate when currencies change
  useEffect(() => {
    if (selectedSource && selectedDestination && isOnline) {
      dispatch(
        fetchExchangeRate({
          sourceCurrency: selectedSource.code,
          destinationCurrency: selectedDestination.code,
        }),
      );
    }
  }, [dispatch, selectedSource, selectedDestination, isOnline]);

  // Save to history when conversion completes
  useEffect(() => {
    if (
      convertedAmount !== null &&
      selectedSource &&
      selectedDestination &&
      exchangeRate
    ) {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount) && numericAmount > 0) {
        dispatch(
          addToHistory({
            sourceCurrency: selectedSource.code,
            destinationCurrency: selectedDestination.code,
            amount: numericAmount,
            result: convertedAmount,
            rate: exchangeRate.rate,
          }),
        );
      }
    }
  }, [convertedAmount]);

  const handleSwap = () => {
    swapRotation.value = withSpring(swapRotation.value + 180, {
      damping: 20,
      stiffness: 150,
    });
    dispatch(swapCurrencies());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedSource && selectedDestination) {
      await dispatch(
        fetchExchangeRate({
          sourceCurrency: selectedSource.code,
          destinationCurrency: selectedDestination.code,
        }),
      );
    }
    setRefreshing(false);
  };

  const handleRetryCurrency = () => {
    dispatch(clearError());
    dispatch(fetchCurrencyPairs());
  };

  const handleRetryExchangeRate = () => {
    dispatch(clearConversionError());
    if (selectedSource && selectedDestination) {
      dispatch(
        fetchExchangeRate({
          sourceCurrency: selectedSource.code,
          destinationCurrency: selectedDestination.code,
        }),
      );
    }
  };

  const swapButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${swapRotation.value}deg` }],
    };
  });

  const quickAmounts = [10, 50, 100, 500];

  // Loading state
  if (currencyLoading && sourceCurrencies.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner size={60} />
      </SafeAreaView>
    );
  }

  // Error state
  if (currencyError && sourceCurrencies.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={currencyError} onRetry={handleRetryCurrency} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner visible={!isOnline} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Currency Converter</Text>
            <Text style={styles.subtitle}>Get live exchange rates</Text>
          </View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("History")}
            activeOpacity={0.8}
          >
            <MaterialIcons name="history" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View
            style={[styles.statusDot, isOnline && styles.statusDotOnline]}
          />
          <Text style={styles.statusText}>
            {isOnline ? "Live rates" : "Offline mode"}
          </Text>
        </View>

        {/* Main Converter Card */}
        <View style={styles.converterCard}>
          {/* Source Currency */}
          <CurrencyDropdown
            label="From"
            currencies={sourceCurrencies}
            selectedCurrency={selectedSource}
            onSelect={(currency) => dispatch(setSelectedSource(currency))}
            searchable
          />

          {/* Swap Button */}
          <View style={styles.swapContainer}>
            <Animated.View style={swapButtonStyle}>
              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwap}
                activeOpacity={0.8}
              >
                <MaterialIcons name="swap-vert" size={28} color="#3B82F6" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Destination Currency */}
          <CurrencyDropdown
            label="To"
            currencies={destinationCurrencies}
            selectedCurrency={selectedDestination}
            onSelect={(currency) => dispatch(setSelectedDestination(currency))}
            searchable
          />

          {/* Amount Input */}
          <AmountInput
            value={amount}
            onChange={(value) => dispatch(setAmount(value))}
            currencyCode={selectedSource?.code}
            error={conversionError || undefined}
          />

          {/* Conversion Result */}
          {selectedSource && selectedDestination && (
            <>
              {conversionError && !exchangeRate ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons
                    name="error-outline"
                    size={24}
                    color="#EF4444"
                  />
                  <Text style={styles.errorText}>{conversionError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRetryExchangeRate}
                  >
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ConversionResult
                  sourceCurrency={selectedSource.code}
                  destinationCurrency={selectedDestination.code}
                  amount={amount}
                  convertedAmount={convertedAmount}
                  exchangeRate={exchangeRate?.rate || null}
                  loading={conversionLoading}
                />
              )}
            </>
          )}

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsContainer}>
            <Text style={styles.quickAmountsLabel}>Quick amounts:</Text>
            <View style={styles.quickAmountsButtons}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => dispatch(setAmount(quickAmount.toString()))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickAmountText}>{quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <MaterialIcons name="verified-user" size={16} color="#10B981" />
          <Text style={styles.footerText}>
            Powered by real-time exchange rates
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  historyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
  },
  statusDotOnline: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  converterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  swapContainer: {
    alignItems: "center",
    marginVertical: 8,
    zIndex: 1,
  },
  swapButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAmountsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  quickAmountsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  quickAmountsButtons: {
    flexDirection: "row",
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
