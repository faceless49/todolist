import {
  addTodoListAC,
  removeTodolistAC,
  setTodosAC,
} from "./todolistsReducer";
import { TaskStateType } from "../../app/AppWithRedux";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistApi,
  UpdateTaskModelType,
} from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { setAppStatusAC } from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    updateTaskAC: (
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainModelTaskType;
        todolistId: string;
      }>
    ) => {
      const task = state[action.payload.todolistId];
      const index = task.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        task[index] = { ...task[index], ...action.payload.model };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodoListAC, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.todolistId];
    });
    builder.addCase(setTodosAC, (state, action) => {
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
  },
});

const { updateTaskAC } = slice.actions;

export const tasksReducer = slice.reducer;

// * ===== THUNKS

export const updateTaskTC = (
  taskId: string,
  todolistId: string,
  domainModel: UpdateDomainModelTaskType
) => (dispatch: any, getState: () => AppRootStateType) => {
  const allTasksFromState = getState().tasks;
  const tasksForCurrentTodolist = allTasksFromState[todolistId];
  const task = tasksForCurrentTodolist.find((t) => {
    return t.id === taskId;
  });

  if (!task) {
    console.warn("task not found in the state");
    return;
  }
  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel,
  };
  dispatch(setAppStatusAC({ status: "loading" }));
  todolistApi
    .updateTask(todolistId, taskId, apiModel)
    .then((res) => {
      const action = updateTaskAC({
        taskId: taskId,
        model: domainModel,
        todolistId,
      });
      dispatch(action);
    })
    .catch((err: AxiosError) =>
      handleServerNetworkError(dispatch, { message: err.message })
    )
    .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
};

// types
export type UpdateDomainModelTaskType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
