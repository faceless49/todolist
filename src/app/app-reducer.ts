import { authAPI } from "../api/todolist-api";
import { ResponseStatusCodes } from "../features/TodolistsList/todolistsReducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "../features/Login";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

const initializeAppTC = createAsyncThunk(
  "app/initializeApp",
  async (param, thunkAPI) => {
    const res = await authAPI.me();
    if (res.data.resultCode === ResponseStatusCodes.success) {
      thunkAPI.dispatch(authActions.setIsLoggedInAC({ isLoggedIn: true }));
    }
  }
);

export const asyncActions = {
  initializeAppTC,
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
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});

export const { setAppStatusAC, setAppErrorAC } = slice.actions;

export const appReducer = slice.reducer;

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;

type ActionsType =
  | SetAppErrorActionType
  | SetAppStatusActionType
  | ReturnType<typeof initializeAppTC>;
