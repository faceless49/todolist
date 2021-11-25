import { Dispatch } from "redux";
import { authAPI } from "../api/todolist-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { ResponseStatusCodes } from "../features/TodolistsList/todolistsReducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

type InitialStateType = typeof initialState;

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-IS-INITIALIZED":
      return { ...state, isInitialized: action.isInitialized };
    default:
      return state;
  }
};

export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: "APP/SET-STATUS", status } as const);

export const setAppErrorAC = (error: string | null) =>
  ({
    type: "APP/SET-ERROR",
    error,
  } as const);

export const setAppIsInitialized = (isInitialized: boolean) =>
  ({ type: "APP/SET-IS-INITIALIZED", isInitialized } as const);

export const initializeAppTC = () => (dispatch: Dispatch<ActionsType>) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        dispatch(setIsLoggedInAC(true));
      } else {
      }
      //* TODO: Fix add prealoader
    })
    .finally(() => {
      dispatch(setAppIsInitialized(true));
    });
};

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>;
export type SetAppIsInitialized = ReturnType<typeof setAppIsInitialized>;

type ActionsType =
  | SetAppStatusActionType
  | SetAppErrorActionType
  | SetIsLoggedInActionType
  | SetAppIsInitialized;
