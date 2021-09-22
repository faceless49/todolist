import {TaskStateType, TodolistType} from '../App';
import {tasksReducer} from './taskReducer';
import {addTodoListAC, todoListsReducer} from './todolistsReducer';

test('ids should be equals', () => {
  const startTasksState: TaskStateType = {};
  const startTodolistsState: Array<TodolistType> = [];

  const action = addTodoListAC("new todolist");

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todoListsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.todoListID);
  expect(idFromTodolists).toBe(action.todoListID);
});

