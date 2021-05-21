import React, {useState} from 'react';
import './App.css';
import Todolist, {TaskType} from './components/todolist/Todolist';

export type FilterValueType = 'all' | 'active' | 'completed'

function App() {
  // let tasksToLearn: Array<TaskType> = [
  //   {id: 1, title: 'HTML&CSS', isDone: true},
  //   {id: 2, title: 'JS', isDone: true},
  //   {id: 3, title: 'ReactJS', isDone: false},
  //   {id: 4, title: 'Redux', isDone: false},
  // ]

  // ! BLL:
//* В фильтре сидит 1 из 3х значений, и глядя на эти значения changeTodoListFilter будет передавать отрисовку
  const [filter, setFilter] = useState<FilterValueType>('all')


  const [tasksToLearn, setTasksToLearn] = useState<Array<TaskType>>([
    {id: 1, title: 'HTML&CSS', isDone: true},
    {id: 2, title: 'JS', isDone: true},
    {id: 3, title: 'ReactJS', isDone: false},
    {id: 4, title: 'Redux', isDone: false},
  ])

  function changeTodoListFilter(filterValue: FilterValueType) {
    setFilter(filterValue)
  }

  // ** Используем хук usestate. В качестве начального значения
  // ** передаем массив tasksToLearn, в качестве параметров принимаешь массив тасктайп
  // ** функция setTasksToLearn - проверяет ли действительно ли мы передаем новые данные в таскс, если да то ререндер UI


  function removeTasks(taskID: number) {
    const filteredTasks = tasksToLearn.filter(t => t.id !== taskID) // * Фильтруем таски по айдишнику
    console.log(filteredTasks)                                      // * если у таски айди не совпадет с нашей искомой то вернется тру
    // tasksToLearn = filteredTasks
    setTasksToLearn(filteredTasks) // * функция setTasksToLearn автоматом будет ререндер
    // * потому что филтертаскс говорит ей, что именно изменилось
  }


  // ? Подаем разные данные в две компоненты, для отрисовки другого JSX
  // ? Для этого мы даем через пропсы массивы tasks
  // ? И указываем их в Todolist в тайпе, что ждем массивы tasks
  // ? В функции всегда задавать данные?

  // const tasksToBuy: Array<TaskType> = [
  //   {id: 1, title: 'Milk', isDone: true},
  //   {id: 2, title: 'Meat', isDone: false},
  //   {id: 3, title: 'Bread', isDone: false},
  // ]

  // ! UI:

  // * мы хотим переключаться в зав-ти от значения фильтра между разными кейсами
  function getFilteredTasks() {
    switch (filter) {
      case 'active':
        return tasksToLearn.filter(t => t.isDone === false)
      case 'completed':
        return tasksToLearn.filter(t => t.isDone === true)
      default:
        return tasksToLearn
    }
  }

  return (
    <div className="App">
      <Todolist
        title={'What to learn'}
        tasks={getFilteredTasks()}
        removeTasks={removeTasks}
        changeTodoListFilter={changeTodoListFilter}/>
      {/*Мы передаем массив с тасками и функцией в нашу компоненту, но ссылку*/}
      {/*<Todolist title="What to buy" tasks={tasksToBuy}/>*/}
    </div>
  );
}


export default App;
