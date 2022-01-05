import React, { useEffect } from "react";
import styles from "./App.module.scss";
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
import { useAppSelector } from "./store";
import { initializeAppTC, RequestStatusType } from "./app-reducer";
import { useDispatch } from "react-redux";
import { ErrorSnackbar } from "../components/ui/ErrorSnackbar/ErrorSnackbar";
import { Login } from "../features/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { logoutTC } from "../features/Login/auth-reducer";

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status);
  const isInitialized = useAppSelector<boolean>(
    (state) => state.app.isInitialized
  );
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
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
    <div className={styles.App}>
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
          <Route path="/" element={<TodolistsList />} />
          <Route path="login" element={<Login />} />
          <Route path={"/404"} element={<h1>404: Page not found</h1>} />
          <Route path={"*"} element={<Navigate to="/404" />} />
        </Routes>
      </Container>
      <ErrorSnackbar />
    </div>
  );
}

export default AppWithRedux;