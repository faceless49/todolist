import { todolistApi, TodolistType } from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import {
  RequestStatusType,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { fetchTasksTC } from "./taskReducer";
import { ThunkAction } from "redux-thunk";

const initialState: Array<TodolistDomainType> = [];
export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): TodolistDomainType[] => {
  switch (action.type) {
    case "SET-TODOS":
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.todolistId);
    case "ADD-TODOLIST":
      return [
        { ...action.todolist, filter: "All", entityStatus: "idle" },
        ...state,
      ];
    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, title: action.title } : tl
      );
    case "CHANGE-TODOLIST-FILTER":
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, filter: action.key } : tl
      );
    case "CHANGE-TODOLIST-ENTITY-TYPE":
      return state.map((tl) =>
        tl.id === action.todolistId
          ? { ...tl, entityStatus: action.entityStatus }
          : tl
      );
    case "CLEAR-DATA":
      return [];
    default:
      return state;
  }
};

// ** ===== Action Creators

export const removeTodolistAC = (todolistId: string) =>
  ({ type: "REMOVE-TODOLIST", todolistId } as const);

export const addTodoListAC = (todolist: TodolistType) =>
  ({ type: "ADD-TODOLIST", todolist } as const);

export const changeTodolistTitleAC = (title: string, todolistId: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    todolistId,
    title,
  } as const);

export const changeTodolistFilterAC = (
  key: FilterValueType,
  todolistId: string
) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    todolistId,
    key,
  } as const);

export const setTodosAC = (todolists: Array<TodolistDomainType>) =>
  ({
    type: "SET-TODOS",
    todolists,
  } as const);

export const changeTodolistEntityStatusAC = (
  todolistId: string,
  entityStatus: RequestStatusType
) =>
  ({
    type: "CHANGE-TODOLIST-ENTITY-TYPE",
    todolistId,
    entityStatus,
  } as const);

export const clearTodosDataAC = () => ({ type: "CLEAR-DATA" } as const);

// ** ===== THUNKS

export type ThunkType = ThunkAction<
  void,
  AppRootStateType,
  unknown,
  ActionsType
>;

export const fetchTodolistsTC = (): ThunkType => (
  dispatch,
  getState: () => AppRootStateType
): void => {
  dispatch(setAppStatusAC("loading"));
  todolistApi
    .getTodolists()
    .then((res) => {
      let todos = res.data;
      dispatch(setTodosAC(todos));
      return res.data;
    })
    .then((todos) => {
      todos.forEach((tl) => {
        dispatch(fetchTasksTC(tl.id));
      });
    })
    .catch((err: AxiosError) => handleServerNetworkError(dispatch, err.message))
    .finally(() => dispatch(setAppStatusAC("succeeded")));
};

export const removeTodolistTC = (todolistId: string): ThunkType => {
  return (dispatch) => {
    dispatch(setAppStatusAC("loading"));
    dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
    todolistApi
      .deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === ResponseStatusCodes.success) {
          dispatch(removeTodolistAC(todolistId));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((err: AxiosError) =>
        handleServerNetworkError(dispatch, err.message)
      )
      .finally(() => dispatch(setAppStatusAC("succeeded")));
  };
};

export const addTodolistTC = (title: string): ThunkType => (dispatch) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi
    .createTodo(title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(addTodoListAC(res.data.data.item));
      } else {
        //   if (res.data.messages[0]) {
        //     dispatch(setAppErrorAC(res.data.messages[0]));
        //   } else {
        //     dispatch(setAppErrorAC("Some Error"));
        //   }
        //   dispatch(setAppStatusAC("failed"));
        // }
        // *===== Generic function
        handleServerAppError<{ item: TodolistType }>(res.data, dispatch); // You can delete <T>.
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    })
    .finally(() => dispatch(setAppStatusAC("succeeded")));
};

export const changeTodolistTitleTC = (
  title: string,
  todolistId: string
): ThunkType => (dispatch) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi
    .updateTodolistTitle(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(changeTodolistTitleAC(title, todolistId));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    })
    .finally(() => dispatch(setAppStatusAC("succeeded")));
};

// * types

export type AddTodolistAT = ReturnType<typeof addTodoListAC>;
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>;
export type SetTodosActionType = ReturnType<typeof setTodosAC>;
export type ChangeTodolistEntityStatusActionType = ReturnType<
  typeof changeTodolistEntityStatusAC
>;

export type FilterValueType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
export type ActionsType =
  | AddTodolistAT
  | RemoveTodolistAT
  | SetTodosActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetAppStatusActionType
  | SetAppErrorActionType
  | ChangeTodolistEntityStatusActionType
  | ReturnType<typeof clearTodosDataAC>;
