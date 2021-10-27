import { todolistApi, TodolistType } from '../api/todolist-api';
import { Dispatch } from 'redux';
import { AppRootStateType } from './store';

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): TodolistDomainType[] => {
  switch (action.type) {
    case 'SET-TODOS':
      return action.todolists.map((tl) => ({ ...tl, filter: 'All' }));
    case 'REMOVE-TODOLIST':
      return state.filter((tl) => tl.id !== action.todolistId);
    case 'ADD-TODOLIST':
      return [{ ...action.todolist, filter: 'All' }, ...state];
    case 'CHANGE-TODOLIST-TITLE':
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, title: action.title } : tl
      );
    case 'CHANGE-TODOLIST-FILTER':
      return state.map((tl) =>
        tl.id === action.todolistId ? { ...tl, filter: action.key } : tl
      );
    default:
      return state;
  }
};

// ** ===== Action Creators

export const removeTodoListAC = (todolistId: string) =>
  ({ type: 'REMOVE-TODOLIST', todolistId } as const);

export const addTodoListAC = (todolist: TodolistType) =>
  ({ type: 'ADD-TODOLIST', todolist } as const);

export const changeTodolistTitleAC = (title: string, todolistId: string) =>
  ({
    type: 'CHANGE-TODOLIST-TITLE',
    todolistId,
    title
  } as const);

export const changeTodolistFilterAC = (
  key: FilterValueType,
  todolistId: string
) =>
  ({
    type: 'CHANGE-TODOLIST-FILTER',
    todolistId,
    key
  } as const);

export const setTodosAC = (todolists: Array<TodolistDomainType>) =>
  ({
    type: 'SET-TODOS',
    todolists
  } as const);

// ** ===== THUNKS
export const setTodolistsTC = () => (
  dispatch: Dispatch<ActionsType>,
  getState: () => AppRootStateType
): void => {
  todolistApi.getTodos().then((res) => {
    let todos = res.data;
    dispatch(setTodosAC(todos));
  });
};

export const removeTodolistTC = (todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  todolistApi.deleteTodo(todolistId).then((res) => {
    dispatch(removeTodoListAC(todolistId));
  });
};

export const addTodolistTC = (title: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  todolistApi.createTodo(title).then((res) => {
    dispatch(addTodoListAC(res.data.data.item));
  });
};

export const changeTodolistTitleTC = (title: string, todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  todolistApi.updateTodolistTitle(todolistId, title).then((res) => {
    dispatch(changeTodolistTitleAC(title, todolistId));
  });
};

// * types

export type AddTodolistAT = ReturnType<typeof addTodoListAC>;
export type RemoveTodolistAT = ReturnType<typeof removeTodoListAC>;
export type SetTodosActionType = ReturnType<typeof setTodosAC>;

export type FilterValueType = 'All' | 'Active' | 'Completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
};
export type ActionsType =
  | AddTodolistAT
  | RemoveTodolistAT
  | SetTodosActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>;
