import { rootReducer, store } from "../app/store";
import { FieldErrorType } from "../api/types";

export type AppDispatchType = typeof store.dispatch;
export type AppRootStateType = ReturnType<typeof rootReducer>;
export type ThunkError = {
  rejectValue: {
    errors: Array<string>;
    fieldsErrors?: Array<FieldErrorType>;
  };
};
