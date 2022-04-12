import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAppStatusAC } from "../../app/app-reducer";
import { todolistApi, TodolistType } from "../../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import {
  changeTodolistEntityStatusAC,
  ResponseStatusCodes,
} from "./todolistsReducer";

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
