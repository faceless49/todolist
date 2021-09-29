import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from '@material-ui/core';
import {EditableSpan} from '../ui/editableSpan/EditableSpan';
import {Delete} from '@material-ui/icons';
import {TaskType} from '../todolist/Todolist';


type TaskPropsType = {
  removeTasks: (id: string, todoListID: string) => void
  changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
  changeTaskTitle: (tID: string, title: string, todoListID: string) => void
  task: TaskType
  todolistID: string
}

export const Task = React.memo((props: TaskPropsType) => {
  console.log('task render')
  const removeTasksHandler = useCallback(() => {
    props.removeTasks(props.task.id, props.todolistID)
  }, [props.task.id, props.removeTasks, props.todolistID])
  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked
    props.changeTaskStatus(props.task.id, newIsDoneValue, props.todolistID)
  }, [props.task.id, props.changeTaskStatus, props.todolistID])
  const changeTaskTitleHandler = useCallback((title: string) => {
    props.changeTaskTitle(props.task.id, title, props.todolistID)
  }, [props.task.id, props.changeTaskTitle, props.todolistID])

  return (
    <li key={props.task.id}>
      <Checkbox
        checked={props.task.isDone}
        color="primary"
        onChange={changeTaskStatus}
      />

      <EditableSpan
        changeTitle={changeTaskTitleHandler}
        className={props.task.isDone ? 'is-done' : ''}
        title={props.task.title}/>

      <IconButton
        onClick={removeTasksHandler}
        color={'primary'}
        size={'small'}
      >
        <Delete/>
      </IconButton>
    </li>)
})
