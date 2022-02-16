import { todolistApi, TodolistType } from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { fetchTasksTC } from "./taskReducer";
import { ThunkAction } from "redux-thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [];
export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

const slice = createSlice({
  name: "todolist",
  initialState,
  reducers: {
    removeTodolistAC: (
      state,
      action: PayloadAction<{ todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    addTodoListAC: (
      state,
      action: PayloadAction<{ todolist: TodolistType }>
    ) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    },
    changeTodolistTitleAC: (
      state,
      action: PayloadAction<{ title: string; todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].title = action.payload.title;
    },
    changeTodolistFilterAC: (
      state,
      action: PayloadAction<{ key: FilterValueType; todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].filter = action.payload.key;
    },
    setTodosAC: (
      state,
      action: PayloadAction<{ todolists: Array<TodolistDomainType> }>
    ) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    },
    changeTodolistEntityStatusAC: (
      state,
      action: PayloadAction<{
        todolistId: string;
        entityStatus: RequestStatusType;
      }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].entityStatus = action.payload.entityStatus;
    },
    clearTodosDataAC: (state, action: PayloadAction) => {
      return [];
    },
  },
});

export const {
  removeTodolistAC,
  addTodoListAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  setTodosAC,
  changeTodolistEntityStatusAC,
  clearTodosDataAC,
} = slice.actions;
export const todolistsReducer = slice.reducer;

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
  dispatch(setAppStatusAC({ status: "loading" }));
  todolistApi
    .getTodolists()
    .then((res) => {
      let todos = res.data;
      dispatch(setTodosAC({ todolists: todos }));
      return res.data;
    })
    .then((todos) => {
      todos.forEach((tl) => {
        dispatch(fetchTasksTC(tl.id));
      });
    })
    .catch((err: AxiosError) => handleServerNetworkError(dispatch, err))
    .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
};

export const removeTodolistTC = (todolistId: string): ThunkType => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      changeTodolistEntityStatusAC({ todolistId, entityStatus: "loading" })
    );
    todolistApi
      .deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === ResponseStatusCodes.success) {
          dispatch(removeTodolistAC({ todolistId }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((err: AxiosError) => handleServerNetworkError(dispatch, err))
      .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
  };
};

export const addTodolistTC = (title: string): ThunkType => (dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  todolistApi
    .createTodo(title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(addTodoListAC({ todolist: res.data.data.item }));
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
      handleServerNetworkError(dispatch, err);
    })
    .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
};

export const changeTodolistTitleTC = (
  title: string,
  todolistId: string
): ThunkType => (dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  todolistApi
    .updateTodolistTitle(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(changeTodolistTitleAC({ title, todolistId }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err);
    })
    .finally(() => dispatch(setAppStatusAC({ status: "succeeded" })));
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
  | ChangeTodolistEntityStatusActionType
  | ReturnType<typeof clearTodosDataAC>
  | ReturnType<typeof setAppStatusAC>;
