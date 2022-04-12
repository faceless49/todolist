import {
  ActionCreatorsMapObject,
  bindActionCreators,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import { tasksReducer } from "../features/TodolistsList/taskReducer";
import { todolistsReducer } from "../features/TodolistsList/todolistsReducer";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useMemo } from "react";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatchType>();

// @ts-ignore
window.store = store;

type AppDispatchType = typeof store.dispatch;

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
  const dispatch = useAppDispatch();
  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, []);
  return boundActions;
}
