import { Dispatch } from "redux";
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

const initialState: Array<TodolistDomainType> = [];
enum ResponseStatusCodes {
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
    default:
      return state;
  }
};

// ** ===== Action Creators

export const removeTodoListAC = (todolistId: string) =>
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

// ** ===== THUNKS
export const fetchTodolistsTC = () => (
  dispatch: Dispatch<ActionsType>,
  getState: () => AppRootStateType
): void => {
  dispatch(setAppStatusAC("loading"));
  todolistApi.getTodos().then((res) => {
    let todos = res.data;
    dispatch(setTodosAC(todos));
    dispatch(setAppStatusAC("succeeded"));
  });
};

export const removeTodolistTC = (todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
  todolistApi.deleteTodo(todolistId).then((res) => {
    dispatch(removeTodoListAC(todolistId));
    dispatch(setAppStatusAC("succeeded"));
  });
};

export const addTodolistTC = (title: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi
    .createTodo(title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(addTodoListAC(res.data.data.item));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        //   if (res.data.messages[0]) {
        //     dispatch(setAppErrorAC(res.data.messages[0]));
        //   } else {
        //     dispatch(setAppErrorAC("Some Error"));
        //   }
        //   dispatch(setAppStatusAC("failed"));
        // }
        // *===== Generic function
        handleServerAppError<{ item: TodolistType }>(res.data, dispatch);
      }
    })
    .catch((res: AxiosError) => {
      handleServerNetworkError(dispatch, res.message);
    });
};

export const changeTodolistTitleTC = (title: string, todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi.updateTodolistTitle(todolistId, title).then((res) => {
    dispatch(changeTodolistTitleAC(title, todolistId));
    dispatch(setAppStatusAC("succeeded"));
  });
};

// * types

export type AddTodolistAT = ReturnType<typeof addTodoListAC>;
export type RemoveTodolistAT = ReturnType<typeof removeTodoListAC>;
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
  | ChangeTodolistEntityStatusActionType;
