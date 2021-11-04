import { Dispatch } from "redux";
import {
  AddTodolistAT,
  RemoveTodolistAT,
  SetTodosActionType,
} from "./todolistsReducer";
import { TaskStateType } from "../../app/AppWithRedux";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistApi,
  UpdateTaskModelType,
} from "../../api/todolist-api";
import { AppRootStateType } from "../../app/store";
import {
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";

const initialState: TaskStateType = {};
enum ResponseStatusCodes {
  success = 0,
  error = 1,
  captcha = 10,
}

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
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskID
        ),
      };
    }
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };
    // const stateCopy = { ...state };
    // const tasks = stateCopy[action.task.todolistId];
    // console.log(tasks);
    // const newTasks = [action.task, ...tasks];
    // console.log(newTasks);
    //
    // stateCopy[action.task.todolistId] = newTasks;
    // return stateCopy;

    case "UPDATE-TASK": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskID ? { ...t, ...action.model } : t
        ),
      };
    }
    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.todolistId];
      return copyState;
    }

    case "SET-TASKS": {
      return { ...state, [action.todolistId]: action.tasks };
      // const stateCopy = { ...state };
      // stateCopy[action.todolistId] = action.tasks;
      // return stateCopy;
    }
    default:
      return state;
  }
};

// *===== Action Creators

export const removeTaskAC = (taskID: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskID, todolistId } as const);

export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task } as const);

export const updateTaskAC = (
  taskID: string,
  model: UpdateDomainModelTaskType,
  todolistId: string
) => ({ type: "UPDATE-TASK", model, taskID, todolistId } as const);

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);

// * ===== THUNKS

export const fetchTasksTC = (todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi.getTasks(todolistId).then((res) => {
    const tasks = res.data.items;
    const action = setTasksAC(tasks, todolistId);
    dispatch(action);
    dispatch(setAppStatusAC("succeeded"));
  });
};

export const removeTaskTC = (taskId: string, todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi.deleteTask(todolistId, taskId).then((res) => {
    dispatch(removeTaskAC(taskId, todolistId));
    dispatch(setAppStatusAC("succeeded"));
  });
};

export const addTaskTC = (title: string, todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistApi
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatusCodes.success) {
        let task = res.data.data.item;
        const action = addTaskAC(task);
        dispatch(action);
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((res: AxiosError) => {
      // dispatch(setAppErrorAC(res.message)); = Proxy Refactor
      // dispatch(setAppStatusAC("failed"));
      handleServerNetworkError(dispatch, res.message);
    });
  // .finally(() => {
  //   dispatch(setAppStatusAC("succeeded"));
  // });
};

export const updateTaskTC = (
  taskId: string,
  todolistId: string,
  domainModel: UpdateDomainModelTaskType
) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
  // так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
  // те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

  const allTasksFromState = getState().tasks;
  const tasksForCurrentTodolist = allTasksFromState[todolistId];
  const task = tasksForCurrentTodolist.find((t) => {
    return t.id === taskId;
  });

  if (!task) {
    //throw new Error("task not found in the state");
    console.warn("task not found in the state");
    return;
  }
  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel,
  };
  dispatch(setAppStatusAC("loading"));

  todolistApi.updateTask(todolistId, taskId, apiModel).then((res) => {
    const action = updateTaskAC(taskId, domainModel, todolistId);
    dispatch(action);
    dispatch(setAppStatusAC("succeeded"));
  });
};

// types
export type UpdateDomainModelTaskType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof setTasksAC>
  | AddTodolistAT
  | RemoveTodolistAT
  | SetTodosActionType
  | SetAppStatusActionType
  | SetAppErrorActionType;
