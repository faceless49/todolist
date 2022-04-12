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

export const Todolist = React.memo((props: PropsType) => {
  const {
    changeTodolistFilter,
    removeTodolist,
    changeTodolistTitle,
  } = useActions(todolistsActions);

  const { addTask, updateTask, removeTask } = useActions(tasksActions);

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      updateTask({ taskId, todolistId, domainModel: { status } });
    },
    []
  );

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      updateTask({ taskId, todolistId, domainModel: { title } });
    },
    []
  );

  const onClickRemoveTodoList = () =>
    removeTodolist({ todolistId: props.todolistId });

  const changeTodoListTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({ title, todolistId: props.todolistId });
    },
    [props.todolistId]
  );

  const onAllClickHandler = useCallback(
    () => changeTodolistFilter({ key: "All", todolistId: props.todolistId }),
    [props.todolistId]
  );
  const onActiveClickHandler = useCallback(
    () =>
      changeTodolistFilter({
        key: "Active",
        todolistId: props.todolistId,
      }),
    [props.todolistId]
  );
  const onCompletedClickHandler = useCallback(
    () =>
      changeTodolistFilter({
        key: "Completed",
        todolistId: props.todolistId,
      }),
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
          <Task
            task={t}
            todolistId={props.todolistId}
            removeTask={removeTask}
            changeTaskStatus={changeTaskStatus}
            changeTaskTitle={changeTaskTitle}
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
};
