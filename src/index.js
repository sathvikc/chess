import React from 'react';
import ReactDOM from 'react-dom';
import ChessBoard from './ChessBoard';
import './index.css'
import './styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <ChessBoard />
  </React.StrictMode>,
  document.getElementById('root')
);