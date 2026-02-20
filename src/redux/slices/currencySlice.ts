import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { currencyApi } from "../../api/currencyApi";
import { Currency, CurrencyState } from "../../types/currency";
import type { RootState } from "../store";

const initialState: CurrencyState = {
  currencyPairs: [],
  sourceCurrencies: [],
  destinationCurrencies: [],
  selectedSource: null,
  selectedDestination: null,
  loading: false,
  error: null,
};

export const fetchCurrencyPairs = createAsyncThunk(
  "currency/fetchPairs",
  async () => {
    const pairs = await currencyApi.getCurrencyPairs();
    return pairs;
  },
);

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setSelectedSource: (state, action: PayloadAction<Currency>) => {
      state.selectedSource = action.payload;

      // Update destination currencies based on source
      const validDestinations = state.currencyPairs
        .filter((pair) => pair.source_currency_code === action.payload.code)
        .map((pair) => ({
          code: pair.destination_currency_code,
          name: pair.destination_currency_name,
        }));

      state.destinationCurrencies = validDestinations;

      // Reset destination if not valid
      if (
        !state.selectedDestination ||
        !validDestinations.find(
          (c) => c.code === state.selectedDestination?.code,
        )
      ) {
        state.selectedDestination = validDestinations[0] || null;
      }
    },
    setSelectedDestination: (state, action: PayloadAction<Currency>) => {
      state.selectedDestination = action.payload;
    },
    swapCurrencies: (state) => {
      if (state.selectedSource && state.selectedDestination) {
        const temp = state.selectedSource;
        state.selectedSource = state.selectedDestination;
        state.selectedDestination = temp;

        // Update destination currencies
        const validDestinations = state.currencyPairs
          .filter(
            (pair) => pair.source_currency_code === state.selectedSource!.code,
          )
          .map((pair) => ({
            code: pair.destination_currency_code,
            name: pair.destination_currency_name,
          }));
        state.destinationCurrencies = validDestinations;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyPairs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyPairs.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyPairs = action.payload;

        // Extract unique source currencies
        const sources = Array.from(
          new Set(action.payload.map((pair) => pair.source_currency_code)),
        ).map((code) => {
          const pair = action.payload.find(
            (p) => p.source_currency_code === code,
          );
          return {
            code,
            name: pair?.source_currency_name || code,
          };
        });
        //SOUCE dropdown options
        state.sourceCurrencies = sources;

        // Set default selections
        if (!state.selectedSource && sources.length > 0) {
          //source dropdown value set
          state.selectedSource =
            sources.find((c) => c.code === "SGD") || sources[0];
        }

        // Set destination currencies
        if (state.selectedSource) {
          //find pairs with selected source and map to destination dropdown options
          const destinations = action.payload
            .filter(
              (pair) =>
                pair.source_currency_code === state.selectedSource!.code,
            )
            .map((pair) => ({
              code: pair.destination_currency_code,
              name: pair.destination_currency_name,
            }));
          state.destinationCurrencies = destinations;
          //cehck usd or Set first destination if usd not found
          if (!state.selectedDestination && destinations.length > 0) {
            state.selectedDestination =
              destinations.find((c) => c.code === "USD") || destinations[0];
          }
        }
      })
      .addCase(fetchCurrencyPairs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch currency pairs";
      });
  },
});

export const {
  setSelectedSource,
  setSelectedDestination,
  swapCurrencies,
  clearError,
} = currencySlice.actions;

// Selectors
export const selectSourceCurrencies = (state: RootState) =>
  state.currency.sourceCurrencies;
export const selectDestinationCurrencies = (state: RootState) =>
  state.currency.destinationCurrencies;
export const selectSelectedSource = (state: RootState) =>
  state.currency.selectedSource;
export const selectSelectedDestination = (state: RootState) =>
  state.currency.selectedDestination;
export const selectCurrencyLoading = (state: RootState) =>
  state.currency.loading;
export const selectCurrencyError = (state: RootState) => state.currency.error;

export default currencySlice.reducer;
