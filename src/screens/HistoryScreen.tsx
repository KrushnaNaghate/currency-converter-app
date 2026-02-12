import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { selectHistory } from "../redux/slices/conversionSlice";
import { ConversionHistory } from "../types/currency";
import { getFlag } from "../utils/flags";
import { formatCurrency, formatDate } from "../utils/format";

export const HistoryScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const history = useSelector(selectHistory);

  const renderItem = ({
    item,
    index,
  }: {
    item: ConversionHistory;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={styles.historyItem}
    >
      <View style={styles.historyHeader}>
        <View style={styles.currencyPair}>
          <Text style={styles.flag}>{getFlag(item.sourceCurrency)}</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#9CA3AF" />
          <Text style={styles.flag}>{getFlag(item.destinationCurrency)}</Text>
          <Text style={styles.currencyText}>
            {item.sourceCurrency} → {item.destinationCurrency}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>

      <View style={styles.historyContent}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>You sent</Text>
          <Text style={styles.amount}>
            {formatCurrency(item.amount, item.sourceCurrency)}
          </Text>
        </View>

        <MaterialIcons name="arrow-downward" size={20} color="#3B82F6" />

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>They received</Text>
          <Text style={styles.convertedAmount}>
            {formatCurrency(item.result, item.destinationCurrency)}
          </Text>
        </View>
      </View>

      <View style={styles.rateContainer}>
        <MaterialIcons name="trending-up" size={14} color="#6B7280" />
        <Text style={styles.rateText}>
          Rate: 1 {item.sourceCurrency} = {item.rate.toFixed(4)}{" "}
          {item.destinationCurrency}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInRight.springify()} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Conversion History</Text>
          <Text style={styles.headerSubtitle}>
            {history.length}{" "}
            {history.length === 1 ? "conversion" : "conversions"}
          </Text>
        </View>
      </Animated.View>

      {/* History List */}
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons name="history" size={80} color="#E5E7EB" />
          </View>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySubtitle}>
            Your currency conversions will appear here
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyButtonText}>Start Converting</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  listContent: {
    padding: 20,
  },
  historyItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyHeader: {
    marginBottom: 16,
  },
  currencyPair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  flag: {
    fontSize: 24,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  historyContent: {
    alignItems: "center",
    gap: 12,
  },
  amountContainer: {
    width: "100%",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  convertedAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3B82F6",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  rateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
