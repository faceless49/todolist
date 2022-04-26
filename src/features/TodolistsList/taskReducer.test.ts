import { TaskPriorities, TaskStatuses } from "../../api/types";
import { todolistsActions, tasksActions, tasksReducer } from "./index";
import { TaskStateType } from "../../app/App";

let startState: TaskStateType = {};

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = tasksActions.removeTask.fulfilled(
    {
      taskId: "2",
      todolistId: "todolistId2",
    },
    "requestId",
    { taskId: "2", todolistId: "todolistId2" }
  );

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
});

test("correct task should be added to correct array", () => {
  const task = {
    id: "id exists",
    title: "new task",
    status: TaskStatuses.New,
    todoListId: "todolistId2",
    startDate: "",
    deadline: "",
    addedDate: "",
    order: 0,
    priority: TaskPriorities.Low,
    description: "",
  };

  const action = tasksActions.addTask.fulfilled(task, "requestId", {
    title: task.title,
    todolistId: task.todoListId,
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("new task");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const param = {
    taskId: "2",
    domainModel: { status: TaskStatuses.New },
    todolistId: "todolistId1",
  };
  const action = tasksActions.updateTask.fulfilled(param, "requestId", param);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][0].status).toBe(TaskStatuses.New);
});

test("title of specified task should be changed", () => {
  const param = {
    taskId: "1",
    domainModel: { title: "nasdaq" },
    todolistId: "todolistId2",
  };
  const action = tasksActions.updateTask.fulfilled(param, "requestId", param);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][0].title).toBe("CSS");
  expect(endState["todolistId2"][0].title).toBe("nasdaq");
});

test("new array should be added when new todolist is added", () => {
  let payload = {
    todolist: { id: "123", title: "new todolist", order: 0, addedDate: "" },
  };
  const action = todolistsActions.addTodolist.fulfilled(
    payload,
    "requestId",
    payload.todolist.title
  );

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist.fulfilled(
    { todolistId: "todolistId2" },
    "requestId",
    { todolistId: "todolistId2" }
  );

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("tasks should be added for todolist", () => {
  const action = tasksActions.fetchTasks.fulfilled(
    { tasks: startState["todolistId1"], todolistId: "todolistId1" },
    "requestId",
    "todolistId1"
  );

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
