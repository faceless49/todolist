import React, { useCallback } from "react";
import { FilterValueType } from "../todolistsReducer";
import {
  AddItemForm,
  AddItemFormSubmitHelperType,
} from "../../../components/ui/addItemForm/AddItemForm";
import { Task } from "./Task/Task";
import { EditableSpan } from "../../../components/ui/editableSpan/EditableSpan";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksActions, todolistsActions } from "../index";
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button";
import { OverridableStringUnion } from "@mui/types";
import { useActions, useAppDispatch } from "../../../utils/redux-utils";
import { TaskStatuses, TaskType } from "../../../api/types";
import { RequestStatusType } from "../../Application";

export const Todolist = React.memo((props: TodolistProps) => {
  const {
    changeTodolistFilter,
    removeTodolist,
    changeTodolistTitle,
  } = useActions(todolistsActions);

  const { addTask } = useActions(tasksActions);

  const dispatch = useAppDispatch();
  const onClickRemoveTodoList = () =>
    removeTodolist({ todolistId: props.todolistId });

  const changeTodoListTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({ title, todolistId: props.todolistId });
    },
    [props.todolistId]
  );

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValueType) =>
      changeTodolistFilter({ key: filter, todolistId: props.todolistId }),
    [props.todolistId]
  );

  const addTaskCallback = useCallback(
    async (title: string, helpers: AddItemFormSubmitHelperType) => {
      let thunk = addTask({ title, todolistId: props.todolistId });
      const resultAction = await dispatch(thunk);

      if (addTask.rejected.match(resultAction)) {
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

  let allTodolistTasks = props.tasks;

  if (props.filter === "Active") {
    allTodolistTasks = allTodolistTasks.filter(
      (t) => t.status === TaskStatuses.New
    );
  }
  if (props.filter === "Completed") {
    allTodolistTasks = allTodolistTasks.filter(
      (t) => t.status === TaskStatuses.Completed
    );
  }

  const renderFilterButton = (
    buttonFilter: FilterValueType,
    color: OverridableStringUnion<
      "inherit" | "primary" | "secondary" | "success",
      ButtonPropsColorOverrides
    >,
    text: string
  ) => {
    return (
      <Button
        size={"small"}
        color={color}
        onClick={() => onFilterButtonClickHandler(buttonFilter)}
        variant={props.filter === buttonFilter ? "outlined" : "text"}
      >
        {text}
      </Button>
    );
  };

  return (
    <div>
      <h3>
        <EditableSpan title={props.title} changeTitle={changeTodoListTitle} />

        <IconButton
          onClick={onClickRemoveTodoList}
          size={"small"}
          color={"primary"}
          disabled={props.entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm
        addItem={addTaskCallback}
        disabled={props.entityStatus === "loading"}
      />

      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {allTodolistTasks.map((t: TaskType) => (
          <Task task={t} todolistId={props.todolistId} key={t.id} />
        ))}
      </ul>

      <div>
        {renderFilterButton("All", "primary", "All")}
        {renderFilterButton("Active", "primary", "Active")}
        {renderFilterButton("Completed", "primary", "Completed")}
      </div>
    </div>
  );
});

export type TodolistProps = {
  todolistId: string;
  title: string;
  tasks: Array<TaskType>;
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
