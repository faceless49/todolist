import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "../ui/addItemForm/AddItemForm";
import { EditableSpan } from "../ui/editableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "../task/Task";
import { TaskStatuses, TaskType } from "../../api/todolist-api";
import { FilterValueType } from "../../store/todolistsReducer";
import { fetchTasksTC } from "../../store/taskReducer";
import { useDispatch } from "react-redux";

export type PropsType = {
  todolistID: string;
  title: string;
  tasks: Array<TaskType>;
  filter: FilterValueType;
  removeTasks: (id: string, todoListID: string) => void;
  changeTodoListFilter: (key: FilterValueType, todoListID: string) => void;
  addTask: (newTitle: string, todolistID: string) => void;
  changeTaskStatus: (
    id: string,
    status: TaskStatuses,
    todoListID: string
  ) => void;
  changeTaskTitle: (tID: string, title: string, todoListID: string) => void;
  removeTodoList: (todoListID: string) => void;
  changeTodoListTitle: (title: string, todoListID: string) => void;
};

export const Todolist = React.memo((props: PropsType) => {
  console.log("todolist render");

  const dispatch = useDispatch();
  useEffect(() => {
    debugger;
    dispatch(fetchTasksTC(props.todolistID));
  }, []);

  const onClickRemoveTodoList = () => props.removeTodoList(props.todolistID);
  const changeTodoListTitle = useCallback(
    (title: string) => {
      props.changeTodoListTitle(title, props.todolistID);
    },
    [props.changeTodoListTitle, props.todolistID]
  );

  const onAllClickHandler = useCallback(
    () => props.changeTodoListFilter("All", props.todolistID),
    [props.changeTodoListFilter, props.todolistID]
  );
  const onActiveClickHandler = useCallback(
    () => props.changeTodoListFilter("Active", props.todolistID),
    [props.changeTodoListFilter, props.todolistID]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeTodoListFilter("Completed", props.todolistID),
    [props.changeTodoListFilter, props.todolistID]
  );

  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.todolistID); // * TODO asking about this const. Why we should declare here. 26STR
    },
    [props.addTask, props.todolistID]
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
            todolistID={props.todolistID}
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
