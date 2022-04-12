import { TodolistType } from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import { ThunkAction } from "redux-thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTodolist,
  changeTodolistTitle,
  fetchTodolists,
  removeTodolist,
} from "./todolists-actions";

export enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

export const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ key: FilterValueType; todolistId: string }>
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].filter = action.payload.key;
    },
    changeTodolistEntityStatus: (
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
    clearTodosData: (state, action: PayloadAction) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "All",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "All",
        entityStatus: "idle",
      });
    });
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistId
      );
      state[index].title = action.payload.title;
    });
  },
});

export const {
  changeTodolistFilter,
  changeTodolistEntityStatus,
  clearTodosData,
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
  typeof changeTodolistEntityStatus
>;

export type FilterValueType = "All" | "Active" | "Completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
export type ActionsType =
  | ReturnType<typeof changeTodolistFilter>
  | ChangeTodolistEntityStatusActionType
  | ReturnType<typeof clearTodosData>
  | ReturnType<typeof setAppStatusAC>;
