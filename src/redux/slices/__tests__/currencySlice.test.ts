import { configureStore } from "@reduxjs/toolkit";
import { CurrencyState } from "../../../types/currency";
import currencyReducer, {
  clearError,
  fetchCurrencyPairs,
  setSelectedDestination,
  setSelectedSource,
  swapCurrencies,
} from "../currencySlice";

// Mock the API
jest.mock("../../../api/currencyApi", () => ({
  currencyApi: {
    getCurrencyPairs: jest.fn(() =>
      Promise.resolve([
        {
          source_currency_code: "USD",
          source_currency_name: "US Dollar",
          destination_currency_code: "EUR",
          destination_currency_name: "Euro",
        },
        {
          source_currency_code: "USD",
          source_currency_name: "US Dollar",
          destination_currency_code: "GBP",
          destination_currency_name: "British Pound",
        },
      ]),
    ),
  },
}));

describe("currencySlice", () => {
  const initialState: CurrencyState = {
    currencyPairs: [],
    sourceCurrencies: [],
    destinationCurrencies: [],
    selectedSource: null,
    selectedDestination: null,
    loading: false,
    error: null,
  };

  // Test 1: Initial state
  it("should return the initial state", () => {
    const state = currencyReducer(undefined, { type: "unknown" });

    expect(state.currencyPairs).toEqual([]);
    expect(state.sourceCurrencies).toEqual([]);
    expect(state.selectedSource).toBeNull();
    expect(state.loading).toBe(false);
  });

  // Test 2: setSelectedSource
  it("should set selected source currency", () => {
    const stateWithData: CurrencyState = {
      ...initialState,
      currencyPairs: [
        {
          source_currency_code: "USD",
          source_currency_name: "US Dollar",
          destination_currency_code: "EUR",
          destination_currency_name: "Euro",
        },
      ],
    };

    const currency = { code: "USD", name: "US Dollar" };
    const state = currencyReducer(stateWithData, setSelectedSource(currency));

    expect(state.selectedSource).toEqual(currency);
  });

  // Test 3: setSelectedDestination
  it("should set selected destination currency", () => {
    const currency = { code: "EUR", name: "Euro" };
    const state = currencyReducer(
      initialState,
      setSelectedDestination(currency),
    );

    expect(state.selectedDestination).toEqual(currency);
  });

  // Test 4: swapCurrencies
  it("should swap source and destination currencies", () => {
    const stateWithSelections: CurrencyState = {
      ...initialState,
      currencyPairs: [
        {
          source_currency_code: "USD",
          source_currency_name: "US Dollar",
          destination_currency_code: "EUR",
          destination_currency_name: "Euro",
        },
        {
          source_currency_code: "EUR",
          source_currency_name: "Euro",
          destination_currency_code: "USD",
          destination_currency_name: "US Dollar",
        },
      ],
      selectedSource: { code: "USD", name: "US Dollar" },
      selectedDestination: { code: "EUR", name: "Euro" },
    };

    const state = currencyReducer(stateWithSelections, swapCurrencies());

    expect(state.selectedSource?.code).toBe("EUR");
    expect(state.selectedDestination?.code).toBe("USD");
  });

  // Test 5: clearError
  it("should clear error", () => {
    const stateWithError: CurrencyState = {
      ...initialState,
      error: "Network error",
    };

    const state = currencyReducer(stateWithError, clearError());

    expect(state.error).toBeNull();
  });

  // Test 6: fetchCurrencyPairs pending
  it("should set loading to true when fetching currency pairs", () => {
    const action = { type: fetchCurrencyPairs.pending.type };
    const state = currencyReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Test 7: fetchCurrencyPairs fulfilled
  it("should handle fetchCurrencyPairs fulfilled", async () => {
    const store = configureStore({
      reducer: {
        currency: currencyReducer,
      },
    });

    await store.dispatch(fetchCurrencyPairs());
    const state = store.getState().currency;

    expect(state.loading).toBe(false);
    expect(state.currencyPairs.length).toBeGreaterThan(0);
    expect(state.sourceCurrencies.length).toBeGreaterThan(0);
    expect(state.error).toBeNull();
  });
});
