import React from 'react';
import './App.css';
import Todolist from "./components/todolist/Todolist";


function App(props: any) {

  let tasks1 = [
    {id: 1, title: 'CSS', isDone: true},
    {id: 2, title: 'JS', isDone: true},
    {id: 3, title: 'React', isDone: false},
  ]

  let tasks2 = [
    {id: 1, title: 'Terminator', isDone: true},
    {id: 2, title: 'XXX', isDone: false},
    {id: 3, title: 'Fortune', isDone: true},
  ]

  return (
    <div className="App">
      <Todolist title="What to learn" tasks={tasks1}/>
      <Todolist title="Songs" tasks={tasks2}/>
      <Todolist title="React" tasks={tasks1}/>
    </div>
  );
}


export default App;
