import {
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  RemoveTodoListAC,
  todoListsReducer
} from './todolistsReducer';

import {v1} from 'uuid';
import {keyType, TodolistType} from '../App';

let todolistId1: string
let todolistId2: string

let startState: Array<TodolistType>

beforeEach(() => { // ? Определяем здесь значения для всех тестов
                      // ? Выносим за скоуп переменные тудулистов для иммутабельности
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    {id: todolistId1, title: 'What to learn', filter: 'All'},
    {id: todolistId2, title: 'What to buy', filter: 'All'}
  ]
})


test('correct todolist should be removed', () => {

  const endState = todoListsReducer(startState, RemoveTodoListAC(todolistId1))

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
  expect(endState[0].title).toBe('What to buy');
});

test('correct todolist should be added', () => {
  let newTodolistTitle = 'New Todolist';

  const endState = todoListsReducer(startState, addTodoListAC(newTodolistTitle))

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {
  let newTodolistTitle: string = 'New Todolist';

  const action = changeTodoListTitleAC(newTodolistTitle, todolistId2)

  const endState = todoListsReducer(startState, action);

  expect(endState[0].title).toBe('What to learn');
  expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
  let newFilter: keyType = 'Completed';

  const action = changeTodoListFilterAC(newFilter, todolistId2)

  const endState = todoListsReducer(startState, action);

  expect(endState[0].filter).toBe('All');
  expect(endState[1].filter).toBe(newFilter);
});
