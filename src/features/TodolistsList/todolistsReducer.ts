import { todolistApi, TodolistType } from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { ThunkAction } from "redux-thunk";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const fetchTodolistsTC = createAsyncThunk(
  "todolist/fetchTodolistsTC",
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

export const removeTodolistTC = createAsyncThunk(
  "todolist/removeTodolistTC",
  async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      changeTodolistEntityStatusAC({
        todolistId: param.todolistId,
        entityStatus: "loading",
      })
    );
    const res = await todolistApi.deleteTodolist(param.todolistId);
    dispatch(setAppStatusAC({ status: "succeeded" }));
    return { todolistId: param.todolistId };
  }
);

export const addTodolistTC = createAsyncThunk(
  "todolist/addTodolistTC",
  async (param: { title: string }, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.createTodo(param.title);
    try {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError<{ item: TodolistType }>(res.data, dispatch);
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

export const changeTodolistTitleTC = createAsyncThunk(
  "todolist/changeTodolistTitleTC",
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

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilterAC: (
      state,
      action: PayloadAction<{ key: FilterValueType; todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].filter = action.payload.key;
    },
    changeTodolistEntityStatusAC: (
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
    clearTodosDataAC: (state, action: PayloadAction) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    });
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].title = action.payload.title;
    });
  },
});

export const {
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
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
  typeof changeTodolistEntityStatusAC
>;

export type FilterValueType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
export type ActionsType =
  | ReturnType<typeof changeTodolistFilterAC>
  | ChangeTodolistEntityStatusActionType
  | ReturnType<typeof clearTodosDataAC>
  | ReturnType<typeof setAppStatusAC>;
