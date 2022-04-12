import React, { useCallback } from "react";
import { TaskStatuses, TaskType } from "../../../api/todolist-api";
import { FilterValueType } from "../todolistsReducer";
import { AddItemForm } from "../../../components/ui/addItemForm/AddItemForm";
import { Task } from "./Task/Task";
import { EditableSpan } from "../../../components/ui/editableSpan/EditableSpan";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { RequestStatusType } from "../../../app/app-reducer";

export const Todolist = React.memo((props: PropsType) => {
  console.log("todolist render");

  const onClickRemoveTodoList = () =>
    props.removeTodoList({ todolistId: props.todolistId });
  const changeTodoListTitle = useCallback(
    (title: string) => {
      props.changeTodoListTitle({ title, todolistId: props.todolistId });
    },
    [props.changeTodoListTitle, props.todolistId]
  );

  const onAllClickHandler = useCallback(
    () =>
      props.changeTodoListFilter({ key: "All", todolistId: props.todolistId }),
    [props.changeTodoListFilter, props.todolistId]
  );
  const onActiveClickHandler = useCallback(
    () =>
      props.changeTodoListFilter({
        key: "Active",
        todolistId: props.todolistId,
      }),
    [props.changeTodoListFilter, props.todolistId]
  );
  const onCompletedClickHandler = useCallback(
    () =>
      props.changeTodoListFilter({
        key: "Completed",
        todolistId: props.todolistId,
      }),
    [props.changeTodoListFilter, props.todolistId]
  );

  const addTask = useCallback(
    (title: string) => {
      props.addTask({ title, todolistId: props.todolistId });
    },
    [props.addTask, props.todolistId]
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
        addItem={addTask}
        disabled={props.entityStatus === "loading"}
      />

      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {allTodolistTasks.map((t: TaskType) => (
          <Task
            task={t}
            todolistId={props.todolistId}
            removeTask={props.removeTask}
            changeTaskStatus={props.changeTaskStatus}
            changeTaskTitle={props.changeTaskTitle}
            key={t.id}
          />
        ))}
      </ul>

      <div>
        <Button
          size={"small"}
          variant={"contained"}
          color={props.filter === "All" ? "secondary" : "primary"}
          onClick={onAllClickHandler}
        >
          All
        </Button>

        <Button
          size={"small"}
          color={props.filter === "Active" ? "secondary" : "primary"}
          onClick={onActiveClickHandler}
          variant={"contained"}
        >
          Active
        </Button>

        <Button
          size={"small"}
          color={props.filter === "Completed" ? "secondary" : "primary"}
          onClick={onCompletedClickHandler}
          variant={"contained"}
        >
          Completed
        </Button>
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
  removeTask: (params: { taskId: string; todolistId: string }) => void;
  changeTodoListFilter: (params: {
    key: FilterValueType;
    todolistId: string;
  }) => void;
  addTask: (params: { title: string; todolistId: string }) => void;
  changeTaskStatus: (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) => void;
  changeTaskTitle: (tID: string, title: string, todolistId: string) => void;
  removeTodoList: (params: { todolistId: string }) => void;
  changeTodoListTitle: (params: { title: string; todolistId: string }) => void;
};
