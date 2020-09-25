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

// const pieces = {
//   WHITE_PAWN  : 'wp',
//   WHITE_BISHOP: 'wb',
//   WHITE_KNIGHT: 'wn',
//   WHITE_ROOK  : 'wr',
//   WHITE_QUEEN : 'wq',
//   WHITE_KING  : 'wk',

//   BLACK_PAWN  : 'bp',
//   BLACK_BISHOP: 'bb',
//   BLACK_KNIGHT: 'bn',
//   BLACK_ROOK  : 'br',
//   BLACK_QUEEN : 'bq',
//   BLACK_KING  : 'bk',
// }

export const pieceImages = {
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
  'a1': 'wr',
  'b1': 'wn',
  'c1': 'wb',
  'd1': 'wq',
  'e1': 'wk',
  'f1': 'wb',
  'g1': 'wn',
  'h1': 'wr',

  'a2': 'wp',
  'b2': 'wp',
  'c2': 'wp',
  'd2': 'wp',
  'e2': 'wp',
  'f2': 'wp',
  'g2': 'wp',
  'h2': 'wp',

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

  'a7': 'bp',
  'b7': 'bp',
  'c7': 'bp',
  'd7': 'bp',
  'e7': 'bp',
  'f7': 'bp',
  'g7': 'bp',
  'h7': 'bp',

  'a8': 'br',
  'b8': 'bn',
  'c8': 'bb',
  'd8': 'bq',
  'e8': 'bk',
  'f8': 'bb',
  'g8': 'bn',
  'h8': 'br',
};