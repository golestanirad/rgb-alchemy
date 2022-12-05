import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { URL } from "../constants";
import { AlchemyInfo } from "./types";

export const fetchAlchemyInfo = createAsyncThunk<AlchemyInfo>(
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

export const fetchUserAlchemyInfo = createAsyncThunk<AlchemyInfo, string>(
  "alchemy/fetchUserAlchemyInfoForUser",
  async (userID, thunkAPI) => {
    try {
      const { data } = await axios.get(`${URL}/user/${userID}`);
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
