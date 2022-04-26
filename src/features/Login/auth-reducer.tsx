import { authAPI } from "../../api/todolist-api";
import { clearTodosData } from "../TodolistsList/todolistsReducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FieldErrorType, LoginParamsType } from "../../api/types";
import {
  handleAsyncServerAppError,
  handleAsyncServerNetworkError,
} from "../../utils/error-utils";
import { appActions } from "../CommonActions/AppCommonActions";

enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const login = createAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: {
      errors: Array<string>;
      fieldsErrors?: Array<FieldErrorType>;
    };
  }
>("auth/login", async (param: LoginParamsType, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === ResponseStatusCodes.success) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return;
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI);
    }
  } catch (error) {
    return handleAsyncServerNetworkError(error, thunkAPI);
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResponseStatusCodes.success) {
        thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
        thunkAPI.dispatch(clearTodosData());
        return;
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI);
      }
    } catch (error) {
      return handleAsyncServerNetworkError(error, thunkAPI);
    }
  }
);

export const asyncActions = {
  login,
  logout,
};

export const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      });
  },
});
