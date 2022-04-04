import { Dispatch } from "redux";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  authAPI,
  FieldErrorType,
  LoginParamsType,
} from "../../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { clearTodosDataAC } from "../TodolistsList/todolistsReducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

const initialState = {
  isLoggedIn: false,
};

export const loginTC = createAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType,
  {
    rejectValue: {
      errors: Array<string>;
      fieldsErrors?: Array<FieldErrorType>;
    };
  }
>("auth/login", async (param: LoginParamsType, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === ResponseStatusCodes.success) {
      // thunkAPI.dispatch(setIsLoggedInAC({ isLoggedIn: true }));
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (err) {
    // @ts-ignore
    const error: AxiosError = err; //* TODO Support
    // @ts-ignore
    handleServerAppError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({
      errors: [error.message],
      fieldsErrors: undefined,
    });
  }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

export const { setIsLoggedInAC } = slice.actions;
export const authReducer = slice.reducer;

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

// *thunks
// export const loginTC_ = (data: LoginParamsType) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: "loading" }));
//   authAPI
//     .login(data)
//     .then((res) => {
//       if (res.data.resultCode === ResponseStatusCodes.success) {
//         dispatch(setIsLoggedInAC({ isLoggedIn: true }));
//         dispatch(setAppStatusAC({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((error) => {
//       handleServerAppError(error, dispatch);
//     });
// };
