import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import 'chessboard-element';

function App () {
  const [currentTime, setCurrentTime] = useState(0);
  let actualState = 'start';
  let logareamessages = '';

  useEffect(() => {
    const board = document.querySelector('chess-board');
    const startButton = document.getElementById('startBtn');
    const logarea = document.getElementById('logarea');

    fetch('/actualstate').then(res => res.json()).then(data => {
      actualState = data.actualstate;
    });

    startButton.addEventListener('click',
    () => {
      board.start();
      fetch('/restart');
    });

    board.addEventListener('drop', (e) => {
      const {source, target, piece, newPosition, oldPosition, orientation} = e.detail;
      console.log('Source: ' + source)
      console.log('Target: ' + target)
      console.log('Piece: ' + piece)
      console.log('New position: ' + newPosition)
      console.log('Old position: ' + oldPosition)
      console.log('Orientation: ' + orientation)
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

      fetch('/move/' + source + '/' + target).then(res => res.json()).then(data => {
        logarea.innerHTML = logarea.innerHTML + data.error + '\n\n';

        if(data.validMove == 'False') {
          board.move(target + '-' + source);
        }
      });
    });
  }, []);

  return (
    <div className="App">
      <div>
        <h1>&lt;chess-board&gt; and React</h1>
        <div style={{float :'left'}}>
          <strong>White: Human</strong><br />
          Black: Human<br />
          <textarea id="logarea" rows="30" cols="40" value={logareamessages} >
          
          </textarea>
        </div>
        <div style={{width : '400px', margin: '0 auto'}}>
          <chess-board id="board3"
            position={actualState}
            draggable-pieces
            >
          </chess-board>
        </div>
        <div style={{clear:'both'}}></div>
      </div>
      <button id="startBtn">Start Position</button>
      <header className="App-header">

        <p></p>
      </header>
    </div>
  );
}

export default App;
