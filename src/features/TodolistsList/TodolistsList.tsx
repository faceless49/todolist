import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  FilterValueType,
  removeTodolistTC,
  fetchTodolistsTC,
  TodolistDomainType,
} from "./todolistsReducer";
import { AppRootStateType } from "../../app/store";
import { TaskStateType } from "../../app/AppWithRedux";
import { TaskStatuses } from "../../api/todolist-api";
import { addTaskTC, removeTaskTC, updateTaskTC } from "./taskReducer";
import { AddItemForm } from "../../components/ui/addItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

export const TodolistsList: React.FC = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, []);

  let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  let tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );

  const removeTask = useCallback(
    (taskId: string, todolistId: string) => {
      const thunk = removeTaskTC(taskId, todolistId);
      dispatch(thunk);
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
  const changeStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      dispatch(updateTaskTC(taskId, todolistId, { status }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      dispatch(updateTaskTC(taskId, todolistId, { title }));
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

  const removeTodoList = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolistTC(todolistId));
    },
    [dispatch]
  );

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
