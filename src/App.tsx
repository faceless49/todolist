import React, { useState } from 'react';
import s from './App.module.scss';
import { v1 } from 'uuid';
import { AddItemForm } from './components/ui/addItemForm/AddItemForm';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Paper
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { FilterValueType, TodolistDomainType } from './store/todolistsReducer';
import { TaskPriorities, TaskStatuses, TaskType } from './api/todolist-api';
import { Todolist } from './components/todolist/Todolist';

export type TaskStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const todoListID_1 = v1();
  const todoListID_2 = v1();

  let [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
    {
      id: todoListID_1,
      title: 'What to Learn',
      filter: 'All',
      addedDate: '',
      order: 0
    },
    {
      id: todoListID_2,
      title: 'What to buy',
      filter: 'All',
      addedDate: '',
      order: 0
    }
  ]);

  let [tasks, setTasks] = useState<TaskStateType>({
    [todoListID_1]: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: todoListID_1,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: todoListID_1,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 1,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'ReactJS',
        status: TaskStatuses.New,
        todoListId: todoListID_1,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 2,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'SASS',
        status: TaskStatuses.New,
        todoListId: todoListID_1,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 3,
        priority: TaskPriorities.Low,
        description: ''
      }
    ],
    [todoListID_2]: [
      {
        id: v1(),
        title: 'NASDAQ',
        status: TaskStatuses.New,
        todoListId: todoListID_2,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'Amazon',
        status: TaskStatuses.Completed,
        todoListId: todoListID_2,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 1,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'Facebook',
        status: TaskStatuses.New,
        todoListId: todoListID_2,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 2,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'NVIDIA',
        status: TaskStatuses.Completed,
        todoListId: todoListID_2,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 3,
        priority: TaskPriorities.Low,
        description: ''
      },
      {
        id: v1(),
        title: 'Tesla',
        status: TaskStatuses.Completed,
        todoListId: todoListID_2,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 4,
        priority: TaskPriorities.Low,
        description: ''
      }
    ]
  });

  const changeTaskStatus = (
    tID: string,
    status: TaskStatuses,
    todoListID: string
  ) => {
    tasks[todoListID] = tasks[todoListID].map((t) => {
      if (t.id === tID) {
        return { ...t, status };
      }
      return t;
    });
    setTasks({ ...tasks });
  };
  const changeTaskTitle = (tID: string, title: string, todoListID: string) => {
    tasks[todoListID] = tasks[todoListID].map((t) => {
      if (t.id === tID) {
        return { ...t, title: title };
      }
      return t;
    });
    setTasks({ ...tasks });
  };

  const changeTodoListFilter = (key: FilterValueType, todoListID: string) => {
    setTodoLists(
      todoLists.map((tl) =>
        tl.id === todoListID ? { ...tl, filter: key } : tl
      )
    );
  };
  const addTask = (title: string, todoListID: string) => {
    const newTask = {
      id: v1(),
      title,
      status: TaskStatuses.New,
      todoListId: todoListID,
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 5,
      priority: TaskPriorities.Low,
      description: ''
    };
    tasks[todoListID] = [newTask, ...tasks[todoListID]];
    setTasks({ ...tasks });
  };
  const removeTasks = (tID: string, todoListID: string) => {
    tasks[todoListID] = tasks[todoListID].filter((t) => t.id !== tID);
    setTasks({ ...tasks });
  };
  const removeTodoList = (todoListID: string) => {
    setTodoLists(todoLists.filter((tl) => tl.id !== todoListID));
    delete tasks[todoListID];
    setTasks({ ...tasks });
  };
  const addTodoList = (title: string) => {
    const newTodoListID = v1();
    const newTodoList: TodolistDomainType = {
      id: newTodoListID,
      title: title,
      filter: 'All',
      addedDate: '',
      order: 0
    };
    setTodoLists([...todoLists, newTodoList]);
    setTasks({ ...tasks, [newTodoListID]: [] });
  };

  const changeTodoListTitle = (title: string, todoListID: string) => {
    const updatedTodoLists = todoLists.map((tl) => {
      if (tl.id === todoListID) {
        return { ...tl, title: title };
      }
      return tl;
    });
    setTodoLists(updatedTodoLists);
  };

  const todoListsComponents = todoLists.map((tl) => {
    let tasksForTodolist = tasks[tl.id];

    if (tl.filter === 'Active') {
      tasksForTodolist = tasks[tl.id].filter(
        (t) => t.status === TaskStatuses.New
      );
    }
    if (tl.filter === 'Completed') {
      tasksForTodolist = tasks[tl.id].filter(
        (t) => t.status === TaskStatuses.Completed
      );
    }

    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: '10px' }} elevation={5}>
          <Todolist
            todolistID={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            removeTasks={removeTasks}
            addTask={addTask}
            changeTodoListFilter={changeTodoListFilter}
            changeTaskStatus={changeTaskStatus}
            removeTodoList={removeTodoList}
            filter={tl.filter}
            changeTaskTitle={changeTaskTitle}
            changeTodoListTitle={changeTodoListTitle}
          />
        </Paper>
      </Grid>
    );
  });

  return (
    <div className={s.App}>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Todolists</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: '20px 20px' }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container spacing={5}>
          {todoListsComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
