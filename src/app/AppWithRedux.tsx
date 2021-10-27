import React from "react";
import s from "./App.module.scss";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { TaskType } from "../api/todolist-api";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
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
        <TodolistsList />
      </Container>
    </div>
  );
}

export default AppWithRedux;
