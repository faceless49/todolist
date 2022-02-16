import { setAppErrorAC, setAppStatusAC } from "../app/app-reducer";
import { Dispatch } from "redux";
import { ResponseType } from "../api/todolist-api";

export const handleServerNetworkError = (
  dispatch: Dispatch,
  error: { message: string }
) => {
  dispatch(
    setAppErrorAC(
      { error: error.message }
        ? { error: error.message }
        : { error: "Some error occurred" }
    )
  );
  dispatch(setAppStatusAC({ status: "failed" }));
};

export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: Dispatch
) => {
  if (data.messages[0]) {
    dispatch(setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(setAppErrorAC({ error: "Some Error" }));
  }
  dispatch(setAppStatusAC({ status: "failed" }));
};
