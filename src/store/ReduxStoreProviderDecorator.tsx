import { Provider } from "react-redux";
import React from "react";
import { v1 } from "uuid";
import { combineReducers, createStore } from "redux";
import { todolistsReducer } from "../features/TodolistsList/todolistsReducer";
import { tasksReducer } from "../features/TodolistsList/taskReducer";
import { AppRootStateType } from "../utils/types";
import { TaskPriorities, TaskStatuses } from "../api/types";

// export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) =>
// <Provider store={store}>{storyFn()}</Provider>

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todolistsReducer,
});

const initialGlobalState = {
  todoLists: [
    {
      id: "todolistId1",
      title: "What to Learn",
      filter: "All",
      addedDate: "",
      order: 0,
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "All",
      addedDate: "",
      order: 0,
    },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        id: v1(),
        title: "HTML&CSS",
        status: TaskStatuses.Completed,
        todolistId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatuses.Completed,
        todolistId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 1,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
    ["todolistId2"]: [
      {
        id: v1(),
        title: "NASDAQ",
        status: TaskStatuses.New,
        todolistId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "Amazon",
        status: TaskStatuses.Completed,
        todolistId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 1,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
  },
};

export const storyBookStore = createStore(
  rootReducer
  // initialGlobalState as AppRootStateType
);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
  <Provider store={storyBookStore}>{storyFn()}</Provider>
);
