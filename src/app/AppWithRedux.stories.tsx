import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import AppWithRedux from "./AppWithRedux";
import { ReduxStoreProviderDecorator } from "../store/ReduxStoreProviderDecorator";

export default {
  title: "Todolist/AppWithRedux",
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof AppWithRedux>;

const Template: ComponentStory<typeof AppWithRedux> = () => <AppWithRedux />;

export const AppWithReduxStories = Template.bind({});
AppWithReduxStories.args = {};
