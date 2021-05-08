import React from 'react';
import './App.css';
import Todolist from "./components/todolist/Todolist";

function App(props: any) {
  return (
    <div className="App">
      <Todolist title="What to learn"/>
      <Todolist title="Songs"/>
      <Todolist title="Books"/>
    </div>
  );
}


export default App;
