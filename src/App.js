import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import 'chessboard-element';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="App">
      <div>
        <h1>&lt;chess-board&gt; and React</h1>
        <p>Here is &lt;chess-board&gt; inside a React app!</p>
        <div style={{width : '400px', margin: '0 auto'}}>
          <chess-board
            position="start"
            draggable-pieces
            >
          </chess-board>
        </div>
      </div>
      <header className="App-header">

        ... no changes in this part ...

        <p>The current time is {currentTime}.</p>
      </header>
    </div>
  );
}

export default App;
