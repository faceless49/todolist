import { TaskStateType } from "../../app/AppWithRedux";
import { TaskPriorities, TaskStatuses } from "../../api/todolist-api";
import { createSlice } from "@reduxjs/toolkit";
import { addTask, fetchTasks, removeTask, updateTask } from "./tasks-actions";
import {
  addTodolist,
  fetchTodolists,
  removeTodolist,
} from "./todolists-actions";

const initialState: TaskStateType = {};

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload.todolistId];
    });
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
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
