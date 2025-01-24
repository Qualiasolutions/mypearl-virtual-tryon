import React from "react";
import VirtualTryOn from "./VirtualTryOn";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>My Pearl Beauty</h1>
        <p>Virtual Try-On Experience</p>
      </header>
      <VirtualTryOn />
    </div>
  );
}
