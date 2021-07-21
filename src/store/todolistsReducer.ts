import {keyType, TodoListType} from '../App';
import {v1} from 'uuid';

export type RemoveTodolistAT = {
  type: 'REMOVE-TODOLIST'
  todolistID: string
}

export type AddTodolistAT = {
  type: 'ADD-TODOLIST'
  title: string
  todoListID: string
}

export type ChangeTodoListTitle = {
  type: 'CHANGE-TODOLIST-TITLE'
  todoListID: string
  title: string
}

export type ChangeTodoListFilter = {
  type: 'CHANGE-TODOLIST-FILTER'
  todoListID: string
  key: keyType
}


export type TodoListsReducer = AddTodolistAT | RemoveTodolistAT | ChangeTodoListTitle | ChangeTodoListFilter

export const todoListsReducer = (todoLists: TodoListType[], action: TodoListsReducer): TodoListType[] => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return todoLists.filter(tl => tl.id !== action.todolistID)
    case 'ADD-TODOLIST':
      const newTodoList: TodoListType = {
        id: action.todoListID,
        title: action.title,
        filter: 'All'
      }
      return [...todoLists, newTodoList]
    case 'CHANGE-TODOLIST-TITLE':
      return todoLists.map(tl => {
        if (tl.id === action.todoListID) {
          return {...tl, title: action.title}
        }
        return tl
      })
    case 'CHANGE-TODOLIST-FILTER':
      return todoLists.map(tl => tl.id === action.todoListID ? {...tl, filter: action.key} : tl)
    default:
      return todoLists
  }
}

export const RemoveTodoListAC = (todolistID: string): RemoveTodolistAT => {
  return {type: 'REMOVE-TODOLIST', todolistID: todolistID}
}

export const addTodoListAC = (title: string): AddTodolistAT => {
  return {type: 'ADD-TODOLIST', title: title, todoListID: v1()}
}

export const changeTodoListTitleAC = (title: string, todoListID: string): ChangeTodoListTitle => {
  return {type: 'CHANGE-TODOLIST-TITLE', todoListID: todoListID, title: title}
};

export const changeTodoListFilterAC = (key: keyType, todoListID: string): ChangeTodoListFilter => {
  return {type: 'CHANGE-TODOLIST-FILTER', todoListID: todoListID, key: key}
}
