import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import 'chessboard-element';

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
        logarea.innerHTML = logarea.innerHTML + data.error + '\n\n';

        if(data.validMove == 'False') {
          // MOVE BACK IS NOT VALID
          board.move(target + '-' + source);
        } else {
          // CHECK IF IS NOT OVER 
          fetch('/gameover')
          .then(res => res.json())
          .then(data => {
            if(data.isGameOver == 'True') {
              logarea.innerHTML = logarea.innerHTML + data.message + '\n\n';
            }
          });

          // COMPUTER MOVE
          fetch('/moverandom')
          .then(res => res.json())
          .then(data => {
            board.move(data.move.substring(0, 2) + '-' + data.move.substring(2, 4));
            logarea.innerHTML = logarea.innerHTML + data.error + '\n\n';
          });
          // CHECK IF IS NOT OVER 
          fetch('/gameover')
          .then(res => res.json())
          .then(data => {
            if(data.isGameOver == 'True') {
              logarea.innerHTML = logarea.innerHTML + data.message + '\n\n';
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
          Black: Human<br />
          <textarea id="logarea" rows="30" cols="40">
          
          </textarea>
        </div>
        <div style={{width : '400px', margin: '0 auto'}}>
          <chess-board id="board3"
            draggable-pieces
            >
          </chess-board>
        </div>
        <div style={{clear:'both'}}></div>
      </div>
      <button id="startBtn">Start Position</button>
      <button id="moveRandomBtn">Move Random</button>
      <header className="App-header">

        <p>Chillout</p>
      </header>
    </div>
  );
}

export default App;
