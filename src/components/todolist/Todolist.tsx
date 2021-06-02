import React from 'react';
import {keyType} from './../../App';

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

export type PropsType = {
  title: string
  tasks: Array<TaskType>
  removeTasks: (id: number) => void
  changeFilter: (key: keyType) => void
}

export function Todolist(props: PropsType) {
  return <div>
    <h3>{props.title}</h3>
    <div>
      <input/>
      <button>+</button>
    </div>
    <ul>
      {props.tasks.map(t => <li key={t.id}>
        <button onClick={() => props.removeTasks(t.id)}>X</button>
        <input type="checkbox" checked={t.isDone}/>
        <span>{t.title}</span></li>)}
    </ul>
    <div>
      <button onClick={() => props.changeFilter('All')}>All</button>
      <button onClick={() => props.changeFilter('Active')}>Active</button>
      <button onClick={() => props.changeFilter('Completed')}>Completed</button>
    </div>
  </div>
}
