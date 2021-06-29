import React, {ChangeEvent} from 'react';
import {keyType} from '../../App';
import {Button} from '../ui/Button';
import {Input} from '../ui/input/Input';
import {EditableSpan} from '../ui/editableSpan/EditableSpan';

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type PropsType = {
  title: string
  tasks: Array<TaskType>
  filter: keyType
  todolistID: string
  removeTasks: (id: string, todoListID: string) => void
  changeTodoListFilter: (key: keyType, todoListID: string) => void
  addTask: (newTitle: string, todoListID: string) => void
  changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
  changeTaskTitle: (tID: string, title: string, todoListID: string) => void
  removeTodoList: (todoListID: string) => void
}

export function Todolist(props: PropsType) {

  const onFilterClickHandler = (key: keyType) => {
    return () => props.changeTodoListFilter(key, props.todolistID)
  }
  const onClickRemoveTodoList = () => props.removeTodoList(props.todolistID)

  return <div>
    <h3>
      {props.title}
      <button onClick={onClickRemoveTodoList}>X</button>
    </h3>
    <Input
      callBack={(newTitle) =>
        props.addTask(newTitle, props.todolistID)}/>

    <ul>

      {props.tasks.map((t: TaskType) => {
        const removeTasksHandler = () => {
          props.removeTasks(t.id, props.todolistID)
        }

        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
          props.changeTaskStatus(t.id, e.currentTarget.checked, props.todolistID)
        }
        const changeTaskTitleHandler = (title: string) => {
          props.changeTaskTitle(t.id, title, props.todolistID)
        }

        return (
          <li key={t.id}>
            <input type="checkbox" checked={t.isDone} onChange={changeTaskStatus}/>
            <EditableSpan
              changeTitle={changeTaskTitleHandler}
              className={t.isDone ? 'is-done' : ''}
              title={t.title}/>
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

