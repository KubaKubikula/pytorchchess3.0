from flask import Flask
import chess
import random

app = Flask(__name__)
board = chess.Board()

# nějaké cookie které bude držet aktuální stav ?

def is_valid_movement(source, target):
    move = chess.Move.from_uci(source + target)
    return move in board.legal_moves

# [class Valuator(object):
# def __init__(self):
# import torch
# from train import Net
# vals = torch.load("nets/value.pth", map_location=lambda storage, loc: storage)
# self.model = Net()
# self.model.load_state_dict(vals)

# def __call__(self, s):
# brd = s.serialize()[None]
# output = self.model(torch.tensor(brd).float())
# return float(output.data[0][0])

# # let's write a simple chess value function
# # discussing with friends how simple a minimax + value function can beat me
# # i'm rated about a 1500

# MAXVAL = 10000
# class ClassicValuator(object):
# values = {chess.PAWN: 1,
#     chess.KNIGHT: 3,
#     chess.BISHOP: 3,
#     chess.ROOK: 5,
#     chess.QUEEN: 9,
#     chess.KING: 0}

# def __init__(self):
# self.reset()
# self.memo = {}

# def reset(self):
# self.count = 0

# # writing a simple value function based on pieces
# # good ideas:
# # https://en.wikipedia.org/wiki/Evaluation_function#In_chess
# def __call__(self, s):
# self.count += 1
# key = s.key()
# if key not in self.memo:
# self.memo[key] = self.value(s)
# return self.memo[key]

# def value(self, s):
# b = s.board
# # game over values
# if b.is_game_over():
# if b.result() == "1-0":
# return MAXVAL
# elif b.result() == "0-1":
# return -MAXVAL
# else:
# return 0

# val = 0.0
# # piece values
# pm = s.board.piece_map()
# for x in pm:
# tval = self.values[pm[x].piece_type]
# if pm[x].color == chess.WHITE:
# val += tval
# else:
# val -= tval

# # add a number of legal moves term
# bak = b.turn
# b.turn = chess.WHITE
# val += 0.1 * b.legal_moves.count()
# b.turn = chess.BLACK
# val -= 0.1 * b.legal_moves.count()
# b.turn = bak

# return val

# def computer_minimax(s, v, depth, a, b, big=False):
# if depth >= 5 or s.board.is_game_over():
# return v(s)
# # white is maximizing player
# turn = s.board.turn
# if turn == chess.WHITE:
# ret = -MAXVAL
# else:
# ret = MAXVAL
# if big:
# bret = []

# # can prune here with beam search
# isort = []
# for e in s.board.legal_moves:
# s.board.push(e)
# isort.append((v(s), e))
# s.board.pop()
# move = sorted(isort, key=lambda x: x[0], reverse=s.board.turn)

# # beam search beyond depth 3
# if depth >= 3:
# move = move[:10]

# for e in [x[1] for x in move]:
# s.board.push(e)
# tval = computer_minimax(s, v, depth+1, a, b)
# s.board.pop()
# if big:
# bret.append((tval, e))
# if turn == chess.WHITE:
# ret = max(ret, tval)
# a = max(a, ret)
# if a >= b:
# break  # b cut-off
# else:
# ret = min(ret, tval)
# b = min(b, ret)
# if a >= b:
# break  # a cut-off
# if big:
# return ret, bret
# else:
# return ret

# def explore_leaves(s, v):
# ret = []
# start = time.time()
# v.reset()
# bval = v(s)
# cval, ret = computer_minimax(s, v, 0, a=-MAXVAL, b=MAXVAL, big=True)
# eta = time.time() - start
# print("%.2f -> %.2f: explored %d nodes in %.3f seconds %d/sec" % (bval, cval, v.count, eta, int(v.count/eta)))
# return ret

# # chess board and "engine"
# s = State()
# #v = Valuator()
# v = ClassicValuator()]

# def computer_move(s, v):
#   # computer move
#   move = sorted(explore_leaves(s, v), key=lambda x: x[0], reverse=s.board.turn)
#   if len(move) == 0:
#     return
#   print("top 3:")
#   for i,m in enumerate(move[0:3]):
#     print("  ",m)
#   print(s.board.turn, "moving", move[0][1])
#   s.board.push(move[0][1])

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
            return {'validMove': 'False', 'error' : 'wrong movement', 'move' : source + target}
        board.push_san(source + target)
    except ValueError as e:
        return {'validMove': 'False', 'error' : str(e), 'move' : source + target}
    return {'validMove': 'True', 'error' : 'False', 'move' : source + target}

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




