import { TodolistType } from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import { ThunkAction } from "redux-thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  removeTodolistTC,
} from "./todolists-actions";

export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilterAC: (
      state,
      action: PayloadAction<{ key: FilterValueType; todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].filter = action.payload.key;
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
  extraReducers: (builder) => {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    });
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].title = action.payload.title;
    });
  },
});

export const {
  changeTodolistFilterAC,
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

// * types

export type ChangeTodolistEntityStatusActionType = ReturnType<
  typeof changeTodolistEntityStatusAC
>;

export type FilterValueType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
export type ActionsType =
  | ReturnType<typeof changeTodolistFilterAC>
  | ChangeTodolistEntityStatusActionType
  | ReturnType<typeof clearTodosDataAC>
  | ReturnType<typeof setAppStatusAC>;
