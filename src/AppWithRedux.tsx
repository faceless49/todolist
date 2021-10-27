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
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  FilterValueType,
  removeTodolistTC,
  setTodolistsTC,
  TodolistDomainType,
} from "./store/todolistsReducer";
import { addTaskTC, removeTaskTC, updateTaskTC } from "./store/taskReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./store/store";
import { TaskStatuses, TaskType } from "./api/todolist-api";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
  // Достаем из редакса юзселектором
  // let todolistId_1 = v1()
  // let todolistId_2 = v1()
  //
  // let [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
  //   {id: todolistId_1, title: 'What to Learn', filter: 'All'},
  //   {id: todolistId_2, title: 'What to buy', filter: 'All'}
  // ])

  // Достаем из редакса юзселектором таски
  // const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
  //   [todolistId_1]: [
  //     {id: v1(), title: 'HTML&CSS', isDone: true},
  //     {id: v1(), title: 'JS', isDone: true},
  //     {id: v1(), title: 'ReactJS', isDone: false},
  //     {id: v1(), title: 'SASS', isDone: true}
  //   ],
  //   [todolistId_2]: [
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTodolistsTC());
  }, []);

  let todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  let tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );


  const changeTaskStatus = useCallback(
    (taskID: string, status: TaskStatuses, todolistId: string) => {
      dispatch(updateTaskTC(taskID, todolistId, { status }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (taskID: string, title: string, todolistId: string) => {
      dispatch(updateTaskTC(taskID, todolistId, { title }));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (newTitle: string, todolistId: string) => {
      const thunk = addTaskTC(newTitle, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );
  const removeTasks = useCallback(
    (taskID: string, todolistId: string) => {
      const thunk = removeTaskTC(taskID, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );

  const removeTodoList = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolistTC(todolistId));
    },
    [dispatch]
  );
  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );
  const changeTodoListTitle = useCallback(
    (title: string, todolistId: string) => {
      dispatch(changeTodolistTitleTC(title, todolistId));
    },
    [dispatch]
  );

  const changeTodoListFilter = useCallback(
    (key: FilterValueType, todolistId: string) => {
      const action = changeTodolistFilterAC(key, todolistId);
      dispatch(action);
    },
    [dispatch]
  );

  const todoListsComponents = todoLists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "10px" }} elevation={5}>
          <Todolist
            todolistId={tl.id}
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
