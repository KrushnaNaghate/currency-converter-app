import { fireEvent, render } from "@testing-library/react-native";

// Mock react-native-reanimated BEFORE importing the component
jest.mock("react-native-reanimated", () => {
  const RN = require("react-native");

  return {
    __esModule: true,
    default: {
      View: RN.View,
      Text: RN.Text,
      ScrollView: RN.ScrollView,
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((value) => value),
    withTiming: jest.fn((value) => value),
  };
});

// Mock MaterialIcons
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

// NOW import the component AFTER mocks
import { AmountInput } from "../AmountInput";

describe("AmountInput Component", () => {
  it("should render correctly with default props", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <AmountInput value="" onChange={mockOnChange} />,
    );

    expect(getByPlaceholderText("0.00")).toBeTruthy();
    expect(getByText("Amount")).toBeTruthy();
  });

  it("should display the provided value", () => {
    const mockOnChange = jest.fn();
    const { getByDisplayValue } = render(
      <AmountInput value="123.45" onChange={mockOnChange} />,
    );

    expect(getByDisplayValue("123.45")).toBeTruthy();
  });

  it("should call onChange when text is entered", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput value="" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("0.00");
    fireEvent.changeText(input, "100");

    expect(mockOnChange).toHaveBeenCalledWith("100");
  });

  it("should filter out non-numeric characters except decimal point", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput value="" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("0.00");
    fireEvent.changeText(input, "abc123.45xyz");

    expect(mockOnChange).toHaveBeenCalled();
    const calledValue = mockOnChange.mock.calls[0][0];
    expect(calledValue).toMatch(/^[0-9.]+$/);
  });

  it("should prevent multiple decimal points", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput value="" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("0.00");
    fireEvent.changeText(input, "10.5.3");

    expect(mockOnChange).toHaveBeenCalled();
    const calledValue = mockOnChange.mock.calls[0][0];
    const decimalCount = (calledValue.match(/\./g) || []).length;
    expect(decimalCount).toBeLessThanOrEqual(1);
  });

  it("should show currency code", () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <AmountInput value="100" onChange={mockOnChange} currencyCode="EUR" />,
    );

    expect(getByText("EUR")).toBeTruthy();
  });

  it("should show custom label", () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <AmountInput value="" onChange={mockOnChange} label="Enter Amount" />,
    );

    expect(getByText("Enter Amount")).toBeTruthy();
  });

  it("should show error message", () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <AmountInput value="" onChange={mockOnChange} error="Invalid amount" />,
    );

    expect(getByText("Invalid amount")).toBeTruthy();
  });

  it("should disable input when disabled", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput value="" onChange={mockOnChange} disabled={true} />,
    );

    const input = getByPlaceholderText("0.00");
    expect(input.props.editable).toBe(false);
  });
});
