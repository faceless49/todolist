import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import App from "./AppWithRedux";
import { ReduxStoreProviderDecorator } from "../store/ReduxStoreProviderDecorator";

export default {
  title: "Todolist/AppWithRedux",
  component: App,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = () => <App />;

export const AppWithReduxStories = Template.bind({});
AppWithReduxStories.args = {};
