import React, {useState} from 'react';
import s from './App.module.scss';
import {TaskType, Todolist} from './components/todolist/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './components/ui/addItemForm/AddItemForm';
import {AppBar, Button, Container, IconButton, Toolbar, Typography, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';


export type keyType = 'All' | 'Active' | 'Completed'

type TodoListType = {
  id: string
  title: string
  filter: keyType
}

type TaskStateType = {
  [key: string]: Array<TaskType>
}

function App() {
  const todoListID_1 = v1()
  const todoListID_2 = v1()
  const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
    {id: todoListID_1, title: 'What to Learn', filter: 'All'},
    {id: todoListID_2, title: 'What to buy', filter: 'All'}
  ])


  const [tasks, setTasks] = useState<TaskStateType>({
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

    // ? const todoListTasks = tasks[todoListID]

    tasks[todoListID] = tasks[todoListID].map(t => {
      if (t.id === tID) {
        return {...t, isDone: newIsDone}
      }
      return t
    })
    setTasks({...tasks});

    // let currentTask = tasks.find(t => t.id === id)
    // if (currentTask) {
    //   currentTask.isDone = newIsDone
    //   // * 2 variant
    //   // * currentTask.isDone = !currentTask.isDone
    //   setTasks([...tasks]);
    // }
  }

  const changeTaskTitle = (tID: string, title: string, todoListID: string) => {


    tasks[todoListID] = tasks[todoListID].map(t => {
      if (t.id === tID) {
        return {...t, title: title}
      }
      return t
    })
    setTasks({...tasks});
  }
  const changeTodoListFilter = (key: keyType, todoListID: string) => {
    setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: key} : tl))
  }
  const addTask = (newTitle: string, todoListID: string) => {
    const newTask = {id: v1(), title: newTitle, isDone: false};
    tasks[todoListID] = [newTask, ...tasks[todoListID]]
    setTasks({...tasks})
  }
  const removeTasks = (tID: string, todoListID: string) => {
    console.log(tasks)
    tasks[todoListID] = tasks[todoListID].filter(t => t.id !== tID)
    setTasks({...tasks})
  }
  const removeTodoList = (todoListID: string) => {
    setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
    delete tasks[todoListID]
  }
  const addTodoList = (title: string) => {
    const newTodoListID = v1()
    const newTodoList: TodoListType = {
      id: newTodoListID,
      title: title,
      filter: 'All'
    }
    setTodoLists([...todoLists, newTodoList])
    setTasks({...tasks, [newTodoListID]: []})
  }

  const changeTodoListTitle = (title: string, todoListID: string) => {
    const updatedTodoLists = todoLists.map(tl => {
      if (tl.id === todoListID) {
        return {...tl, title: title}
      }
      return tl
    })
    setTodoLists(updatedTodoLists)
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

export default App;


