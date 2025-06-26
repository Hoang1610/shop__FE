import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "./reducer/accountSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import orderReducer from "./reducer/order";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["account"],
};

// Kết hợp các reducer (nếu có nhiều reducer)
const rootReducer = combineReducers({
  account: accountReducer,
  order: orderReducer,
});

// Bọc rootReducer với persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình Redux Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các action type của redux-persist để tránh warning về non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tạo persistor
const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
