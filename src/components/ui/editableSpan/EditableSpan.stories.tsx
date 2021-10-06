import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from '@storybook/addon-actions'
import {EditableSpan} from './EditableSpan';

// const changeTitleCallback = action('Change Task/Title')

export default {
  title: 'Todolist/EditableSpan', // Title Story
  component: EditableSpan,
  argsTypes: {
    changeTitle: {
      description: ' Value EditableSpan changed'
    },
    title: {
      defaultValue: 'Hello World',
      description: 'Start value EditableSpan'
    }
  },
} as ComponentMeta<typeof EditableSpan>;

const EditableSpanTemplate: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanStory = EditableSpanTemplate.bind({});

EditableSpanStory.args = {
  changeTitle: action('Value EditableSpan changed'),
  title: 'DClick me'
};

