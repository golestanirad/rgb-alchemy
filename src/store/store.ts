import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import alchemyReducer from "./alchemy/alchemySlice";

export const store = configureStore({
  reducer: {
    alchemy: alchemyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
