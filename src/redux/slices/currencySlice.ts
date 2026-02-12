import NetInfo from "@react-native-community/netinfo";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrencyPairs, fetchExchangeRate } from "../../api/currencyApi";
import { CurrencyState } from "../../types/currency.types";

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

// Fetch currency pairs
export const loadCurrencyPairs = createAsyncThunk(
  "currency/loadPairs",
  async (_, { rejectWithValue }) => {
    try {
      const pairs = await fetchCurrencyPairs();
      return pairs;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// Fetch exchange rate
export const loadExchangeRate = createAsyncThunk(
  "currency/loadRate",
  async (
    { source, destination }: { source: string; destination: string },
    { rejectWithValue },
  ) => {
    try {
      const rate = await fetchExchangeRate(source, destination);
      return rate;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// Check network status
export const checkNetworkStatus = createAsyncThunk(
  "currency/checkNetwork",
  async () => {
    const state = await NetInfo.fetch();
    return state.isConnected || false;
  },
);

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setSourceCurrency: (state, action: PayloadAction<string>) => {
      state.sourceCurrency = action.payload;
    },
    setDestinationCurrency: (state, action: PayloadAction<string>) => {
      state.destinationCurrency = action.payload;
    },
    swapCurrencies: (state) => {
      const temp = state.sourceCurrency;
      state.sourceCurrency = state.destinationCurrency;
      state.destinationCurrency = temp;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load currency pairs
      .addCase(loadCurrencyPairs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCurrencyPairs.fulfilled, (state, action) => {
        state.loading = false;
        state.pairs = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(loadCurrencyPairs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load exchange rate
      .addCase(loadExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadExchangeRate.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRate = action.payload;
      })
      .addCase(loadExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check network status
      .addCase(checkNetworkStatus.fulfilled, (state, action) => {
        state.isOffline = !action.payload;
      });
  },
});

export const {
  setSourceCurrency,
  setDestinationCurrency,
  swapCurrencies,
  clearError,
} = currencySlice.actions;

export default currencySlice.reducer;
