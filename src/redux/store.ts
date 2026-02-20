import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import conversionReducer from "./slices/conversionSlice";
import currencyReducer from "./slices/currencySlice";

//configured redux store with persistence for currency pairs and conversion history.
const currencyPersistConfig = {
  key: "currency",
  storage: AsyncStorage,
  whitelist: ["currencyPairs", "sourceCurrencies"],
};

const conversionPersistConfig = {
  key: "conversion",
  storage: AsyncStorage,
  whitelist: ["history", "cachedRates"],
};
// currency slice: currency pairs and selections are persisted.
// conversion slice: amount, last rate, and history are persisted

const rootReducer = combineReducers({
  currency: persistReducer(currencyPersistConfig, currencyReducer),
  conversion: persistReducer(conversionPersistConfig, conversionReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
//! flush for Forces all pending state writes to storage immediately.
//! rehydrate for Triggered when persisted state is loaded from AsyncStorage and merged back.
//! PAUSE for Temporarily stops persistence.
//! PERSIST for Starts persistence.
//! PURGE for Deletes persisted storage completely.

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
