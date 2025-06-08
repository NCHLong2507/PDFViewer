import { configureStore } from "@reduxjs/toolkit";
import documentListReducer from "./documentListSlice";
import documentDetailReducer from "./documentDetailSlice";
export const store = configureStore({
  reducer: {
    ...documentListReducer,
    ...documentDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
