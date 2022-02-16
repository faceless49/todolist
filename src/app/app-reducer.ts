import { Dispatch } from "redux";
import { authAPI } from "../api/todolist-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { ResponseStatusCodes } from "../features/TodolistsList/todolistsReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatusAC(
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      state.status = action.payload.status;
    },
    setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppIsInitialized: (
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const {
  setAppStatusAC,
  setAppErrorAC,
  setAppIsInitialized,
} = slice.actions;

export const appReducer = slice.reducer;

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }));
      }
    })
    .finally(() => {
      dispatch(setAppIsInitialized({ isInitialized: true }));
    });
};
