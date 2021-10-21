import { v1 } from "uuid";
import { todolistApi, TodolistType } from "../api/todolist-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";

export type RemoveTodolistAT = {
  type: "REMOVE-TODOLIST";
  todolistID: string;
};

export type AddTodolistAT = {
  type: "ADD-TODOLIST";
  title: string;
  todoListID: string;
};

export type ChangeTodoListTitle = {
  type: "CHANGE-TODOLIST-TITLE";
  todoListID: string;
  title: string;
};

export type ChangeTodoListFilter = {
  type: "CHANGE-TODOLIST-FILTER";
  todoListID: string;
  key: FilterValueType;
};
export type SetTodosActionType = {
  type: "SET-TODOS";
  todolists: Array<TodolistDomainType>;
};

export type FilterValueType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
};

const initialState: Array<TodolistDomainType> = [];

export type TodoListsReducer =
  | AddTodolistAT
  | RemoveTodolistAT
  | ChangeTodoListTitle
  | ChangeTodoListFilter
  | SetTodosActionType;

export const todoListsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: TodoListsReducer
): TodolistDomainType[] => {
  switch (action.type) {
    case "SET-TODOS":
      return action.todolists.map((tl) => {
        return { ...tl, filter: "All" };
      });
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.todolistID);
    case "ADD-TODOLIST":
      const newTodoList: TodolistDomainType = {
        id: action.todoListID,
        title: action.title,
        filter: "All",
        addedDate: "",
        order: 0,
      };
      return [newTodoList, ...state];
    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) => {
        if (tl.id === action.todoListID) {
          return { ...tl, title: action.title };
        }
        return tl;
      });
    case "CHANGE-TODOLIST-FILTER": {
      const todolist = state.find((tl) => tl.id === action.todoListID);
      if (todolist) {
        todolist.filter = action.key;
      }
      return [...state];
    }
    default:
      return state;
  }
};

export const RemoveTodoListAC = (todolistID: string): RemoveTodolistAT => {
  return { type: "REMOVE-TODOLIST", todolistID: todolistID };
};

export const addTodoListAC = (title: string): AddTodolistAT => {
  return { type: "ADD-TODOLIST", title: title, todoListID: v1() };
};

export const changeTodoListTitleAC = (
  title: string,
  todoListID: string
): ChangeTodoListTitle => {
  return {
    type: "CHANGE-TODOLIST-TITLE",
    todoListID: todoListID,
    title: title,
  };
};

export const changeTodoListFilterAC = (
  key: FilterValueType,
  todoListID: string
): ChangeTodoListFilter => {
  return { type: "CHANGE-TODOLIST-FILTER", todoListID: todoListID, key: key };
};

export const setTodosAC = (
  todolists: Array<TodolistDomainType>
): SetTodosActionType => {
  return {
    type: "SET-TODOS",
    todolists,
  };
};

// THUNK

export const setTodolistsTC = () => (
  dispatch: Dispatch,
  getState: () => AppRootStateType
): void => {
  todolistApi.getTodos().then((res) => {
    let todos = res.data;
    dispatch(setTodosAC(todos));
  });
};
