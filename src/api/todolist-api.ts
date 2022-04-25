import { AxiosResponse } from "axios";
import { TodolistDomainType } from "../features/TodolistsList/todolistsReducer";
import {
  CommonResponseType,
  GetTasksResponse,
  LoginParamsType,
  MeResponseType,
  ResponseType,
  TaskType,
  TodolistType,
  UpdateTaskModelType,
} from "./types";
import { instance } from "./apiConfig";

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
