import React, { useCallback, useEffect } from "react";
import { FilterValueType, TodolistDomainType } from "../todolistsReducer";
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
import { fetchTasks } from "../taskReducer";

export type TodolistProps = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
};

export const Todolist = React.memo((props: TodolistProps) => {
  const {
    changeTodolistFilter,
    removeTodolist,
    changeTodolistTitle,
  } = useActions(todolistsActions);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!props.tasks.length) {
      fetchTasks(props.todolist.id);
    }
  }, []);

  const onClickRemoveTodoList = () =>
    removeTodolist({ todolistId: props.todolist.id });

  const changeTodoListTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({ title, todolistId: props.todolist.id });
    },
    [props.todolist.id]
  );

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValueType) =>
      changeTodolistFilter({ key: filter, todolistId: props.todolist.id }),
    [props.todolist.id]
  );

  const addTaskCallback = useCallback(
    async (title: string, helpers: AddItemFormSubmitHelperType) => {
      let thunk = tasksActions.addTask({
        title,
        todolistId: props.todolist.id,
      });
      const resultAction = await dispatch(thunk);

      if (tasksActions.addTask.rejected.match(resultAction)) {
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
    [props.todolist.id]
  );

  let allTodolistTasks = props.tasks;

  if (props.todolist.filter === "Active") {
    allTodolistTasks = allTodolistTasks.filter(
      (t) => t.status === TaskStatuses.New
    );
  }
  if (props.todolist.filter === "Completed") {
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
        variant={props.todolist.filter === buttonFilter ? "outlined" : "text"}
      >
        {text}
      </Button>
    );
  };

  return (
    <div>
      <h3>
        <EditableSpan
          title={props.todolist.title}
          changeTitle={changeTodoListTitle}
        />

        <IconButton
          onClick={onClickRemoveTodoList}
          size={"small"}
          color={"primary"}
          disabled={props.todolist.entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm
        addItem={addTaskCallback}
        disabled={props.todolist.entityStatus === "loading"}
      />

      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {allTodolistTasks.map((t: TaskType) => (
          <Task task={t} todolistId={props.todolist.id} key={t.id} />
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
