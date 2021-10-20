import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "db8d2f12-200b-4467-ba1f-cd791df3f39c",
  },
});

type CommonResponseType<T = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
  data: T;
};

type TodoType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  isDone: boolean;
  status: number;
  priority: number;
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

type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};

// TODO: Type
export const todolistApi = {
  getTodos() {
    let promise = instance.get<Array<TodoType>>("todo-lists");
    return promise;
  },
  createTodo(title: string) {
    return instance.post<CommonResponseType<{ item: TodoType }>>("todo-lists", {
      title: title,
    });
  },
  deleteTodo(todolistId: string) {
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
    return instance.post(`todo-lists/${todolistId}/tasks`, { title });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `/todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  updateTask(todolistId: string, taskId: string) {
    return instance.put(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
};