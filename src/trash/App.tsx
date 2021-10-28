import React, { useState } from "react";
import s from "./App.module.scss";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses, TaskType } from "../api/todolist-api";
import { AddItemForm } from "../components/ui/addItemForm/AddItemForm";
import {
  FilterValueType,
  TodolistDomainType,
} from "../features/TodolistsList/todolistsReducer";
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

function App() {
  const todolistId_1 = v1();
  const todolistId_2 = v1();

  let [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
    {
      id: todolistId_1,
      title: "What to Learn",
      filter: "All",
      addedDate: "",
      order: 0,
    },
    {
      id: todolistId_2,
      title: "What to buy",
      filter: "All",
      addedDate: "",
      order: 0,
    },
  ]);

  let [tasks, setTasks] = useState<TaskStateType>({
    [todolistId_1]: [
      {
        id: v1(),
        title: "HTML&CSS",
        status: TaskStatuses.Completed,
        todoListId: todolistId_1,
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

  const changeTaskStatus = (
    tID: string,
    status: TaskStatuses,
    todolistId: string
  ) => {
    tasks[todolistId] = tasks[todolistId].map((t) => {
      if (t.id === tID) {
        return { ...t, status };
      }
      return t;
    });
    setTasks({ ...tasks });
  };
  const changeTaskTitle = (tID: string, title: string, todolistId: string) => {
    tasks[todolistId] = tasks[todolistId].map((t) => {
      if (t.id === tID) {
        return { ...t, title: title };
      }
      return t;
    });
    setTasks({ ...tasks });
  };

  const changeTodoListFilter = (key: FilterValueType, todolistId: string) => {
    setTodoLists(
      todoLists.map((tl) =>
        tl.id === todolistId ? { ...tl, filter: key } : tl
      )
    );
  };
  const addTask = (title: string, todolistId: string) => {
    const newTask = {
      id: v1(),
      title,
      status: TaskStatuses.New,
      todoListId: todolistId,
      startDate: "",
      deadline: "",
      addedDate: "",
      order: 5,
      priority: TaskPriorities.Low,
      description: "",
    };
    tasks[todolistId] = [newTask, ...tasks[todolistId]];
    setTasks({ ...tasks });
  };
  const removeTasks = (tID: string, todolistId: string) => {
    tasks[todolistId] = tasks[todolistId].filter((t) => t.id !== tID);
    setTasks({ ...tasks });
  };
  const removeTodoList = (todolistId: string) => {
    setTodoLists(todoLists.filter((tl) => tl.id !== todolistId));
    delete tasks[todolistId];
    setTasks({ ...tasks });
  };
  const addTodoList = (title: string) => {
    const newtodolistId = v1();
    const newTodoList: TodolistDomainType = {
      id: newtodolistId,
      title: title,
      filter: "All",
      addedDate: "",
      order: 0,
    };
    setTodoLists([...todoLists, newTodoList]);
    setTasks({ ...tasks, [newtodolistId]: [] });
  };

  const changeTodoListTitle = (title: string, todolistId: string) => {
    const updatedTodoLists = todoLists.map((tl) => {
      if (tl.id === todolistId) {
        return { ...tl, title: title };
      }
      return tl;
    });
    setTodoLists(updatedTodoLists);
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

export default App;
