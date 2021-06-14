import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './components/todolist/Todolist';
import {v1} from 'uuid';


export type keyType = 'All' | 'Active' | 'Completed'

function App() {


  let [tasks, setTasks] = useState<Array<TaskType>>([
    {id: v1(), title: 'HTML&CSS', isDone: true},
    {id: v1(), title: 'JS', isDone: true},
    {id: v1(), title: 'ReactJS', isDone: false},
    {id: v1(), title: 'SASS', isDone: true}
  ])


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


