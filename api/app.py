from flask import Flask
import chess

app = Flask(__name__)
board = chess.Board()

@app.route('/actualstate')
def get_actual_state():
    return {'actualstate': board.fen()}

@app.route('/restart')
def restart():
    board = chess.Board()
    return {'actualstate': board.fen()}

@app.route('/move/<string:position>')
def move(position):
    try:
        board.push_san(position)
    except:
        return {'validMove': 'False'}
    return {'validMove': 'True'}

