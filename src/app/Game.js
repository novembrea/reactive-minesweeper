import React, { Component, Fragment } from 'react';
import Header from './Header';
import Board from './Board';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  gameOver = () => {
    alert('game over!');
  }

  render() {
    return (
      <Fragment>
        <Header />
        <Board gameOver={this.gameOver} width={20} height={20} />
      </Fragment>
    );
  }
}


export default Game;
