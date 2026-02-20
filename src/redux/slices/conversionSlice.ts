//? amount input, exchange rate fetching, rate caching, and history management

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { currencyApi } from "../../api/currencyApi";
import { ConversionHistory, ConversionState } from "../../types/currency";
import type { RootState } from "../store";

const initialState: ConversionState = {
  amount: "100",
  exchangeRate: null,
  convertedAmount: null,
  history: [],
  loading: false,
  error: null,
  cachedRates: {},
};

//? cache ex.  "USD-INR": { rate: 83.45, timestamp: 1708455600000 },

export const fetchExchangeRate = createAsyncThunk(
  "conversion/fetchRate",
  async (
    {
      sourceCurrency,
      destinationCurrency,
    }: { sourceCurrency: string; destinationCurrency: string },
    { getState },
  ) => {
    const state = getState() as RootState;
    const cacheKey = `${sourceCurrency}-${destinationCurrency}`;
    const cached = state.conversion.cachedRates[cacheKey];

    // Use cache if less than 5 minutes old
    if (cached && Date.now() - cached.timestamp < 300000) {
      return {
        source_currency: sourceCurrency,
        destination_currency: destinationCurrency,
        rate: cached.rate,
        date: new Date().toISOString(),
      };
    }

    const rate = await currencyApi.getExchangeRate(
      sourceCurrency,
      destinationCurrency,
    );
    return rate;
  },
);

const conversionSlice = createSlice({
  name: "conversion",
  initialState,
  reducers: {
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload;

      // Recalculate converted amount
      if (state.exchangeRate) {
        const numAmount = parseFloat(action.payload);
        if (!isNaN(numAmount) && numAmount > 0) {
          state.convertedAmount = numAmount * state.exchangeRate.rate;
        } else {
          state.convertedAmount = null;
        }
      }
    },
    addToHistory: (
      state,
      action: PayloadAction<{
        sourceCurrency: string;
        destinationCurrency: string;
        amount: number;
        result: number;
        rate: number;
      }>,
    ) => {
      const entry: ConversionHistory = {
        id: Date.now().toString(),
        sourceCurrency: action.payload.sourceCurrency,
        destinationCurrency: action.payload.destinationCurrency,
        amount: action.payload.amount,
        result: action.payload.result,
        rate: action.payload.rate,
        timestamp: Date.now(),
      };

      state.history = [entry, ...state.history].slice(0, 10);
    },
    clearConversionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRate = action.payload;

        // Calculate converted amount
        const numAmount = parseFloat(state.amount);
        if (!isNaN(numAmount) && numAmount > 0) {
          state.convertedAmount = numAmount * action.payload.rate;
        }

        // Cache the rate
        const cacheKey = `${action.payload.source_currency}-${action.payload.destination_currency}`;
        state.cachedRates[cacheKey] = {
          rate: action.payload.rate,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch exchange rate";
      });
  },
});

export const { setAmount, addToHistory, clearConversionError } =
  conversionSlice.actions;

// Selectors
export const selectAmount = (state: RootState) => state.conversion.amount;
export const selectExchangeRate = (state: RootState) =>
  state.conversion.exchangeRate;
export const selectConvertedAmount = (state: RootState) =>
  state.conversion.convertedAmount;
export const selectConversionLoading = (state: RootState) =>
  state.conversion.loading;
export const selectConversionError = (state: RootState) =>
  state.conversion.error;
export const selectHistory = (state: RootState) => state.conversion.history;

export default conversionSlice.reducer;
