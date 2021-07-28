import React, {ChangeEvent} from 'react';
import {keyType} from '../../App';
// import {Button} from '../ui/Button';
import {AddItemForm} from '../ui/addItemForm/AddItemForm';
import {EditableSpan} from '../ui/editableSpan/EditableSpan';
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';


export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type PropsType = {
  todolistID: string
  title: string
  tasks: Array<TaskType>
  filter: keyType
  removeTasks: (id: string, todoListID: string) => void
  changeTodoListFilter: (key: keyType, todoListID: string) => void
  addTask: (newTitle: string, todoListID: string) => void
  changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
  changeTaskTitle: (tID: string, title: string, todoListID: string) => void
  removeTodoList: (todoListID: string) => void
  changeTodoListTitle: (title: string, todoListID: string) => void
}

export function Todolist(props: PropsType) {

  // const onFilterClickHandler = (key: keyType) => {
  //   return () => props.changeTodoListFilter(key, props.todolistID)
  // for Custom Component }


  const onClickRemoveTodoList = () => props.removeTodoList(props.todolistID)
  const changeTodoListTitle = (title: string) => props.changeTodoListTitle(title, props.todolistID)

  const onAllClickHandler = () => props.changeTodoListFilter('All', props.todolistID);
  const onActiveClickHandler = () => props.changeTodoListFilter('Active', props.todolistID);
  const onCompletedClickHandler = () => props.changeTodoListFilter('Completed', props.todolistID);


  return <div>
    <h3>
      <EditableSpan
        title={props.title}
        changeTitle={changeTodoListTitle}/>
      <IconButton
        onClick={onClickRemoveTodoList}
        size={'small'}
        color={'primary'}
      >
        <Delete/>
      </IconButton>
    </h3>

    <AddItemForm
      callBack={(newTitle) =>
        props.addTask(newTitle, props.todolistID)}/>

    <ul style={{listStyleType: 'none', paddingLeft: '0'}}>
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
            <Checkbox
              checked={t.isDone}
              onChange={changeTaskStatus}
            />

            <EditableSpan
              changeTitle={changeTaskTitleHandler}
              className={t.isDone ? 'is-done' : ''}
              title={t.title}/>

            <IconButton
              onClick={removeTasksHandler}
              color={'primary'}
              size={'small'}
            >
              <Delete/>
            </IconButton>
          </li>
        )
      })
      }
    </ul>
    <div>

      <Button
        size={'small'}
        variant={'contained'}
        color={props.filter === 'All' ? 'secondary' : 'primary'}
        onClick={onAllClickHandler}>All</Button>

      <Button
        size={'small'}
        color={props.filter === 'Active' ? 'secondary' : 'primary'}
        onClick={onActiveClickHandler}
        variant={'contained'}
      >Active</Button>

      <Button
        size={'small'}
        color={props.filter === 'Completed' ? 'secondary' : 'primary'}
        onClick={onCompletedClickHandler}
        variant={'contained'}
      >Completed</Button>
    </div>
  </div>
}

