import React, { useReducer } from "react";
import s from "./App.module.scss";
import { TaskPriorities, TaskStatuses, TaskType } from "./api/todolist-api";
import { v1 } from "uuid";
import { AddItemForm } from "./components/ui/addItemForm/AddItemForm";
import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import {
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  FilterValueType,
  RemoveTodoListAC,
  todoListsReducer,
} from "./store/todolistsReducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from "./store/taskReducer";
import { Todolist } from "./components/todolist/Todolist";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithReducers() {
  let todoListID_1 = v1();
  let todoListID_2 = v1();

  let [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
    {
      id: todoListID_1,
      title: "What to Learn",
      filter: "All",
      order: 0,
      addedDate: "",
    },
    {
      id: todoListID_2,
      title: "What to buy",
      filter: "All",
      order: 0,
      addedDate: "",
    },
  ]);

  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todoListID_1]: [
      {
        id: v1(),
        title: "HTML&CSS",
        todoListId: todoListID_1,
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
        todoListId: todoListID_1,
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
        todoListId: todoListID_1,
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
        todoListId: todoListID_1,
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 3,
        priority: TaskPriorities.Low,
        description: "",
      },
    ],
    [todoListID_2]: [
      {
        id: v1(),
        title: "NASDAQ",
        status: TaskStatuses.New,

        todoListId: todoListID_2,
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

        todoListId: todoListID_2,
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

        todoListId: todoListID_2,
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

        todoListId: todoListID_2,
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

        todoListId: todoListID_2,
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
    todoListID: string
  ) => {
    const action = changeTaskStatusAC(tID, status, todoListID);
    dispatchToTasks(action);
  };
  const changeTaskTitle = (tID: string, title: string, todoListID: string) => {
    const action = changeTaskTitleAC(tID, title, todoListID);
    dispatchToTasks(action);
  };
  const addTask = () => {
    // @ts-ignore
    const action = addTaskAC(newTitle, todoListID);
    dispatchToTasks(action);
  };
  const removeTasks = (tID: string, todoListID: string) => {
    const action = removeTaskAC(tID, todoListID);
    dispatchToTasks(action);
  };

  const removeTodoList = (todoListID: string) => {
    const action = RemoveTodoListAC(todoListID);
    dispatchToTodoLists(action);
    dispatchToTasks(action);
  };
  const addTodoList = (title: string) => {
    const action = addTodoListAC(title);
    dispatchToTasks(action);
    dispatchToTodoLists(action);
  };
  const changeTodoListTitle = (title: string, todoListID: string) => {
    const action = changeTodoListTitleAC(title, todoListID);
    dispatchToTodoLists(action);
  };
  const changeTodoListFilter = (key: FilterValueType, todoListID: string) => {
    const action = changeTodoListFilterAC(key, todoListID);
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
            todolistID={tl.id}
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

export default AppWithReducers;
