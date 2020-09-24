import React, { PureComponent } from 'react';

import { players, defaultBoardState } from './Constants';

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

  onCellClick = (event) => {
    const cellCooridinate = event.target.value;

    this.setState((state) => {
      return {
        selectedCoordinate: state.selectedCoordinate === cellCooridinate ? '' : cellCooridinate
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
                  const isPiece = board[cellCooridinate] ? true : false;

                  return (
                    <button 
                      key={cellId}
                      value={cellCooridinate}
                      className={`cell ${cellColor} ${isPiece ? 'pointer' : ''}`}
                      onClick={this.onCellClick}
                      disabled={!isPiece}
                    >
                      { isPiece ? <img src={board[cellCooridinate]} className="piece-img" alt="chess piece" /> : null }
                      
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