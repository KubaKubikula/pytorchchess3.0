from flask import Flask
import chess

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
        board.push_san(target)
    except ValueError as e:
        return {'validMove': 'False', 'error' : str(e)}
    return {'validMove': 'True', 'error' : 'False'}

@app.route('/moverandom')
def move_random():
    return {'validMove': 'True', 'error' : 'False'}