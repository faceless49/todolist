import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Task } from './Task';
import { action } from '@storybook/addon-actions';
import { TaskPriorities, TaskStatuses } from '../../api/todolist-api';

const changeTaskStatusCallback = action('Change Task Status');
const removeTasksCallback = action('Remove Task');
const changeTaskTitleCallback = action('Title is changed');

export default {
  title: 'Todolist/Task',
  component: Task,
  args: {
    changeTaskStatus: changeTaskStatusCallback,
    removeTasks: removeTasksCallback,
    changeTaskTitle: changeTaskTitleCallback
  }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

// const baseArgs = { Можно сразу подбросить в export default args с данными колбеками
//   changeTaskStatus: changeTaskStatusCallback,
//   removeTasks: removeTasksCallback,
//   changeTaskTitle: changeTaskTitleCallback
// }

export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {
  //...baseArgs, //  Можно в общие аргсы вынести указаны выше
  todolistID: 'todo1',
  task: {
    id: '1',
    title: 'Redux',
    status: TaskStatuses.Completed,
    startDate: '',
    deadline: '',
    addedDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    description: '',
    todoListId: 'todo1'
  }
};

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
  //...baseArgs,
  todolistID: 'todo2',
  task: {
    id: '2',
    title: 'JS',
    status: TaskStatuses.New,
    startDate: '',
    deadline: '',
    addedDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    description: '',
    todoListId: 'todo2'
  }
};
