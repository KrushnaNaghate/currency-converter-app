import currencyReducer, {
  clearError,
  setDestinationCurrency,
  setSourceCurrency,
  swapCurrencies,
} from "../redux/slices/currencySlice";
import { CurrencyState } from "../types/currency";

describe("currencySlice", () => {
  const initialState: CurrencyState = {
    pairs: [],
    sourceCurrency: "SGD",
    destinationCurrency: "INR",
    exchangeRate: null,
    loading: false,
    error: null,
    isOffline: false,
    lastFetched: null,
  };

  it("should handle initial state", () => {
    expect(currencyReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("should handle setSourceCurrency", () => {
    const actual = currencyReducer(initialState, setSourceCurrency("USD"));
    expect(actual.sourceCurrency).toEqual("USD");
  });

  it("should handle setDestinationCurrency", () => {
    const actual = currencyReducer(initialState, setDestinationCurrency("EUR"));
    expect(actual.destinationCurrency).toEqual("EUR");
  });

  it("should handle swapCurrencies", () => {
    const actual = currencyReducer(initialState, swapCurrencies());
    expect(actual.sourceCurrency).toEqual("INR");
    expect(actual.destinationCurrency).toEqual("SGD");
  });

  it("should handle clearError", () => {
    const stateWithError = {
      ...initialState,
      error: "Something went wrong",
    };
    const actual = currencyReducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });

  it("should swap currencies correctly multiple times", () => {
    let state = currencyReducer(initialState, swapCurrencies());
    expect(state.sourceCurrency).toEqual("INR");
    expect(state.destinationCurrency).toEqual("SGD");

    state = currencyReducer(state, swapCurrencies());
    expect(state.sourceCurrency).toEqual("SGD");
    expect(state.destinationCurrency).toEqual("INR");
  });
});
