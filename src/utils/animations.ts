import { Easing, withSpring, withTiming } from "react-native-reanimated";

export const springConfig = {
  damping: 20,
  stiffness: 150,
  mass: 0.5,
};

export const timingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const animateSpring = (value: number) => {
  "worklet";
  return withSpring(value, springConfig);
};

export const animateTiming = (value: number) => {
  "worklet";
  return withTiming(value, timingConfig);
};
