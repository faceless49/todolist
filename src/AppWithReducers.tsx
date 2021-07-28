import React, {useReducer, useState} from 'react';
import s from './App.module.scss';
import {TaskType, Todolist} from './components/todolist/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './components/ui/addItemForm/AddItemForm';
import {AppBar, Button, Container, IconButton, Toolbar, Typography, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
  addTodoListAC,
  changeTodoListFilterAC, changeTodoListTitleAC,
  RemoveTodoListAC,
  todoListsReducer
} from './store/todolistsReducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './store/taskReducer';


export type keyType = 'All' | 'Active' | 'Completed'

export type TodoListType = {
  id: string
  title: string
  filter: keyType
}

export type TaskStateType = {
  [key: string]: Array<TaskType>
}

function AppWithReducers() {
  let todoListID_1 = v1()
  let todoListID_2 = v1()

  let [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
    {id: todoListID_1, title: 'What to Learn', filter: 'All'},
    {id: todoListID_2, title: 'What to buy', filter: 'All'}
  ])
  const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
    [todoListID_1]: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
      {id: v1(), title: 'ReactJS', isDone: false},
      {id: v1(), title: 'SASS', isDone: true}
    ],
    [todoListID_2]: [
      {id: v1(), title: 'NASDAQ', isDone: false},
      {id: v1(), title: 'Amazon', isDone: true},
      {id: v1(), title: 'Facebook', isDone: false},
      {id: v1(), title: 'NVIDIA', isDone: true},
      {id: v1(), title: 'Tesla', isDone: true},
    ]
  })


  // * Отправляем в 1 объект 2 массива
  // let [tasks, setTasks] = useState<Array<TaskType>>([
  //   {id: v1(), title: 'HTML&CSS', isDone: true},
  //   {id: v1(), title: 'JS', isDone: true},
  //   {id: v1(), title: 'ReactJS', isDone: false},
  //   {id: v1(), title: 'SASS', isDone: true}
  // ])

  const changeTaskStatus = (tID: string, newIsDone: boolean, todoListID: string) => {
    const action = changeTaskStatusAC(tID, newIsDone, todoListID)
    dispatchToTasks(action)
  }
  const changeTaskTitle = (tID: string, title: string, todoListID: string) => {
    const action = changeTaskTitleAC(tID, title, todoListID)
    dispatchToTasks(action)
  }
  const addTask = (newTitle: string, todoListID: string) => {
    const action = addTaskAC(newTitle, todoListID)
    dispatchToTasks(action)
  }
  const removeTasks = (tID: string, todoListID: string) => {
    const action = removeTaskAC(tID, todoListID)
    dispatchToTasks(action)
  }


  const removeTodoList = (todoListID: string) => {
    const action = RemoveTodoListAC(todoListID)
    dispatchToTodoLists(action)
    dispatchToTasks(action)
  }
  const addTodoList = (title: string) => {
    const action = addTodoListAC(title)
    dispatchToTasks(action)
    dispatchToTodoLists(action)
  }
  const changeTodoListTitle = (title: string, todoListID: string) => {
    const action = changeTodoListTitleAC(title, todoListID)
    dispatchToTodoLists(action)
  }
  const changeTodoListFilter = (key: keyType, todoListID: string) => {
    const action = changeTodoListFilterAC(key, todoListID)
    dispatchToTodoLists(action)
  }


  const todoListsComponents = todoLists.map(tl => {
    let tasksForTodolist = tasks[tl.id]

    if (tl.filter === 'Active') {
      tasksForTodolist = tasks[tl.id].filter(t => !t.isDone)
    }
    if (tl.filter === 'Completed') {
      tasksForTodolist = tasks[tl.id].filter(t => t.isDone)
    }

    return (
      <Grid
        item
        key={tl.id}>
        <Paper
          style={{padding: '10px'}}
          elevation={5}>
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
    )
  })

  return (
    <div className={s.App}>
      <AppBar position="static">
        <Toolbar style={{justifyContent: 'space-between'}}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu">
            <Menu/>
          </IconButton>
          <Typography variant="h6">
            Todolists
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid
          container
          style={{padding: '20px 20px'}}>
          <AddItemForm callBack={addTodoList}/>
        </Grid>
        <Grid
          container
          spacing={5}>
          {todoListsComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithReducers;


