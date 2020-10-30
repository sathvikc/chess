import React, { PureComponent, Fragment } from 'react';

import { players, defaultBoardState, pieceImages } from './Constants';

const { WHITE, BLACK } = players;

const whiteBoardPositions = [
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
];

const blackBoardPositions = [
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
];

const alphaToNum = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8};
const numToAlpha = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' };

function isOutOfBounds(row, column) {
  return ( row < 1 || row > 8 || column < 1 || column > 8 );
}

function arrayToCoordinate(_row, _column, move = [0, 0]) {
  const row = _row + move[0];
  const column = _column + move[1];

  if(!isOutOfBounds(row, column)) {
    const columnName = numToAlpha[column];
    const coordinate = `${columnName}${row}`;

    return coordinate;
  }

  return null;
}

function getEnpassantAttackCoordinate(enPassantPieceCoordinate, board) {
  const cellInformation = getPieceInformation(enPassantPieceCoordinate, board);
  const rowIncrement = cellInformation['color'] === 'w' ? -1 : 1;

  return arrayToCoordinate(cellInformation['row'] + rowIncrement, cellInformation['column']);
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

      availableMoves.push(attackCoordinate);
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

function getKingMoves(piece, board) {
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

  return availableMoves;
}

function getMovesBySelectedPiece(piece, board, options) {
  if(!piece) return [];

  if(piece['rank'] === 'p') {
    return getPawnMoves(piece, board, options.enPassantPieceCoordinate);
  }

  if(piece['rank'] === 'r') {
    return getRookMoves(piece, board);
  }

  if(piece['rank'] === 'n') {
    return getKnightMoves(piece, board);
  }

  if(piece['rank'] === 'b') {
    return getBishopMoves(piece, board);
  }

  if(piece['rank'] === 'q') {
    return getQueenMoves(piece, board);
  }

  if(piece['rank'] === 'k') {
    return getKingMoves(piece, board);
  }

  return [];
}

function getPieceInformation(coordinate, board) {
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

function getCoordinateInformation(coordinate) {
  const column = coordinate[0];
  const row = coordinate[1];

  return {
    row: Number(row),
    column: Number(alphaToNum[column]),
  }
}

function getMovesByCoordinate(coordinate, board, options) {
  const pieceInfo = getPieceInformation(coordinate, board);
  const moves = getMovesBySelectedPiece(pieceInfo, board, options);

  return moves;
}

function isValidMove(sourceCoordinate, targetCoordinate, board, options) {
  if(!sourceCoordinate) return false;

  const validMoves = getMovesByCoordinate(sourceCoordinate, board, options);

  return validMoves.includes(targetCoordinate);
}

class Board extends PureComponent {
  orientationTimeout = null;

  constructor() {
    super();

    this.state = {
      board: defaultBoardState,
      orientation: WHITE,
      isAutoOrientation: false,
      playerTurn: WHITE,
      selectedCoordinate: '',
      enPassantPieceCoordinate: '',
    };
  }

  componentWillUnmount() {
    if(this.state.isAutoOrientation && this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }
  }

  setPlayerBoard = () => {
    this.setState((state) => {
      const player = state.playerTurn === WHITE ? BLACK : WHITE;

      return { 
        playerTurn: player,
        orientation: player,
      }
    });
  };

  getCellInformation = (cellCooridinate, board) => {
    const chessPiece =  board ? board[cellCooridinate] : this.state.board[cellCooridinate];

    return chessPiece || '';
  }

  isPlayerChessPiece = (chessPiece = '', playerTurn = this.state.playerTurn) => {
    return chessPiece.startsWith(playerTurn);
  }

  isOpponentChessPiece = (chessPiece = '', playerTurn = this.state.playerTurn) => {
    const opponentPlayer = playerTurn === WHITE ? BLACK : WHITE;

    return chessPiece.startsWith(opponentPlayer);
  }

  isEnPassant = (prevCoordinate, coordinate) => {
    const prevPieceInfo = getCoordinateInformation(prevCoordinate);
    const pieceInfo = getCoordinateInformation(coordinate);

    const rowMovementDiff = Math.abs(prevPieceInfo['row'] - pieceInfo['row']);

    if(rowMovementDiff === 2) {
      return true;
    }

    return false;
  }

  // onCellClick = (cellCooridinate, event) => {
  //   this.setState((state) => {
  //     const prevSelectedCell = this.getCellInformation(state.selectedCoordinate, state.board);
  //     const selectedCell = this.getCellInformation(cellCooridinate, state.board);
  //     const isPlayerChessPiece = this.isPlayerChessPiece(selectedCell, state.playerTurn);

  //     if(!isPlayerChessPiece && prevSelectedCell) {
  //       const isValid = isValidMove(state.selectedCoordinate, cellCooridinate, state.board, { enPassantPieceCoordinate: state.enPassantPieceCoordinate });
  //       const isPawn = isValid && getPieceInformation(state.selectedCoordinate, state.board)['rank'] === 'p';
  //       const enPassantPieceCoordinate = isValid && isPawn && this.isEnPassant(state.selectedCoordinate, cellCooridinate) ? cellCooridinate : '';

  //       if(isValid) {
  //         return {
  //           selectedCoordinate: '',
  //           enPassantPieceCoordinate: enPassantPieceCoordinate,
  //           playerTurn: state.playerTurn === WHITE ? BLACK : WHITE,
  //           board: {
  //             ...state.board,
  //             [state.selectedCoordinate]: '',
  //             [cellCooridinate]: prevSelectedCell,
  //             // [enPassantPieceCoordinate]: cellCooridinate === getEnpassantAttackCoordinate(state.enPassantPieceCoordinate) ? '' : 
  //           }
  //         }
  //       }
        
  //       return null;
  //     }

  //     return {
  //       selectedCoordinate: state.selectedCoordinate === cellCooridinate ? '' : cellCooridinate,
  //     }
  //   }, this.setOrientation);
  // }

  onCellClick = (cellCooridinate) => {
    const prevSelectedCell = this.getCellInformation(this.state.selectedCoordinate, this.state.board);
    const selectedCell = this.getCellInformation(cellCooridinate, this.state.board);
    const isPlayerChessPiece = this.isPlayerChessPiece(selectedCell, this.state.playerTurn);

    if(!isPlayerChessPiece && prevSelectedCell) {
      const isValid = isValidMove(this.state.selectedCoordinate, cellCooridinate, this.state.board, { enPassantPieceCoordinate: this.state.enPassantPieceCoordinate });
      const isPawn = isValid && getPieceInformation(this.state.selectedCoordinate, this.state.board)['rank'] === 'p';
      const enPassantPieceCoordinate = isValid && isPawn && this.isEnPassant(this.state.selectedCoordinate, cellCooridinate) ? cellCooridinate : '';

      let enPassantCooridinate = {};

      if(this.state.enPassantPieceCoordinate && cellCooridinate === getEnpassantAttackCoordinate(this.state.enPassantPieceCoordinate, this.state.board)) {
        enPassantCooridinate = {
          [this.state.enPassantPieceCoordinate]: '',
        }
      }

      if(isValid) {
        this.setState({
          selectedCoordinate: '',
          enPassantPieceCoordinate: enPassantPieceCoordinate,
          playerTurn: this.state.playerTurn === WHITE ? BLACK : WHITE,
          board: {
            ...this.state.board,
            ...enPassantCooridinate,
            [this.state.selectedCoordinate]: '',
            [cellCooridinate]: prevSelectedCell,
          }
        }, this.setOrientation);
      }
    } else {
      this.setState({
        selectedCoordinate: this.state.selectedCoordinate === cellCooridinate ? '' : cellCooridinate,
      }, this.setOrientation);
    }
  }

  setOrientation = () => {
    if(this.state.isAutoOrientation) {
      this.orientationTimeout = setTimeout(() => {
        this.setState({
          orientation: this.state.playerTurn
        });
      }, 1000);
    }
  }

  render() {
    const board = this.state.board;

    const isBlack = this.state.isAutoOrientation && this.state.orientation === BLACK;
    const boardPositions = isBlack ? blackBoardPositions : whiteBoardPositions;
    const pieceColorValue = isBlack ? 1 : 0;

    const selectedPieceNextMoves = getMovesByCoordinate(this.state.selectedCoordinate, this.state.board, { enPassantPieceCoordinate: this.state.enPassantPieceCoordinate });
    
    return (
      <Fragment>
        <div className="player-turn">
          <span> <strong>{ this.state.playerTurn === WHITE ? 'WHITE' : 'BLACK' }</strong> to move </span>
        </div>
        <div className="board light">
          {
            boardPositions.map((cellPositions, index) => {
              index = isBlack ? index + 1 : (index - 8) * -1;
              const rowId = `row-${index}`;

              const rowPosition = index;

              return (
                <div className="row" key={rowId}>
                {
                  cellPositions.map((cellPosition, inx) => {
                    const cellId = `cell-${cellPosition}`;
                    const cellColor = (rowPosition + inx + pieceColorValue) % 2 === 1 ? 'black' : 'white';

                    const cellCooridinate = `${cellPosition}${rowPosition}`;
                    const chessPiece = board[cellCooridinate] || '';

                    const isChessPiece = board[cellCooridinate] ? true : false;
                    const isPlayerChessPiece = this.isPlayerChessPiece(chessPiece);
                    const isOpponentChessPiece = this.state.enPassantPieceCoordinate ? cellCooridinate === getEnpassantAttackCoordinate(this.state.enPassantPieceCoordinate, this.state.board) : this.isOpponentChessPiece(chessPiece);
                    const isActive = this.state.selectedCoordinate === cellCooridinate;
                    const isPossibleMove = selectedPieceNextMoves.includes(cellCooridinate);
                    const isClickable = isPlayerChessPiece || isPossibleMove;

                    return (
                      <button 
                        key={cellId}
                        className={`cell ${cellColor} ${isClickable ? 'pointer' : ''} ${isActive ? 'active' : ''}`}
                        onClick={() => { this.onCellClick(cellCooridinate); }}
                        disabled={!isClickable}
                      >
                        { isChessPiece ? <img src={pieceImages[board[cellCooridinate]]} className="piece-img" alt="chess piece" /> : null }

                        { isPossibleMove && <span className={`suggest ${isOpponentChessPiece && 'red'}`} /> }

                        <span className={`cell-name ${cellColor}`}>
                          { cellCooridinate }
                        </span>
                      </button>
                    );
                  })
                }
              </div>
              );
            })
          }
        </div>
      </Fragment>
    );
  }
}

export default Board;