import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAppStatusAC } from "../../app/app-reducer";
import { todolistApi, TodolistType } from "../../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import {
  changeTodolistEntityStatus,
  ResponseStatusCodes,
} from "./todolistsReducer";

export const fetchTodolists = createAsyncThunk(
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
export const removeTodolist = createAsyncThunk(
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
export const addTodolist = createAsyncThunk(
  "todolist/addTodolist",
  async (title: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.createTodo(title);
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
export const changeTodolistTitle = createAsyncThunk(
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
