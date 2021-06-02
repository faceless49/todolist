import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './components/todolist/Todolist';


export type keyType = 'All' | 'Active' | 'Completed'

function App() {


  let [tasks, setTasks] = useState<Array<TaskType>>([
    {id: 1, title: 'HTML&CSS', isDone: true},
    {id: 2, title: 'JS', isDone: true},
    {id: 3, title: 'ReactJS', isDone: false},
    {id: 4, title: 'SASS', isDone: true}
  ])

  const removeTasks = (tID: number) => {
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


  return (
    <div className="App">
      <Todolist title="What to learn"
                tasks={filterValue}
                removeTasks={removeTasks}
                changeFilter={changeFilter}
      />

    </div>
  );
}

export default App;


