import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeTodolistFilterAC,
  FilterValueType,
  TodolistDomainType,
} from "./todolistsReducer";
import { AppRootStateType, useActions } from "../../app/store";
import { TaskStateType } from "../../app/AppWithRedux";
import { TaskStatuses } from "../../api/todolist-api";
import { AddItemForm } from "../../components/ui/addItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../Login/selectors";
import { tasksActions } from "./index";
import {
  addTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  removeTodolistTC,
} from "./todolists-actions";

export const TodolistsList: React.FC = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(fetchTodolistsTC());
  }, []);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { updateTaskTC, removeTaskTC, addTaskTC } = useActions(tasksActions);

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  const tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );

  const removeTask = useCallback((taskId: string, todolistId: string) => {
    removeTaskTC({ taskId, todolistId });
  }, []);

  const addTask = useCallback((title: string, todolistId: string) => {
    addTaskTC({ title, todolistId });
  }, []);

  const changeStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      updateTaskTC({ taskId, todolistId, domainModel: { status } });
    },
    []
  );

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      updateTaskTC({ taskId, todolistId, domainModel: { title } });
    },
    []
  );

  const changeTodoListFilter = useCallback(
    (key: FilterValueType, todolistId: string) => {
      const action = changeTodolistFilterAC({ key, todolistId });
      dispatch(action);
    },
    [dispatch]
  );

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistTC({ title }));
    },
    [dispatch]
  );
  const changeTodoListTitle = useCallback(
    (title: string, todolistId: string) => {
      dispatch(changeTodolistTitleTC({ title, todolistId }));
    },
    [dispatch]
  );

  const removeTodoList = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolistTC({ todolistId }));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodoList} />
      </Grid>
      <Grid container spacing={5}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }} elevation={5}>
                <Todolist
                  todolistId={tl.id}
                  title={tl.title}
                  tasks={tasks[tl.id]}
                  entityStatus={tl.entityStatus}
                  removeTasks={removeTask}
                  addTask={addTask}
                  changeTodoListFilter={changeTodoListFilter}
                  changeTaskStatus={changeStatus}
                  removeTodoList={removeTodoList}
                  filter={tl.filter}
                  changeTaskTitle={changeTaskTitle}
                  changeTodoListTitle={changeTodoListTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
