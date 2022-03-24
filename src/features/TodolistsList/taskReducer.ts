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
  (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    return (
      todolistApi
        .getTasks(todolistId)
        .then((res) => {
          const tasks = res.data.items;
          // thunkAPI.dispatch(setTasksAC({ tasks, todolistId }));
          return { tasks, todolistId };
        })
        // .catch((err: AxiosError) =>
        //   handleServerNetworkError(thunkAPI.dispatch, { message: err.message })
        // )
        .finally(() =>
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
        )
    );
  }
);

export const removeTaskTC = createAsyncThunk(
  "task/removeTaskTC",
  (param: { taskId: string; todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }));
    todolistApi
      .deleteTask(param.todolistId, param.taskId)
      .then((res) => {
        thunkAPI.dispatch(
          removeTaskAC({ taskID: param.taskId, todolistId: param.todolistId })
        );
      })
      .catch((err: AxiosError) =>
        handleServerNetworkError(thunkAPI.dispatch, { message: err.message })
      )
      .finally(() =>
        thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
      );
  }
);

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    removeTaskAC: (
      state,
      action: PayloadAction<{ taskID: string; todolistId: string }>
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskID);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    },
    addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTaskAC: (
      state,
      action: PayloadAction<{
        taskID: string;
        model: UpdateDomainModelTaskType;
        todolistId: string;
      }>
    ) => {
      const task = state[action.payload.todolistId];
      const index = task.findIndex((t) => t.id === action.payload.taskID);
      if (index > -1) {
        task[index] = { ...task[index], ...action.payload.model };
      }
    },
    // setTasksAC: (
    //   state,
    //   action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    // ) => {
    //   state[action.payload.todolistId] = action.payload.tasks;
    // },
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
  },
});

const { removeTaskAC, addTaskAC, updateTaskAC /*setTasksAC*/ } = slice.actions;

export const tasksReducer = slice.reducer;

// * ===== THUNKS

// export const fetchTasksTC_ = (todolistId: string) => (dispatch: any) => {
//   dispatch(setAppStatusAC({ status: "loading" }));
//   todolistApi
//     .getTasks(todolistId)
//     .then((res) => {
//       const tasks = res.data.items;
//       const action = setTasksAC({ tasks, todolistId });
//       dispatch(action);
//     })
//     .catch((err: AxiosError) =>
//       handleServerNetworkError(dispatch, { message: err.message })
//     )
//     .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
// };

// export const removeTaskTC_ = (taskId: string, todolistId: string) => (
//   dispatch: any
// ) => {
//   dispatch(setAppStatusAC({ status: "loading" }));
//   todolistApi
//     .deleteTask(todolistId, taskId)
//     .then((res) => {
//       dispatch(removeTaskAC({ taskID: taskId, todolistId }));
//     })
//     .catch((err: AxiosError) =>
//       handleServerNetworkError(dispatch, { message: err.message })
//     )
//     .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
// };

export const addTaskTC = (title: string, todolistId: string) => (
  dispatch: any
) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  todolistApi
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        let task = res.data.data.item;
        const action = addTaskAC({ task });
        dispatch(action);
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((err: AxiosError) => {
      // dispatch(setAppErrorAC(res.message)); = Proxy Refactor
      // dispatch(setAppStatusAC("failed"));
      handleServerNetworkError(dispatch, { message: err.message });
    })
    .finally(() => {
      dispatch(setAppStatusAC({ status: "succeeded" }));
    });
};

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
        taskID: taskId,
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
