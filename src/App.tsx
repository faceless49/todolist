import React from 'react';
import './App.css';
import Todolist, {TaskType} from './components/todolist/Todolist';


function App() {
  const tasks1 = [
    {id: 1, title: 'HTML&CSS', isDone: true},
    {id: 2, title: 'JS', isDone: true},
    {id: 3, title: 'ReactJS', isDone: false},
  ]
    // ? Подаем разные данные в две компоненты, для отрисовки другого JSX
    // ? Для этого мы даем через пропсы массивы tasks
    // ? И указываем их в Todolist в тайпе, что ждем массивы tasks

  const tasks2: Array<TaskType> = [
    {id: 1, title: 'HelloWorld', isDone: true},
    {id: 2, title: 'I am Happy', isDone: false},
    {id: 3, title: 'Yo', isDone: false},
  ]

  return (
    <div className="App">
      <Todolist title="What to learn" tasks={tasks1}/>
      <Todolist title="Songs" tasks={tasks2}/>
    </div>
  );
}


export default App;
