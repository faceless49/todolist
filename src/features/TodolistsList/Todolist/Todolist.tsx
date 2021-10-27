import React, { useCallback, useEffect } from "react";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { TaskStatuses, TaskType } from "../../../api/todolist-api";
import { FilterValueType } from "../todolistsReducer";
import { fetchTasksTC } from "../taskReducer";
import { AddItemForm } from "../../../components/ui/addItemForm/AddItemForm";
import { Task } from "./Task/Task";
import { EditableSpan } from "../../../components/ui/editableSpan/EditableSpan";

export const Todolist = React.memo((props: PropsType) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTasksTC(props.todolistId));
  }, []);

  const onClickRemoveTodoList = () => props.removeTodoList(props.todolistId);
  const changeTodoListTitle = useCallback(
    (title: string) => {
      props.changeTodoListTitle(title, props.todolistId);
    },
    [props.changeTodoListTitle, props.todolistId]
  );

  const onAllClickHandler = useCallback(
    () => props.changeTodoListFilter("All", props.todolistId),
    [props.changeTodoListFilter, props.todolistId]
  );
  const onActiveClickHandler = useCallback(
    () => props.changeTodoListFilter("Active", props.todolistId),
    [props.changeTodoListFilter, props.todolistId]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeTodoListFilter("Completed", props.todolistId),
    [props.changeTodoListFilter, props.todolistId]
  );

  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.todolistId);
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
        >
          <Delete />
        </IconButton>
      </h3>

      <AddItemForm addItem={addTask} />

      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {allTodolistTasks.map((t: TaskType) => (
          <Task
            task={t}
            todolistId={props.todolistId}
            removeTasks={props.removeTasks}
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
  removeTasks: (id: string, todolistId: string) => void;
  changeTodoListFilter: (key: FilterValueType, todolistId: string) => void;
  addTask: (newTitle: string, todolistId: string) => void;
  changeTaskStatus: (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) => void;
  changeTaskTitle: (tID: string, title: string, todolistId: string) => void;
  removeTodoList: (todolistId: string) => void;
  changeTodoListTitle: (title: string, todolistId: string) => void;
};
