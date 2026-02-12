module.exports = {
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withSpring: jest.fn((value) => value),
  withTiming: jest.fn((value) => value),
  FadeInDown: { delay: jest.fn().mockReturnThis(), springify: jest.fn() },
  FadeInRight: { springify: jest.fn() },
};
