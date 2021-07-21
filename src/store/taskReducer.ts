import {TaskStateType} from '../App';
import {v1} from 'uuid';
import {TaskType} from '../components/todolist/Todolist';
import {AddTodolistAT, RemoveTodolistAT} from './todolistsReducer';

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  taskID: string,
  todoListID: string
}

export type AddTaskActionType = {
  type: 'ADD-TASK'
  title: string
  todoListID: string
}
export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS'
  isDone: boolean
  taskID: string
  todoListID: string
}
export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE'
  title: string
  taskID: string
  todoListID: string
}

export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  todoListID: string
}

type ActionsType = RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistAT
  | RemoveTodolistAT

export const tasksReducer = (state: TaskStateType, action: ActionsType) => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      const stateCopy = {...state}
      stateCopy[action.todoListID] = stateCopy[action.todoListID].filter(t => t.id !== action.taskID)
      return stateCopy
    }
    case 'ADD-TASK': {
      let newTask: TaskType = {id: v1(), title: action.title, isDone: false}
      return {...state, [action.todoListID]: [newTask, ...state[action.todoListID]]}
    }
    case 'CHANGE-TASK-STATUS': {
      return {
        ...state, [action.taskID]: state[action.todoListID].map(task => {
          if (task.id === action.taskID) {
            return {...task, isDone: action.isDone}
          }
          return task
        })
      }
    }
    case 'CHANGE-TASK-TITLE': {
      return {
        ...state, [action.todoListID]: state[action.todoListID]
          .map(task => task.id === action.taskID ? {...task, title: action.title} : task)
      }
    }
    case 'ADD-TODOLIST':
      return {
        ...state, [action.todoListID]: []
      }
    case 'REMOVE-TODOLIST':
      let stateCopy = {...state}
      delete stateCopy[action.todolistID]
      return stateCopy
    default:
      throw new Error('Error')
  }
}


export const removeTaskAC = (taskID: string, todoListID: string): RemoveTaskActionType => {
  return {
    type: 'REMOVE-TASK',
    taskID,
    todoListID
  }
}
export const addTaskAC = (title: string, todoListID: string): AddTaskActionType => {
  return {
    type: 'ADD-TASK',
    title,
    todoListID,
  }
}
export const changeTaskStatusAC = (taskID: string, isDone: boolean, todoListID: string): ChangeTaskStatusActionType => {
  return {
    type: 'CHANGE-TASK-STATUS',
    isDone,
    taskID,
    todoListID
  }
}
export const changeTaskTitleAC = (todoListID: string, taskID: string, title: string): ChangeTaskTitleActionType => {
  return {
    type: 'CHANGE-TASK-TITLE',
    title,
    taskID,
    todoListID
  }
}



