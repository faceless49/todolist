import { Dispatch } from "redux";
import { setAppStatusAC } from "../../app/app-reducer";
import { authAPI, LoginParamsType } from "../../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { clearTodosDataAC } from "../TodolistsList/todolistsReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const { setIsLoggedInAC } = slice.actions;
export const authReducer = slice.reducer;

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerAppError(error, dispatch);
    });
};

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: false }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
        dispatch(clearTodosDataAC());
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch(error));
    });
};
