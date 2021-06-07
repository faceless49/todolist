import React from 'react';
import {keyType} from '../../App';
import {Button} from '../ui/Button';

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type PropsType = {
  title: string
  tasks: Array<TaskType>
  removeTasks: (id: string) => void
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
      <Button callBack={() => props.changeFilter('All')} value={'All'}/>
      <Button callBack={() => props.changeFilter('Active')} value={'Active'}/>
      <Button callBack={() => props.changeFilter('Completed')} value={'Completed'}/>
    </div>
  </div>
}
