import WHITE_PAWN from './images/wp.png';
import WHITE_ROOK from './images/wr.png';
import WHITE_KNIGHT from './images/wn.png';
import WHITE_BISHOP from './images/wb.png';
import WHITE_QUEEN from './images/wq.png';
import WHITE_KING from './images/wk.png';

import BLACK_PAWN from './images/bp.png';
import BLACK_ROOK from './images/br.png';
import BLACK_KNIGHT from './images/bn.png';
import BLACK_BISHOP from './images/bb.png';
import BLACK_QUEEN from './images/bq.png';
import BLACK_KING from './images/bk.png';

export const players = {
  WHITE: 'w',
  BLACK: 'b',
}

const pieces = {
  WHITE_PAWN  : 'wp',
  WHITE_BISHOP: 'wb',
  WHITE_KNIGHT: 'wn',
  WHITE_ROOK  : 'wr',
  WHITE_QUEEN : 'wq',
  WHITE_KING  : 'wk',

  BLACK_PAWN  : 'bp',
  BLACK_BISHOP: 'bb',
  BLACK_KNIGHT: 'bn',
  BLACK_ROOK  : 'br',
  BLACK_QUEEN : 'bq',
  BLACK_KING  : 'bk',
}

const pieceImages = {
  'wp': WHITE_PAWN,
  'wr': WHITE_ROOK,
  'wn': WHITE_KNIGHT,
  'wb': WHITE_BISHOP,
  'wq': WHITE_QUEEN,
  'wk': WHITE_KING,

  'bp': BLACK_PAWN,
  'br': BLACK_ROOK,
  'bn': BLACK_KNIGHT,
  'bb': BLACK_BISHOP,
  'bq': BLACK_QUEEN,
  'bk': BLACK_KING,
}

export const defaultBoardState = {
  'a1': pieceImages[pieces['WHITE_ROOK']],
  'b1': pieceImages[pieces['WHITE_KNIGHT']],
  'c1': pieceImages[pieces['WHITE_BISHOP']],
  'd1': pieceImages[pieces['WHITE_QUEEN']],
  'e1': pieceImages[pieces['WHITE_KING']],
  'f1': pieceImages[pieces['WHITE_BISHOP']],
  'g1': pieceImages[pieces['WHITE_KNIGHT']],
  'h1': pieceImages[pieces['WHITE_ROOK']],

  'a2': pieceImages[pieces['WHITE_PAWN']],
  'b2': pieceImages[pieces['WHITE_PAWN']],
  'c2': pieceImages[pieces['WHITE_PAWN']],
  'd2': pieceImages[pieces['WHITE_PAWN']],
  'e2': pieceImages[pieces['WHITE_PAWN']],
  'f2': pieceImages[pieces['WHITE_PAWN']],
  'g2': pieceImages[pieces['WHITE_PAWN']],
  'h2': pieceImages[pieces['WHITE_PAWN']],

  // 'a3': '',
  // 'b3': '',
  // 'c3': '',
  // 'd3': '',
  // 'e3': '',
  // 'f3': '',
  // 'g3': '',
  // 'h3': '',

  // 'a4': '',
  // 'b4': '',
  // 'c4': '',
  // 'd4': '',
  // 'e4': '',
  // 'f4': '',
  // 'g4': '',
  // 'h4': '',

  // 'a5': '',
  // 'b5': '',
  // 'c5': '',
  // 'd5': '',
  // 'e5': '',
  // 'f5': '',
  // 'g5': '',
  // 'h5': '',

  // 'a6': '',
  // 'b6': '',
  // 'c6': '',
  // 'd6': '',
  // 'e6': '',
  // 'f6': '',
  // 'g6': '',
  // 'h6': '',

  'a7': pieceImages[pieces['BLACK_PAWN']],
  'b7': pieceImages[pieces['BLACK_PAWN']],
  'c7': pieceImages[pieces['BLACK_PAWN']],
  'd7': pieceImages[pieces['BLACK_PAWN']],
  'e7': pieceImages[pieces['BLACK_PAWN']],
  'f7': pieceImages[pieces['BLACK_PAWN']],
  'g7': pieceImages[pieces['BLACK_PAWN']],
  'h7': pieceImages[pieces['BLACK_PAWN']],

  'a8': pieceImages[pieces['BLACK_ROOK']],
  'b8': pieceImages[pieces['BLACK_KNIGHT']],
  'c8': pieceImages[pieces['BLACK_BISHOP']],
  'd8': pieceImages[pieces['BLACK_QUEEN']],
  'e8': pieceImages[pieces['BLACK_KING']],
  'f8': pieceImages[pieces['BLACK_BISHOP']],
  'g8': pieceImages[pieces['BLACK_KNIGHT']],
  'h8': pieceImages[pieces['BLACK_ROOK']],
};