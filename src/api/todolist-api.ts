import axios, { AxiosResponse } from "axios";
import { TodolistDomainType } from "../features/TodolistsList/todolistsReducer";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "db8d2f12-200b-4467-ba1f-cd791df3f39c",
  },
});

// api
export const todolistApi = {
  //* Todolist
  getTodolists() {
    let promise = instance.get<Array<TodolistDomainType>>("todo-lists");
    return promise;
  },
  createTodo(title: string) {
    return instance.post<CommonResponseType<{ item: TodolistType }>>(
      "todo-lists",
      {
        title: title,
      }
    );
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`);
  },
  updateTodolistTitle(todolistId: string, title: string) {
    return instance.put<CommonResponseType>(`todo-lists/${todolistId}`, {
      title,
    });
  },

  //* Tasks
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<
      { title: string },
      { data: ResponseType<{ item: TaskType }> }
    >(`todo-lists/${todolistId}/tasks`, {
      title,
    });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `/todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<
      UpdateTaskModelType,
      AxiosResponse<ResponseType<{ item: TaskType }>>
    >(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

// * Auth

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<
      LoginParamsType,
      AxiosResponse<ResponseType<{ userId: number }>>
    >("/auth/login", data);
  },
  me() {
    return instance.get<ResponseType<MeResponseType>>("/auth/me");
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};

// types
export type FormikErrorType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type MeResponseType = {
  id: number;
  email: string;
  login: string;
};

type CommonResponseType<T = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
  data: T;
};
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: Array<TaskType>;
};
export type FieldErrorType = { field: string; error: string };
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<FieldErrorType>;
  data: D;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
export type LoginParamsType = FormikErrorType & {
  captcha?: string;
};
export type LoginResponseType = {
  resultCode: number;
  messages: Array<string>;
  data: {
    userId: number;
  };
};
