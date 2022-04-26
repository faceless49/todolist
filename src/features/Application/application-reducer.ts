import { authAPI } from "../../api/todolist-api";
import { ResponseStatusCodes } from "../TodolistsList/todolistsReducer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authActions } from "../Login";
import { appActions } from "../CommonActions/AppCommonActions";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

const initializeApp = createAsyncThunk(
  "application/initializeApp",
  async (param, thunkAPI) => {
    const res = await authAPI.me();
    if (res.data.resultCode === ResponseStatusCodes.success) {
      thunkAPI.dispatch(authActions.setIsLoggedInAC({ isLoggedIn: true }));
    }
  }
);

export const asyncActions = {
  initializeApp,
};

export const slice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(appActions.setAppStatus, (state, action) => {
        state.status = action.payload.status;
      })
      .addCase(appActions.setAppError, (state, action) => {
        state.error = action.payload.error;
      })
      .addCase(initializeApp.fulfilled, (state) => {
        state.isInitialized = true;
      });
  },
});
