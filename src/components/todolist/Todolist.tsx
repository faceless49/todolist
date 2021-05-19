import React from 'react';


export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

type PropsToDoListType = { // Мы создаем объект для передачи его в пропсы
  title: string
  tasks: Array<TaskType> // Массив чисел? Нет, Массив объектов тогда нужно описать type TaskType=
  removeTasks: (taskID: number) => void
}

function Todolist(props: PropsToDoListType) { // props = {title: 'What to learn', tasks: []}

  const tasksJSXElements = props.tasks.map(t => {
    const removeTasks = () => props.removeTasks(t.id)
    return (
      <li>
        <input type="checkbox" checked={t.isDone}/>
        <span>{t.title}</span>
        <button onClick={removeTasks}>X</button>
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
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </div>
    </div>
  );
}

export default Todolist;
