import { todolistApi } from "../../api/todolist-api";
import { ThunkAction } from "redux-thunk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  handleAsyncServerAppError,
  handleAsyncServerNetworkError,
} from "../../utils/error-utils";
import { AppRootStateType, ThunkError } from "../../utils/types";
import { TodolistType } from "../../api/types";
import { RequestStatusType } from "../Application";
import { appActions } from "../CommonActions/AppCommonActions";

export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

const { setAppStatus } = appActions;

const fetchTodolists = createAsyncThunk<
  { todolists: TodolistType[] },
  undefined,
  ThunkError
>("todolist/fetchTodolists", async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistApi.getTodolists();
    thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
    return { todolists: res.data };
  } catch (error) {
    return handleAsyncServerNetworkError(error, thunkAPI);
  }
});
const removeTodolist = createAsyncThunk<
  { todolistId: string },
  { todolistId: string },
  ThunkError
>(
  "todolist/removeTodolist",
  async (param: { todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: "loading" }));
    thunkAPI.dispatch(
      changeTodolistEntityStatus({
        todolistId: param.todolistId,
        entityStatus: "loading",
      })
    );
    try {
      const res = await todolistApi.deleteTodolist(param.todolistId);
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId: param.todolistId };
    } catch (error) {
      return handleAsyncServerNetworkError(error, thunkAPI);
    }
  }
);
const addTodolist = createAsyncThunk<
  { todolist: TodolistType },
  string,
  ThunkError
>("todolist/addTodolist", async (title, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  const res = await todolistApi.createTodo(title);
  try {
    if (res.data.resultCode === ResponseStatusCodes.success) {
      return { todolist: res.data.data.item };
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI, false);
    }
  } catch (error) {
    return handleAsyncServerNetworkError(error, thunkAPI, false);
  }
});
const changeTodolistTitle = createAsyncThunk(
  "todolist/changeTodolistTitle",
  async (
    param: {
      title: string;
      todolistId: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistApi.updateTodolistTitle(
        param.todolistId,
        param.title
      );
      if (res.data.resultCode === ResponseStatusCodes.success) {
        thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
        return { todolistId: param.todolistId, title: param.title };
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI, false);
      }
    } catch (error) {
      return handleAsyncServerNetworkError(error, thunkAPI, false);
    }
  }
);

export const asyncActions = {
  fetchTodolists,
  addTodolist,
  removeTodolist,
  changeTodolistTitle,
};

export const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ key: FilterValueType; todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].filter = action.payload.key;
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{
        todolistId: string;
        entityStatus: RequestStatusType;
      }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].entityStatus = action.payload.entityStatus;
    },
    clearTodosData: () => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({
          ...tl,
          filter: "All",
          entityStatus: "idle",
        }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(
          (tl) => tl.id === action.payload.todolistId
        );
        if (index > -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.todolist,
          filter: "All",
          entityStatus: "idle",
        });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(
          (tl) => tl.id === action.payload.todolistId
        );
        state[index].title = action.payload.title;
      });
  },
});

export const {
  changeTodolistFilter,
  changeTodolistEntityStatus,
  clearTodosData,
} = slice.actions;

// ** ===== THUNKS

export type ThunkType = ThunkAction<
  void,
  AppRootStateType,
  unknown,
  ActionsType
>;

// * types

export type ChangeTodolistEntityStatusActionType = ReturnType<
  typeof changeTodolistEntityStatus
>;

export type FilterValueType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
export type ActionsType =
  | ReturnType<typeof changeTodolistFilter>
  | ChangeTodolistEntityStatusActionType
  | ReturnType<typeof clearTodosData>
  | ReturnType<typeof setAppStatus>;
