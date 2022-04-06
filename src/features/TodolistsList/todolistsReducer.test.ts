import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValueType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsReducer,
} from "./todolistsReducer";

import { v1 } from "uuid";
// @ts-ignore
import { TodolistType } from "src/api/todolist-api";

let todolistId1: string;
let todolistId2: string;

let startState: Array<TodolistDomainType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "All",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "All",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ];
});

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(
    startState,
    removeTodolistTC.fulfilled({ todolistId: todolistId1 }, "requestId", {
      todolistId: todolistId1,
    })
  );

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
  expect(endState[0].title).toBe("What to buy");
});

test("todolists should be added", () => {
  let payload = { todolists: startState };
  const action = fetchTodolistsTC.fulfilled(payload, "requestId");
  const endState = todolistsReducer([], action);

  expect(endState.length).toBe(2);
});
test("correct todolist should be added", () => {
  let todolist: TodolistType = {
    title: "New Todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };
  const endState = todolistsReducer(
    startState,
    addTodolistTC.fulfilled({ todolist }, "requestId", todolist.title)
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(todolist.title);
  expect(endState[0].filter).toBe("All");
});

test("correct todolist should change its name", () => {
  let newTodolistTitle: string = "New Todolist";

  let param = { title: newTodolistTitle, todolistId: todolistId2 };
  const action = changeTodolistTitleTC.fulfilled(param, "requestId", param);

  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValueType = "Completed";

  const action = changeTodolistFilterAC({
    key: newFilter,
    todolistId: todolistId2,
  });

  const endState = todolistsReducer(startState, action);

  expect(endState[0].filter).toBe("All");
  expect(endState[1].filter).toBe(newFilter);
});
