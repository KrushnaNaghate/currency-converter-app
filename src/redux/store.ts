import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import currencyReducer from "./slices/currencySlice";
import historyReducer from "./slices/historySlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["history", "currency"],
};

const rootReducer = combineReducers({
  currency: currencyReducer, //!doubt we need seperate ?
  history: historyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
