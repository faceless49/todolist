import React, { useReducer } from "react";
import s from "./App.module.scss";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses, TaskType } from "../api/todolist-api";
import {
  addTodoListAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValueType,
  removeTodolistAC,
  todolistsReducer,
} from "../features/TodolistsList/todolistsReducer";
import {
  addTaskAC,
  removeTaskAC,
  tasksReducer,
  updateTaskAC,
} from "../features/TodolistsList/taskReducer";
import { AddItemForm } from "../components/ui/addItemForm/AddItemForm";
import { Todolist } from "../features/TodolistsList/Todolist/Todolist";
import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithReducers() {
  let todolistId_1 = v1();
  let todolistId_2 = v1();

  let [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer, [
    {
      id: todolistId_1,
      title: "What to Learn",
      filter: "All",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
    {
      id: todolistId_2,
      title: "What to buy",
      filter: "All",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todolistId_1]: [
      {
        id: v1(),
        title: "HTML&CSS",
        todoListId: todolistId_1,
        status: TaskStatuses.Completed,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: todolistId_1,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 1,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "ReactJS",
        status: TaskStatuses.New,
        todoListId: todolistId_1,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 2,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "SASS",
        status: TaskStatuses.New,
        todoListId: todolistId_1,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 3,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
    [todolistId_2]: [
      {
        id: v1(),
        title: "NASDAQ",
        status: TaskStatuses.New,

        todoListId: todolistId_2,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "Amazon",
        status: TaskStatuses.Completed,

        todoListId: todolistId_2,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 1,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "Facebook",
        status: TaskStatuses.New,

        todoListId: todolistId_2,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 2,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "NVIDIA",
        status: TaskStatuses.Completed,

        todoListId: todolistId_2,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 3,
        priority: TaskPriorities.Low,
        description: "",
      },
      {
        id: v1(),
        title: "Tesla",
        status: TaskStatuses.Completed,

        todoListId: todolistId_2,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 4,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
  });

  // * Отправляем в 1 объект 2 массива
  // let [tasks, setTasks] = useState<Array<TaskType>>([
  //   {id: v1(), title: 'HTML&CSS', isDone: true},
  //   {id: v1(), title: 'JS', isDone: true},
  //   {id: v1(), title: 'ReactJS', isDone: false},
  //   {id: v1(), title: 'SASS', isDone: true}
  // ])

  const changeTaskStatus = (
    tID: string,
    status: TaskStatuses,
    todolistId: string
  ) => {
    const action = updateTaskAC(tID, { status }, todolistId);
    dispatchToTasks(action);
  };
  const changeTaskTitle = (tID: string, title: string, todolistId: string) => {
    const action = updateTaskAC(tID, { title }, todolistId);
    dispatchToTasks(action);
  };
  const addTask = () => {
    // @ts-ignore
    const action = addTaskAC(newTitle, todolistId);
    dispatchToTasks(action);
  };
  const removeTasks = (tID: string, todolistId: string) => {
    const action = removeTaskAC(tID, todolistId);
    dispatchToTasks(action);
  };

  const removeTodoList = (todolistId: string) => {
    const action = removeTodolistAC(todolistId);
    dispatchToTodoLists(action);
    dispatchToTasks(action);
  };
  const addTodoList = (title: string) => {
    const action = addTodoListAC({
      id: v1(),
      addedDate: "",
      order: 0,
      title,
    });
    dispatchToTasks(action);
    dispatchToTodoLists(action);
  };
  const changeTodoListTitle = (title: string, todolistId: string) => {
    const action = changeTodolistTitleAC(title, todolistId);
    dispatchToTodoLists(action);
  };
  const changeTodoListFilter = (key: FilterValueType, todolistId: string) => {
    const action = changeTodolistFilterAC(key, todolistId);
    dispatchToTodoLists(action);
  };

  const todoListsComponents = todoLists.map((tl) => {
    let tasksForTodolist = tasks[tl.id];

    if (tl.filter === "Active") {
      tasksForTodolist = tasks[tl.id].filter(
        (t) => t.status === TaskStatuses.New
      );
    }
    if (tl.filter === "Completed") {
      tasksForTodolist = tasks[tl.id].filter(
        (t) => t.status === TaskStatuses.Completed
      );
    }

    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "10px" }} elevation={5}>
          <Todolist
            entityStatus={tl.entityStatus}
            todolistId={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            removeTasks={removeTasks}
            addTask={addTask}
            changeTodoListFilter={changeTodoListFilter}
            changeTaskStatus={changeTaskStatus}
            removeTodoList={removeTodoList}
            filter={tl.filter}
            changeTaskTitle={changeTaskTitle}
            changeTodoListTitle={changeTodoListTitle}
          />
        </Paper>
      </Grid>
    );
  });

  return (
    <div className={s.App}>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Todolists</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px 20px" }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container spacing={5}>
          {todoListsComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default () => null;
