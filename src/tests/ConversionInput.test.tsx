import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import ConversionInput from "../components/ConversionInput";

describe("ConversionInput", () => {
  it("renders correctly with label and placeholder", () => {
    const { getByText, getByPlaceholderText } = render(
      <ConversionInput label="Amount" value="" onChangeText={() => {}} />,
    );

    expect(getByText("Amount")).toBeTruthy();
    expect(getByPlaceholderText("0.00")).toBeTruthy();
  });

  it("accepts valid numeric input", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <ConversionInput label="Amount" value="" onChangeText={mockOnChange} />,
    );

    const input = getByPlaceholderText("0.00");
    fireEvent.changeText(input, "123.45");

    expect(mockOnChange).toHaveBeenCalledWith("123.45");
  });

  it("rejects invalid non-numeric input", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <ConversionInput label="Amount" value="" onChangeText={mockOnChange} />,
    );

    const input = getByPlaceholderText("0.00");
    fireEvent.changeText(input, "abc");

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("displays correct value", () => {
    const { getByDisplayValue } = render(
      <ConversionInput label="Amount" value="100" onChangeText={() => {}} />,
    );

    expect(getByDisplayValue("100")).toBeTruthy();
  });

  it("is disabled when editable is false", () => {
    const { getByPlaceholderText } = render(
      <ConversionInput
        label="Converted"
        value=""
        onChangeText={() => {}}
        editable={false}
      />,
    );

    const input = getByPlaceholderText("0.00");
    expect(input.props.editable).toBe(false);
  });
});
