import React, { PureComponent } from 'react';

import { players, defaultBoardState, pieceImages } from './Constants';

const { WHITE, BLACK } = players;

const boardPositions = [
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
];

class Board extends PureComponent {
  constructor() {
    super();

    this.state = {
      board: defaultBoardState,
      orientation: WHITE,
      playerTurn: WHITE,
      selectedCoordinate: '',
    };
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

  onCellClick = (cellCooridinate) => {
    this.setState((state) => {
      const prevSelectedChessPiece = this.getCellInformation(state.selectedCoordinate, state.board);
      const selectedChessPiece = this.getCellInformation(cellCooridinate, state.board);
      const isPlayerChessPiece = this.isPlayerChessPiece(selectedChessPiece, state.playerTurn);

      if(!isPlayerChessPiece && prevSelectedChessPiece) {
        return {
          selectedCoordinate: '',
          playerTurn: state.playerTurn === WHITE ? BLACK : WHITE,
          board: {
            ...state.board,
            [state.selectedCoordinate]: '',
            [cellCooridinate]: prevSelectedChessPiece,
          }
        }
      }

      return {
        selectedCoordinate: state.selectedCoordinate === cellCooridinate ? '' : cellCooridinate,
      }
    });
  }

  render() {
    const board = this.state.board;
    
    return (
      <div className="board">
        {
          boardPositions.map((cellPositions, index) => {
            index = (index - 8) * -1;
            const rowId = `row-${index}`;

            const rowPosition = index;

            return (
              <div className="row" key={rowId}>
              {
                cellPositions.map((cellPosition, inx) => {
                  const cellId = `cell-${cellPosition}`;
                  const cellColor = (rowPosition + inx) % 2 === 1 ? 'black' : 'white';

                  const cellCooridinate = `${cellPosition}${rowPosition}`;
                  const chessPiece = board[cellCooridinate] || '';

                  const isChessPiece = board[cellCooridinate] ? true : false;
                  const isPlayerChessPiece = this.isPlayerChessPiece(chessPiece);
                  const isActive = this.state.selectedCoordinate === cellCooridinate;
                  const isClickable = isPlayerChessPiece || this.state.selectedCoordinate;

                  return (
                    <button 
                      key={cellId}
                      className={`cell ${cellColor} ${isClickable ? 'pointer' : ''} ${isActive ? 'active' : ''}`}
                      onClick={() => this.onCellClick(cellCooridinate)}
                      disabled={!isClickable}
                    >
                      { isChessPiece ? <img src={pieceImages[board[cellCooridinate]]} className="piece-img" alt="chess piece" /> : null }

                      <span className="cell-name">
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
    );
  }
}

export default Board;