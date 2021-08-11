import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from './Task';
import {action} from '@storybook/addon-actions'
import {TaskType} from '../todolist/Todolist';




const changeTaskStatusCallback = action('Change Task status')
const removeTasksCallback = action('Remove task')
const changeTaskTitleCallback = action('Title is changed')


export default {
  title: 'Todolist/Task',
  component: Task,
  args: {
    changeTaskStatus: changeTaskStatusCallback,
    removeTasks: removeTasksCallback,
    changeTaskTitle: changeTaskTitleCallback
  },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;



const args = {
  changeTaskStatus: changeTaskStatusCallback,
  removeTasks: removeTasksCallback,
  changeTaskTitle: changeTaskTitleCallback
}

export const TaskIsDone = Template.bind({});
TaskIsDone.args = {
  // ...args, Можно в общие аргсы вынести
  todolistID: 'todo1',
  task: {id: '1', title: 'Redux', isDone: true},
}

export const TaskIsNotDone = Template.bind({});
TaskIsNotDone.args = {
  // ...args,
  todolistID: 'todo2',
  task: {id: '2', title: 'JS', isDone: false},
}






