import {
  setAppErrorAC,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from "../app/app-reducer";
import { Dispatch } from "redux";
import { ResponseType } from "../api/todolist-api";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
  showError = true
) => {
  if (showError) {
    dispatch(
      setAppErrorAC({
        error: data.messages.length ? data.messages[0] : "Some error occurred",
      })
    );
  }
  dispatch(setAppStatusAC({ status: "failed" }));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
  showError = true
) => {
  if (showError) {
    dispatch(
      setAppErrorAC({
        error: error.message ? error.message : "Some error occurred",
      })
    );
  }
  dispatch(setAppStatusAC({ status: "failed" }));
};
