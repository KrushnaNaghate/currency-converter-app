// Mock AsyncStorage (required by redux-persist)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock NetInfo (required by your offline detection)
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// Mock Expo vector icons to avoid font loading issues
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialIcons: View,
  };
});

// Suppress console noise
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
