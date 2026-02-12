import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Currency } from "../types/currency";
import { getFlag } from "../utils/flags";

interface CurrencyDropdownProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  currencies,
  selectedCurrency,
  onSelect,
  label = "Select Currency",
  disabled = false,
  searchable = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const scale = useSharedValue(1);
  const modalOpacity = useSharedValue(0);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePress = () => {
    if (!disabled) {
      setModalVisible(true);
      modalOpacity.value = withTiming(1, { duration: 200 });
    }
  };

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    setModalVisible(false);
    setSearchTerm("");
    modalOpacity.value = withTiming(0);
  };

  const handleClose = () => {
    modalOpacity.value = withTiming(0);
    setTimeout(() => {
      setModalVisible(false);
      setSearchTerm("");
    }, 200);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.7}
          onPressIn={() => {
            scale.value = withSpring(0.98);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
        >
          {selectedCurrency ? (
            <View style={styles.selectedContainer}>
              <Text style={styles.flag}>{getFlag(selectedCurrency.code)}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.currencyCode}>{selectedCurrency.code}</Text>
                <Text style={styles.currencyName} numberOfLines={1}>
                  {selectedCurrency.name}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="language" size={24} color="#9CA3AF" />
              <Text style={styles.placeholder}>Select currency</Text>
            </View>
          )}
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#6B7280" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            <Pressable>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {searchable && (
                <View style={styles.searchContainer}>
                  <MaterialIcons
                    name="search"
                    size={20}
                    color="#9CA3AF"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search currencies..."
                    placeholderTextColor="#9CA3AF"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                </View>
              )}

              <FlatList
                data={filteredCurrencies}
                keyExtractor={(item) => item.code}
                style={styles.list}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.currencyItem,
                      selectedCurrency?.code === item.code &&
                        styles.currencyItemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.flag}>{getFlag(item.code)}</Text>
                    <View style={styles.textContainer}>
                      <Text style={styles.currencyCode}>{item.code}</Text>
                      <Text style={styles.currencyName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    {selectedCurrency?.code === item.code && (
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color="#3B82F6"
                      />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <MaterialIcons
                      name="search-off"
                      size={48}
                      color="#D1D5DB"
                    />
                    <Text style={styles.emptyText}>No currencies found</Text>
                  </View>
                }
              />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
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
    color: "#374151",
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    minHeight: 64,
  },
  buttonDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.6,
  },
  selectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  placeholderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  currencyName: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  placeholder: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#111827",
  },
  list: {
    maxHeight: 400,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  currencyItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
});
