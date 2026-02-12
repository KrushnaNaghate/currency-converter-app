import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface OfflineBannerProps {
  visible: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  const translateY = useSharedValue(-100);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : -100, {
      damping: 20,
      stiffness: 150,
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <MaterialIcons name="wifi-off" size={20} color="#854D0E" />
      <Text style={styles.text}>You are offline. Using cached rates.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  text: {
    color: "#854D0E",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
});
