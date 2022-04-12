import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TodolistDomainType } from "./todolistsReducer";
import { AppRootStateType, useActions } from "../../app/store";
import { TaskStateType } from "../../app/AppWithRedux";
import { AddItemForm } from "../../components/ui/addItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../Login/selectors";
import { todolistsActions } from "./index";

export const TodolistsList: React.FC = (props) => {
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { fetchTodolists, addTodolist } = useActions(todolistsActions);

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  const tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
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
                  filter={tl.filter}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
