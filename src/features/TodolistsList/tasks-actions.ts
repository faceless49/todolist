import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAppStatusAC } from "../../app/app-reducer";
import { todolistApi, UpdateTaskModelType } from "../../api/todolist-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { AppRootStateType } from "../../app/store";
import { UpdateDomainModelTaskType } from "./taskReducer";

enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const fetchTasks = createAsyncThunk(
  "task/fetchTasksTC",
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.getTasks(todolistId);
    const tasks = res.data.items;

    thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
    return { tasks, todolistId };
  }
);
export const removeTask = createAsyncThunk(
  "task/removeTaskTC",
  async (param: { taskId: string; todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.deleteTask(param.todolistId, param.taskId);

    return { taskId: param.taskId, todolistId: param.todolistId };
    // .catch((err: AxiosError) =>
    //   handleServerNetworkError(thunkAPI.dispatch, { message: err.message })
    // )
    // .finally(() =>
    //   thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
    // )
  }
);
export const addTask = createAsyncThunk(
  "task/addTaskTC",
  async (
    param: { title: string; todolistId: string },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistApi.createTask(param.todolistId, param.title);
      if (res.data.resultCode === ResponseStatusCodes.success) {
        const task = res.data.data.item;
        return task;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue({});
      }
    } catch (err) {
      handleServerNetworkError(dispatch, { message: err.message });
      return rejectWithValue({});
    }
  }
);
export const updateTask = createAsyncThunk(
  "task/updateTaskTC",
  async (
    param: {
      taskId: string;
      todolistId: string;
      domainModel: UpdateDomainModelTaskType;
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as AppRootStateType;
    const tasksForCurrentTodolist = state.tasks[param.todolistId];
    const task = tasksForCurrentTodolist.find((t) => {
      return t.id === param.taskId;
    });

    if (!task) {
      return rejectWithValue("task not found in the state");
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...param.domainModel,
    };
    dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.updateTask(
      param.todolistId,
      param.taskId,
      apiModel
    );
    try {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        return param;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue({});
      }
    } catch (err) {
      handleServerNetworkError(dispatch, { message: err.message });
      return rejectWithValue({});
    } finally {
      dispatch(setAppStatusAC({ status: "succeeded" }));
    }
  }
);
