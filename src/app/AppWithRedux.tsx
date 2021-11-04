import React, { useEffect } from "react";
import s from "./App.module.scss";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { TaskType } from "../api/todolist-api";
import { AppRootStateType } from "./store";
import { initializeAppTC, RequestStatusType } from "./app-reducer";
import { useDispatch, useSelector } from "react-redux";
import { ErrorSnackbar } from "../components/ui/ErrorSnackbar/ErrorSnackbar";
import { Login } from "../features/Login/Login";
import { Route, Routes } from "react-router-dom";
import { logoutTC } from "../features/Login/auth-reducer";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );
  const isInitialized = useSelector<AppRootStateType, boolean>(
    (state) => state.app.isInitialized
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  const logoutHandler = () => dispatch(logoutTC());

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={s.App}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {status === "loading" && (
        <LinearProgress color="secondary" sx={{ width: "100%" }} />
      )}
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          {/*<Route path={"/*"} } />*/}
        </Routes>
      </Container>
      <ErrorSnackbar />
    </div>
  );
}

export default AppWithRedux;
