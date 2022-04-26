import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { TodolistDomainType } from "./todolistsReducer";
import {
  AddItemForm,
  AddItemFormSubmitHelperType,
} from "../../components/ui/addItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../Login/selectors";
import { todolistsActions } from "./index";
import { TaskStateType } from "../../app/App";
import { useActions, useAppDispatch } from "../../utils/redux-utils";
import { AppRootStateType } from "../../utils/types";

export const TodolistsList: React.FC = (props) => {
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  const { fetchTodolists, addTodolist } = useActions(todolistsActions);

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );

  const addTodolistCallback = useCallback(
    async (title: string, helpers: AddItemFormSubmitHelperType) => {
      let thunk = addTodolist(title);
      const resultAction = await dispatch(thunk);

      if (todolistsActions.addTodolist.rejected.match(resultAction)) {
        if (resultAction.payload?.errors?.length) {
          const errorMessage = resultAction.payload?.errors[0];
          helpers.setError(errorMessage);
        } else {
          helpers.setError("Some error occured");
        }
      } else {
        helpers.setTitle("");
      }
    },
    []
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
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
