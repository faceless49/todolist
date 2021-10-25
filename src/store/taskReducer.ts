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
  UpdateTaskModelType,
} from "../api/todolist-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";

export type RemoveTaskActionType = {
  type: "REMOVE-TASK";
  taskID: string;
  todoListID: string;
};
export type AddTaskActionType = {
  type: "ADD-TASK";
  task: TaskType;
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
      const stateCopy = { ...state };
      const tasks = stateCopy[action.task.todoListId];
      const newTasks = [action.task, ...tasks];
      stateCopy[action.task.todoListId] = newTasks;
      return stateCopy;
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
      return { ...state, [action.todolist.id]: [] };
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

// * AC
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
export const addTaskAC = (task: TaskType): AddTaskActionType => {
  return {
    type: "ADD-TASK",
    task,
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

export type SetTasksActionType = {
  type: "SET-TASKS";
  tasks: Array<TaskType>;
  todolistId: string;
};

export const setTasksAC = (
  tasks: Array<TaskType>,
  todolistId: string
): SetTasksActionType => {
  return { type: "SET-TASKS", tasks, todolistId } as const;
};

// * THUNK
export const fetchTasksTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    todolistApi.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      const action = setTasksAC(tasks, todolistId);
      dispatch(action);
    });
  };
};

export const removeTaskTC = (taskId: string, todolistId: string) => (
  dispatch: Dispatch
) => {
  todolistApi.deleteTask(todolistId, taskId).then((res) => {
    dispatch(removeTaskAC(taskId, todolistId));
  });
};

export const addTaskTC = (title: string, todolistId: string) => (
  dispatch: Dispatch<AddTaskActionType>
) => {
  todolistApi.createTask(todolistId, title).then((res) => {
    let task = res.data.data.item;
    const action = addTaskAC(task);
    dispatch(action);
  });
};

export const updateTaskStatusTC = (
  taskId: string,
  todolistId: string,
  status: TaskStatuses
) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    // так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
    // те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId];
    const task = tasksForCurrentTodolist.find((t) => {
      return t.id === taskId;
    });

    if (task) {
      todolistApi
        .updateTask(todolistId, taskId, {
          title: task.title,
          startDate: task.startDate,
          priority: task.priority,
          description: task.description,
          deadline: task.deadline,
          status,
        })
        .then(() => {
          dispatch(changeTaskStatusAC(taskId, status, todolistId));
        });
    }
  };
};

export const changeTaskTitleTC = (
  title: string,
  taskId: string,
  todolistId: string
) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const allTasksFromState = getState().tasks;
  const tasksForCurrentTodolist = allTasksFromState[todolistId];
  const task = tasksForCurrentTodolist.find((t) => {
    return t.id === taskId;
  });

  if (task) {
    todolistApi
      .updateTask(todolistId, taskId, {
        title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
      })
      .then(() => {
        dispatch(changeTaskTitleAC(taskId, title, todolistId));
      });
  }
};
