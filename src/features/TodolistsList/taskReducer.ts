import { todolistApi } from "../../api/todolist-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  handleAsyncServerAppError,
  handleAsyncServerNetworkError,
} from "../../utils/error-utils";
import { asyncActions as asyncTodolistsActions } from "./todolistsReducer";
import { TaskStateType } from "../../app/App";
import { AppRootStateType, ThunkError } from "../../utils/types";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskModelType,
} from "../../api/types";
import { appActions } from "../CommonActions/AppCommonActions";
import { AxiosError } from "axios";

const initialState: TaskStateType = {};

enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const fetchTasks = createAsyncThunk<
  { tasks: TaskType[]; todolistId: string },
  string,
  ThunkError
>("task/fetchTasksTC", async (todolistId, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistApi.getTasks(todolistId);
    const tasks = res.data.items;
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { tasks, todolistId };
  } catch (error) {
    if (error instanceof AxiosError)
      return handleAsyncServerNetworkError(error, thunkAPI);
  }
});
export const removeTask = createAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string },
  ThunkError
>("task/removeTaskTC", async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistApi.deleteTask(param.todolistId, param.taskId);
    return { taskId: param.taskId, todolistId: param.todolistId };
  } catch (error) {
    if (error instanceof AxiosError)
      return handleAsyncServerNetworkError(error, thunkAPI);
  }
});

export const addTask = createAsyncThunk<
  TaskType,
  { title: string; todolistId: string },
  ThunkError
>("task/addTaskTC", async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistApi.createTask(param.todolistId, param.title);
    if (res.data.resultCode === ResponseStatusCodes.success) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return res.data.data.item;
    } else {
      handleAsyncServerAppError(res.data, thunkAPI, false);
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (error) {
    if (error instanceof AxiosError)
      return handleAsyncServerNetworkError(error, thunkAPI, false);
  }
});
export const updateTask = createAsyncThunk(
  "task/updateTaskTC",
  async (
    param: {
      taskId: string;
      todolistId: string;
      domainModel: UpdateDomainModelTaskType;
    },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as AppRootStateType;
    const tasksForCurrentTodolist = state.tasks[param.todolistId];
    const task = tasksForCurrentTodolist.find((t) => {
      return t.id === param.taskId;
    });

    if (!task) {
      return thunkAPI.rejectWithValue("task not found in the state");
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
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistApi.updateTask(
      param.todolistId,
      param.taskId,
      apiModel
    );
    try {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        return param;
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return handleAsyncServerNetworkError(error, thunkAPI);
    }
  }
);

export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
};

export const slice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodolistsActions.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(
        asyncTodolistsActions.removeTodolist.fulfilled,
        (state, action) => {
          delete state[action.payload.todolistId];
        }
      )
      .addCase(
        asyncTodolistsActions.fetchTodolists.fulfilled,
        (state, action) => {
          action.payload.todolists.forEach((tl) => {
            state[tl.id] = [];
          });
        }
      )
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) {
          tasks.splice(index, 1);
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const task = state[action.payload.todolistId];
        const index = task.findIndex((t) => t.id === action.payload.taskId);
        if (index > -1) {
          task[index] = { ...task[index], ...action.payload.domainModel };
        }
      });
  },
});

// types
export type UpdateDomainModelTaskType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
