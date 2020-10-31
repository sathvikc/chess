import React, { PureComponent } from 'react';

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

function getAllCoordinatesByPlayer(player, board) {
  const boardCoordinates = Object.keys(board);

  if(!player) {
    return boardCoordinates;
  }

  const coordinates = [];

  boardCoordinates.map((coordinate) => {
    if(board[coordinate].startsWith(player)) {
      coordinates.push(coordinate);
    }

    return null;
  });

  return coordinates;
}

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

function getKingMoves(piece, board, availableCastlingMovesString) {
  const possibleMoves = [ [1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0] ];
  // const castlingMoves = [ [0, 2], [0, -2] ];
  // const checkCastlingPositions = [ [0, 1], [0, -1] ];

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

  // const availableCastlings = {
  //   w: {
  //     k: availableCastlingMovesString.includes('K'),
  //     q: availableCastlingMovesString.includes('Q'),
  //   },
  //   b: {
  //     k: availableCastlingMovesString.includes('k'),
  //     q: availableCastlingMovesString.includes('q'),
  //   }
  // }

  // const isKingSideCastlingAllowed = availableCastlings[piece['color']]['k'];
  // const isQueenSideCastlingAllowed = availableCastlings[piece['color']]['q'];

  // const isCastlingAllowed = isKingSideCastlingAllowed || isQueenSideCastlingAllowed;

  // if(isCastlingAllowed) {
  //   let isPrevCoordinateEmpty = false;

  //   checkCastlingPositions.map((move) => {
  //     let row = piece['row'] + move[0];
  //     let column = piece['column'] + move[1];
  
  //     if(!isOutOfBounds(row, column)) {
  //       const coordinate = arrayToCoordinate(row, column);
  
  //       const pieceInfo = getPieceInformation(coordinate, board);
  
  //       if(!pieceInfo) {

  //         isPrevCoordinateEmpty = true;
  //       }
  //     }

  //     return null;
  //   });
  // }

  // if(isCastlingAllowed) {
  //   checkCastlingPositions.map((move) => {
  //     let row = piece['row'] + move[0];
  //     let column = piece['column'] + move[1];
      
  //     let suggest = true;
  //     while(suggest) {
  //       const coordinate = arrayToCoordinate(row, column);
  
  //       if(board[coordinate]) {
  //         const pieceInfo = getPieceInformation(coordinate, board);
  
  //         if(pieceInfo) {
  //           suggest = false;
  //         }
  //       }
  
  //       if(suggest) {
  //         availableMoves.push(coordinate);
  //         row += move[0];
  //         column += move[1];
  //       }
  //     }
  
  //     return null;
  //   });
  // }

  // castlingMoves.map((move) => {
  //   let row = piece['row'] + move[0];
  //   let column = piece['column'] + move[1];

  //   if(!isOutOfBounds(row, column)) {
  //     const coordinate = arrayToCoordinate(row, column);

  //     const pieceInfo = getPieceInformation(coordinate, board);

  //     if(!pieceInfo || pieceInfo['color'] !== piece['color']) {
  //       availableMoves.push(coordinate);
  //     }
  //   }

  //   return null;
  // });

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
    return getKingMoves(piece, board, options.castling);
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

function getMovesByCoordinate(coordinate, board, options = {}) {
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
      theme: 'light',
      board: defaultBoardState,
      orientation: WHITE,
      isAutoOrientation: false,
      showPossibleMoves: true,
      playerTurn: WHITE,
      selectedCoordinate: '',
      enPassantPieceCoordinate: '',
      castling: 'KQkq',
      playerInCheck: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.selectedCoordinate === '' && prevState.selectedCoordinate !== this.state.selectedCoordinate) {
      this.validateKingInCheck();
    }
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

  validateKingInCheck = () => {
    const allCoordinates = getAllCoordinatesByPlayer(null, this.state.board);

    let isPlayerInCheck = false;
    let pieceInfoByCheck = null; // Piece Info that put opponent player in check
    let pieceInfoInCheck = null; // Piece Info that in check

    allCoordinates.map((_coordinate) => {
      const moves = getMovesByCoordinate(_coordinate, this.state.board);
      const coordinatePieceInfo = getPieceInformation(_coordinate, this.state.board);

      moves.map((move) => {
        const movePieceInfo = getPieceInformation(move, this.state.board);

        if(movePieceInfo && movePieceInfo['rank'] === 'k' && movePieceInfo['color'] !== coordinatePieceInfo['color']) {
          isPlayerInCheck = true;
          pieceInfoByCheck = coordinatePieceInfo;
          pieceInfoInCheck = movePieceInfo;
        }

        return null;
      });

      return null;
    });

    if(isPlayerInCheck) {
      this.setState({
        playerInCheck: pieceInfoInCheck['color'],
      });
    }

    if(!isPlayerInCheck && this.state.playerInCheck) {
      this.setState({
        playerInCheck: null,
      });
    }

    return isPlayerInCheck;
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

  onThemeChange = (event) => {
    event.preventDefault();
    this.setState({
      theme: event.target.value
    });
  }

  toggleAutoOrientation = (event) => {
    // event.preventDefault();
    this.setState((state) => {
      return {
        isAutoOrientation: !state.isAutoOrientation,
        orientation: this.state.playerTurn,
      } 
    });
  }

  togglePossibleMoves = () => {
    this.setState((state) => {
      return {
        showPossibleMoves: !state.showPossibleMoves,
      } 
    });
  }

  render() {
    const board = this.state.board;

    const isBlack = this.state.isAutoOrientation && this.state.orientation === BLACK;
    const boardPositions = isBlack ? blackBoardPositions : whiteBoardPositions;
    const pieceColorValue = isBlack ? 1 : 0;

    const pieceOptions = { 
      enPassantPieceCoordinate: this.state.enPassantPieceCoordinate,
      castling: this.state.castling,
    };
    const selectedPieceNextMoves = getMovesByCoordinate(this.state.selectedCoordinate, this.state.board, pieceOptions);

    const playerInCheck = this.state.playerInCheck;
    
    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col">
            <h5 className="mt-5 mb-4">Options</h5>

            <div className="form-group row">
              <label className="col-sm-6 col-form-label">Select Theme</label>
              <div className="col-sm-6">
                <select className="custom-select" value={this.state.theme} onChange={this.onThemeChange}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-6 col-form-label">Auto Orientation</label>
              <div className="col-sm-6">
                <div className="form-check mt-1">
                  <input className="form-check-input position-static" type="checkbox" checked={this.state.isAutoOrientation} onChange={this.toggleAutoOrientation} />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-6 col-form-label">Show Possible Moves</label>
              <div className="col-sm-6">
                <div className="form-check mt-1">
                  <input className="form-check-input position-static" type="checkbox" checked={this.state.showPossibleMoves} onChange={this.togglePossibleMoves} />
                </div>
              </div>
            </div>

          </div>

          <div className="col-6">

            <div className="player-turn">
              <span> <strong>{this.state.playerTurn === WHITE ? 'WHITE' : 'BLACK'}</strong> to move</span>
            </div>

            <div className="container">
              <div className={`board ${this.state.theme}`}>
                {boardPositions.map((cellPositions, index) => {
                  index = isBlack ? index + 1 : (index - 8) * -1;
                  const rowId = `row-${index}`;

                  const rowPosition = index;

                  return (
                    <div className="board-row" key={rowId}>
                      {cellPositions.map((cellPosition, inx) => {
                        const cellId = `cell-${cellPosition}`;
                        const cellColor = (rowPosition + inx + pieceColorValue) % 2 === 1 ? 'black' : 'white';

                        const cellCooridinate = `${cellPosition}${rowPosition}`;
                        const chessPiece = board[cellCooridinate] || '';

                        const isChessPiece = board[cellCooridinate] ? true : false;
                        const isPlayerChessPiece = this.isPlayerChessPiece(chessPiece);
                        const isOpponentChessPiece = this.state.enPassantPieceCoordinate ? cellCooridinate === getEnpassantAttackCoordinate(this.state.enPassantPieceCoordinate, this.state.board) || this.isOpponentChessPiece(chessPiece) : this.isOpponentChessPiece(chessPiece);
                        const isActive = this.state.selectedCoordinate === cellCooridinate;
                        const isPossibleMove = selectedPieceNextMoves.includes(cellCooridinate);
                        const isClickable = isPlayerChessPiece || isPossibleMove;

                        const isPlayerKing = chessPiece.startsWith(playerInCheck) && chessPiece.endsWith('k');

                        return (
                          <button 
                            key={cellId} 
                            className={`cell ${cellColor} ${isClickable ? 'pointer' : ''} ${isActive ? 'active' : ''} ${isPlayerKing ? 'check' : ''}`}
                            onClick={() => { this.onCellClick(cellCooridinate); }}
                            disabled={!isClickable}
                          >
                            { isChessPiece ? <img src={pieceImages[board[cellCooridinate]]} className="piece-img" alt="chess piece" /> : null }

                            { this.state.showPossibleMoves && isPossibleMove && <span className={`suggest ${isOpponentChessPiece ? 'red' : ''}`} /> }

                            <span className={`cell-name ${cellColor}`}> {cellCooridinate} </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="col">
            <h5 className="mt-5 mb-4">Move History</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;