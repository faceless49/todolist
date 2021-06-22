import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './components/todolist/Todolist';
import {v1} from 'uuid';


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



  // * Отправляем в отдельные массивы
  // let [tasks, setTasks] = useState<Array<TaskType>>([
  //   {id: v1(), title: 'HTML&CSS', isDone: true},
  //   {id: v1(), title: 'JS', isDone: true},
  //   {id: v1(), title: 'ReactJS', isDone: false},
  //   {id: v1(), title: 'SASS', isDone: true}
  // ])


  const addTask = (newTitle: string) => {
    let newTask = {id: v1(), title: newTitle, isDone: false}
    setTasks([newTask, ...tasks])
  }


  const removeTasks = (tID: string) => {
    console.log(tasks)
    tasks = tasks.filter(t => t.id !== tID)
    setTasks(tasks)
  }

  let [filter, setFilter] = useState<keyType>('All')

  const changeFilter = (key: keyType) => {
    setFilter(key)
  }

  let filterValue = tasks

  if (filter === 'Active') {
    filterValue = tasks.filter(t => !t.isDone)
  }
  if (filter === 'Completed') {
    filterValue = tasks.filter(t => t.isDone)
  }

  const changeTaskStatus = (id: string, newIsDone: boolean) => {
    let currentTask = tasks.find(t => t.id === id)
    if (currentTask) {
      currentTask.isDone = newIsDone
      // * 2 variant
      // * currentTask.isDone = !currentTask.isDone
      setTasks([...tasks]);
    }
  }

  return (
    <div className="App">
      <Todolist title="What to learn"
                tasks={filterValue}
                removeTasks={removeTasks}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                filter={filter}
      />

    </div>
  );
}

export default App;


