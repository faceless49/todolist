import React, { useCallback, useEffect } from "react";
import s from "./App.module.scss";
import { Todolist } from "./components/todolist/Todolist";
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
  setTodolistsTC,
  TodolistDomainType,
} from "./store/todolistsReducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "./store/taskReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./store/store";
import { TaskStatuses, TaskType } from "./api/todolist-api";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
  // Достаем из редакса юзселектором
  // let todoListID_1 = v1()
  // let todoListID_2 = v1()
  //
  // let [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
  //   {id: todoListID_1, title: 'What to Learn', filter: 'All'},
  //   {id: todoListID_2, title: 'What to buy', filter: 'All'}
  // ])

  // Достаем из редакса юзселектором таски
  // const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
  //   [todoListID_1]: [
  //     {id: v1(), title: 'HTML&CSS', isDone: true},
  //     {id: v1(), title: 'JS', isDone: true},
  //     {id: v1(), title: 'ReactJS', isDone: false},
  //     {id: v1(), title: 'SASS', isDone: true}
  //   ],
  //   [todoListID_2]: [
  //     {id: v1(), title: 'NASDAQ', isDone: false},
  //     {id: v1(), title: 'Amazon', isDone: true},
  //     {id: v1(), title: 'Facebook', isDone: false},
  //     {id: v1(), title: 'NVIDIA', isDone: true},
  //     {id: v1(), title: 'Tesla', isDone: true},
  //   ]
  // })

  // * Отправляем в 1 объект 2 массива
  // let [tasks, setTasks] = useState<Array<TaskType>>([
  //   {id: v1(), title: 'HTML&CSS', isDone: true},
  //   {id: v1(), title: 'JS', isDone: true},
  //   {id: v1(), title: 'ReactJS', isDone: false},
  //   {id: v1(), title: 'SASS', isDone: true}
  // ])

  useEffect(() => {
    dispatch(setTodolistsTC());
  }, []);

  let todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  let tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );
  const dispatch = useDispatch();

  const changeTaskStatus = useCallback(
    (taskID: string, status: TaskStatuses, todoListID: string) => {
      const action = changeTaskStatusAC(taskID, status, todoListID);
      dispatch(action);
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (taskID: string, title: string, todoListID: string) => {
      const action = changeTaskTitleAC(taskID, title, todoListID);
      dispatch(action);
    },
    [dispatch]
  );

  const addTask = useCallback(
    (newTitle: string, todoListID: string) => {
      const action = addTaskAC(newTitle, todoListID);
      dispatch(action);
    },
    [dispatch]
  );
  const removeTasks = useCallback(
    (taskID: string, todoListID: string) => {
      const action = removeTaskAC(taskID, todoListID);
      dispatch(action);
    },
    [dispatch]
  );

  const removeTodoList = useCallback(
    (todoListID: string) => {
      const action = RemoveTodoListAC(todoListID);
      dispatch(action);
    },
    [dispatch]
  );
  const addTodoList = useCallback(
    (title: string) => {
      const action = addTodoListAC(title);
      dispatch(action);
    },
    [dispatch]
  );
  const changeTodoListTitle = useCallback(
    (title: string, todoListID: string) => {
      const action = changeTodoListTitleAC(title, todoListID);
      dispatch(action);
    },
    [dispatch]
  );

  const changeTodoListFilter = useCallback(
    (key: FilterValueType, todoListID: string) => {
      const action = changeTodoListFilterAC(key, todoListID);
      dispatch(action);
    },
    [dispatch]
  );

  const todoListsComponents = todoLists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "10px" }} elevation={5}>
          <Todolist
            todolistID={tl.id}
            title={tl.title}
            tasks={tasks[tl.id]}
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

export default AppWithRedux;
