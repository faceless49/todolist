import { createAction } from "@reduxjs/toolkit";
import { RequestStatusType } from "../Application/application-reducer";

const setAppStatus = createAction<{ status: RequestStatusType }>(
  "application/setAppStatus"
);
const setAppError = createAction<{ error: string | null }>(
  "application/setAppError"
);

export const appActions = {
  setAppError,
  setAppStatus,
};
