// src/App.js
import React from "react";
import VirtualTryOn from "./VirtualTryOn";
import "./styles.css";

const App = () => {
  return (
    <div className="App">
      <header className="app-header">
        <h1>My Pearl Beauty</h1>
        <p>Virtual Try-On Experience</p>
      </header>
      <main className="app-main">
        <VirtualTryOn />
      </main>
    </div>
  );
};

export default App;