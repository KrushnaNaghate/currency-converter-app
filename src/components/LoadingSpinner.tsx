import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

interface LoadingSpinnerProps {
  visible: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default LoadingSpinner;
