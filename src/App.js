import React, { Component } from 'react';
import './App.css';
import MemoryGame from './components/MemoryGame.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MemoryGame />
      </div>
    );
  }
}

export default App;
