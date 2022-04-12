import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { TodolistDomainType } from "./todolistsReducer";
import { AppRootStateType, useActions } from "../../app/store";
import { TaskStateType } from "../../app/AppWithRedux";
import { TaskStatuses } from "../../api/todolist-api";
import { AddItemForm } from "../../components/ui/addItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../Login/selectors";
import { tasksActions, todolistsActions } from "./index";

export const TodolistsList: React.FC = (props) => {
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { updateTask, removeTask, addTask } = useActions(tasksActions);
  const {
    changeTodolistTitle,
    fetchTodolists,
    removeTodolist,
    addTodolist,
    changeTodolistFilter,
  } = useActions(todolistsActions);

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  const tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );

  const changeStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      updateTask({ taskId, todolistId, domainModel: { status } });
    },
    []
  );

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      updateTask({ taskId, todolistId, domainModel: { title } });
    },
    []
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
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
                  removeTask={removeTask}
                  addTask={addTask}
                  changeTodoListFilter={changeTodolistFilter}
                  changeTaskStatus={changeStatus}
                  removeTodoList={removeTodolist}
                  filter={tl.filter}
                  changeTaskTitle={changeTaskTitle}
                  changeTodoListTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
