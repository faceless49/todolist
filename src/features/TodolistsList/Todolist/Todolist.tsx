import React, { useCallback } from "react";
import { TaskStatuses, TaskType } from "../../../api/todolist-api";
import { FilterValueType } from "../todolistsReducer";
import { AddItemForm } from "../../../components/ui/addItemForm/AddItemForm";
import { Task } from "./Task/Task";
import { EditableSpan } from "../../../components/ui/editableSpan/EditableSpan";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { RequestStatusType } from "../../../app/app-reducer";
import { useActions } from "../../../app/store";
import { tasksActions, todolistsActions } from "../index";
import { ButtonPropsColorOverrides } from "@mui/material/Button/Button";
import { OverridableStringUnion } from "@mui/types";

export const Todolist = React.memo((props: PropsType) => {
  const {
    changeTodolistFilter,
    removeTodolist,
    changeTodolistTitle,
  } = useActions(todolistsActions);

  const { addTask } = useActions(tasksActions);

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
    (title: string) => {
      addTask({ title, todolistId: props.todolistId });
    },
    [props.todolistId]
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

export type PropsType = {
  todolistId: string;
  title: string;
  tasks: Array<TaskType>;
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
