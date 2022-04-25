import { asyncActions as tasksAsyncActions } from "./taskReducer";
import { TodolistsList } from "./TodolistsList";
import { asyncActions as todolistsAsyncActions } from "./todolistsReducer";
import { slice as todolistsSlice } from "./todolistsReducer";
import { slice as tasksSlice } from "./taskReducer";

const todolistsActions = {
  ...todolistsAsyncActions,
  ...todolistsSlice.actions,
};

const tasksActions = {
  ...tasksAsyncActions,
};
const todolistsReducer = todolistsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

export {
  tasksActions,
  todolistsActions,
  TodolistsList,
  todolistsReducer,
  tasksReducer,
};
