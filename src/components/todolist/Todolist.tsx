import Header from "./header/Header";
import List from "./list/List";
import Footer from "./footer/Footer";
import React from "react";

function Todolist(props:any) {
  return (
    <div>
      <Header/>
      <List/>
      <Footer/>
    </div>
  );
}

export default Todolist;
