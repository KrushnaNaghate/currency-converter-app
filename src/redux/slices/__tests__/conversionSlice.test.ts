import { configureStore } from "@reduxjs/toolkit";
import { ConversionState } from "../../../types/currency";
import conversionReducer, {
  addToHistory,
  clearConversionError,
  fetchExchangeRate,
  setAmount,
} from "../conversionSlice";

// Mock the API
jest.mock("../../../api/currencyApi", () => ({
  currencyApi: {
    getExchangeRate: jest.fn(() =>
      Promise.resolve({
        source_currency: "USD",
        destination_currency: "EUR",
        rate: 0.92,
        date: "2026-02-12",
      }),
    ),
  },
}));

describe("conversionSlice", () => {
  const initialState: ConversionState = {
    amount: "100",
    exchangeRate: null,
    convertedAmount: null,
    history: [],
    loading: false,
    error: null,
    cachedRates: {},
  };

  // Test 1: Should return initial state
  it("should return the initial state", () => {
    const state = conversionReducer(undefined, { type: "unknown" });

    expect(state.amount).toBe("100");
    expect(state.exchangeRate).toBeNull();
    expect(state.convertedAmount).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Test 2: setAmount action
  it("should handle setAmount", () => {
    const state = conversionReducer(initialState, setAmount("250"));

    expect(state.amount).toBe("250");
  });

  // Test 3: setAmount with exchange rate recalculates conversion
  it("should recalculate converted amount when amount changes and rate exists", () => {
    const stateWithRate: ConversionState = {
      ...initialState,
      exchangeRate: {
        source_currency: "USD",
        destination_currency: "EUR",
        rate: 0.92,
        date: "2026-02-12",
      },
    };

    const state = conversionReducer(stateWithRate, setAmount("100"));

    expect(state.amount).toBe("100");
    expect(state.convertedAmount).toBe(92); // 100 * 0.92
  });

  // Test 4: addToHistory action
  it("should add entry to history", () => {
    const historyEntry = {
      sourceCurrency: "USD",
      destinationCurrency: "EUR",
      amount: 100,
      result: 92,
      rate: 0.92,
    };

    const state = conversionReducer(initialState, addToHistory(historyEntry));

    expect(state.history).toHaveLength(1);
    expect(state.history[0].sourceCurrency).toBe("USD");
    expect(state.history[0].destinationCurrency).toBe("EUR");
    expect(state.history[0].amount).toBe(100);
    expect(state.history[0].result).toBe(92);
    expect(state.history[0].rate).toBe(0.92);
    expect(state.history[0].id).toBeDefined();
    expect(state.history[0].timestamp).toBeDefined();
  });

  // Test 5: History keeps only last 10 entries
  it("should keep only last 10 history entries", () => {
    let state = initialState;

    // Add 15 entries
    for (let i = 0; i < 15; i++) {
      state = conversionReducer(
        state,
        addToHistory({
          sourceCurrency: "USD",
          destinationCurrency: "EUR",
          amount: i,
          result: i * 0.92,
          rate: 0.92,
        }),
      );
    }

    expect(state.history).toHaveLength(10);
    // Most recent should be first (amount 14)
    expect(state.history[0].amount).toBe(14);
  });

  // Test 6: clearConversionError action
  it("should clear conversion error", () => {
    const stateWithError: ConversionState = {
      ...initialState,
      error: "Network error",
    };

    const state = conversionReducer(stateWithError, clearConversionError());

    expect(state.error).toBeNull();
  });

  // Test 7: fetchExchangeRate pending state
  it("should set loading to true when fetchExchangeRate is pending", () => {
    const action = { type: fetchExchangeRate.pending.type };
    const state = conversionReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Test 8: fetchExchangeRate fulfilled state
  it("should handle fetchExchangeRate fulfilled", async () => {
    const store = configureStore({
      reducer: {
        conversion: conversionReducer,
      },
    });

    const result = await store.dispatch(
      fetchExchangeRate({
        sourceCurrency: "USD",
        destinationCurrency: "EUR",
      }),
    );

    const state = store.getState().conversion;

    expect(state.loading).toBe(false);
    expect(state.exchangeRate).toBeDefined();
    expect(state.exchangeRate?.rate).toBe(0.92);
    expect(state.convertedAmount).toBe(92); // 100 * 0.92 (initial amount is 100)
    expect(state.error).toBeNull();
  });

  // Test 9: fetchExchangeRate caches rates
  it("should cache exchange rate after fetching", async () => {
    const store = configureStore({
      reducer: {
        conversion: conversionReducer,
      },
    });

    await store.dispatch(
      fetchExchangeRate({
        sourceCurrency: "USD",
        destinationCurrency: "EUR",
      }),
    );

    const state = store.getState().conversion;
    const cacheKey = "USD-EUR";

    expect(state.cachedRates[cacheKey]).toBeDefined();
    expect(state.cachedRates[cacheKey].rate).toBe(0.92);
    expect(state.cachedRates[cacheKey].timestamp).toBeDefined();
  });

  // Test 10: Invalid amount doesn't calculate conversion
  it("should not calculate converted amount for invalid input", () => {
    const stateWithRate: ConversionState = {
      ...initialState,
      exchangeRate: {
        source_currency: "USD",
        destination_currency: "EUR",
        rate: 0.92,
        date: "2026-02-12",
      },
    };

    const state = conversionReducer(stateWithRate, setAmount("abc"));

    expect(state.amount).toBe("abc");
    expect(state.convertedAmount).toBeNull();
  });
});
