import { TaskStateType, TodolistType } from "../App";
import { tasksReducer } from "./taskReducer";
import { addTodoListAC, todolistsReducer } from "./todolistsReducer";

test("ids should be equals", () => {
  const startTasksState: TaskStateType = {};
  const startTodolistsState: Array<TodolistType> = [];

  const action = addTodoListAC("new todolist");

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.todolistId);
  expect(idFromTodolists).toBe(action.todolistId);
});
