import React from 'react';
import './App.css';
import Todolist, {TaskType} from './components/todolist/Todolist';


function App() {
  const tasksToLearn = [
    {id: 1, title: 'HTML&CSS', isDone: true},
    {id: 2, title: 'JS', isDone: true},
    {id: 3, title: 'ReactJS', isDone: false},
  ]
    // ? Подаем разные данные в две компоненты, для отрисовки другого JSX
    // ? Для этого мы даем через пропсы массивы tasks
    // ? И указываем их в Todolist в тайпе, что ждем массивы tasks
    // ? В функции всегда задавать данные?

  const tasksToBuy: Array<TaskType> = [
    {id: 1, title: 'Milk', isDone: true},
    {id: 2, title: 'Meat', isDone: false},
    {id: 3, title: 'Bread', isDone: false},
  ]

  return (
    <div className="App">
      <Todolist title="What to learn" tasks={tasksToLearn}/>
      <Todolist title="What to buy" tasks={tasksToBuy}/>
    </div>
  );
}


export default App;
