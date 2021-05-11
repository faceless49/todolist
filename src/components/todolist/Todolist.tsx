import React from 'react';


export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

type PropsType = { // Мы создаем объект для передачи его в пропсы
  title: string
  tasks: Array<TaskType> // Массив чисел? Нет, Массив объектов тогда нужно описать type TaskType=
}
function Todolist(props: PropsType) { // props = {title: 'What to learn', tasks: []}
debugger

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input/>
        <button>+</button>
      </div>
      <ul>
        <li><input type="checkbox" checked={props.tasks[0].isDone}/> <span>{props.tasks[0].title}</span></li>
        <li><input type="checkbox" checked={props.tasks[1].isDone}/> <span>{props.tasks[1].title}</span></li>
        <li><input type="checkbox" checked={props.tasks[2].isDone}/> <span>{props.tasks[2].title}</span></li>
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
