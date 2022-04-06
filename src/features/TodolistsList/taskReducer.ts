import {
  addTodolistTC,
  fetchTodolistsTC,
  removeTodolistTC,
} from "./todolistsReducer";
import { TaskStateType } from "../../app/AppWithRedux";
import {
  TaskPriorities,
  TaskStatuses,
  todolistApi,
  UpdateTaskModelType,
} from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TaskStateType = {};
enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const fetchTasksTC = createAsyncThunk(
  "task/fetchTasksTC",
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    const res = await todolistApi.getTasks(todolistId);
    const tasks = res.data.items;

    thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }));
    return { tasks, todolistId };
  }
);

export const removeTaskTC = createAsyncThunk(
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

export const addTaskTC = createAsyncThunk(
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

export const updateTaskTC = createAsyncThunk(
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

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.todolistId];
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    });
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload);
    });
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId];
      const index = task.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        task[index] = { ...task[index], ...action.payload.domainModel };
      }
    });
  },
});

export const tasksReducer = slice.reducer;

// types
export type UpdateDomainModelTaskType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
