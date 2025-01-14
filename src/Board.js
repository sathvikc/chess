import React, { PureComponent } from 'react';

import { players, defaultBoardState, pieceImages, castlingReplaceStrings } from './Constants';
import { isValidMove, boardToFEN, FENToBoard, getCoordinateInformation, getPieceInformation, getEnpassantAttackCoordinate, arrayToCoordinate, getMovesByCoordinate } from './utils';
import Chess from './Chess';

const chess = new Chess();

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

class Board extends PureComponent {
  orientationTimeout = null;

  constructor() {
    super();

    const defaultFENString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    this.state = {
      theme: 'light',
      board: defaultBoardState,
      orientation: WHITE,
      isAutoOrientation: false,
      showPossibleMoves: true,
      playerTurn: WHITE,
      selectedCoordinate: '',
      enPassantPieceCoordinate: '',
      promotionCoordinate: '',
      castling: 'KQkq',
      playerInCheck: null,
      historyMoves: [],
      showUndoButton: true,
      FENString: defaultFENString,
      fullMoveCount: 1,
      halfMoveClock: 0,
      checkMate: null,
    };

    chess.load(defaultFENString);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.selectedCoordinate === '' && prevState.selectedCoordinate !== this.state.selectedCoordinate) {
      this.updateFEN();
    }
  }

  componentWillUnmount() {
    if(this.state.isAutoOrientation && this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }
  }

  historyMoves = [];

  initializeNewGame = () => {
    const defaultFENString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    this.setState({
      board: defaultBoardState,
      orientation: WHITE,
      playerTurn: WHITE,
      selectedCoordinate: '',
      enPassantPieceCoordinate: '',
      castling: 'KQkq',
      playerInCheck: null,
      historyMoves: [],
      promotionCoordinate: '',
      FENString: defaultFENString,
      fullMoveCount: 1,
      halfMoveClock: 0,
      checkMate: null,
    });

    this.historyMoves = [];

    chess.load(defaultFENString);
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

  getCastingString = (string, pieceInfo) => {
    if(string) {
      let replaceString = '';
      let replaceStringWith = '';

      const rank = pieceInfo['rank'];
  
      if(rank === 'k') {
        if(string.length === 4) {
          replaceString = pieceInfo['color'] === WHITE ? string.slice(0, 2) :  string.slice(2, 4);
        } else {
          replaceString = string;
        }

        replaceStringWith = '';
      }
  
      if(rank === 'r') {
        const {row, column, color} = pieceInfo;
  
        if(row === 1 || row === 8) {
          replaceString = column === 8 ? 'k' : 'q';
          replaceStringWith = '-';

          if(color === WHITE) {
            replaceString = replaceString.toUpperCase();
          }
        }
      }

      let result = string.replace(replaceString, replaceStringWith);

      return castlingReplaceStrings[result] ? castlingReplaceStrings[result] : result;
    }

    return string;
  }

  checkPawnPromotion = (pieceInfo, selectedCell) => {
    const color = pieceInfo['color'];
    const { row } = getCoordinateInformation(selectedCell);

    if(
        (color === BLACK && row === 1) 
        || (color === WHITE && row === 8)
    ) {
      return true;
    }

    return false;
  }

  checkCastlingPerformed = (prevCoordinate, coordinate) => {
    const prevPieceInfo = getCoordinateInformation(prevCoordinate);
    const pieceInfo = getCoordinateInformation(coordinate);

    const columnMovementDiff = pieceInfo['column'] - prevPieceInfo['column'];

    if(columnMovementDiff === 2) {
      return 'k';
    }

    if(columnMovementDiff === -2) {
      return 'q';
    }

    return false;
  }

  onCellClick = (cellCooridinate) => {
    const prevSelectedCoordinate = this.state.selectedCoordinate;
    const prevSelectedCell = this.getCellInformation(prevSelectedCoordinate, this.state.board);
    const selectedCell = this.getCellInformation(cellCooridinate, this.state.board);
    const isPlayerChessPiece = this.isPlayerChessPiece(selectedCell, this.state.playerTurn);
    const cellInfo = getCoordinateInformation(cellCooridinate);
    
    if(!isPlayerChessPiece && prevSelectedCell) {
      const isValid = isValidMove(prevSelectedCoordinate, cellCooridinate, this.state.board, { enPassantPieceCoordinate: this.state.enPassantPieceCoordinate, castling: this.state.castling });

      if(isValid) {
        const selectedPieceInfo = getPieceInformation(prevSelectedCoordinate, this.state.board);
        
        // En Passant
        const isPawn = selectedPieceInfo['rank'] === 'p';
        const enPassantPieceCoordinate = isPawn && this.isEnPassant(prevSelectedCoordinate, cellCooridinate) ? cellCooridinate : '';

        let enPassantCooridinate = {};

        const enPassantAttackCoordinate = this.state.enPassantPieceCoordinate ? getEnpassantAttackCoordinate(this.state.enPassantPieceCoordinate, this.state.board) : null;
        const isEnPassantAttack = cellCooridinate === enPassantAttackCoordinate;
        if(isEnPassantAttack) {
          enPassantCooridinate = {
            [this.state.enPassantPieceCoordinate]: '',
          }
        }

        // Castling
        const isKing = selectedPieceInfo['rank'] === 'k';
        const castlingPerformed = isKing && this.checkCastlingPerformed(prevSelectedCoordinate, cellCooridinate);
        
        let castleRook = {};

        if(castlingPerformed) {
          if(castlingPerformed === 'k') {
            const rookCoordinate = arrayToCoordinate(cellInfo['row'], 8);
            const newRookCoordinate = arrayToCoordinate(cellInfo['row'], 6);

            castleRook = {
              [rookCoordinate]: '',
              [newRookCoordinate]: this.state.board[rookCoordinate]
            }
          }

          if(castlingPerformed === 'q') {
            const rookCoordinate = arrayToCoordinate(cellInfo['row'], 1);
            const newRookCoordinate = arrayToCoordinate(cellInfo['row'], 4);

            castleRook = {
              [rookCoordinate]: '',
              [newRookCoordinate]: this.state.board[rookCoordinate]
            }
          }
        }

        // Pawn Promotion
        const isPawnPromotion = isPawn && this.checkPawnPromotion(selectedPieceInfo, cellCooridinate) ? cellCooridinate : '';
        
        // Move history
        const move = {
          current: {
            piece: isEnPassantAttack ? this.state.board[this.state.enPassantPieceCoordinate] : selectedCell,
            coordinate: cellCooridinate,
            enPassant: isEnPassantAttack ? this.state.enPassantPieceCoordinate : null,
            castling: this.state.castling,
            castlingPerformed: castlingPerformed,
            inCheck: false,
            promotionCoordinate: isPawnPromotion || ''
          },
          previous: {
            piece: prevSelectedCell,
            coordinate: prevSelectedCoordinate,
          }
        };

        const newState = {
          ...this.state,
          selectedCoordinate: '',
          enPassantPieceCoordinate: enPassantPieceCoordinate,
          playerTurn: this.state.playerTurn === WHITE ? BLACK : WHITE,
          castling: this.getCastingString(this.state.castling, selectedPieceInfo),
          board: {
            ...this.state.board,
            ...enPassantCooridinate,
            ...castleRook,
            [prevSelectedCoordinate]: '',
            [cellCooridinate]: prevSelectedCell,
          },
          promotionCoordinate: isPawnPromotion
        };

        const v = chess.move({ from: move.previous.coordinate, to: move.current.coordinate });

        // Check
        if(chess.in_check()) {
          newState.playerInCheck = chess.turn();
          move.current.inCheck = true;
        } else {
          newState.playerInCheck = null;
        }

        // Game over
        if((v === null && chess.in_check()) || chess.game_over()) {
          newState.checkMate = chess.turn();
        }

        newState.historyMoves = [ ...this.state.historyMoves, move];

        this.setState(newState, this.setOrientation);
      }
    } else {
      this.setState({
        selectedCoordinate: prevSelectedCoordinate === cellCooridinate ? '' : cellCooridinate,
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

  onUndoClick = () => {
    const historyMoves = this.state.historyMoves;
    const historyMovesLength = historyMoves.length - 1;

    if(historyMovesLength >= 0) {
      const lastMove = historyMoves[historyMovesLength];

      const { current, previous } = lastMove;

      let clearEnPassant = {};

      if(current.enPassant) {
        clearEnPassant = {
          [current.coordinate]: '',
        }
      }

      let castleRook = {};
      if(current.castlingPerformed) {
        const cellInfo = getCoordinateInformation(current.coordinate);

        if(current.castlingPerformed === 'k') {
          const rookCoordinate = arrayToCoordinate(cellInfo['row'], 6);
          const newRookCoordinate = arrayToCoordinate(cellInfo['row'], 8);

          castleRook = {
            [rookCoordinate]: '',
            [newRookCoordinate]: this.state.board[rookCoordinate]
          }
        }

        if(current.castlingPerformed === 'q') {
          const rookCoordinate = arrayToCoordinate(cellInfo['row'], 4);
          const newRookCoordinate = arrayToCoordinate(cellInfo['row'], 1);

          castleRook = {
            [rookCoordinate]: '',
            [newRookCoordinate]: this.state.board[rookCoordinate]
          }
        }
      }

      const newState = { 
        playerTurn: this.state.playerTurn === WHITE ? BLACK : WHITE,
        board: {
          ...this.state.board,
          ...clearEnPassant,
          ...castleRook,
          [current.enPassant || current.coordinate]: current.piece,
          [previous.coordinate]: previous.piece,
        },
        castling: current.castling || this.state.castling,
        enPassantPieceCoordinate: current.enPassant ? current.enPassant : '',
        historyMoves: historyMoves.slice(0, historyMovesLength),
        playerInCheck: current.inCheck ? null : this.state.playerInCheck,
        promotionCoordinate: current.promotionCoordinate ? '' : current.promotionCoordinate,
      };

      const { FENString } = this.updateFEN(newState);
      chess.load(FENString);

      if(chess.in_check()) {
        newState.playerInCheck = chess.turn();
      } else {
        newState.playerInCheck = null;
      }

      this.setState(newState, this.updateFEN);
    }
  }

  updateFEN = (_state = null) => {
    const state = _state || this.state;

    const { historyMoves, halfMoveClock } = this.getHistoryMoves(state.halfMoveClock);

    const enPassantAttackCoordinate = state.enPassantPieceCoordinate ? getEnpassantAttackCoordinate(state.enPassantPieceCoordinate, state.board) : '-';
    const { FENString, fullMoveCount } = boardToFEN(state.board, state.playerTurn, state.castling, enPassantAttackCoordinate, historyMoves, halfMoveClock, state.fullMoveCount);

    this.historyMoves = historyMoves;

    if(_state) {
      return {
        FENString: FENString,
        halfMoveClock: halfMoveClock,
        fullMoveCount: fullMoveCount
      }
    }

    this.setState({
      FENString: FENString,
      halfMoveClock: halfMoveClock,
      fullMoveCount: fullMoveCount
    })
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

  toggleUndoButton = () => {
    this.setState((state) => {
      return {
        showUndoButton: !state.showUndoButton,
      }
    });
  }

  getHistoryMoves = (halfMoveClockCount) => {
    const historyMoves = [];

    let halfMoveClock = halfMoveClockCount;

    this.state.historyMoves.map((historyMove, inx) => {
      const isFullMove = inx % 2 === 0;

      const { current, previous } = historyMove;

      let move = current.coordinate;

      halfMoveClock++;

      if(previous.piece && previous.piece[1] === 'p') {
        halfMoveClock = 0;
      }

      // Attach Notation
      if(current.piece[0] && current.piece[0] !== previous.piece[0]) {
        move = previous.coordinate[0] + 'x' + move;
        halfMoveClock = 0;
      }

      // If selected piece is other than Pawn
      if(previous.piece && previous.piece[1] !== 'p') {
        move = previous.piece[1].toUpperCase() + ( move.includes('x') ? move.slice(1) : move );
      }

      // Castling 
      if(current.castlingPerformed) {
        if(current.castlingPerformed === 'k') {
          move = '0-0';
        }

        if(current.castlingPerformed === 'q') {
          move = '0-0-0';
        }
      }

      // In Check
      if(current.inCheck) {
        move = move + '+';
      }

      if(isFullMove) {
        historyMoves.push([ move ]);
      } else {
        historyMoves[historyMoves.length - 1].push(move);
      }

      return null;
    });

    return { historyMoves, halfMoveClock };
  }

  copyToClipboard = () => {
    const copyText = document.getElementById('fen-string');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');

    const tooltip = document.getElementById('copy-button');
    const tooltipId = tooltip.getAttribute('aria-describedby');
    const tooltipHTML = document.getElementById(tooltipId);
    tooltipHTML.innerHTML = tooltipHTML.innerHTML.replace('Copy to Clipboard', 'Copied!')
  }

  loadFEN = () => {
    const copyText = document.getElementById('fen-string');
    const value = copyText.value;

    const boardDetails = FENToBoard(value);

    chess.load(value);

    if(chess.in_check()) {
      boardDetails.playerInCheck = chess.turn();
    }

    if(chess.game_over()) {
      boardDetails.checkMate = chess.turn();
    }

    this.setState({
      ...this.state,
      ...boardDetails,
    });
  }

  onFENChange = (event) => {
    event.preventDefault();

    this.setState({
      FENString: event.target.value
    })
  }

  onSelectPromotion(piece) {
    this.setState({
      ...this.state,
      board: {
        ...this.state.board,
        [this.state.promotionCoordinate]: piece,
      },
      promotionCoordinate: ''
    }, this.updateFEN);
  }

  renderCheckMate = () => {
    const checkMate = this.state.checkMate;

    if(checkMate) {
      const player = this.state.checkMate === WHITE ? 'Black': 'White';
  
      return (
        <div className="check-mate small">
          { player } Player Win!
        </div>
      );
    }

    return null;
  }

  renderPawnPromotionModal = (coordinate) => {
    const pieceInfo = getPieceInformation(coordinate, this.state.board);

    if(pieceInfo) {
      const { color } = pieceInfo;

      const queen = `${color}q`;
      const rook = `${color}r`;
      const knight = `${color}n`;
      const bishop = `${color}b`;

      return (
        <div className="pawn-promotion-option">
          <button className="option" onClick={() => this.onSelectPromotion(queen)}>
            <img src={pieceImages[queen]} className="piece-img" alt="chess piece" />
          </button>
          <button className="option" onClick={() => this.onSelectPromotion(rook)}>
            <img src={pieceImages[rook]} className="piece-img" alt="chess piece" />
          </button>
          <button className="option" onClick={() => this.onSelectPromotion(knight)}>
            <img src={pieceImages[knight]} className="piece-img" alt="chess piece" />
          </button>
          <button className="option" onClick={() => this.onSelectPromotion(bishop)}>
            <img src={pieceImages[bishop]} className="piece-img" alt="chess piece" />
          </button>
        </div>
      );
    }
  }

  render() {
    const board = this.state.board;

    const isBlack = this.state.isAutoOrientation && this.state.orientation === BLACK;
    const boardPositions = isBlack ? blackBoardPositions : whiteBoardPositions;
    const pieceColorValue = isBlack ? 1 : 0;

    const playerInCheck = this.state.playerInCheck;
    const playerTurn = this.state.playerTurn;

    const pieceOptions = { 
      enPassantPieceCoordinate: this.state.enPassantPieceCoordinate,
      castling: playerInCheck === playerTurn ? '' : this.state.castling,
    };
    const selectedPieceNextMoves = getMovesByCoordinate(this.state.selectedCoordinate, this.state.board, pieceOptions);

    const enPassantAttackCoordinate = this.state.enPassantPieceCoordinate ? getEnpassantAttackCoordinate(this.state.enPassantPieceCoordinate, this.state.board) : '-';
    const promotionCoordinate = this.state.promotionCoordinate;
    
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
            <div className="form-group row">
              <label className="col-sm-6 col-form-label">Show Undo Button</label>
              <div className="col-sm-6">
                <div className="form-check mt-1">
                  <input className="form-check-input position-static" type="checkbox" checked={this.state.showUndoButton} onChange={this.toggleUndoButton} />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-12 text-center">
                <button type="button" className="btn btn-primary btn-lg" onClick={this.initializeNewGame}>New Game</button>
              </div>
            </div>
          </div>

          <div className="col-6">

            <div className="container options-nav">
              <div className="row">
                <div className="col-6">
                  <div className="player-turn">
                    <span> Player: <strong>{playerTurn === WHITE ? 'WHITE' : 'BLACK'}</strong></span>
                  </div>
                </div>

                <div className="col-6">
                  { 
                    this.state.showUndoButton && (
                      <div className="undo-button">
                        <button onClick={this.onUndoClick}>
                          <i className="fas fa-undo"></i>
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>

            <div className="container">
              { this.renderCheckMate() }
              { this.renderPawnPromotionModal(promotionCoordinate) }

              <div className={`board ${this.state.theme}`}>
                {boardPositions.map((cellPositions, index) => {
                  index = isBlack ? index + 1 : (index - 8) * -1;
                  const rowId = `row-${index}`;

                  const rowPosition = index;

                  return (
                    <div className={`board-row ${promotionCoordinate || this.state.checkMate ? 'opacity' : ''}`} key={rowId}>
                      {cellPositions.map((cellPosition, inx) => {
                        const cellId = `cell-${cellPosition}`;
                        const cellColor = (rowPosition + inx + pieceColorValue) % 2 === 1 ? 'black' : 'white';

                        const cellCooridinate = `${cellPosition}${rowPosition}`;
                        const chessPiece = board[cellCooridinate] || '';

                        const isChessPiece = board[cellCooridinate] ? true : false;
                        const isPlayerChessPiece = this.isPlayerChessPiece(chessPiece);
                        const isActive = this.state.selectedCoordinate === cellCooridinate;
                        const selectedChessPiece = board[this.state.selectedCoordinate] || '';
                        const isOpponentChessPiece = this.state.enPassantPieceCoordinate ? ((cellCooridinate === enPassantAttackCoordinate && selectedChessPiece.endsWith('p')) || this.isOpponentChessPiece(chessPiece)) : this.isOpponentChessPiece(chessPiece);
                        const isPossibleMove = selectedPieceNextMoves.includes(cellCooridinate);
                        const isClickable = isPlayerChessPiece || isPossibleMove;

                        const isPlayerKing = chessPiece.startsWith(playerInCheck) && chessPiece.endsWith('k');

                        return (
                          <button 
                            key={cellId} 
                            className={`cell ${cellColor} ${isClickable ? 'pointer' : 'not-allowed'} ${isActive ? 'active' : ''} ${isPlayerKing ? 'check' : ''}`}
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

            <div className="container fen-details">
              <div className="form-group">
                <label>FEN Notation: </label>
                <div className="input-group">
                  <input id="fen-string" type="text" className="form-control" value={this.state.FENString} onChange={this.onFENChange}  />
                  <div className="input-group-append">
                    <button type="button" id="copy-button" className="btn input-group-text" data-toggle="tooltip" data-placement="right" title="Copy to Clipboard" onClick={this.copyToClipboard}>Copy</button>
                  </div>
                </div>
              </div>

              <button type="button" className="btn btn-primary" onClick={this.loadFEN}>Load</button>
            </div>
          </div>
          
          <div className="col">
            <h5 className="mt-5 mb-4">Move History</h5>
              <ol className="move-history">
                {
                  this.historyMoves.map((fullMove, inx) => {
                    return (
                      <li key={inx}>
                        {
                          fullMove.map((move, moveInx) => {
                            return <span key={moveInx} className={moveInx === 0 ? 'white-move' : 'black-move'}>{move}</span>;
                          })
                        }
                      </li>
                    )
                  })
                }
              </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;