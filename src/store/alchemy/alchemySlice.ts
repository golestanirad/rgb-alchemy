import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchAlchemyInfo } from "./thunks";
import { AlchemyInfo } from "./types";

interface InitialState {
  alchemyInfo: AlchemyInfo;
  isLoading: boolean;
}

const initialState: InitialState = {
  alchemyInfo: {
    userId: "",
    width: 0,
    height: 0,
    maxMoves: 0,
    target: [],
  },
  isLoading: false,
};

export const alchemySlice = createSlice({
  name: "alchemy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlchemyInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAlchemyInfo.fulfilled,
        (state, action: PayloadAction<AlchemyInfo>) => {
          state.isLoading = false;
          state.alchemyInfo = action.payload;
        }
      )
      .addCase(fetchAlchemyInfo.rejected, (state, action) => {
        state.isLoading = false;
        console.log("fetch github user info - error => ", action.payload);
      });
  },
});

//export const {} = alchemySlice.actions;

export default alchemySlice.reducer;
