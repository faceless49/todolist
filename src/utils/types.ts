import { store } from "../app/store";
import { FieldErrorType } from "../api/types";
import { rootReducer } from "../app/reducers";

export type AppDispatchType = typeof store.dispatch;
export type AppRootStateType = ReturnType<typeof rootReducer>;
export type ThunkError = {
  rejectValue: {
    errors: Array<string>;
    fieldsErrors?: Array<FieldErrorType>;
  };
};
