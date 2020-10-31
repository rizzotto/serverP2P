import "./App.css";
import React, { useState } from "react";

function App() {
  const [resources, setResources] = useState([
    { name: "Star Wars", id: 0},
    { name: "Lord of the Rings", id: 1 },
    { name: "Harry Potter", id: 2 },
  ]);

  return (
    <div className="App">
      <body className="App-body">
        <div className="list">
          {resources.map((item) => (
            <div className="resource">{item.name}</div>
          ))}
        </div>
      </body>
    </div>
  );
}

export default App;
