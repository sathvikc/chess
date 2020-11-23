import { players } from './Constants';

const { WHITE, BLACK } = players;

const alphaToNum = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8};
const numToAlpha = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' };

function isOutOfBounds(row, column) {
  return ( row < 1 || row > 8 || column < 1 || column > 8 );
}

export function arrayToCoordinate(_row, _column, move = [0, 0]) {
  const row = _row + move[0];
  const column = _column + move[1];

  if(!isOutOfBounds(row, column)) {
    const columnName = numToAlpha[column];
    const coordinate = `${columnName}${row}`;

    return coordinate;
  }

  return null;
}

export function getEnpassantAttackCoordinate(enPassantPieceCoordinate, board) {
  if(enPassantPieceCoordinate && board[enPassantPieceCoordinate]) {
    const cellInformation = getPieceInformation(enPassantPieceCoordinate, board);
    const rowIncrement = cellInformation['color'] === 'w' ? -1 : 1;
  
    return arrayToCoordinate(cellInformation['row'] + rowIncrement, cellInformation['column']);
  }

  return null;
}

function getPawnMoves(piece, board, enPassantPieceCoordinate) {
  const possibleAttackMoves = { 
    b: [ [-1, -1],  [-1, 1] ],
    w: [ [1, -1], [1, 1] ],
  }

  const enPassantAttackMoves = [ [0, -1], [0, 1] ];

  const availableMoves = [];
  let coordinate = '';

  if(piece['color'] === 'w') {
    coordinate = arrayToCoordinate(piece['row'], piece['column'], [1, 0]);

    if(!board[coordinate]) {
      availableMoves.push(coordinate);
    }

    if(piece['row'] === 2) {
      coordinate = arrayToCoordinate(piece['row'], piece['column'], [2, 0]);
      
      if(!board[coordinate]) {
        availableMoves.push(coordinate);
      }
    }
  }

  if(piece['color'] === 'b') {
    coordinate = arrayToCoordinate(piece['row'], piece['column'], [-1, 0]);
    
    if(!board[coordinate]) {
      availableMoves.push(coordinate);
    }

    if(piece['row'] === 7) {
      coordinate = arrayToCoordinate(piece['row'], piece['column'], [-2, 0]);
      
      if(!board[coordinate]) {
        availableMoves.push(coordinate);
      }
    }
  }

  possibleAttackMoves[piece['color']].map((move) => {
    coordinate = arrayToCoordinate(piece['row'], piece['column'], move);

    const pieceInfo = getPieceInformation(coordinate, board);

    if(board[coordinate] && pieceInfo['color'] !== piece['color']) {
      availableMoves.push(coordinate);
    }

    return null;
  });

  enPassantAttackMoves.map((move) => {
    coordinate = arrayToCoordinate(piece['row'], piece['column'], move);

    const pieceInfo = getPieceInformation(coordinate, board);

    if(board[coordinate] && pieceInfo['color'] !== piece['color'] && coordinate === enPassantPieceCoordinate) {
      const attackCoordinate = getEnpassantAttackCoordinate(enPassantPieceCoordinate, board);

      if(attackCoordinate) {
        availableMoves.push(attackCoordinate);
      }
    }

    return null;
  });

  return availableMoves;
}

function getRookMoves(piece, board) {
  const possibleMoves = [ [0, 1], [0, -1], [1, 0], [-1, 0] ];

  const availableMoves = [ ];

  possibleMoves.map((move) => {
    let row = piece['row'] + move[0];
    let column = piece['column'] + move[1];
    
    let suggest = true;
    while(suggest && !isOutOfBounds(row, column)) {
      const coordinate = arrayToCoordinate(row, column);

      if(board[coordinate]) {
        const pieceInfo = getPieceInformation(coordinate, board);

        if(pieceInfo['color'] === piece['color']) {
          suggest = false;
        } else {
          availableMoves.push(coordinate);
          suggest = false;
        }
      }

      if(suggest) {
        availableMoves.push(coordinate);
        row += move[0];
        column += move[1];
     }
    }

    return null;
  });

  return availableMoves;
}

function getKnightMoves(piece, board) {
  const possibleMoves = [ [-1, -2], [-2, -1], [1, -2], [-2, 1], [2, -1], [-1, 2], [2, 1], [1, 2] ];

  const availableMoves = [];

  possibleMoves.map((move) => {
    let row = piece['row'] + move[0];
    let column = piece['column'] + move[1];

    if(!isOutOfBounds(row, column)) {
      const coordinate = arrayToCoordinate(row, column);

      const pieceInfo = getPieceInformation(coordinate, board);

      if(!pieceInfo || pieceInfo['color'] !== piece['color']) {
        availableMoves.push(coordinate);
      }
    }

    return null;
  });

  return availableMoves;
}

function getBishopMoves(piece, board) {
  const possibleMoves = [ [1, 1], [1, -1], [-1, 1], [-1, -1] ];

  const availableMoves = [];

  possibleMoves.map((move) => {
    let row = piece['row'] + move[0];
    let column = piece['column'] + move[1];
    
    let suggest = true;
    while(suggest && !isOutOfBounds(row, column)) {
      const coordinate = arrayToCoordinate(row, column);

      if(board[coordinate]) {
        const pieceInfo = getPieceInformation(coordinate, board);

        if(pieceInfo['color'] === piece['color']) {
          suggest = false;
        } else {
          availableMoves.push(coordinate);
          suggest = false;
        }
      }

      if(suggest) {
        availableMoves.push(coordinate);
        row += move[0];
        column += move[1];
     }
    }

    return null;
  });

  return availableMoves;
}

function getQueenMoves(piece, board) {
  const possibleMoves = [ [1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0] ];

  const availableMoves = [];

  possibleMoves.map((move) => {
    let row = piece['row'] + move[0];
    let column = piece['column'] + move[1];
    
    let suggest = true;
    while(suggest && !isOutOfBounds(row, column)) {
      const coordinate = arrayToCoordinate(row, column);

      if(board[coordinate]) {
        const pieceInfo = getPieceInformation(coordinate, board);

        if(pieceInfo['color'] === piece['color']) {
          suggest = false;
        } else {
          availableMoves.push(coordinate);
          suggest = false;
        }
      }

      if(suggest) {
        availableMoves.push(coordinate);
        row += move[0];
        column += move[1];
     }
    }

    return null;
  });

  return availableMoves;
}

function checkCastlingAvailable(castlingString, piece, returnString = false) {
  if(castlingString) {
    const regexString = piece['color'] === WHITE ? /[A-Z]+/g : /[a-z]+/g;

    const result = castlingString.match(regexString);

    if(result && returnString) {
      return result[0];
    }

    return result ? true : false;
  }

  return false;
}

function getKingMoves(piece, board, castlingString) {
  const possibleMoves = [ [1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0] ];

  const availableMoves = [];

  possibleMoves.map((move) => {
    let row = piece['row'] + move[0];
    let column = piece['column'] + move[1];

    if(!isOutOfBounds(row, column)) {
      const coordinate = arrayToCoordinate(row, column);

      const pieceInfo = getPieceInformation(coordinate, board);

      if(!pieceInfo || pieceInfo['color'] !== piece['color']) {
        availableMoves.push(coordinate);
      }
    }

    return null;
  });

  const playerCastlingString = checkCastlingAvailable(castlingString, piece, true);

  if(playerCastlingString) {
    const isKingSideCastlingAvailable = playerCastlingString.toLowerCase().includes('k');
    const isQueenSideCastlingAvailable = playerCastlingString.toLowerCase().includes('q');

    const row = piece['row'];
    const column = piece['column'];
    
    if(isKingSideCastlingAvailable) {
      if (
        !board[arrayToCoordinate(row, column + 1)]
        && !board[arrayToCoordinate(row, column + 2)]
      ) {
        const coordinate = arrayToCoordinate(row, column + 2);

        availableMoves.push(coordinate)
      }
    }

    if(isQueenSideCastlingAvailable) {
      if (
        !board[arrayToCoordinate(row, column - 1)]
        && !board[arrayToCoordinate(row, column - 2)]
        && !board[arrayToCoordinate(row, column - 3)]
      ) {
        const coordinate = arrayToCoordinate(row, column - 2);

        availableMoves.push(coordinate)
      }
    }
  }

  return availableMoves;
}

function getMovesBySelectedPiece(piece, board, options) {
  if(!piece) return [];

  if(piece['rank'] === 'p') { // pawn
    return getPawnMoves(piece, board, options.enPassantPieceCoordinate);
  }

  if(piece['rank'] === 'r') { // rook
    return getRookMoves(piece, board);
  }

  if(piece['rank'] === 'n') { // knight
    return getKnightMoves(piece, board);
  }

  if(piece['rank'] === 'b') { // bishop
    return getBishopMoves(piece, board);
  }

  if(piece['rank'] === 'q') { // queen
    return getQueenMoves(piece, board);
  }

  if(piece['rank'] === 'k') { // king
    return getKingMoves(piece, board, options.castling);
  }

  return [];
}

export function getPieceInformation(coordinate, board) {
  if(coordinate && board[coordinate]) {
    const { row, column } = getCoordinateInformation(coordinate);
  
    const color = board[coordinate][0];
    const rank = board[coordinate][1];
  
    return {
      row: row,
      column: column,
      rank: rank,
      color: color,
    }
  }

  return null;
}

export function getCoordinateInformation(coordinate) {
  const column = coordinate[0];
  const row = coordinate[1];

  return {
    row: Number(row),
    column: Number(alphaToNum[column]),
  }
}

export function getMovesByCoordinate(coordinate, board, options = {}) {
  const pieceInfo = getPieceInformation(coordinate, board);
  const moves = getMovesBySelectedPiece(pieceInfo, board, options);

  return moves;
}

export function isValidMove(sourceCoordinate, targetCoordinate, board, options) {
  if(!sourceCoordinate) return false;

  const validMoves = getMovesByCoordinate(sourceCoordinate, board, options);

  return validMoves.includes(targetCoordinate);
}

export function boardToFEN(board, playerTurn, castling, enPassant, historyMoves, halfMoveClock, fullMoveCount) {
  const historyMovesLength = historyMoves.length;
  const historyMovesIndexLength = historyMovesLength - 1;
  const latestMove = historyMovesIndexLength >= 0 ? historyMoves[historyMovesIndexLength] : [];
  const fullMoveCount_ = historyMovesIndexLength >= 0 ? ( latestMove.length === 2 ? historyMovesLength + 1 : historyMovesIndexLength + 1 ) : fullMoveCount;

  let FENString = '';

  for(let row = 8; row >= 1; row--) {
    let emptyCoordinateCount = 0;

    for(let column = 1; column <= 8; column++) {
      const columnName = numToAlpha[column];
      const coordinate = `${columnName}${row}`;

      const pieceInfo = getPieceInformation(coordinate, board);

      if(pieceInfo) {
        const rank = pieceInfo['color'] === WHITE ? pieceInfo['rank'].toUpperCase() : pieceInfo['rank'];
        FENString = emptyCoordinateCount > 0 ? FENString + emptyCoordinateCount + rank : FENString + rank;
        emptyCoordinateCount = 0;
      } else {
        emptyCoordinateCount++;

        if(emptyCoordinateCount === 8) {
          FENString += emptyCoordinateCount;
          emptyCoordinateCount = 0;
        }
      }
    }

    if(emptyCoordinateCount) {
      FENString+= emptyCoordinateCount;
    }

    if(row !== 1) {
      FENString+= '/';
    }
  }

  return {
    FENString: `${FENString} ${playerTurn} ${castling} ${enPassant} ${halfMoveClock} ${fullMoveCount_}`,
    fullMoveCount: fullMoveCount_
  }
}

export function FENToBoard(string) {
  const [ boardString, playerTurn, castling, enPassant, halfMoveClock, fullMoveCount ] = string.split(' ');

  const rows = boardString.split('/');

  const board = {};

  let rowCount = 8;
  rows.map((row, inx) => {
    const columnPieces = row.split('');
    const rowCoordinate = rowCount - inx;

    let emptyCoordinateCount = 0;

    columnPieces.map((piece, columnInx) => {

      if(isNaN(piece)) {
        const columnCoordinate = numToAlpha[columnInx + 1 + emptyCoordinateCount];
        const color = piece === piece.toUpperCase() ? WHITE : BLACK;
        const rank = piece.toLowerCase();
  
        board[`${columnCoordinate}${rowCoordinate}`] = `${color}${rank}`;
      } else {
        emptyCoordinateCount = emptyCoordinateCount + Number(piece) - 1;
      }

      return null;
    });

    return null;
  });

  return {
    board: board,
    playerTurn: playerTurn,
    castling: castling,
    enPassantPieceCoordinate: enPassant === '-' ? '' : enPassant,
    fullMoveCount: fullMoveCount,
    halfMoveClock: halfMoveClock
  }
}