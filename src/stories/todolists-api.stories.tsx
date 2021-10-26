import React, { useEffect, useState } from "react";
import { todolistApi } from "../api/todolist-api";

export default {
  title: "API",
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, settodolistId] = useState<string>("");
  const GetTodolists = () => {
    todolistApi.getTodos().then((res) => {
      let todos = res.data;
      setState(todos);
    });
  };

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            settodolistId(e.currentTarget.value);
          }}
        />
        <button onClick={GetTodolists}>GetTodolists</button>
      </div>
    </div>
  );
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [title, setTitle] = useState<string>("");

  const CreateTodo = () => {
    todolistApi.createTodo(title).then((res) => {
      setState(res.data);
    });
  };
  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolist Title"}
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
        <button onClick={CreateTodo}>Create Todo</button>
      </div>
    </div>
  );
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, settodolistId] = useState<string>("");

  const DeleteTodolist = () => {
    todolistApi.deleteTodo(todolistId).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            settodolistId(e.currentTarget.value);
          }}
        />
        <button onClick={DeleteTodolist}>Delete todolist</button>
      </div>
    </div>
  );
};

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, settodolistId] = useState<any>("");
  const [title, setTitle] = useState<string>("");

  const UpdateTodolistTitle = () => {
    todolistApi.updateTodolistTitle(todolistId, title).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            settodolistId(e.currentTarget.value);
          }}
        />
        <input
          type="text"
          placeholder={"taskId"}
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
        <button onClick={UpdateTodolistTitle}>Update Todolist Title</button>
      </div>
    </div>
  );
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "056aaade-db07-4ad4-ab07-d99566447a71";
    todolistApi.getTasks(todolistId).then((res) => {
      setState(res.data);
    });
  });
  return <div> {JSON.stringify(state)}</div>;
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, settodolistId] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");

  const CreateTask = () => {
    todolistApi.createTask(todolistId, taskTitle).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            settodolistId(e.currentTarget.value);
          }}
        />
        <input
          type="text"
          placeholder={"TaskTitle"}
          value={taskTitle}
          onChange={(e) => {
            setTaskTitle(e.currentTarget.value);
          }}
        />
        <button onClick={CreateTask}>Create task</button>
      </div>
    </div>
  );
};
export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const [taskId, setTaskId] = useState<string>("");
  const [todolistId, settodolistId] = useState<string>("");

  const deleteTask = () => {
    todolistApi.deleteTask(todolistId, taskId).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            settodolistId(e.currentTarget.value);
          }}
        />
        <input
          type="text"
          placeholder={"taskId"}
          value={taskId}
          onChange={(e) => {
            setTaskId(e.currentTarget.value);
          }}
        />
        <button onClick={deleteTask}>Delete task</button>
      </div>
    </div>
  );
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistId, settodolistId] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");

  const UpdateTask = () => {
    // @ts-ignore
    todolistApi.updateTask(todolistId, taskId).then((res) => {
      setState(res.data);
    });
  };

  return (
    <div>
      {" "}
      {JSON.stringify(state)}
      <div>
        <input
          type="text"
          placeholder={"todolistId"}
          value={todolistId}
          onChange={(e) => {
            settodolistId(e.currentTarget.value);
          }}
        />
        <input
          type="text"
          placeholder={"taskId"}
          value={taskId}
          onChange={(e) => {
            setTaskId(e.currentTarget.value);
          }}
        />
        <button onClick={UpdateTask}>UpdateTask</button>
      </div>
    </div>
  );
};
