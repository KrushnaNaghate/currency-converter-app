import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearHistory } from "../redux/slices/historySlice";
import { RootState } from "../redux/store";
import { formatAmount, formatTimestamp } from "../utils/validators";

const HistoryScreen = () => {
  const dispatch = useDispatch();
  const { conversions } = useSelector((state: RootState) => state.history);

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyAmount}>
          {formatAmount(item.amount)} {item.fromCurrency}
        </Text>
        <Text style={styles.historyDate}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
      <View style={styles.conversionRow}>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.convertedAmount}>
          {formatAmount(item.convertedAmount)} {item.toCurrency}
        </Text>
      </View>
      <Text style={styles.rate}>
        Rate: 1 {item.fromCurrency} = {formatAmount(item.rate)}{" "}
        {item.toCurrency}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversion History</Text>
        {conversions.length > 0 && (
          <TouchableOpacity
            onPress={handleClearHistory}
            style={styles.clearButton}
            accessibilityLabel="Clear history"
          >
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {conversions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversion history yet</Text>
          <Text style={styles.emptySubtext}>
            Start converting currencies to see your history
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ff3b30",
    borderRadius: 6,
    minWidth: 80,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  clearText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  historyDate: {
    fontSize: 12,
    color: "#666",
  },
  conversionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  arrow: {
    fontSize: 20,
    color: "#007AFF",
    marginRight: 8,
  },
  convertedAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  rate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default HistoryScreen;
