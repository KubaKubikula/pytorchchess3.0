from flask import Flask
import chess
import random

app = Flask(__name__)
board = chess.Board()

# nějaké cookie které bude držet aktuální stav ?

def is_valid_movement(source, target):
    move = chess.Move.from_uci(source + target)
    return move in board.legal_moves

@app.route('/actualstate')
def get_actual_state():
    return {'actualstate': board.fen()}

@app.route('/restart')
def restart():
    board.reset()
    return {'actualstate': board.fen()}

@app.route('/move/<string:source>/<string:target>')
def move(source, target):
    try:
        if is_valid_movement(source, target) != True:
            return {'validMove': 'False', 'error' : 'wrong movement'}
        board.push_san(source + target)
    except ValueError as e:
        return {'validMove': 'False', 'error' : str(e)}
    return {'validMove': 'True', 'error' : 'False'}

@app.route('/moverandom')
def move_random():
    move = random.choice(list(board.legal_moves))
    #print(str(move))
    board.push_san(str(move))
    return {'validMove': 'True', 'error' : 'False', 'move' : str(move)}

@app.route('/gameover')
def game_over():
    isGameOver = 'False'
    message = ''
    if board.is_checkmate():
        isGameOver = 'True'
        message = 'checkmate'
    elif board.is_stalemate():
        isGameOver = 'True'
        message = 'stalemate'
    elif board.is_insufficient_material():
        isGameOver = 'True'
        message = 'insuficient material'
    elif board.is_fivefold_repetition():
        isGameOver = 'True'
        message = '5 repetition'
    return {'isGameOver': isGameOver, 'message' : message }




