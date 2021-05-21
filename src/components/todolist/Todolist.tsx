import React from 'react';
import {FilterValueType} from '../../App';


export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

type PropsToDoListType = { // Мы создаем объект для передачи его в пропсы
  title: string
  tasks: Array<TaskType> // Массив чисел? Нет, Массив объектов тогда нужно описать type TaskType=
  removeTasks: (taskID: number) => void // Тайп - функция, которая получит какое то число, и ничего не ретурнит
  changeTodoListFilter: (filterValue: FilterValueType) => void
}

function Todolist(props: PropsToDoListType) { // props = {title: 'What to learn', tasks: []}

  const tasksJSXElements = props.tasks.map(t => {
    const removeTasks = () => props.removeTasks(t.id)

    return (
      <li>
        <input type="checkbox" checked={t.isDone}/>
        <span>{t.title}</span>
        <button onClick={removeTasks}>X</button>
        {/*  <button onClick={() => props.removeTasks(t.id)}>X</button> -- Так подробнее*/}

      </li>
    )
  })


  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input/>
        <button>+</button>
      </div>
      <ul>
        {tasksJSXElements}
      </ul>
      <div>
        <button onClick={() => props.changeTodoListFilter("all")}>All</button>
        <button onClick={() => props.changeTodoListFilter("active")}>Active</button>
        <button onClick={() => props.changeTodoListFilter("completed")}>Completed</button>
      </div>
    </div>
  );
}

export default Todolist;
