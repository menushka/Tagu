import * as React from "react";
import * as ReactDOM from "react-dom";
import { Search } from "./components/search";

const callback = () => {
  console.log("Test");
}

ReactDOM.render(
  <Search onChange={callback}/>,
  document.getElementById("example")
);

// import { ImageDatabase, Image } from './database';

// const imageDatabase = new ImageDatabase()
// imageDatabase.connect();

// imageDatabase.close();
