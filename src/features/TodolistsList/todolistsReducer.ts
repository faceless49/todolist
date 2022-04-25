import { todolistApi, TodolistType } from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import { ThunkAction } from "redux-thunk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";

export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

const fetchTodolists = createAsyncThunk(
  "todolist/fetchTodolists",
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.getTodolists();
    try {
      thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (error) {
      handleServerNetworkError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue("Error");
    }
  }
);
const removeTodolist = createAsyncThunk(
  "todolist/removeTodolist",
  async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      changeTodolistEntityStatus({
        todolistId: param.todolistId,
        entityStatus: "loading",
      })
    );
    const res = await todolistApi.deleteTodolist(param.todolistId);
    dispatch(setAppStatusAC({ status: "succeeded" }));
    return { todolistId: param.todolistId };
  }
);
const addTodolist = createAsyncThunk(
  "todolist/addTodolist",
  async (title: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.createTodo(title);
    try {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue("Error");
      }
    } catch (error) {
      handleServerNetworkError(dispatch, error);
      return rejectWithValue("Error");
    } finally {
      dispatch(setAppStatusAC({ status: "succeeded" }));
    }
  }
);
const changeTodolistTitle = createAsyncThunk(
  "todolist/changeTodolistTitle",
  async (
    param: {
      title: string;
      todolistId: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.updateTodolistTitle(
      param.todolistId,
      param.title
    );

    try {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        return { todolistId: param.todolistId, title: param.title };
      } else {
        // @ts-ignore
        handleServerAppError(res.data, dispatch);
        return rejectWithValue("Error");
      }
    } catch (err) {
      handleServerNetworkError(dispatch, err);
      return rejectWithValue("Error");
    } finally {
      dispatch(setAppStatusAC({ status: "succeeded" }));
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
    clearTodosData: (state, action: PayloadAction) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    });
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
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
export const todolistsReducer = slice.reducer;

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
  | ReturnType<typeof setAppStatusAC>;
