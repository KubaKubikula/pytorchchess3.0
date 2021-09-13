import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import 'chessboard-element';

function App () {
  const [currentTime, setCurrentTime] = useState(0);
  let actualState = "start";

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });

    fetch('/actualstate').then(res => res.json()).then(data => {
      actualState = data.actualstate;
    });

    document.getElementById('startBtn').addEventListener('click',
    () => document.getElementById('board3').start());
  }, []);

  return (
    <div className="App">
      <div>
        <h1>&lt;chess-board&gt; and React</h1>
        <p>Here is &lt;chess-board&gt; inside a React app!</p>
        <div style={{width : '400px', margin: '0 auto'}}>
          <chess-board id="board3"
            position={actualState}
            draggable-pieces
            >
          </chess-board>
        </div>
      </div>
      <button id="startBtn">Start Position</button>
      <header className="App-header">

        ... no changes in this part ...

        <p>The current time is {currentTime}. {actualState}</p>
      </header>
    </div>
  );
}

export default App;
