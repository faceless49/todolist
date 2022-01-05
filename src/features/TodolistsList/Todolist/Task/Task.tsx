import React, { ChangeEvent, useCallback } from "react";
import { TaskStatuses, TaskType } from "../../../../api/todolist-api";
import { EditableSpan } from "../../../../components/ui/editableSpan/EditableSpan";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./Task.module.scss";

type TaskPropsType = {
  removeTasks: (id: string, todolistId: string) => void;
  changeTaskStatus: (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) => void;
  changeTaskTitle: (tID: string, title: string, todolistId: string) => void;
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo((props: TaskPropsType) => {
  const removeTasksHandler = useCallback(() => {
    props.removeTasks(props.task.id, props.todolistId);
  }, [props.task.id, props.removeTasks, props.todolistId]);
  const changeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      props.changeTaskStatus(
        props.task.id,
        newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        props.todolistId
      );
    },
    [props.task.id, props.changeTaskStatus, props.todolistId]
  );
  const changeTaskTitleHandler = useCallback(
    (title: string) => {
      props.changeTaskTitle(props.task.id, title, props.todolistId);
    },
    [props.task.id, props.changeTaskTitle, props.todolistId]
  );

  return (
    <li
      key={props.task.id}
      className={
        props.task.status === TaskStatuses.Completed ? `${styles.isDone}` : ""
      }
    >
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatus}
      />

      <EditableSpan
        changeTitle={changeTaskTitleHandler}
        className={
          props.task.status === TaskStatuses.Completed ? "is-done" : ""
        }
        title={props.task.title}
      />

      <IconButton onClick={removeTasksHandler} color={"primary"} size={"small"}>
        <Delete />
      </IconButton>
    </li>
  );
});
