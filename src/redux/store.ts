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

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
