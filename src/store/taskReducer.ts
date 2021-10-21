import { TaskStateType } from "../App";
import { v1 } from "uuid";
import {
  AddTodolistAT,
  RemoveTodolistAT,
  SetTodosActionType,
} from "./todolistsReducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistApi,
} from "../api/todolist-api";
import { Dispatch } from "redux";

export type RemoveTaskActionType = {
  type: "REMOVE-TASK";
  taskID: string;
  todoListID: string;
};
export type AddTaskActionType = {
  type: "ADD-TASK";
  title: string;
  todoListID: string;
};
export type ChangeTaskStatusActionType = {
  type: "CHANGE-TASK-STATUS";
  status: TaskStatuses;
  taskID: string;
  todoListID: string;
};
export type ChangeTaskTitleActionType = {
  type: "CHANGE-TASK-TITLE";
  title: string;
  taskID: string;
  todoListID: string;
};
export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST";
  todoListID: string;
};

const initialState: TaskStateType = {};

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistAT
  | RemoveTodolistAT
  | SetTodosActionType
  | SetTasksActionType;

export const tasksReducer = (
  state: TaskStateType = initialState,
  action: ActionsType
): TaskStateType => {
  switch (action.type) {
    case "SET-TODOS":
      let copyState = { ...state };
      action.todolists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      stateCopy[action.todoListID] = stateCopy[action.todoListID].filter(
        (t) => t.id !== action.taskID
      );
      return stateCopy;
    }
    case "ADD-TASK": {
      let newTask: TaskType = {
        id: v1(),
        title: action.title,
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        addedDate: "",
        startDate: "",
        description: "",
        order: 6,
        todoListId: action.todoListID,
        deadline: "",
      };
      return {
        ...state,
        [action.todoListID]: [newTask, ...state[action.todoListID]],
      };
    }
    case "CHANGE-TASK-STATUS": {
      return {
        ...state,
        [action.todoListID]: state[action.todoListID].map((task) => {
          if (task.id === action.taskID) {
            return { ...task, status: action.status };
          } else {
            return task;
          }
        }),
      };
    }
    case "CHANGE-TASK-TITLE": {
      const stateCopy = { ...state };
      let todolistTasks = stateCopy[action.todoListID];
      stateCopy[action.todoListID] = todolistTasks.map((t) =>
        t.id === action.taskID ? { ...t, title: action.title } : t
      );
      return stateCopy;
    }
    case "ADD-TODOLIST":
      return {
        [action.todoListID]: [],
        ...state,
      };
    case "REMOVE-TODOLIST":
      let stateCopy = { ...state };
      delete stateCopy[action.todolistID];
      return stateCopy;
    case "SET-TASKS": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = action.tasks;
      return stateCopy;
    }
    default:
      return state;
  }
};

export const removeTaskAC = (
  taskID: string,
  todoListID: string
): RemoveTaskActionType => {
  return {
    type: "REMOVE-TASK",
    taskID,
    todoListID,
  };
};
export const addTaskAC = (
  title: string,
  todoListID: string
): AddTaskActionType => {
  return {
    type: "ADD-TASK",
    title,
    todoListID,
  };
};
export const changeTaskStatusAC = (
  taskID: string,
  status: TaskStatuses,
  todoListID: string
): ChangeTaskStatusActionType => {
  return {
    type: "CHANGE-TASK-STATUS",
    status,
    taskID,
    todoListID,
  };
};
export const changeTaskTitleAC = (
  taskID: string,
  title: string,
  todoListID: string
): ChangeTaskTitleActionType => {
  return {
    type: "CHANGE-TASK-TITLE",
    title,
    taskID,
    todoListID,
  };
};

// * Thunk
// export const fetchTasksTC = (todolistId: string) => {
//   debugger;
//   return (dispatch: Dispatch) => {
//     todolistApi.getTasks(todolistId).then((res) => {});
//   };
// };

// export const fetchTasksThunk = (dispatch: Dispatch, todolistId: string) => {
//   todolistApi.getTasks(todolistId)
//     .then((res) => {
//
//   });
// };

export type SetTasksActionType = {
  type: "SET-TASKS";
  tasks: Array<TaskType>;
  todolistId: string;
};

export const setTasksAC = (
  tasks: Array<TaskType>,
  todolistId: string
): SetTasksActionType => {
  return { type: "SET-TASKS", tasks, todolistId };
};

export const fetchTasksTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    todolistApi.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      const action = setTasksAC(tasks, todolistId);
      dispatch(action);
    });
  };
};
