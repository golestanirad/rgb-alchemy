import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { URL } from "../constants";

export const fetchAlchemyInfo = createAsyncThunk(
  "alchemy/fetchAlchemyInfo",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(URL);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        console.log("unexpected error: ", error);
      }
    }
  }
);
