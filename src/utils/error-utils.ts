import {
  setAppErrorAC,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from "../app/app-reducer";
import { Dispatch } from "redux";
import { ResponseType } from "../api/todolist-api";

export const handleServerNetworkError = (
  dispatch: Dispatch<ErrorUtilsActionsType>,
  message: string
) => {
  dispatch(setAppErrorAC(message));
  dispatch(setAppStatusAC("failed"));
};

export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: Dispatch<ErrorUtilsActionsType>
) => {
  if (data.messages[0]) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Some Error"));
  }
  dispatch(setAppStatusAC("failed"));
};

type ErrorUtilsActionsType = SetAppStatusActionType | SetAppErrorActionType;
