import React, { ChangeEvent, useCallback } from "react";
import { TaskStatuses, TaskType } from "../../../../api/todolist-api";
import { EditableSpan } from "../../../../components/ui/editableSpan/EditableSpan";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./Task.module.scss";
import { useActions } from "../../../../app/store";
import { tasksActions } from "../../index";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo((props: TaskPropsType) => {
  const { updateTask, removeTask } = useActions(tasksActions);

  const removeTasksHandler = useCallback(() => {
    removeTask({ taskId: props.task.id, todolistId: props.todolistId });
  }, [props.task.id, props.todolistId]);

  const changeTaskStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      updateTask({
        taskId: props.task.id,
        todolistId: props.todolistId,
        domainModel: {
          status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        },
      });
    },
    [props.task.id, props.todolistId]
  );
  const changeTaskTitleHandler = useCallback(
    (title: string) => {
      updateTask({
        taskId: props.task.id,
        todolistId: props.todolistId,
        domainModel: { title },
      });
    },
    [props.task.id, props.todolistId]
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
        onChange={changeTaskStatusHandler}
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
