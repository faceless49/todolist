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
import { clearTodosData } from "../TodolistsList/todolistsReducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const loginTC = createAsyncThunk<
  undefined,
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
      return;
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

export const logoutTC = createAsyncThunk(
  "auth/logout",
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResponseStatusCodes.success) {
        thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
        thunkAPI.dispatch(clearTodosData());
        return;
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
      }
    } catch (err) {
      const error: AxiosError = err;
      handleServerNetworkError(error, thunkAPI.dispatch(error));
      return thunkAPI.rejectWithValue({});
    }
  }
);

export const asyncActions = {
  loginTC,
  logoutTC,
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
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
  },
});

const { setIsLoggedInAC } = slice.actions;
export const authReducer = slice.reducer;

// * init state
// const initialState = {
//   isLoggedIn: false,
// };

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

// export const logoutTC_ = () => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: "loading" }));
//   authAPI
//     .logout()
//     .then((res) => {
//       if (res.data.resultCode === ResponseStatusCodes.success) {
//         dispatch(setIsLoggedInAC({ isLoggedIn: false }));
//         dispatch(setAppStatusAC({ status: "succeeded" }));
//         dispatch(clearTodosDataAC());
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch(error));
//     });
// };
