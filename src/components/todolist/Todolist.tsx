import Header from "./header/Header";
import List from "./list/List";
import Footer from "./footer/Footer";
import React from "react";

type TaskType = {
  id: number,
  title: string,
  isDone: boolean,
}

type PropsType = {
  title: string,
  tasks: Array<TaskType>,
}

function Todolist(props: PropsType) {
  return (
    <div>
      <Header title={props.tasks[0].title} />
      <List/>
      <Footer/>
    </div>
  );
}

export default Todolist;
