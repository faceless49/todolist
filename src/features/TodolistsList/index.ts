import { asyncActions as tasksAsyncActions } from "./taskReducer";
import { TodolistsList } from "./TodolistsList";
import { asyncActions as todolistsAsyncActions } from "./todolistsReducer";
import { slice } from "./todolistsReducer";

const todolistsActions = {
  ...todolistsAsyncActions,
  ...slice.actions,
};

const tasksActions = {
  ...tasksAsyncActions,
};

export { tasksActions, todolistsActions, TodolistsList };
