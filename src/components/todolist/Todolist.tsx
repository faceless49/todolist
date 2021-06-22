import React, {ChangeEvent} from 'react';
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
  addTask: (newTitle: string) => void
  changeTaskStatus: (id: string, isDone: boolean) => void
  filter: keyType
}

export function Todolist(props: PropsType) {

  const onFilterClickHandler = (filterValue: keyType) => {
    return () => props.changeFilter(filterValue)
  }


  return <div>
    <h3>{props.title}</h3>
    <Input callBack={(newTitle) => props.addTask(newTitle)}/>
    <ul>

      {props.tasks.map((t: TaskType) => {
        const removeTasksHandler = () => {
          props.removeTasks(t.id)
        }

        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
          props.changeTaskStatus(t.id, e.currentTarget.checked)
        }

        return (
          <li key={t.id}>
            <input type="checkbox" checked={t.isDone} onChange={changeTaskStatus}/>
            <span className={t.isDone ? 'is-done' : ''}>{t.title}</span>
            <Button callBack={removeTasksHandler} value={'x'}/>
          </li>
        )
      })
      }
    </ul>
    <div>
      <Button
        callBack={onFilterClickHandler('All')}
        value={'All'}
        filter={props.filter}
      />
      <Button
        callBack={onFilterClickHandler('Active')}
        value={'Active'}
        filter={props.filter}
      />
      <Button
        callBack={onFilterClickHandler('Completed')}
        value={'Completed'}
        filter={props.filter}
      />
    </div>
  </div>
}

