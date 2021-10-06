import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {AddItemForm} from './AddItemForm';
import {action} from '@storybook/addon-actions'


export default {
  title: 'Todolist/AddItemForm', // Title Story
  component: AddItemForm,
  argTypes: { // Additional description for our component(props)
   addItem: { // Our onClick func callback
     description: 'Add task in our todolist'
   },
  },
} as ComponentMeta<typeof AddItemForm>;

const AddItemFormTemplate: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = AddItemFormTemplate.bind({});

AddItemFormStory.args = {
  addItem: action('Add task in our todolist')
};

