import React, { useEffect } from 'react';
import './App.css';

import 'chessboard-element';
import 'bootstrap/dist/css/bootstrap.min.css';

function App () {

  useEffect(() => {
    const board = document.querySelector('chess-board');
    const startButton = document.getElementById('startBtn');
    const logarea = document.getElementById('logarea');
    const moveRandomButton = document.getElementById('moveRandomBtn');

    fetch('/actualstate').then(res => res.json()).then(data => {
      board.setAttribute('position', data.actualstate);
    });

    startButton.addEventListener('click',
    () => {
      board.start();
      fetch('/restart');
    });

    moveRandomButton.addEventListener('click',
    () => {
      fetch('/moverandom')
      .then(res => res.json())
      .then(data => {
        board.move(data.move.substring(0, 2) + '-' + data.move.substring(2, 4));
        logarea.innerHTML = logarea.innerHTML + data.error + '\n\n';
      });
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
        let message = data.move;
        if (data.error !== 'False') {
          message = message + ' - ' + data.error;
        }
        logarea.innerHTML = logarea.innerHTML + '\n' + message;

        if (data.validMove === 'False') {
          // MOVE BACK IS NOT VALID - it's buggy
          board.move(target + '-' + source);
        } else {
          // CHECK IF IS NOT OVER 
          fetch('/gameover')
          .then(res => res.json())
          .then(data => {
            if(data.isGameOver === 'True') {
              logarea.innerHTML = logarea.innerHTML + '\n' + data.message;
            }
          });

          // COMPUTER MOVE
          fetch('/moverandom')
          .then(res => res.json())
          .then(data => {
            board.move(data.move.substring(0, 2) + '-' + data.move.substring(2, 4));
            logarea.innerHTML = logarea.innerHTML + '\n' + data.move ;
          });
          // CHECK IF IS NOT OVER 
          fetch('/gameover')
          .then(res => res.json())
          .then(data => {
            if(data.isGameOver === 'True') {
              logarea.innerHTML = logarea.innerHTML + '\n' + data.message ;
            }
          });
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
          Black: AI computer<br />
          <textarea id="logarea" rows="20" cols="40">
          
          </textarea>
        </div>
        <div style={{width : '400px', margin: '0 auto', paddingTop: '47px'}}>
          <chess-board id="board3"
            draggable-pieces
            >
          </chess-board>
        </div>
        <div style={{clear:'both'}}></div>
      </div>
      <br />
      <button class="btn btn-primary" id="startBtn">Start Position</button>&nbsp;
      <button class="btn btn-secondary" id="moveRandomBtn">Move Random</button>
      <br />
      <br />
      <header className="App-header">

        <p>Chillout</p>
      </header>
    </div>
  );
}

export default App;
