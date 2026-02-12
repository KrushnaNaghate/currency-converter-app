import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversionHistory, HistoryState } from "../../types/currency";

const initialState: HistoryState = {
  conversions: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addConversion: (
      state,
      action: PayloadAction<Omit<ConversionHistory, "id">>,
    ) => {
      const newConversion: ConversionHistory = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
      };

      // Keep only last 10 conversions
      state.conversions = [newConversion, ...state.conversions].slice(0, 10);
    },
    clearHistory: (state) => {
      state.conversions = [];
    },
  },
});

export const { addConversion, clearHistory } = historySlice.actions;
export default historySlice.reducer;
