import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CurrencyOption {
  code: string;
  name: string;
}

interface CurrencyDropdownProps {
  label: string;
  options: CurrencyOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
}

// Country flag emojis for source currencies
const FLAGS: { [key: string]: string } = {
  USD: "🇺🇸",
  HKD: "🇭🇰",
  MYR: "🇲🇾",
  SGD: "🇸🇬",
  JPY: "🇯🇵",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
};

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  searchable = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((opt) => opt.code === selectedValue);

  const filteredOptions = options.filter(
    (opt) =>
      opt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (code: string) => {
    onSelect(code);
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
        accessibilityLabel={`${label} dropdown`}
        accessibilityHint="Select currency"
      >
        <View style={styles.dropdownContent}>
          {FLAGS[selectedValue] && (
            <Text style={styles.flag}>{FLAGS[selectedValue]}</Text>
          )}
          <Text style={styles.selectedText}>
            {selectedOption
              ? `${selectedOption.code} - ${selectedOption.name}`
              : "Select"}
          </Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                accessibilityLabel="Close"
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {searchable && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search currency..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                accessibilityLabel="Search currencies"
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.code === selectedValue && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.code)}
                  accessibilityLabel={`${item.code} ${item.name}`}
                >
                  <View style={styles.optionContent}>
                    {FLAGS[item.code] && (
                      <Text style={styles.optionFlag}>{FLAGS[item.code]}</Text>
                    )}
                    <Text style={styles.optionText}>
                      {item.code} - {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
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
    marginBottom: 8,
    color: "#333",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minHeight: 56,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 24,
    color: "#666",
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    fontSize: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 56,
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CurrencyDropdown;
