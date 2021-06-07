import React from 'react';
import {keyType} from '../../App';
import {Button} from '../ui/Button';
import {Input} from '../ui/input/Input';

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
  addTask: () => void
}

export function Todolist(props: PropsType) {
  const changeFilterHandlerAll = () => {
    props.changeFilter('All')
  }
  const changeFilterHandlerActive = () => {
    props.changeFilter('Active')
  }
  const changeFilterHandlerCompleted = () => {
    props.changeFilter('Completed')
  }

  return <div>
    <h3>{props.title}</h3>
    <Input callBack={() => props.addTask()}/>
    <ul>
      {props.tasks.map((t: TaskType) => {
        const removeTasksHandler = () => {
          props.removeTasks(t.id)
        }
        return (
          <li key={t.id}>
            <Button callBack={removeTasksHandler} value={'x'}/>
            {/*<button onClick={() => {props.removeTask(t.id)}}>x</button>*/}
            <input type="checkbox" checked={t.isDone}/>
            <span>{t.title}</span>
          </li>
        )
      })
      }
    </ul>
    <div>
      <Button callBack={changeFilterHandlerAll} value={'All'}/>
      {/*<Button callBack={() => props.changeFilter('Active')} value={'Active'}/>*/}
      <Button callBack={changeFilterHandlerActive} value={'Active'}/>
      <Button callBack={changeFilterHandlerCompleted} value={'Completed'}/>
    </div>
  </div>
}
