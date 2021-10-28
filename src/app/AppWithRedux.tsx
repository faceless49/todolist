import React from "react";
import s from "./App.module.scss";
import { TaskType } from "../api/todolist-api";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { AppRootStateType } from "./store";
import { RequestStatusType } from "./app-reducer";
import { useSelector } from "react-redux";
export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );

  return (
    <div className={s.App}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      {status === "loading" && (
        <LinearProgress color="secondary" sx={{ width: "100%" }} />
      )}

      <Container fixed>
        <TodolistsList />
      </Container>
    </div>
  );
}

export default AppWithRedux;
